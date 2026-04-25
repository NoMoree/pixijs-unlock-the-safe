import { Application } from "pixi.js";
import { Models } from "./game/models/Models";
import { XContainer } from "./pixi/XContainer";
import { GameState } from "./structure/states/StateDefinitions";
import { SetupState } from "./structure/states/SetupState";
import { GamePlayState } from "./structure/states/GamePlayState";
import { CustomEvent } from "./events/CustomEvent";
import { PIXI_CONFIG } from "./PIXI_CONFIG";
import { WinSequenceState } from "./structure/states/WinSequenceState";
import { SafeDoor } from "./prefabs/SafeDoor";

export type GameConfig = {
    showBlockConsole: boolean;
    showEventConsole: boolean;
};

export const gameConfig: GameConfig = {
    showBlockConsole: false,
    showEventConsole: false,
};

type GAME_Type = {
    states: {
        [GameState.SETUP]: SetupState;
        [GameState.GAME_PLAY]: GamePlayState;
        [GameState.WIN_SEQUENCE]: WinSequenceState;
    };
    events: {
        blockComplete: CustomEvent<void>;
        redraw: CustomEvent<void>;
        enableSound: CustomEvent<boolean>;
    };
    containers: {
        mainGameContainer: XContainer | undefined;
        door: SafeDoor | undefined;
    };
    sound: any;
    app: Application;
    config: PIXI_CONFIG;
};

export const GAME_MODELS = new Models();

export const GAME: GAME_Type = {
    states: {
        [GameState.SETUP]: new SetupState(),
        [GameState.GAME_PLAY]: new GamePlayState(),
        [GameState.WIN_SEQUENCE]: new WinSequenceState()
    },
    events: {
        blockComplete: new CustomEvent<void>("block-complete"),
        redraw: new CustomEvent<void>("redraw", true),
        enableSound: new CustomEvent<boolean>("sound-enabled", true),
    },
    containers: {
        mainGameContainer: undefined,
        door: undefined,
    },
    sound: undefined,
    app: new Application(),
    config: new PIXI_CONFIG(),
};

const canvas = document.querySelector("#app") as HTMLCanvasElement;
await GAME.app.init({
    canvas,
    resizeTo: window,
    autoDensity: true,
    backgroundColor: 0x1a2a3a,
});
GAME.states[GameState.SETUP].enterState();