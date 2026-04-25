import { State } from "../State";
import { GAME } from "../../GAME";
import { GameState } from "./StateDefinitions";
import { AssetLoad } from "../blocks/setup/AssetLoad";

export class SetupState extends State {
    setupEvents(): void {
        console.log("SetupState - loading assets.");
    }

    modelChanges(): void {
    }

    setupBlocks(): void {
        this.blocks = [new AssetLoad("Asset load")];
    }

    removeEvents(): void {
    }

    exitState(): void {
        GAME.states[GameState.GAME_PLAY].enterState();
    }
}