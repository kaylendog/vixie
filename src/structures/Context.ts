import {
    APIMessageContentResolvable, Guild, Message, MessageAdditions, MessageOptions
} from "discord.js";

import { ContextEmbed } from "./ContextEmbed";

/**
 * Represents the context in which a command was run.
 */
export class Context {
	constructor(message: Message) {
		this._message = message;
	}

	// workaround for needing to specify types on cloned methods
	private _message: Message;

	/**
	 * The message this content represents.
	 */
	get message(): Message {
		return this._message;
	}

	/**
	 * The user who ran the command.
	 */
	get author() {
		return this._message.author;
	}

	/**
	 * The channel the command was executed in.
	 */
	get channel() {
		return this._message.channel;
	}

	get guild(): Guild | null {
		return this._message.guild;
	}

	/**
	 * Reply to this message.
	 */
	reply = this.message.reply;

	/**
	 * Send a message to the channel this context was created in.
	 */
	send = this.channel.send.bind(this.channel);

	/**
	 * Create a new context embed.
	 */
	embed() {
		return new ContextEmbed(this);
	}
}
