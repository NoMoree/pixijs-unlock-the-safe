import { Sprite, Assets, Texture, Container } from "pixi.js";
import { State } from "../State";
import { GAME } from "../../GAME";
import { SafeDoor } from "../../prefabs/SafeDoor";
import { TimerText } from "../../prefabs/TimerText";
import { CombinationGenerator } from "../../utils/CombinationGenerator";
import { GameState } from "./StateDefinitions";
import { getGameScale } from "../../utils/scaleHelper";

export class GamePlayState extends State {
    private gameContainer!: Container;
    private door!: SafeDoor;
    private timerText!: TimerText;
    private background!: Sprite;

    setupEvents(): void {
        console.log("GamePlayState - listening for turns");
    }

    modelChanges(): void {
        if (!this.models.game.secretCombination.length) {
            this.models.game.secretCombination = CombinationGenerator.generate();
            this.models.timer.reset();
            this.models.timer.start();
        }
    }

    setupBlocks(): void { }

    enterState(): void {
        super.enterState();

        if (GAME.containers.door) {
            this.door = GAME.containers.door;
            this.updateGameContainerTransform();
            this.timerText.destroy();
            this.timerText = new TimerText();
            this.positionTimerText();
            GAME.app.stage.addChild(this.timerText);
            this.setupInput();
            GAME.app.ticker.add(this.updateTimer, this);
            return;
        }

        this.createScene();
        this.setupInput();
        GAME.app.ticker.add(this.updateTimer, this);

        window.addEventListener("resize", this.onResize.bind(this));
    }

    private createScene() {
        GAME.app.stage.removeChildren();

        this.gameContainer = new Container();
        GAME.app.stage.addChild(this.gameContainer);

        // Background
        const bgTex = Assets.get("background") as Texture;
        this.background = new Sprite(bgTex);
        const ref = this.getRefResolution();
        this.gameContainer.addChild(this.background);

        // Door
        this.door = new SafeDoor();
        this.door.setPosition(ref.width / 2, ref.height / 2);
        this.door.setTurnHandler((direction) => this.handleTurn(direction));
        this.gameContainer.addChild(this.door);
        GAME.containers.door = this.door;

        this.timerText = new TimerText();
        GAME.app.stage.addChild(this.timerText);

        this.updateGameContainerTransform();
        this.positionTimerText();

        this.setupInput();
        GAME.app.ticker.add(this.updateTimer, this);
        window.addEventListener("resize", this.onResize.bind(this));
    }

    private updateGameContainerTransform() {
        const ref = this.getRefResolution();

        const { scale, x, y } = getGameScale(ref.width, ref.height, {
            maxOverflowRatio: 2,
            targetScreenXRatio: 0.15,
            doorRefX: this.door.x,
        });

        this.gameContainer.scale.set(scale);
        this.gameContainer.x = x;
        this.gameContainer.y = y;
    }

    private positionTimerText() {
        const timerCfg = GAME.config.getConfig().timer;
        const ref = this.getRefResolution();
        const container = this.gameContainer;
        if (!container) return;

        const scale = container.scale.x;
        const containerLeft = container.x;
        const containerTop = container.y;

        const targetLocalX = ref.width * timerCfg.posXPercent;
        const targetLocalY = ref.height * timerCfg.posYPercent;

        // Convert to screen coordinates
        const screenX = containerLeft + targetLocalX * scale;
        const screenY = containerTop + targetLocalY * scale;

        this.timerText.x = screenX;
        this.timerText.y = screenY;
        this.timerText.anchor.set(timerCfg.anchorX, timerCfg.anchorY);
        this.timerText.style.fontSize = Math.max(5, timerCfg.fontSize * scale);
    }

    private setupInput() {
        window.addEventListener("keydown", this.keyboardHandler);
    }

    private getRefResolution() {
        const tex = this.background.texture.source;

        return {
            width: tex.width,
            height: tex.height
        };
    }

    private async handleTurn(direction: "CW" | "CCW") {
        if (this.models.game.isUnlocked || this.models.game.isSpinning) return;

        const pair = this.models.game.secretCombination[this.models.game.currentPairIndex];
        if (!pair) return;

        // Wrong move
        if (pair.direction !== direction) {
            this.models.game.isSpinning = true;
            await this.door.spinFuriously();

            this.models.game.secretCombination = CombinationGenerator.generate();
            this.models.game.currentPairIndex = 0;
            this.models.game.currentStepCount = 0;
            this.models.timer.reset();
            this.models.timer.start();
            this.models.game.isSpinning = false;
            return;
        }

        // Correct direction
        if (direction === "CW") await this.door.turnCW();
        else await this.door.turnCCW();

        this.models.game.currentStepCount++;
        if (this.models.game.currentStepCount === pair.steps) {
            this.models.game.currentPairIndex++;
            this.models.game.currentStepCount = 0;

            if (this.models.game.currentPairIndex === this.models.game.secretCombination.length) {
                this.models.game.isUnlocked = true;
                this.models.timer.stop();

                this.cleanupInputAndTicker();

                GAME.states[GameState.WIN_SEQUENCE].enterState();
            }
        }
    }

    private updateTimer() {
        this.models.timer.update();
        this.timerText.update();
    }

    private onResize() {
        this.updateGameContainerTransform();
        this.positionTimerText();
    }

    private keyboardHandler = (e: KeyboardEvent) => {
        if (e.code === "ArrowLeft" || e.code === "KeyA") {
            e.preventDefault();
            this.handleTurn("CCW");
        } else if (e.code === "ArrowRight" || e.code === "KeyD") {
            e.preventDefault();
            this.handleTurn("CW");
        }
    };

    private cleanupInputAndTicker() {
        GAME.app.ticker.remove(this.updateTimer, this);
        window.removeEventListener("resize", this.onResize);
        window.removeEventListener("keydown", this.keyboardHandler);
    }

    removeEvents(): void { }

    exitState(): void {
        this.cleanupInputAndTicker();
    }
}