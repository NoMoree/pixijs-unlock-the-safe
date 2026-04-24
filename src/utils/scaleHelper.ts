export const REF_WIDTH = 1016;
export const REF_HEIGHT = 496;

export function getGameScale(): { scale: number; x: number; y: number } {
    const scaleX = window.innerWidth / REF_WIDTH;
    const scaleY = window.innerHeight / REF_HEIGHT;
    const scale = Math.min(scaleX, scaleY);
    const x = (window.innerWidth - REF_WIDTH * scale) / 2;
    const y = (window.innerHeight - REF_HEIGHT * scale) / 2;

    return { scale, x, y };
}