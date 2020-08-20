class table {
    columns: string[] = [];
    rows: string[][] = [[]];

    makeColumns(input: string, delimiter: string) {
        this.columns = input.split(delimiter);
    }
    private splitAsLine(input: string, endofLine: string, maxLineCount: number | undefined): string[] {
        return input.split(endofLine).slice(0, maxLineCount);
    }
    private splitAsEmbracer(input: string[], embracer: string): string[][] {
        return input.map(line => line.split(embracer));
    }
    private splitAsDelimiter(input: string[][], delimiter: string): string[][] {
        return input.map(line => line
            .map((element, index) => {
                if (index % 2 == 0) return element.split(delimiter).filter(e => e != "")
                else return [element]
            })
            .reduce((acc, curr) => acc.concat(curr)));
    }
    makeRows({ input, delimiter, endOfLine, embracer, maxLineCount = undefined }:
        { input: string; delimiter: string; endOfLine: string; embracer: string; maxLineCount: number | undefined }) {
        let lines = this.splitAsLine(input, endOfLine, maxLineCount);
        let preRows = this.splitAsEmbracer(lines, embracer);
        this.rows = this.splitAsDelimiter(preRows, delimiter);
    }
};

export { table };