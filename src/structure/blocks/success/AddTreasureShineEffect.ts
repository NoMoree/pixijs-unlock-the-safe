import { Block } from "../../Blocks";
import { Sprite, Container, Graphics } from "pixi.js";
import gsap from "gsap";

export class AddTreasureShineEffect extends Block {
    private treasure: Sprite;

    constructor(name: string, treasure: Sprite) {
        super(name);
        this.treasure = treasure;
    }

    async start() {
        // TODO: fail, figure out other effect or find flashy assets
        // Wait 5 seconds
        await new Promise((resolve) => gsap.delayedCall(5, resolve));

        this.end();
    }
}