import { Container, Sprite, Texture, Assets } from "pixi.js";
import gsap from "gsap";
import { GAME } from "../GAME";

type DoorConfig = ReturnType<typeof GAME.config.getConfig>["door"];

export class SafeDoor extends Container {
    private closedSprite: Sprite;
    private openSprite: Sprite;
    private openShadow: Sprite;
    private handleGroup: Container;
    private handleSprite: Sprite;
    private handleShadow: Sprite;
    private isOpen = false;
    private originalWidth: number;
    private originalRightEdge: number;
    private currentScale: number = 1;
    private centerX: number = 0;
    private centerY: number = 0;
    private config: DoorConfig;

    constructor() {
        super();
        this.config = GAME.config.getConfig().door;

        const closedTex = Assets.get(this.config.closed.textureKey) as Texture;
        const openTex = Assets.get(this.config.open.textureKey) as Texture;
        const openShadowTex = Assets.get(this.config.openShadow.textureKey) as Texture;
        const handleTex = Assets.get(this.config.handle.textureKey) as Texture;
        const handleShadowTex = Assets.get(this.config.handleShadow.textureKey) as Texture;

        this.closedSprite = new Sprite(closedTex);
        this.closedSprite.anchor.set(this.config.closed.anchor.x, this.config.closed.anchor.y);
        this.closedSprite.position.set(this.config.closed.offset.x, this.config.closed.offset.y);
        this.addChild(this.closedSprite);

        this.openShadow = new Sprite(openShadowTex);
        this.openShadow.anchor.set(this.config.openShadow.anchor.x, this.config.openShadow.anchor.y);
        this.openShadow.position.set(this.config.openShadow.offset.x, this.config.openShadow.offset.y);
        this.openShadow.alpha = this.config.openShadow.alpha;
        this.openShadow.visible = false;
        this.addChild(this.openShadow);

        this.openSprite = new Sprite(openTex);
        this.openSprite.anchor.set(this.config.open.anchor.x, this.config.open.anchor.y);
        this.openSprite.position.set(this.config.open.offset.x, this.config.open.offset.y);
        this.openSprite.visible = false;
        this.addChild(this.openSprite);

        this.handleGroup = new Container();
        this.handleSprite = new Sprite(handleTex);
        this.handleSprite.anchor.set(0.5, 0.5);
        this.handleSprite.position.set(0, 0);
        this.handleSprite.scale.set(this.config.handle.scale, this.config.handle.scale);

        this.handleShadow = new Sprite(handleShadowTex);
        this.handleShadow.anchor.set(0.5, 0.5);
        this.handleShadow.alpha = this.config.handleShadow.alpha;
        this.handleShadow.scale.set(this.config.handleShadow.scale, this.config.handleShadow.scale);
        this.addChild(this.handleShadow);
        this.handleGroup.addChild(this.handleSprite);
        this.addChild(this.handleGroup);

        this.originalWidth = this.closedSprite.width;
        this.originalRightEdge = this.closedSprite.x + this.originalWidth;
        this.updateHandlePosition();
    }

    private updateHandlePosition() {
        const w = this.closedSprite.width;
        const doorCenterX = this.closedSprite.x + w / 2;
        const handleOffsetX = this.config.handle.offset?.x ?? 0;
        const handleOffsetY = this.config.handle.offset?.y ?? 0;
        this.handleGroup.x = doorCenterX + handleOffsetX;
        this.handleGroup.y = handleOffsetY;
        this.handleGroup.scale.x = w / this.originalWidth;
        this.handleGroup.scale.y = 1;
        this.updateShadowFollow();
    }

