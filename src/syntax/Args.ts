import { Argument } from "./Argument";
import { Union } from "./arguments/Union";

/**
 * A generic argument parser.
 */
export class Args {
	static of(argumentArray: Argument<unknown>[]) {
		const args = new Args();
		args.args = argumentArray;
		return args;
	}

	private args: Argument<any>[] = [];

	/**
	 * Expect the next argument.
	 * @param argument
	 */
	public expect(argument: Argument<any>) {
		this.args.push(argument);
		return this;
	}

	/**
	 * Add a union type to this array.
	 * @param a
	 * @param b
	 */
	public either<A, B>(a: Argument<A>, b: Argument<B>) {
		this.args.push(new Union(a, b));
		return this;
	}
}
