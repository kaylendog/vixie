import { Result } from "../../util/result";
import { ArgContext } from "../ArgContext";
import { ArgsParseError } from "../ArgsParseError";
import { Argument } from "../Argument";

export class Union<A, B> extends Argument<A | B> {
	constructor(readonly a: Argument<A>, readonly b: Argument<B>) {
		super();
	}

	/**
	 * Validates the union type. Calls valid on either of the two arguments.
	 * @param ctx
	 */
	validate(ctx: ArgContext) {
		return this.a.validate(ctx) || this.b.validate(ctx);
	}

	/**
	 * Match the arguments.
	 */
	async match(ctx: ArgContext): Promise<Result<A | B, ArgsParseError>> {
		// match a
		if (this.a.validate(ctx)) {
			const res = await this.a.match(ctx);
			if (res.isOk) {
				return Result.ok(res.unwrap());
			}
		}

		// match b
		if (this.b.validate(ctx)) {
			const res = await this.b.match(ctx);
			if (res.isOk) {
				return Result.ok(res.unwrap());
			}
		}

		return Result.err<A | B, ArgsParseError>(new ArgsParseError(this));
	}
}
