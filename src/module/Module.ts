import { Command } from "../structures/Command";
import { VixieImplementation } from "../util/types";
import { VixieClient } from "../VixieClient";

interface ModuleOptions {
	name: string;
}

/**
 * Represents a module.
 */
export abstract class Module {
	constructor(readonly client: VixieClient, readonly options: ModuleOptions) {}

	/**
	 * Register the target commands on this module.
	 * @param commands The commands to register
	 */
	registerCommand(...commands: VixieImplementation<this["client"], Command>[]) {
		this.client.registerCommand(...commands);
	}
}
