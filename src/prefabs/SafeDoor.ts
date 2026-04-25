import { Container, Sprite, Texture, Assets } from "pixi.js";
import gsap from "gsap";

export class SafeDoor extends Container {
    private closedSprite: Sprite;
    private openSprite: Sprite;
    private openShadow: Sprite;
    private handleGroup: Container;
    private handleSprite: Sprite;
    private handleShadow: Sprite;
    private isOpen = false;
    private originalWidth: number;
    private currentScale: number = 1;
    private centerX: number = 0;
    private centerY: number = 0;

    private readonly SHADOW_OFFSET_X = 50;
    private readonly SHADOW_OFFSET_Y = 25;

    private readonly closedDoorMinWidthPercent = 0.5;
    private readonly openDoorStartWidthPercent = 0.2;
    private readonly openDoorTargetWidthPercent = 0.75;


    constructor() {
        super();

        const closedTex = Assets.get("door-closed") as Texture;
        const openTex = Assets.get("door-open") as Texture;
        const openShadowTex = Assets.get("door-open-shadow") as Texture;
        const handleTex = Assets.get("door-handle") as Texture;
        const handleShadowTex = Assets.get("door-handle-shadow") as Texture;

        this.closedSprite = new Sprite(closedTex);
        this.closedSprite.anchor.set(0, 0.5);
        this.addChild(this.closedSprite);

        this.openShadow = new Sprite(openShadowTex);
        this.openShadow.anchor.set(0, 0.5);
        this.openShadow.alpha = 1;
        this.openShadow.visible = false;
        this.addChild(this.openShadow);

        this.openSprite = new Sprite(openTex);
        this.openSprite.anchor.set(0, 0.5);
        this.openSprite.visible = false;
        this.addChild(this.openSprite);


        this.handleGroup = new Container();
        this.handleSprite = new Sprite(handleTex);
        this.handleSprite.anchor.set(0.5);
        this.handleShadow = new Sprite(handleShadowTex);
        this.handleShadow.anchor.set(0.5);
        this.handleShadow.position.set(8, 8);
        this.handleShadow.alpha = 1;
        this.handleGroup.addChild(this.handleShadow);
        this.handleGroup.addChild(this.handleSprite);
        this.addChild(this.handleGroup);

        this.originalWidth = this.closedSprite.width;
        this.updateHandleForClosedDoor();
    }

    private updateHandleForClosedDoor() {
        const w = this.closedSprite.width;
        const centerX = this.closedSprite.x + w / 2;
        this.handleGroup.x = centerX;
        this.handleGroup.scale.x = w / this.originalWidth;
        this.handleGroup.scale.y = 1;
    }

    public setScale(scale: number) {
        this.currentScale = scale;
        this.scale.set(scale, scale);
    }

    public setPosition(centerX: number, centerY: number) {
        this.centerX = centerX;
        this.centerY = centerY;
        const scaledWidth = this.originalWidth * this.currentScale;
        this.x = centerX - scaledWidth / 2;
        this.y = centerY;
    }

    public updatePosition() {
        if (this.centerX && this.centerY) {
            this.x = this.centerX - (this.originalWidth * this.currentScale) / 2;
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

    private resetHandleRotation() {
        this.handleGroup.rotation = 0;
    }

    async openDoor() {
        if (this.isOpen) return;
        this.isOpen = true;

        this.resetHandleRotation();

        // Fixed right edge of the closed door
        const fixedRightEdge = this.closedSprite.x + this.closedSprite.width;
        const minClosedWidth = this.originalWidth * this.closedDoorMinWidthPercent;

        await gsap.to(this.closedSprite, {
            duration: 0.5,
            width: minClosedWidth,
            ease: "power2.in",
            onUpdate: () => {
                const w = this.closedSprite.width;
                this.closedSprite.x = fixedRightEdge - w;

                // Update handle to follow door's center and scale
                this.handleGroup.x = this.closedSprite.x + w / 2;
                this.handleGroup.scale.x = w / this.originalWidth;
            },
            onComplete: () => {
                this.closedSprite.width = minClosedWidth;
                this.closedSprite.x = fixedRightEdge - minClosedWidth;
                this.handleGroup.x = this.closedSprite.x + minClosedWidth / 2;
                this.handleGroup.scale.x = minClosedWidth / this.originalWidth;

                this.closedSprite.visible = false;
                this.handleGroup.visible = false;
            }
        });

        // Prepare open door at the same right edge
        const startWidth = this.originalWidth * this.openDoorStartWidthPercent;
        const targetWidth = this.originalWidth * this.openDoorTargetWidthPercent;
        const openStartX = fixedRightEdge;

        this.openSprite.visible = true;
        this.openSprite.width = startWidth;
        this.openSprite.x = openStartX;

        this.openShadow.visible = true;
        this.openShadow.width = startWidth;
        this.openShadow.x = openStartX + this.SHADOW_OFFSET_X;
        // Keep shadow's original width
        this.openShadow.y = this.SHADOW_OFFSET_Y;
        // this.openShadow.y = this.openSprite.y + this.SHADOW_OFFSET_Y;

        // Expand open door to target width (left edge fixed)
        await gsap.to(this.openSprite, {
            duration: 0.5,
            width: targetWidth,
            ease: "power2.out",
            onUpdate: () => {
                const w = this.openSprite.width;
                this.openSprite.x = openStartX;
                this.openShadow.width = w;
                this.openShadow.x = openStartX + this.SHADOW_OFFSET_X;
            }
        });
    }

    async closeDoor() {
        if (!this.isOpen) return;

        const fixedLeftEdge = this.openSprite.x;
        const endShrinkWidth = this.originalWidth * this.openDoorStartWidthPercent;

        // Shrink open door (left edge fixed)
        await gsap.to(this.openSprite, {
            duration: 0.5,
            width: endShrinkWidth,
            ease: "power2.in",
            onUpdate: () => {
                const w = this.openSprite.width;
                this.openSprite.x = fixedLeftEdge;
                this.openShadow.width = w;
                this.openShadow.x = fixedLeftEdge + this.SHADOW_OFFSET_X;
            },
            onComplete: () => {
                this.openSprite.visible = false;
                this.openShadow.visible = false;
            }
        });

        // Prepare closed door at the same left edge
        const closedStartWidth = this.originalWidth * this.closedDoorMinWidthPercent;
        const closedStartX = fixedLeftEdge;

        this.closedSprite.visible = true;
        this.closedSprite.width = closedStartWidth;
        this.closedSprite.x = closedStartX;

        this.handleGroup.visible = true;
        this.handleGroup.scale.x = closedStartWidth / this.originalWidth;
        this.handleGroup.x = this.closedSprite.x + closedStartWidth / 2;
        this.handleGroup.rotation = 0;

        const fixedRightEdge = this.originalWidth;
        await gsap.to(this.closedSprite, {
            duration: 0.5,
            width: this.originalWidth,
            ease: "power2.out",
            onUpdate: () => {
                const w = this.closedSprite.width;
                // Right edge fixed
                this.closedSprite.x = fixedRightEdge - w;
                this.handleGroup.x = this.closedSprite.x + w / 2;
                this.handleGroup.scale.x = w / this.originalWidth;
            },
            onComplete: () => {
                this.closedSprite.x = 0;
                this.handleGroup.scale.x = 1;
                this.handleGroup.x = this.originalWidth / 2;
                this.handleGroup.rotation = 0;
            }
        });

        this.isOpen = false;
    }
}