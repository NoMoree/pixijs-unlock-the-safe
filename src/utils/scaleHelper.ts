export function getGameScale(refWidth: number, refHeight: number): { scale: number; x: number; y: number } {
    const scaleX = window.innerWidth / refWidth;
    const scaleY = window.innerHeight / refHeight;
    const scale = Math.min(scaleX, scaleY);
    const x = (window.innerWidth - refWidth * scale) / 2;
    const y = (window.innerHeight - refHeight * scale) / 2;
    return { scale, x, y };
}