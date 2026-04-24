import { Container, Graphics } from "pixi.js";
import { CustomEvent } from "../events/CustomEvent";
import { GAME } from "../GAME";

export interface posInterface {
    label: string;
    parent: any;
    w: () => number;
    h: () => number;
    x: () => number;
    y: () => number;
    click?: () => void;
    altEvent?: CustomEvent<void>;
    isTransparent?: boolean;
}
interface GInput extends posInterface {
    color: number;
    pivot: number | null; // set to 0 for default, 0.5 for central pivot
}
export class TGraphics {

    public graphics: Graphics;
    label: string;
    parent: any;
    pivot: number | null; // set to 0 for default, 0.5 for central pivot
    w: () => number;
    h: () => number;
    x: () => number;
    y: () => number;
    click?: () => void;
    altEvent?: CustomEvent<void>
    color: number;
    isTransparent?: boolean;
    private boundRedraw: () => void;

    constructor(input: GInput) {
        this.graphics = new Graphics();
        this.parent = input.parent;
        this.label = input.label;
        this.graphics.label = input.label + "_graphics";
        this.color = input.color;
        this.pivot = input.pivot ? input.pivot : 0;
        this.w = input.w;
        this.h = input.h;
        this.x = input.x;
        this.y = input.y;
        this.click = input.click;
        this.isTransparent = input.isTransparent;

        this.altEvent = input.altEvent;

        this.graphics.rect(0, 0, this.w(), this.h());
        this.graphics.fill(this.color);
        this.graphics.alpha = this.isTransparent ? 0 : 1;

        // Set initial position
        this.graphics.x = this.x();
        this.graphics.y = this.y();

        this.graphics.pivot.set(
            this.graphics.width * this.pivot,
            this.graphics.height * this.pivot);

        if (this.click) {
            this.graphics.eventMode = "static";
            this.graphics.on('pointerdown', () => {
                this.click?.call(this);
            });
        }

        this.parent.addChild(this.graphics);

        // MAKES THE GPRAPHIC RESIZABLE
        // Store bound function reference for proper cleanup
        this.boundRedraw = this.redraw.bind(this);

        // Subscribe to redraw events
        if (this.altEvent) {
            this.altEvent.add(this.boundRedraw);
        } else {
            GAME.events.redraw.add(this.boundRedraw);
        }
    }

    // Add to stage helper
    addTo(stage: Container) {
        this.graphics.addChild(stage);
    }

    // Getter to access underlying graphics
    get pixiGraphics() {
        return this.graphics;
    }

    redraw(): void {
        this.graphics.width = this.w();
        this.graphics.height = this.h();
        this.graphics.x = this.x();
        this.graphics.y = this.y();
    }
}