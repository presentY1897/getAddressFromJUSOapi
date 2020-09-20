import { table } from './table';

class tempFile {
    name: string
    data: table = new table();

    clickEvent: (file: tempFile) => void
    constructor(params: { name: string, encoding: string, clickEvent: (file: tempFile) => void }) {
        this.name = params.name;
        this.clickEvent = params.clickEvent;
    }
};

export { tempFile };