    private updateShadowFollow() {
        const shadowOffsetX = this.config.handleShadow.offset.x;
        const shadowOffsetY = this.config.handleShadow.offset.y;
        this.handleShadow.x = this.handleGroup.x + shadowOffsetX;
        this.handleShadow.y = this.handleGroup.y + shadowOffsetY;
        this.handleShadow.rotation = this.handleGroup.rotation;
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

    async turnCW() { await this.rotateHandle(this.config.handleSpinDegrees); }
    async turnCCW() { await this.rotateHandle(-this.config.handleSpinDegrees); }

    private async rotateHandle(degrees: number) {
        await gsap.to(this.handleGroup, {
            duration: this.config.handleSpinDuration,
            rotation: `+=${degrees * Math.PI / 180}`,
            ease: "power2.out",
            onUpdate: () => this.updateShadowFollow()
        });
    }

    async spinFuriously() {
        const tl = gsap.timeline();
        tl.to(this.handleGroup, {
            duration: this.config.handleSpinDuration,
            rotation: `+=${2 * Math.PI}`,
            repeat: this.config.furiousSpinRepeats,
            ease: "none",
            onUpdate: () => this.updateShadowFollow()
        }).to(this.handleGroup, {
            duration: 0.3,
            rotation: 0,
            ease: "back.out(2)",
            onUpdate: () => this.updateShadowFollow()
        });
        await tl;
    }

    private resetHandleRotation() {
        this.handleGroup.rotation = 0;
        this.updateShadowFollow();
    }

    private getDuration(type: "openingOpen" | "openingClosed" | "closingOpen" | "closingClosed", defaultDur: number = 0.5): number {
        const globalAll = GAME.config.getConfig().gameSettings.doorAnimation?.durationAll;
        if (globalAll !== null && globalAll !== undefined) return globalAll;
        const perElement = GAME.config.getConfig().gameSettings.doorAnimation?.durationPerElement;
        if (!perElement) return defaultDur;
        switch (type) {
            case "openingOpen": return perElement.opening?.openDoor ?? defaultDur;
            case "openingClosed": return perElement.opening?.closeDoor ?? defaultDur;
            case "closingOpen": return perElement.closing?.openDoor ?? defaultDur;
            case "closingClosed": return perElement.closing?.closeDoor ?? defaultDur;
            default: return defaultDur;
        }
    }

    async openDoor() {
        if (this.isOpen) return;
        this.isOpen = true;
        this.resetHandleRotation();

        // Fixed right edge of the closed door
        const fixedRightEdge = this.originalRightEdge;
        const minClosedWidth = this.originalWidth * this.config.closedDoorMinWidthPercent;
        const shrinkDur = this.getDuration("openingClosed");

        await gsap.to(this.closedSprite, {
            duration: shrinkDur,
            width: minClosedWidth,
            ease: "power2.in",
            onUpdate: () => {
                const w = this.closedSprite.width;
                this.closedSprite.x = fixedRightEdge - w;
                this.updateHandlePosition();
            },
            onComplete: () => {
                this.closedSprite.width = minClosedWidth;
                this.closedSprite.x = fixedRightEdge - minClosedWidth;
                this.updateHandlePosition();
                this.closedSprite.visible = false;
                this.handleGroup.visible = false;
                this.handleShadow.visible = false;
            }
        });

        // Prepare open door at the same right edge
        const startWidth = this.originalWidth * this.config.openDoorStartWidthPercent;
        const targetWidth = this.originalWidth * this.config.openDoorTargetWidthPercent;
        const openStartX = fixedRightEdge + (this.config.open.offset?.x ?? 0);
        const openStartY = this.config.open.offset?.y ?? 0;
        const expandDur = this.getDuration("openingOpen");

        this.openSprite.visible = true;
        this.openSprite.width = startWidth;
        this.openSprite.x = openStartX;
        this.openSprite.y = openStartY;

        this.openShadow.visible = true;
        this.openShadow.width = startWidth;
        this.openShadow.x = openStartX + (this.config.openShadow.offset?.x ?? 0);
        this.openShadow.y = openStartY + (this.config.openShadow.offset?.y ?? 0);

        // Expand open door to target width (left edge fixed)
        await gsap.to(this.openSprite, {
            duration: expandDur,
            width: targetWidth,
            ease: "power2.out",
            onUpdate: () => {
                const w = this.openSprite.width;
                this.openShadow.width = w;
                this.openShadow.x = openStartX + (this.config.openShadow.offset?.x ?? 0);
            }
        });
    }

    async closeDoor() {
        if (!this.isOpen) return;

        const fixedLeftEdge = this.openSprite.x;
        const endShrinkWidth = this.originalWidth * this.config.openDoorStartWidthPercent;
        const shrinkDur = this.getDuration("closingOpen");

        // Shrink open door (left edge fixed)
        await gsap.to(this.openSprite, {
            duration: shrinkDur,
            width: endShrinkWidth,
            ease: "power2.in",
            onUpdate: () => {
                const w = this.openSprite.width;
                this.openShadow.width = w;
                this.openShadow.x = fixedLeftEdge + (this.config.openShadow.offset?.x ?? 0);
            },
            onComplete: () => {
                this.openSprite.visible = false;
                this.openShadow.visible = false;
            }
        });

        // Prepare closed door at the same left edge
        const closedStartWidth = this.originalWidth * this.config.closedDoorMinWidthPercent;
        const closedStartX = fixedLeftEdge;
        this.closedSprite.visible = true;
        this.closedSprite.width = closedStartWidth;
        this.closedSprite.x = closedStartX;
        this.closedSprite.y = this.config.closed.offset?.y ?? 0;

        this.handleGroup.visible = true;
        this.handleShadow.visible = true;
        this.updateHandlePosition();

        const fixedRightEdge = this.originalRightEdge;
        const expandDur = this.getDuration("closingClosed");

        await gsap.to(this.closedSprite, {
            duration: expandDur,
            width: this.originalWidth,
            ease: "power2.out",
            onUpdate: () => {
                const w = this.closedSprite.width;
                this.closedSprite.x = fixedRightEdge - w;
                this.updateHandlePosition();
            },
            onComplete: () => {
                this.closedSprite.y = this.config.closed.offset?.y ?? 0;
                this.updateHandlePosition();
                this.handleGroup.rotation = 0;
                this.handleShadow.rotation = 0;
            }
        });

        this.isOpen = false;
    }

    public getOriginalWidth(): number {
        return this.originalWidth;
    }
}