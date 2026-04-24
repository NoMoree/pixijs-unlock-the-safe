import { Text, TextStyle } from "pixi.js";
import { GAME_MODELS } from "../GAME";

export class TimerText extends Text {
    constructor() {
        super({
            text: "0:00",
            style: new TextStyle({
                fill: "#ff6666",
                fontSize: 20,
                fontFamily: "monospace",
                stroke: {
                    color: "#220000",
                    width: 2
                }
            }),
        });
    }

    update() {
        const secs = GAME_MODELS.timer.elapsedSeconds;
        const mins = Math.floor(secs / 60);
        const remainingSecs = Math.floor(secs % 60);
        this.text = `${mins}:${remainingSecs.toString().padStart(2, "0")}`;
    }
}