import { container } from "../metadata/MetadataContainer";
import { Context } from "../structures/Context";
import { Awaitable } from "../util/types";

/**
 * Apply a precondition to this command.
 */
export const ApplyPrecondition = (...values: ((ctx: Context) => Awaitable<boolean>)[]): ClassDecorator => {
    return (target) => {
        values.forEach((value) => {
            container.commandPreconditions.push({ target, value });
        });
    };
};
