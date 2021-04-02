import { VixieClient } from "../VixieClient";
import { Command } from "./Command";

describe("command class tests", () => {
    it("should construct correctly", () => {
        // instantiate a client object.
        const client = new VixieClient();
        // create the command class
        class TestCommand extends Command {
            constructor(client: VixieClient) {
                super(client, { name: "test", aliases: [] });
            }
        }
        // construct the command.
        const command = new TestCommand(client);
        expect(command).toBeInstanceOf(TestCommand);
        expect(command).toBeInstanceOf(Command);
        // cleanup client.
        client.destroy();
    });
});
