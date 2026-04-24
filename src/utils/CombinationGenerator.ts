import { CombinationPair, Direction } from "../game/models/GameModels";

export class CombinationGenerator {
    static generate(pairCount = 1, maxSteps = 1): CombinationPair[] {
        const combo: CombinationPair[] = [];
        let isCW = false;
        for (let i = 0; i < pairCount; i++) {
            const steps = Math.floor(Math.random() * maxSteps) + 1;
            const direction: Direction = isCW ? "CW" : "CCW";
            isCW = !isCW;
            combo.push({ steps, direction });
        }
        console.log(
            `New Secret Combination: ${combo
                .map((p) => `${p.steps}${p.direction}`)
                .join(" → ")}`
        );
        return combo;
    }
}