import { Context } from "../structures/Context";
import { Result } from "../util/result";
import { Awaitable } from "../util/types";
import { ArgContext } from "./ArgContext";
import { ArgsParseError } from "./ArgsParseError";

/**
 * Represents a parseable argument.
 */
export abstract class Argument<T> {
    /**
     * Check if the string is at least somewhat valid before parsing.
     */
    abstract validate(ctx: ArgContext): boolean;

    /**
     * Parse the string and return T.
     * @param ctx
     */
    abstract match(ctx: ArgContext): Awaitable<Result<T, ArgsParseError>>;
}
