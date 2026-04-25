import { Block } from "../../Blocks";
import { Assets, Sprite, Container } from "pixi.js";
import gsap from "gsap";
import { GAME } from "../../../GAME";

export class AddTreasureShineEffectBlock extends Block {
    private container: Container | null = null;
    private sprites: Sprite[] = [];

    constructor(name: string) {
        super(name);
    }

    async start() {
        const shineTex = Assets.get("shine") as any;
        if (!shineTex) {
            console.warn("Shine texture not found");
            await new Promise((resolve) => gsap.delayedCall(5, resolve));
            this.end();
            return;
        }

        const door = GAME.containers.door;
        if (!door) {
            this.end();
            return;
        }

        const config = GAME.config.getConfig().shine;
        const treasureX = door.getOriginalWidth() / 2;
        const treasureY = 0;

        this.container = new Container();
        this.container.x = treasureX;
        this.container.y = treasureY;
        door.addChild(this.container);

        for (let i = 0; i < config.count; i++) {
            const shine = new Sprite(shineTex);
            shine.anchor.set(0.5);
            const angle = Math.random() * Math.PI * 2;
            const radius = Math.random() * config.radius;
            shine.x = Math.cos(angle) * radius;
            shine.y = Math.sin(angle) * radius;
            shine.alpha = 0;
            shine.scale.set(0.5 + Math.random() * 0.5);
            this.container.addChild(shine);
            this.sprites.push(shine);

            const dur = config.minDuration + Math.random() * (config.maxDuration - config.minDuration);
            gsap.to(shine, {
                duration: dur,
                alpha: 0.9,
                scale: shine.scale.x * 1.5,
                repeat: -1,
                yoyo: true,
                ease: "sine.inOut",
                delay: Math.random() * 2,
            });
        }

        await new Promise((resolve) => gsap.delayedCall(5, resolve));

        this.cleanup();
        this.end();
    }

    private cleanup() {
        if (this.container) {
            for (const s of this.sprites) {
                gsap.killTweensOf(s);
                s.destroy();
            }
            this.container.destroy();
            this.container = null;
            this.sprites = [];
        }
    }
}