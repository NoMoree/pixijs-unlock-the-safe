import { State } from "../State";
import { GAME } from "../../GAME";
import { GameState } from "./StateDefinitions";
import { OpenDoorBlock } from "../blocks/success/OpenDoorBlock";
import { ResetGameBlock } from "../blocks/success/ResetGameBlock";
import { AddTreasureShineEffect } from "../blocks/success/AddTreasureShineEffect";

export class ShowTreasureState extends State {
    setupEvents(): void {
        console.log("🏆 ShowTreasureState - playing win sequence");
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
            new AddTreasureShineEffect("Show treasure"),
            new ResetGameBlock("Reset game", door),
        ];
    }

    removeEvents(): void {
    }

    exitState(): void {
        GAME.states[GameState.GAME_PLAY].enterState();
    }
}