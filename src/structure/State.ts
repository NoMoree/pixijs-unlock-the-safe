import { GAME, gameConfig, GAME_MODELS } from "../GAME";
import { Block } from "./Blocks";
import { Models } from "../game/models/Models";

export abstract class State {
    blocks: Block[] = [];
    protected models: Models;

    constructor() {
        this.models = GAME_MODELS;
    }

    enterState(): void {
        this._setupBlockLoopEvent();
        this.setupEvents();
        this.modelChanges();
        this.setupBlocks();
        this._playThroughBlocks();
    }

    private _setupBlockLoopEvent(): void {
        GAME.events.blockComplete.add(this._playThroughBlocks.bind(this));
    }

    abstract setupEvents(): void;
    abstract modelChanges(): void;
    abstract setupBlocks(): void;

    // Changed from private to protected so subclasses can call it
    protected _playThroughBlocks(): void {
        if (this.blocks.length > 0) {
            const currentBlock = this.blocks.shift();
            if (currentBlock) {
                gameConfig.showBlockConsole ? console.log(currentBlock.name) : null;
                currentBlock.start(); // block calls blockComplete when done
            }
        } else {
            this._removeBlockLoopEvent();
            this.removeEvents();
            this.exitState();
        }
    }

    private _removeBlockLoopEvent(): void {
        GAME.events.blockComplete.removeAll();
    }

    abstract removeEvents(): void;
    abstract exitState(): void;
}