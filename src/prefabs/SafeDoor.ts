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
    private staticShadow: Sprite;
    private rotatingShadow: Sprite;

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
        const rotatingShadowTex = Assets.get(this.config.handleShadow.textureKey) as Texture;

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
        this.handleSprite.anchor.set(0.5);
        this.handleSprite.position.set(0, 0);
        this.handleSprite.scale.set(this.config.handle.scale);

        // Two shadow representations:
        // - rotatingShadow: used when door is closed and handle rotates
        // - staticShadow: used during door animation to avoid transform issues
        this.rotatingShadow = new Sprite(rotatingShadowTex);
        this.staticShadow = new Sprite(handleShadowTex);
        this.resetHandleShadow();

        this.closedSprite.addChild(this.rotatingShadow);
        this.handleGroup.addChild(this.staticShadow);
        this.handleGroup.addChild(this.handleSprite);
        this.closedSprite.addChild(this.handleGroup);

        this.originalWidth = this.closedSprite.width;
        this.originalRightEdge = this.closedSprite.x + this.originalWidth;
        this.updateHandlePosition();
    }

    private updateShadowMode() {
        const isClosed = !this.isOpen;

        this.rotatingShadow.visible = isClosed;
        this.staticShadow.visible = !isClosed;
    }

    private resetHandleShadow() {
        this.handleGroup.rotation = 0;

        this.rotatingShadow.rotation = 0;
        this.rotatingShadow.anchor.set(0.5);
        this.rotatingShadow.scale.set(this.config.handleShadow.scale);
        this.rotatingShadow.rotation = 0;
        this.rotatingShadow.alpha = this.config.handleShadow.alpha;

        this.staticShadow.scale.set(this.config.handleShadow.scale);
        this.staticShadow.anchor.set(0.5);

        this.updateShadowMode();
    }

    private updateHandlePosition() {
        const w = this.closedSprite.width;
        const doorCenterX = this.closedSprite.x + w / 2;

        this.handleGroup.x = doorCenterX + (this.config.handle.offset?.x ?? 0);
        this.handleGroup.y = this.config.handle.offset?.y ?? 0;

        this.handleGroup.scale.x = w / this.originalWidth;
        this.handleGroup.scale.y = 1;
        this.staticShadow.x = this.handleGroup.x + this.config.handleShadow.offset.x;
        this.staticShadow.y = this.handleGroup.y + this.config.handleShadow.offset.y;

        this.rotatingShadow.x = this.handleGroup.x + this.config.handleShadow.offset.x;
        this.rotatingShadow.y = this.handleGroup.y + this.config.handleShadow.offset.y;
    }

    private syncShadow() {
        const baseX = this.handleGroup.x;
        const baseY = this.handleGroup.y;

        const offsetX = this.config.handleShadow.offset.x;
        const offsetY = this.config.handleShadow.offset.y;

        this.rotatingShadow.x = baseX + offsetX;
        this.rotatingShadow.y = baseY + offsetY;
        this.rotatingShadow.rotation = this.handleGroup.rotation;
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
            const w = this.originalWidth * this.currentScale;
            this.x = this.centerX - w / 2;
            this.y = this.centerY;
        }
    }

    async turnCW() { await this.rotateHandle(this.config.handleSpinDegrees); }

    async turnCCW() { await this.rotateHandle(-this.config.handleSpinDegrees); }

    private rotateHandle(degrees: number) {
        const rad = degrees * Math.PI / 180;

        return gsap.to(this.handleGroup, {
            duration: this.config.handleSpinDuration,
            rotation: `+=${rad}`,
            ease: "power2.out",
            onUpdate: () => this.syncShadow()
        });
    }

    async spinFuriously() {
        const tl = gsap.timeline();
        tl.to(this.handleGroup, {
            duration: this.config.handleSpinDuration,
            rotation: `+=${2 * Math.PI}`,
            repeat: this.config.furiousSpinRepeats,
            ease: "none",
            onUpdate: () => this.syncShadow()
        }).to(this.handleGroup, {
            duration: 0.3,
            rotation: 0,
            ease: "back.out(2)",
            onUpdate: () => this.syncShadow()
        });
        await tl;
    }

    private resetHandle() {
        this.handleGroup.rotation = 0;
        this.syncShadow();
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

        this.resetHandleShadow();
        this.isOpen = true;
        this.resetHandle();

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
            },
            onComplete: () => {
                this.closedSprite.width = minClosedWidth;
                this.closedSprite.x = fixedRightEdge - minClosedWidth;
                this.closedSprite.visible = false;
            }
        });

        // Prepare open door at the same right edge
        const startWidth = this.originalWidth * this.config.openDoorStartWidthPercent;
        const targetWidth = this.originalWidth * this.config.openDoorTargetWidthPercent;
        const openStartX = fixedRightEdge + (this.config.open.offset?.x ?? 0);
        const openStartY = this.config.open.offset?.y ?? 0;
        const expandDur = this.getDuration("openingOpen");

        this.openSprite.width = startWidth;
        this.openSprite.x = openStartX;
        this.openSprite.y = openStartY;

        this.openShadow.width = startWidth;
        this.openShadow.x = openStartX + (this.config.openShadow.offset?.x ?? 0);
        this.openShadow.y = openStartY + (this.config.openShadow.offset?.y ?? 0);

        this.openSprite.visible = true;
        this.openShadow.visible = true;

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

        const fixedRightEdge = this.originalRightEdge;
        const expandDur = this.getDuration("closingClosed");

        this.closedSprite.visible = true;
        this.handleGroup.visible = true;
        await gsap.to(this.closedSprite, {
            duration: expandDur,
            width: this.originalWidth,
            ease: "power2.out",
            onUpdate: () => {
                const w = this.closedSprite.width;
                this.closedSprite.x = fixedRightEdge - w;
            },
            onComplete: () => {
                this.closedSprite.y = this.config.closed.offset?.y ?? 0;
            }
        });

        this.isOpen = false;
        this.resetHandleShadow();
    }

    public getOriginalWidth(): number {
        return this.originalWidth;
    }
}