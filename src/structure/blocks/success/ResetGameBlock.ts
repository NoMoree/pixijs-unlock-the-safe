import { Block } from "../../Blocks";
import { SafeDoor } from "../../../prefabs/SafeDoor";
import { Sprite } from "pixi.js";
import { GAME_MODELS } from "../../../GAME";
import { CombinationGenerator } from "../../../utils/CombinationGenerator";

export class ResetGameBlock extends Block {
    private door: SafeDoor;
    private treasure: Sprite;

    constructor(name: string, door: SafeDoor, treasure: Sprite) {
        super(name);
        this.door = door;
        this.treasure = treasure;
    }

    async start() {
        await this.door.closeDoor();
        this.treasure.alpha = 0;

        GAME_MODELS.game.secretCombination = CombinationGenerator.generate();
        GAME_MODELS.game.currentPairIndex = 0;
        GAME_MODELS.game.currentStepCount = 0;
        GAME_MODELS.game.isUnlocked = false;
        GAME_MODELS.timer.reset();
        GAME_MODELS.timer.start();

        this.end();
    }
}