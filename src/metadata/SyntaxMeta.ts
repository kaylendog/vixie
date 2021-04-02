import { Context } from "../structures/Context";

export interface ModuleCommandMeta {
    target: Function;
    value: (context: Context) => any;
}

/**
 * Represents a module command.
 * @returns
 */
export const ModuleCommand = (): MethodDecorator => {
    return (target, key, descriptor) => {};
};
