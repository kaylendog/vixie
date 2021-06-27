import { ModuleCommandMeta } from "./ModuleCommandMeta";
import { PreconditionMeta } from "./PreconditionMeta";
import { SyntaxMeta } from "./SyntaxMeta";

class MetadataContainer {
	readonly commandPreconditions: PreconditionMeta[] = [];
	readonly commandSyntaxes: SyntaxMeta[] = [];
	readonly moduleCommands: ModuleCommandMeta[] = [];

	filterPreconditions(target: Function | string): PreconditionMeta[];
	filterPreconditions(target: (Function | string)[]): PreconditionMeta[];
	filterPreconditions(target: (Function | string) | (Function | string)[]): PreconditionMeta[] {
		return this.filterByTarget(this.commandPreconditions, target);
	}

	filterSyntax(target: Function | string): SyntaxMeta[];
	filterSyntax(target: (Function | string)[]): SyntaxMeta[];
	filterSyntax(target: (Function | string) | (Function | string)[]): SyntaxMeta[] {
		return this.filterByTarget(this.commandSyntaxes, target);
	}

	filterModuleCommands(target: Function | string): ModuleCommandMeta[];
	filterModuleCommands(target: (Function | string)[]): ModuleCommandMeta[];
	filterModuleCommands(target: (Function | string) | (Function | string)[]): ModuleCommandMeta[] {
		return this.filterByTarget(this.moduleCommands, target);
	}

	/**
	 * Filters given array by a given target or targets.
	 */
	protected filterByTarget<T extends { target: Function | string }>(
		array: T[],
		target: (Function | string) | (Function | string)[]
	): T[] {
		return array.filter((val) => {
			return Array.isArray(target) ? target.indexOf(val.target) !== -1 : val.target === target;
		});
	}
}

export const container = new MetadataContainer();
