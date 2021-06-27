import { Context } from "../structures/Context";
import { Awaitable } from "../util/types";

export interface PreconditionMeta {
	target: Function;
	value: (context: Context) => Awaitable<boolean>;
}
