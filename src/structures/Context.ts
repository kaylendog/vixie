import {
    APIMessageContentResolvable, Guild, Message, MessageAdditions, MessageOptions
} from "discord.js";

import { ContextEmbed } from "./ContextEmbed";

/**
 * Represents the context in which a command was run.
 */
export class Context {
	constructor(readonly message: Message) {}

	/**
	 * The user who ran the command.
	 */
	get author() {
		return this.message.author;
	}

	/**
	 * The channel the command was executed in.
	 */
	get channel() {
		return this.message.channel;
	}

	get guild(): Guild | null {
		return this.message.guild;
	}

	/**
	 * Reply to this message.
	 */
	get reply() {
		return this.message.reply;
	}

	/**
	 * Send a message to the channel this context was created in.
	 */
	get send() {
		return this.channel.send.bind(this.channel);
	}

	/**
	 * Create a new context embed.
	 */
	embed() {
		return new ContextEmbed(this);
	}
}
