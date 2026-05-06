export type GameScaleOptions = {
    maxOverflowRatio: number;
    targetScreenXRatio: number;
    doorRefX: number;
};

export type GameScaleResult = {
    scale: number;
    x: number;
    y: number;
};

export function getGameScale(
    refWidth: number,
    refHeight: number,
    options: GameScaleOptions
): GameScaleResult {
    const isPortrait = window.innerHeight > window.innerWidth;

    let scale: number;
    let x: number;
    let y: number;

    if (isPortrait) {
        const scaleByHeight = window.innerHeight / refHeight;

        const maxAllowedWidth = window.innerWidth * (1 + options.maxOverflowRatio);
        const scaleByWidthLimit = maxAllowedWidth / refWidth;

        scale = Math.min(scaleByHeight, scaleByWidthLimit);

        const scaledWidth = refWidth * scale;

        const targetScreenX = window.innerWidth * options.targetScreenXRatio;

        x = targetScreenX - options.doorRefX * scale;

        const minX = window.innerWidth - scaledWidth;
        const maxX = 0;

        x = Math.max(minX, Math.min(maxX, x));
        y = 0;
    } else {
        const scaleX = window.innerWidth / refWidth;
        const scaleY = window.innerHeight / refHeight;

        scale = Math.min(scaleX, scaleY);

        const scaledWidth = refWidth * scale;
        const scaledHeight = refHeight * scale;

        x = (window.innerWidth - scaledWidth) / 2;
        y = (window.innerHeight - scaledHeight) / 2;
    }

    return { scale, x, y };
}