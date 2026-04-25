import { Container } from "pixi.js";
import { CustomEvent } from "../events/CustomEvent";
import { GAME } from "../GAME";

export interface XContainerInput {

    label: string;
    x: () => number;
    y: () => number;
    altEvent?: CustomEvent<void>;
}

export class XContainer extends Container {

    label: string;
    xFormula: () => number;
    yFormula: () => number;
    altEvent?: CustomEvent<void>;

    constructor(input: XContainerInput) {

        super();

        this.label = input.label;
        this.xFormula = input.x;
        this.yFormula = input.y;
        this.altEvent = input.altEvent;

        // Set initial position
        this.position.x = this.xFormula();
        this.position.y = this.yFormula();

        GAME.events.redraw.add(this.redraw.bind(this));
        if (this.altEvent) {
            this.altEvent.add(this.redraw.bind(this));
        }
    }

    redraw(): void {

        this.position.x = this.xFormula();
        this.position.y = this.yFormula();
    }
} 