import { Command } from "../structures/Command";
import { Optional } from "../util/types";

export class CommandNode {
    constructor(readonly name: string) {}

    private nodes: CommandNode[] = [];

    /**
     * Add a sub-node to this command node.
     * @param node
     */
    addNode(...nodes: CommandNode[]) {
        this.nodes.push(...nodes);
        return this;
    }

    /**
     * Match this node with the specified array.
     * @param args
     */
    match(args: string[]): Optional<CommandNode> {
        if (args[0] != this.name) {
            return;
        }

        if (args.length == 0) {
            return this;
        }

        for (const node of this.nodes) {
            if (node.match(args.slice(1))) {
                return node;
            }
        }
    }
}

/**
 * Build the node tree for the target command.
 * @param command
 */
export const buildNodeTree = (command: Command): CommandNode =>
    new CommandNode(command.options.name).addNode(
        ...command.subcommands.map((v) => buildNodeTree(v))
    );
