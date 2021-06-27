import { Optional } from "./types";

/**
 * Represents a generic result class.
 */
export class Result<T extends unknown, E extends Error> {
	/**
	 * Return an ok result.
	 * @param value
	 */
	static ok<T, E extends Error>(value?: T) {
		return new Result<T, E>(value);
	}

	/**
	 * Create an error result.
	 * @param error
	 */
	static err<T, E extends Error>(error: E) {
		return new Result<T, E>(undefined, error);
	}

	constructor(readonly result?: T, readonly error?: E) {}

	get isOk() {
		return !this.error;
	}

	/**
	 * Get the error of this embed.
	 */
	err(): Optional<E> {
		return this.error;
	}

	/**
	 * Return a default value if this result was erroneous.
	 * @param value
	 */
	orDefault(value: T) {
		if (this.error) {
			return value;
		}
		return this.result;
	}

	/**
	 * Throw an expectation error if this result is erroneous.
	 * @param msg
	 */
	expect(msg: string) {
		if (this.error) {
			throw new Error(msg);
		}
		return this.result;
	}

	/**
	 * Unwrap the value of this result.
	 */
	unwrap(): T {
		if (this.error) {
			throw this.error;
		}

		// need to assert, so T can be undefined
		return this.result!!;
	}
}
