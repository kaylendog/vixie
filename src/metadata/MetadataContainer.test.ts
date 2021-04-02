import { ApplyPrecondition } from "../decorators/ApplyPrecondition";
import { Command } from "../structures/Command";
import { container } from "./MetadataContainer";

describe("metadata container tests", () => {
    it("should initially be empty", () => {
        expect(container.commandPreconditions.length).toBe(0);
        expect(container.commandSyntaxes.length).toBe(0);
    });

    it("should be able to find decorated classes", () => {
        @ApplyPrecondition((ctx) => ctx.author.id == "1234")
        class TestCommand extends Command {}
        // constructor signature
        expect(container.filterPreconditions(TestCommand)).toBeDefined();
        // constructor function name
        expect(container.filterPreconditions("TestCommand")).toBeDefined();
    });
});
