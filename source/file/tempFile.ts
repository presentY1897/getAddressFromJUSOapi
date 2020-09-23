import { classFile } from './classFile';

class tempFile extends classFile {
    name: string

    clickEvent: (file: classFile) => void
    constructor(params: { name: string, encoding: string, clickEvent: (file: classFile) => void }) {
        super(params.name, params.clickEvent);
        this.name = params.name;
        this.clickEvent = params.clickEvent;
    }
};

export { tempFile };