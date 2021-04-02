import { VixieClient } from "../VixieClient";

interface ModuleOptions {
    name: string;
}

export abstract class Module {
    constructor(
        readonly client: VixieClient,
        readonly options: ModuleOptions
    ) {}
}
