import { gameConfig } from "../GAME";

export class CustomEvent<T = void> {
    private eventName: string;
    private multipleCallersAllowed: boolean;
    private listeners: ((arg?: T) => void)[] = [];

    constructor(name: string, multiAllowed?: boolean) {
        this.eventName = name;
        this.multipleCallersAllowed = multiAllowed;
    }

    // Add listener
    add(listener: (arg?: T) => void) {
        this.listeners.push(listener);
        if (this.listeners.length > 1 && !this.multipleCallersAllowed) {
            gameConfig.showEventConsole ? console.warn(`More than one event added to ${this.eventName}`) : null;
            this.listeners.forEach(element => {
                gameConfig.showEventConsole ? console.warn(element) : null;
            });
        }
    }

    // Remove listener
    remove(listener: (arg?: T) => void) {
        this.listeners = this.listeners.filter(l => l !== listener);
    }

    removeAll() {
        this.listeners = [];
    }

    // Dispatch event
    dispatch(arg?: T) {
        if (gameConfig.showEventConsole) {
            console.log(`⚡ DISPATCH : ${this.eventName} (${this.listeners.length} listeners)`);
        }

        for (const listener of this.listeners) {
            listener(arg);
        }

        if (this.listeners.length < 1) {
            if (gameConfig.showEventConsole) {
                console.warn(`NO listeners added to ${this.eventName}`);
                console.warn("Event dispatched from:", this.getCallerInfo());
            }
        }
    }

    // Get information about where the event is being dispatched from
    private getCallerInfo(): string {
        try {
            // Create an error to get the stack trace
            const error = new Error();
            const stack = error.stack?.split('\n') || [];

            // Find the first line that's not from this file or Error constructor
            for (let i = 0; i < stack.length; i++) {
                const line = stack[i];
                if (line &&
                    !line.includes('CustomEvent.ts') &&
                    !line.includes('Error') &&
                    !line.includes('getCallerInfo') &&
                    !line.includes('dispatch')) {
                    // Clean up the stack trace line
                    return line.trim().replace(/^at\s+/, '');
                }
            }

            return 'Unknown location';
        } catch (e) {
            return 'Unable to determine caller';
        }
    }

    // Check if there are listeners
    hasListeners(): boolean {
        return this.listeners.length > 0;
    }
}
