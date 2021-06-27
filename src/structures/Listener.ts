import { Channel, Message, TextChannel } from "discord.js";

import { ClientEvents, DiscordEvents } from "../util/discord";
import { Awaitable } from "../util/types";
import { VixieClient } from "../VixieClient";

export interface ListenerOptions<T extends DiscordEvents> {
	event: T;
}

/**
 * Represents a listener.
 */
export class Listener<T extends DiscordEvents> {
	readonly options: ListenerOptions<T>;

	constructor(readonly client: VixieClient, options: ListenerOptions<T>) {
		this.options = { ...options };
	}

	get logger() {
		return this.client.logger;
	}

	/**
	 * Handle the target event.
	 * @param args
	 */
	run(...args: ClientEvents[T]): Awaitable<any> {}
}
