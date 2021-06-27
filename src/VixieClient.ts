import { Client, Collection, Message } from "discord.js";
import { Logger } from "winston";

import { buildNodeTree, CommandNode } from "./command/CommadNode";
import { container } from "./metadata/MetadataContainer";
import { Module } from "./module/Module";
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

	private modules = new Collection<string, Module>();
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
	registerListener(...listeners: VixieImplementation<this, Listener<DiscordEvents>>[]) {
		listeners.forEach((v) => {
			this.logger.debug(`Registering listener '${v.name}'...`);
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
			this.logger.debug(`Registering command '${v.name}'...`);
			const cmd = new v(this);
			this.commands.set(cmd.options.name, cmd);
		});
		return this;
	}

	/**
	 * Register the target modules.
	 * @param modules
	 */
	registerModule(...modules: VixieImplementation<this, Module>[]) {
		modules.forEach((v) => {
			this.logger.debug(`Registering module '${v.name}'...`);
			const mod = new v(this);
			this.modules.set(mod.constructor.name, mod);
		});
		return this;
	}

	/**
	 * Declare decorated commands on modules.
	 */
	protected declareDecoratedCommands() {
		this.logger.debug("Declaring decorated commands...");
		// iterate over metadata and attempt to resolve a module using the name
		// of the constructor function.
		container.moduleCommands.forEach((v) => {
			this.logger.debug(`Registering command on module '${v.target.name}'...`);
			const mod = this.modules.get(v.target.name);
			if (!mod) {
				throw new Error("Attempted to declare module command on unregistered module.");
			}
			mod.registerCommand(v.command as VixieImplementation<VixieClient, Command>);
		});
	}

	/**
	 * Attempt to extract a command from this message and evaluate it if it exists.
	 * @param m
	 */
	protected async extractCommand(m: Message) {
		const ctx = new Context(m);
		const prefix = typeof this.opts.prefix == "string" ? this.opts.prefix : await this.opts.prefix(ctx);

		if (!m.cleanContent.startsWith(prefix)) {
			return;
		}
		// debug
		this.logger.debug("Found a potential command - attempting to resolve...");
		// extract args and check map
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
		// execute preconditions
		for (const precondition of container.filterPreconditions(command.constructor)) {
			this.logger.debug(`Executing precondition '${precondition.value.name}'`);
			if (!(await precondition.value(ctx))) {
				this.logger.debug(`Precondition failed!`);
				return;
			}
		}
		// run the command
		return command.run(ctx, ...args);
	}

	/**
	 * Initialize the client and connect to Discord.
	 * @param token
	 */
	async login(token: string) {
		// declare decorated commands
		this.declareDecoratedCommands();
		this.logger.debug(`Have ${this.commands.size} registered - ${this.commands.map((v) => v.options.name)}`);

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
