import { Context } from "../structures/Context";

export interface SyntaxMeta {
	target: Function;
	value: (context: Context) => any;
}

/**
 * Represents a module command.
 * @returns
 */
export const Syntax = (): MethodDecorator => {
	return (target, key, descriptor) => {};
};
