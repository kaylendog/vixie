import { Context } from "../structures/Context";
import { Args } from "../syntax/Args";

export interface SyntaxMeta {
	target: Function;
	value: Args;
}

/**
 * Represents a module command.
 * @returns
 */
export const Syntax = (): MethodDecorator => {
	return (target, key, descriptor) => {};
};
