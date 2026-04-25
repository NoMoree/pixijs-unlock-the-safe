import { Block } from "../../Blocks";
import gsap from "gsap";

export class AddTreasureShineEffect extends Block {

    constructor(name: string) {
        super(name);
    }

    async start() {
        // TODO: fail, figure out other effect or find flashy assets
        // Wait 5 seconds
        await new Promise((resolve) => gsap.delayedCall(5, resolve));

        this.end();
    }
}