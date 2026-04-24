export class TimerModel {
    startTime: number | null = null;
    elapsedSeconds = 0;
    isRunning = false;

    start() {
        this.startTime = performance.now();
        this.isRunning = true;
    }

    stop() {
        this.isRunning = false;
    }

    reset() {
        this.elapsedSeconds = 0;
        this.startTime = null;
        this.isRunning = false;
    }

    update() {
        if (!this.isRunning || this.startTime === null) return;
        this.elapsedSeconds = (performance.now() - this.startTime) / 1000;
    }
}