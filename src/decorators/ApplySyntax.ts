import { container } from "../metadata/MetadataContainer";
import { Args } from "../syntax/Args";
import { Argument } from "../syntax/Argument";

export function ApplySyntax(value: Args): ClassDecorator;
export function ApplySyntax(...args: Argument<unknown>[]): ClassDecorator;

/**
 * Apply a Syntax to this command.
 */
export function ApplySyntax(
    argsOrFirstArgument: Args | Argument<unknown>,
    ...args: Argument<unknown>[]
): ClassDecorator {
    return (target) => {
        if (argsOrFirstArgument instanceof Args) {
            container.commandSyntaxes.push({ target, value: argsOrFirstArgument });
        } else {
            const completeArgs = [argsOrFirstArgument, ...args];
            container.commandSyntaxes.push({ target, value: Args.of(completeArgs) });
        }
    };
}
