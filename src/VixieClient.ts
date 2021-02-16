import { Client, Collection, Message } from "discord.js";
import { Logger } from "winston";

import { buildNodeTree, CommandNode } from "./command/CommadNode";
import { container } from "./metadata/MetadataContainer";
import { Command } from "./structures/Command";
import { Context } from "./structures/Context";
import { Listener } from "./structures/Listener";
import { DiscordEvents } from "./util/discord";
import { createLogger } from "./util/logging";
import { Awaitable, VixieImplementation } from "./util/types";

interface VixieOptions {
    prefix: string | ((ctx: Context) => Awaitable<string>);
    loggerPrefix: string;
}

const DEFAULT_VIXIE_OPTIONS: VixieOptions = {
    prefix: "uwu!",
    loggerPrefix: "vixie",
};

/**
 * Generic client implementation.
 */
export class VixieClient extends Client {
    readonly opts: VixieOptions;

    private commands = new Collection<string, Command>();
    private nodeTree = new Collection<string, CommandNode>();
    private aliases = new Collection<string, Command>();

    private eventListeners = new Collection<DiscordEvents, Listener<any>[]>();

    readonly logger: Logger;

    constructor(opts?: Partial<VixieOptions>) {
        super();
        this.opts = { ...DEFAULT_VIXIE_OPTIONS, ...opts };
        this.logger = createLogger(this.opts.loggerPrefix);

        this.on("message", (m) => this.extractCommand(m));
    }

    /**
     * Register a command.
     * @param commands
     */
    registerListener(
        ...commands: VixieImplementation<this, Listener<DiscordEvents>>[]
    ) {
        commands.forEach((v) => {
            const ev = new v(this);

            // create listener array if it doesn't exist
            if (!this.eventListeners.has(ev.options.event)) {
                this.eventListeners.set(ev.options.event, []);
            }

            const arr = this.eventListeners.get(ev.options.event)!!;
            arr.push(ev);
        });
        return this;
    }

    /**
     * Register a command.
     * @param commands
     */
    registerCommand(...commands: VixieImplementation<this, Command>[]) {
        commands.forEach((v) => {
            const cmd = new v(this);
            this.commands.set(cmd.options.name, cmd);
        });
        return this;
    }

    /**
     * Attempt to extract a command from this message and evaluate it if it exists.
     * @param m
     */
    protected async extractCommand(m: Message) {
        const ctx = new Context(m);
        const prefix =
            typeof this.opts.prefix == "string"
                ? this.opts.prefix
                : await this.opts.prefix(ctx);

        if (!m.cleanContent.startsWith(prefix)) {
            return;
        }

        const args = m.cleanContent.trim().slice(prefix.length).split(" ");

        const cmd = args.shift();

        if (!cmd) {
            return;
        }

        // check if the target command exists.
        let command = this.commands.get(cmd) || this.aliases.get(cmd);
        if (!command) {
            return;
        }

        for (const precondition of container.filterPreconditions(
            command.constructor
        )) {
            if (!(await precondition.value(ctx))) {
                return;
            }
        }

        return command.run(ctx, ...args);
    }

    /**
     * Initialize the client and connect to Discord.
     * @param token
     */
    async login(token: string) {
        // register aliases
        this.commands.forEach((v) => {
            v.options.aliases.forEach((a) => this.aliases.set(a, v));
            this.nodeTree.set(v.options.name, buildNodeTree(v));
        });

        // register event listeners.
        this.eventListeners.forEach((v, k) => {
            v.forEach((l) => {
                this.on(k, (...args) => l.run(...args));
            });
        });

        await super.login(token);

        return token;
    }
}
