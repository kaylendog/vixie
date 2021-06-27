/**
 * Represents the metadata for a command declared on a module.
 */
export interface ModuleCommandMeta {
	/**
	 * The target module.
	 */
	target: Function;
	/**
	 * The declared command.
	 */
	command: Function;
}
