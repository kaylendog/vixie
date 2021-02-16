import { Message } from "discord.js";

import { Context } from "../structures/Context";

/**
 *
 */
export class ArgContext extends Context {
    index = 0;

    constructor(readonly message: Message, readonly args: string[]) {
        super(message);
    }

    /**
     * The current argument being parsed.
     */
    get arg() {
        return this.args[this.index];
    }

    /**
     * Increment the index value.
     */
    nextIndex() {
        this.index += 1;
        return this;
    }
}
