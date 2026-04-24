import { Container, Sprite, Texture } from "pixi.js";
import gsap from "gsap";

export class SafeDoor extends Container {
    private closedSprite: Sprite;
    private openingSprite: Sprite;
    private openSprite: Sprite;
    private handleGroup: Container;
    private handleSprite: Sprite;
    private handleShadow: Sprite;
    private isOpen = false;
    private originalWidth: number;
    private currentScale: number = 1;
    private openStartPosition: number = 0;
    private centerX: number = 0;
    private centerY: number = 0;

    constructor(closedTex: Texture, openTex: Texture, openingTex: Texture, handleTex: Texture) {
        super();

        // Closed sprite (left-anchored)
        this.closedSprite = new Sprite(closedTex);
        this.closedSprite.anchor.set(0, 0.5);
        this.addChild(this.closedSprite);

        // Opening sprite (left-anchored)
        this.openingSprite = new Sprite(openingTex);
        this.openingSprite.anchor.set(0, 0.5);
        this.openingSprite.visible = false;
        this.addChild(this.openingSprite);

        // Open sprite (left-anchored)
        this.openSprite = new Sprite(openTex);
        this.openSprite.anchor.set(0, 0.5);
        this.openSprite.visible = false;
        this.addChild(this.openSprite);

        // Handle group
        this.handleGroup = new Container();
        this.handleSprite = new Sprite(handleTex);
        this.handleSprite.anchor.set(0.5);
        this.handleShadow = new Sprite(handleTex);
        this.handleShadow.anchor.set(0.5);
        this.handleShadow.tint = 0x000000;
        this.handleShadow.alpha = 0.5;
        this.handleShadow.position.set(8, 8);
        this.handleGroup.addChild(this.handleShadow);
        this.handleGroup.addChild(this.handleSprite);
        this.addChild(this.handleGroup);

        this.originalWidth = this.closedSprite.width;

        this.setScale(1);
        this.handleGroup.x = this.originalWidth / 2;

        this.handleGroup.x = this.originalWidth / 2;
    }

    public setScale(scale: number) {
        this.currentScale = scale;
        this.scale.set(scale, scale);

        this.handleGroup.x = (this.originalWidth * scale) / 2;
    }

    // Update setPosition to use the scaled width
    public setPosition(centerX: number, centerY: number) {
        this.centerX = centerX;
        this.centerY = centerY;
        const scaledWidth = this.originalWidth * this.currentScale;
        this.x = centerX - scaledWidth / 2;
        this.y = centerY;
    }

    public updatePosition() {
        if (this.centerX && this.centerY) {
            this.x = this.centerX - this.originalWidth / 2;
            this.y = this.centerY;
        }
    }

    async turnCW() { await this.rotateHandle(60); }
    async turnCCW() { await this.rotateHandle(-60); }

    private async rotateHandle(degrees: number) {
        const tl = gsap.timeline({ duration: 0.2 });
        tl.to(this.handleGroup, { rotation: `+=${degrees * Math.PI / 180}`, ease: "power2.out" }, 0);
        await tl;
    }

    async spinFuriously() {
        const tl = gsap.timeline();
        tl.to(this.handleGroup, {
            duration: 0.2,
            rotation: `+=${2 * Math.PI}`,
            repeat: 3,
            ease: "none",
        }).to(this.handleGroup, {
            duration: 0.3,
            rotation: 0,
            ease: "back.out(2)",
        });
        await tl;
    }

    async openDoor(treasure: Sprite) {
        if (this.isOpen) return;
        this.isOpen = true;

        treasure.alpha = 1;
        this.handleGroup.visible = false;

        // Step 1: Replace closed sprite with opening sprite (full width)
        this.closedSprite.visible = false;
        this.openingSprite.visible = true;
        this.openingSprite.width = this.originalWidth;
        this.openingSprite.x = 0;

        const fixedRightEdge = this.openingSprite.x + this.openingSprite.width;

        // Step 2: Shrink opening sprite to 0 (right fixed, left side shrinks)
        await gsap.to(this.openingSprite, {
            duration: 0.5,
            width: 0,
            ease: "power2.in",
            onUpdate: () => {
                const w = this.openingSprite.width;
                this.openingSprite.x = fixedRightEdge - w;
            }
        });

        this.openStartPosition = fixedRightEdge;

        // Step 3: Hide opening sprite, prepare open sprite
        this.openingSprite.visible = false;
        this.openSprite.visible = true;
        this.openSprite.width = 0;
        this.openSprite.x = this.openStartPosition;

        // Step 4: Expand open sprite to 50% (left fixed at openStartPos, expands right)
        const targetWidth = this.originalWidth * 0.5;
        await gsap.to(this.openSprite, {
            duration: 0.5,
            width: targetWidth,
            ease: "power2.out",
            onUpdate: () => {
                this.openSprite.x = this.openStartPosition;
            }
        });
    }

    async closeDoor() {
        if (!this.isOpen) return;

        // Step 1: Shrink open sprite from 50% to 0 (left fixed, right shrinks)
        const fixedLeftEdge = this.openSprite.x;

        await gsap.to(this.openSprite, {
            duration: 0.5,
            width: 0,
            ease: "power2.in",
            onUpdate: () => {
                // Keep left edge fixed
                this.openSprite.x = fixedLeftEdge;
            }
        });

        // Step 2: Hide open sprite, prepare opening sprite
        this.openSprite.visible = false;
        this.openingSprite.visible = true;
        this.openingSprite.width = 0;
        this.openingSprite.x = fixedLeftEdge;

        // Step 3: Expand opening sprite to full width (right fixed at originalWidth)
        const fixedRightEdge = this.originalWidth;

        await gsap.to(this.openingSprite, {
            duration: 0.5,
            width: this.originalWidth,
            ease: "power2.out",
            onUpdate: () => {
                const w = this.openingSprite.width;
                this.openingSprite.x = fixedRightEdge - w;
            }
        });

        // Step 4: Hide opening sprite, show closed sprite
        this.openingSprite.visible = false;
        this.closedSprite.visible = true;
        this.closedSprite.width = this.originalWidth;
        this.closedSprite.x = 0;

        // Restore handle
        this.handleGroup.visible = true;
        this.handleGroup.x = this.originalWidth / 2;
        this.handleGroup.scale.x = 1;

        this.isOpen = false;
    }
}