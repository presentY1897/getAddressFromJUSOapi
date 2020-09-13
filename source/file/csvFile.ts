import { table } from './table';

class csvFile {
    file: File;
    name: string
    raw: string = '';
    data: table = new table();

    constructor(params: { file: File, encoding: string }) {
        this.file = params.file;
        this.name = this.file.name;
        const reader = new FileReader();
        reader.onload = () => {
            this.raw = reader.result as string;
        }
        reader.readAsText(params.file, params.encoding);
    }

    makeTable({ header, isIncludeHeader, delimiter, endOfLine, embracer, maxLineCount }: { header: string, isIncludeHeader: boolean, delimiter: string, endOfLine: string, embracer: string, maxLineCount: number }) {
        this.data.makeColumns(header, delimiter);
        let raw: string = this.raw;
        if (isIncludeHeader) raw = this.raw.split(endOfLine).filter((_, index) => index > 0).join(endOfLine);
        this.data.makeRows({ input: raw, delimiter, endOfLine, embracer, maxLineCount });
    }
};

export { csvFile };