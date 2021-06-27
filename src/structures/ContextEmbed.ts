import { MessageEmbed, MessageEmbedOptions } from "discord.js";

import { Context } from "./Context";

/**
 * An embed with a built-in context for quickly replying to messages with embeds.
 */
export class ContextEmbed extends MessageEmbed {
	constructor(readonly ctx: Context, data?: MessageEmbed | MessageEmbedOptions) {
		super();
	}

	/**
	 * Send this embed to the target channel.
	 */
	async send() {
		return await this.ctx.channel.send(this);
	}
}
