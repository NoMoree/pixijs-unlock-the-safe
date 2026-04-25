import { CombinationPair, Direction } from "../game/models/GameModels";
import { GAME } from "../GAME";

export class CombinationGenerator {
    static generate(pairCount?: number, maxSteps?: number): CombinationPair[] {
        const config = GAME.config.getConfig().password;
        const sequences = pairCount ?? config.sequences;
        const max = maxSteps ?? config.maxTurns;
        const combo: CombinationPair[] = [];
        let isCW = false;
        for (let i = 0; i < sequences; i++) {
            const steps = Math.floor(Math.random() * max) + 1;
            const direction: Direction = isCW ? "CW" : "CCW";
            isCW = !isCW;
            combo.push({ steps, direction });
        }
        console.log(
            `New Secret Combination: ${combo.map((p) => `${p.steps}${p.direction}`).join(" → ")}`
        );
        return combo;
    }
}