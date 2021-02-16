import { VixieClient } from "../VixieClient";

/**
 * The constructor type of `T`.
 */
export type Constructor<T> = new (...args: any[]) => T;

/**
 * Generic might-be-asynchronous type.
 */
export type Awaitable<T> = Promise<T> | T;

/**
 * Generic optional type.
 */
export type Optional<T> = T | undefined;

/**
 * Represents the type of an implemented Vixie structure.
 */
export type VixieImplementation<C extends VixieClient, T> = new (client: C) => T;
