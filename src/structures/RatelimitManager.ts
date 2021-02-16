import { Collection } from "discord.js";

import { Command } from "./Command";
import { Context } from "./Context";

interface RatelimitOptions {
    maxCount: number;
    duration: number;
}

interface Execution {
    count: number;
    timestamp: number;
}

/**
 * Manages rate limits for commands.
 */
export class RatelimitManager {
    constructor(
        readonly command: Command,
        readonly options: RatelimitOptions
    ) {}

    readonly executions = new Collection<string, Execution>();

    /**
     * Clean up the limits hash map.
     */
    cleanupTimestamps() {
        // drop expired timestamps from memory.
        for (const entry of this.executions) {
            if (entry[1].timestamp < Date.now()) {
                this.executions.delete(entry[0]);
            }
        }
        setTimeout(() => this.cleanupTimestamps(), 60e3);
    }

    /**
     * Store the time that the target context was executed.
     * @param ctx
     */
    userDidExecute(ctx: Context) {
        if (!this.executions.has(ctx.author.id)) {
            this.executions.set(ctx.author.id, { count: 0, timestamp: 0 });
        }

        const execution = this.executions.get(ctx.author.id)!;
        execution.count += 1;

        if (execution.count < this.options.maxCount) {
        }
    }

    /**
     * Apply this manager as a precondition.
     * @param ctx
     */
    apply(ctx: Context) {
        if (!this.executions.has(ctx.author.id)) {
            this.userDidExecute(ctx);
            return true;
        }

        // check timestamp
        const timestamp = this.executions.get(ctx.author.id);
        if (timestamp || 0 < Date.now()) {
            this.userDidExecute(ctx);
            return true;
        }

        return false;
    }
}
