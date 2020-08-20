import { csvFile } from './file/csvFile';
// 인터페이스로 구현해야할 거 같음.

class converter {
    target: csvFile;
    conversionFunc: Function;

    constructor(file: csvFile, conversionFunc: Function) {
        this.target = file;
        this.conversionFunc = conversionFunc;
    }

    do() {
        this.conversionFunc(this.target);
    }
};

export { converter };