import { Argument } from "./Argument";

export class ArgsParseError extends Error {
    readonly args: Argument<any>[];

    constructor(...args: Argument<any>[]) {
        super("Failed to parse arguments");
        this.args = args;
    }
}
