import { table } from './table';
import { classFile } from './classFile';

class tempFile extends classFile {
    name: string
    data: table = new table();

    clickEvent: (file: classFile) => void
    constructor(params: { name: string, encoding: string, clickEvent: (file: classFile) => void }) {
        super(params.name);
        this.name = params.name;
        this.clickEvent = params.clickEvent;
    }
};

export { tempFile };