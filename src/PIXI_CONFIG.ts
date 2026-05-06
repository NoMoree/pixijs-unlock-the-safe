export class PIXI_CONFIG {
    public getConfig() {
        return {
            password: {
                maxTurns: 9,
                sequences: 3,
            },

            door: {
                closed: {
                    textureKey: "door-closed",
                    anchor: { x: 0, y: 0.5 },
                    offset: { x: 25, y: 0 },
                },
                open: {
                    textureKey: "door-open",
                    anchor: { x: 0, y: 0.5 },
                    offset: { x: -95, y: 0 },
                },
                openShadow: {
                    textureKey: "door-open-shadow",
                    anchor: { x: 0, y: 0.5 },
                    offset: { x: 50, y: 25 },
                    scale: 1,
                    alpha: 1,
                },
                handle: {
                    textureKey: "door-handle",
                    anchor: { x: 0.5, y: 0.5 },
                    offset: { x: -60, y: 0 },
                    scale: 1,
                },
                handleShadow: {
                    textureKey: "door-handle-shadow",
                    anchor: { x: 0.5, y: 0.5 },
                    offset: { x: 12, y: 7 },
                    scale: 1,
                    alpha: 1,
                },
                closedDoorMinWidthPercent: 0.25,
                openDoorStartWidthPercent: 0.25,
                openDoorTargetWidthPercent: 0.75,

                handleSpinDegrees: 60,
                handleSpinDuration: 0.3,
                furiousSpinRepeats: 3,
            },

            timer: {
                posXPercent: 0.2845,
                posYPercent: 0.4643,
                anchorX: 0,
                anchorY: 0.5,
                fontSize: 25,
            },

            shine: {
                count: 35,
                radius: 300,
                minDuration: 0.6,
                maxDuration: 1.2,
            },

            gameSettings: {
                doorAnimation: {
                    durationAll: null,   // if set, overrides all door animation durations
                    durationPerElement: {
                        opening: { openDoor: 0.5, closeDoor: 0.5 },
                        closing: { openDoor: 0.5, closeDoor: 0.5 },
                    },
                },
            },
        };
    }
}