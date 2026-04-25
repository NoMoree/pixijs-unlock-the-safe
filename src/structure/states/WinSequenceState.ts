import { State } from "../State";
import { GAME } from "../../GAME";
import { GameState } from "./StateDefinitions";
import { OpenDoorBlock } from "../blocks/success/OpenDoorBlock";
import { ResetGameBlock } from "../blocks/success/ResetGameBlock";
import { AddTreasureShineEffectBlock } from "../blocks/success/AddTreasureShineEffectBlock";

export class WinSequenceState extends State {
    setupEvents(): void {
        console.log("WinSequenceState - playing win sequence");
    }

    modelChanges(): void {
    }

    setupBlocks(): void {
        const door = GAME.containers.door;
        if (!door) {
            console.error("Door missing  cannot run win sequence");
            this.exitState();
            return;
        }
        this.blocks = [
            new OpenDoorBlock("Open door", door),
            new AddTreasureShineEffectBlock("Add treasure shine effect"),
            new ResetGameBlock("Reset game", door),
        ];
    }

    removeEvents(): void {
    }

    exitState(): void {
        GAME.states[GameState.GAME_PLAY].enterState();
    }
}