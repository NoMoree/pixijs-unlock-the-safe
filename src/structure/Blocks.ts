import { GAME, GAME_MODELS } from "../GAME";
import { Models } from "../game/models/Models";

// Deep readonly utility type
type DeepReadonly<T> = {
    readonly [P in keyof T]: T[P] extends object ? DeepReadonly<T[P]> : T[P];
};

export abstract class Block {
    name: string = "Step";
    protected readonly models: DeepReadonly<Models>;

    constructor(name: string) {
        this.name = name;
        this.models = GAME_MODELS;
    }

    abstract start(): void;

    end(): void {
        GAME.events.blockComplete.dispatch();
    }
}
