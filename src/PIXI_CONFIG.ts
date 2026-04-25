import { GAME } from "./GAME";

export class PIXI_CONFIG {
    public getConfig() {
        return {
            door: {
                x: () => window.innerWidth / 2,
                y: () => window.innerHeight / 2,
                anchorX: 0.5,
            },
            timer: {
                posXPercent: 0.275,
                posYPercent: 0.4387,
                anchorX: 0,
                anchorY: 0.5,
                fontSize: 20,
            }
        };
    }

    public updatePositions() {
        GAME.events.redraw.dispatch();
    }
}