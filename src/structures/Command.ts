import { Awaitable } from "../util/types";
import { VixieClient } from "../VixieClient";
import { Context } from "./Context";

export interface CommandOptions {
    name: string;
    aliases: string[];
}

const DEFAULT_COMMAND_OPTIONS: CommandOptions = {
    name: "command",
    aliases: [],
};

/**
 * Represents a command.
 */
export class Command {
    readonly options: CommandOptions;
    readonly subcommands: Command[] = [];

    constructor(readonly client: VixieClient, options: CommandOptions) {
        this.options = { ...DEFAULT_COMMAND_OPTIONS, ...options };
    }

    get logger() {
        return this.client.logger;
    }

    /**
     * Run the command.
     * @param ctx
     * @param args
     */
    run(ctx: Context, ...args: string[]): Awaitable<any> {}

    /**
     * Add a sub command to this command.
     * @param command
     */
    addSubCommand(...command: Command[]) {
        this.subcommands.push(...this.subcommands);
    }
}
