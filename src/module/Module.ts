import { Command } from "../structures/Command";
import { Constructor, VixieImplementation } from "../util/types";
import { VixieClient } from "../VixieClient";

interface ModuleOptions {
	name: string;
}

/**
 * Represents a module.
 */
export abstract class Module {
	constructor(readonly client: VixieClient, readonly options: ModuleOptions) {}

	lookupModule<T extends Module>(constructor: Constructor<T>) {
		const module = this.client.modules.find((module) => module.constructor === constructor);
		// if no module exists.
		if (module === undefined) {
			throw new Error("Failed to resolve module " + constructor.name);
		}
		// cast and return
		return module as T;
	}

	/**
	 * Register the target commands on this module.
	 * @param commands The commands to register
	 */
	registerCommand(...commands: VixieImplementation<this["client"], Command>[]) {
		this.client.registerCommand(...commands);
	}
}
