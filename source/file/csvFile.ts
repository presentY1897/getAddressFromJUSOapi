import { table } from './table';
import { fileHtmlElement } from './fileHTMLElement';

class csvFile {
    file: File;
    name: string
    raw: string = '';
    data: table = new table();

    clickEvent: (file: csvFile) => void
    constructor(params: { file: File, encoding: string, clickEvent: (file: csvFile) => void }) {
        this.file = params.file;
        this.name = this.file.name;
        this.clickEvent = params.clickEvent;
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