import * as chokidar from "chokidar";

import { VixieImplementation } from "../util/types";
import { VixieClient } from "../VixieClient";
import { Module } from "./Module";

interface ModuleWatcherOptions {
    path: string;
}

/**
 * Watches modules and hot reloads them.
 */
export class ModuleWatcher<C extends VixieClient> {
    /**
     * Chokidar watcher.
     */
    private watcher = chokidar.watch(this.options.path);

    private modules = new Map<string, string>();

    constructor(readonly client: C, readonly options: ModuleWatcherOptions) {
        this.watcher.on("add", (path) => this.registerModule(path));
    }

    /**
     * Declare a module to the module watcher.
     * @param names
     */
    public async registerModules(...paths: string[]) {
        // iterate over module names and register.
        for (const path of paths) {
            this.registerModule(path);
        }
    }

    /**
     * Declare a module to the module watcher.
     */
    public async registerModule(path: string) {
        try {
            // attempt to require the module.
            const module = (await import(path)) as VixieImplementation<
                C,
                Module
            >;
            if (!module) {
                throw new Error(`No default import found in file '${path}'`);
            }
        } catch (err) {}
    }

    /**
     * Reload the module with the target path.
     * @param path
     */
    public async reloadModule(path: string) {
        if (!this.modules.has(path)) {
            return;
        }
        // unload the module
        await this.unloadModule(path);
        // load the module
        await this.loadModule(path);
    }

    public async loadModule(path: string) {}

    /**
     * Unload the module with the target path.
     * @param path
     */
    public async unloadModule(path: string) {}
}
