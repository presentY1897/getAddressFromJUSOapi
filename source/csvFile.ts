import { table } from './table';

class csvFile {
    file: File;
    name: string
    raw: string = '';
    data: table | null = null;

    constructor(params: { file: File, encoding: string }) {
        this.file = params.file;
        this.name = this.file.name;
        const reader = new FileReader();
        reader.onload = () => {
            this.raw = reader.result as string;
        }
        reader.readAsText(params.file, params.encoding);
    }
}

export { csvFile };