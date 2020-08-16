import { table } from './table';

class file {
    name: string;
    path: string;
    raw: string;
    data: table | null = null;

    constructor(params: { name: string, path: string, raw: string }) {
        this.name = params.name;
        this.path = params.path;
        this.raw = params.raw;
    }
}

export { file };