import { table } from './table';

class classFile {
    name: string
    data: table = new table();

    constructor(name: string) {
        this.name = name;
    }
};

export { classFile };