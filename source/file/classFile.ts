import { table } from './table';

class classFile {
    name: string
    data: table = new table();
    clickEvent: (file: classFile) => void

    constructor(name: string, clickEvent: (file: classFile) => void) {
        this.name = name;
        this.clickEvent = clickEvent;
    }
};

export { classFile };