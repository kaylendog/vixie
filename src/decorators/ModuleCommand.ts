import { container } from "../metadata/MetadataContainer";
import { Module } from "../module/Module";
import { Command, CommandOptions } from "../structures/Command";
import { Context } from "../structures/Context";
import { Constructor } from "../util/types";
import { VixieClient } from "../VixieClient";

/**
 * Mark this function as a command.
 * @returns
 */
export const ModuleCommand = (opts: CommandOptions): MethodDecorator => {
	// return the class
	return (target, propertyKey: string | symbol, descriptor) => {
		if (descriptor.value === undefined) {
			throw new Error("Descriptor value is undefined!");
		}
		class DecoratorCommand extends Command {
			constructor(client: VixieClient) {
				super(client, opts);
			}
			run(ctx: Context, ...args: any[]): void {
				// run the decorated method
				((descriptor.value! as unknown) as (ctx: Context, ...args: any[]) => unknown).call(target, ctx, ...args);
			}
		}
		container.moduleCommands.push({ target: target.constructor as Constructor<Module>, command: DecoratorCommand });
	};
};
