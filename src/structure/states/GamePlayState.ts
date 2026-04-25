import { Graphics, Sprite, Assets, Texture, Container } from "pixi.js";
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
    private leftZone!: Graphics;
    private rightZone!: Graphics;
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

    setupBlocks(): void {
    }

    enterState(): void {
        super.enterState();

        if (GAME.containers.door) {
            this.door = GAME.containers.door;
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
        const ref = this.getRefResolution();

        this.gameContainer = new Container();
        GAME.app.stage.addChild(this.gameContainer);

        // Background
        const bgTex = Assets.get("background") as Texture;
        this.background = new Sprite(bgTex);
        this.background.width = ref.width;
        this.background.height = ref.height;
        this.gameContainer.addChild(this.background);

        // Door
        this.door = new SafeDoor();
        this.positionDoor();
        this.gameContainer.addChild(this.door);
        GAME.containers.door = this.door;

        this.timerText = new TimerText();
        this.positionTimerText();

        GAME.app.stage.addChild(this.timerText);

        this.updateGameContainerTransform();

        this.setupInput();
        GAME.app.ticker.add(this.updateTimer, this);
        window.addEventListener("resize", this.onResize.bind(this));
    }

    private updateGameContainerTransform() {
        const ref = this.getRefResolution();
        const { scale, x, y } = getGameScale(ref.width, ref.height);
        this.gameContainer.scale.set(scale);
        this.gameContainer.x = x;
        this.gameContainer.y = y;
    }


    private positionDoor() {
        const ref = this.getRefResolution();
        this.door.setPosition(ref.width / 2, ref.height / 2);
    }

    private positionTimerText() {
        const timerCfg = GAME.config.getConfig().timer;
        const ref = this.getRefResolution();
        const { scale, x, y } = getGameScale(ref.width, ref.height);
        const bgLeft = x;
        const bgTop = y;
        const bgWidth = ref.width * scale;
        const bgHeight = ref.height * scale;
        this.timerText.x = bgLeft + bgWidth * timerCfg.posXPercent;
        this.timerText.y = bgTop + bgHeight * timerCfg.posYPercent;
        this.timerText.anchor.set(timerCfg.anchorX, timerCfg.anchorY);
        this.timerText.style.fontSize = Math.max(5, timerCfg.fontSize * scale);
    }

    private setupInput() {
        if (this.leftZone) this.leftZone.destroy();
        if (this.rightZone) this.rightZone.destroy();

        this.leftZone = new Graphics()
            .rect(0, 0, window.innerWidth / 2, window.innerHeight)
            .fill(0x000000, 0);
        this.leftZone.eventMode = "static";
        this.leftZone.cursor = "pointer";
        this.leftZone.on("pointerdown", () => this.handleTurn("CCW"));
        GAME.app.stage.addChild(this.leftZone);

        this.rightZone = new Graphics()
            .rect(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight)
            .fill(0x000000, 0);
        this.rightZone.eventMode = "static";
        this.rightZone.cursor = "pointer";
        this.rightZone.on("pointerdown", () => this.handleTurn("CW"));
        GAME.app.stage.addChild(this.rightZone);

        window.addEventListener("keydown", this.keyboardHandler);
    }

    private getRefResolution() {
        return GAME.config.getConfig().referenceResolution;
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
        this.resizeInputZones();
    }

    private resizeInputZones() {
        if (this.leftZone) {
            this.leftZone.clear()
                .rect(0, 0, window.innerWidth / 2, window.innerHeight)
                .fill(0x000000, 0);
        }
        if (this.rightZone) {
            this.rightZone.clear()
                .rect(window.innerWidth / 2, 0, window.innerWidth / 2, window.innerHeight)
                .fill(0x000000, 0);
        }
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
        if (this.leftZone) this.leftZone.destroy();
        if (this.rightZone) this.rightZone.destroy();
        window.removeEventListener("resize", this.onResize);
    }

    removeEvents(): void {
    }

    exitState(): void {
        this.cleanupInputAndTicker();
    }
}