import { ApplyPrecondition } from "../decorators/ApplyPrecondition";
import { container } from "../metadata/MetadataContainer";
import { Command } from "../structures/Command";
import { Context } from "../structures/Context";

describe("apply precondition tests", () => {
	it("should be able to find decorated classes", () => {
		@ApplyPrecondition((ctx) => ctx.author.id == "1234")
		class TestCommand extends Command {}
		// constructor signature
		expect(container.filterPreconditions(TestCommand)).toBeDefined();
		// constructor function name
		expect(container.filterPreconditions("TestCommand")).toBeDefined();
	});

	it("should evaluate correctly", () => {
		@ApplyPrecondition((ctx) => ctx.author.id == "1234")
		class TestCommand extends Command {}
		// fetch the precondition
		const precondition = container.filterPreconditions(TestCommand)[0];
		expect(precondition).toBeDefined();
		// evaluate precondition
		expect(precondition.value({ author: { id: "1234" } } as Context)).toBeTruthy();
		expect(precondition.value({ author: { id: "4321" } } as Context)).toBeFalsy();
	});
});
