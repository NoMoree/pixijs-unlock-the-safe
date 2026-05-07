import { State } from "../State";
import { GAME } from "../../GAME";
import { GameState } from "./StateDefinitions";
import { OpenDoorBlock } from "../blocks/success/OpenDoorBlock";
import { ResetGameBlock } from "../blocks/success/ResetGameBlock";
import { TreasureShineBlock, ShineConfig } from "../blocks/success/TreasureShineBlock";

export class WinSequenceState extends State {
    setupEvents(): void {
        console.log("WinSequenceState - playing win sequence");
    }

    modelChanges(): void { }

    setupBlocks(): void {
        const door = GAME.containers.door;
        if (!door) {
            console.error("Door missing cannot run win sequence");
            this.exitState();
            return;
        }

        const shineConfig: ShineConfig = GAME.config.getConfig().shine;

        this.blocks = [
            new OpenDoorBlock("Open door", door),
            new TreasureShineBlock("Add treasure shine effect", door, shineConfig),
            new ResetGameBlock("Reset game", door),
        ];
    }

    removeEvents(): void { }

    exitState(): void {
        GAME.states[GameState.GAME_PLAY].enterState();
    }
}