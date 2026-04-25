export type Direction = "CW" | "CCW";

export interface CombinationPair {
    steps: number;
    direction: Direction;
}

export class GameModel {
    secretCombination: CombinationPair[] = [];
    currentPairIndex = 0;
    currentStepCount = 0;
    isUnlocked = false;
    isSpinning = false;
}