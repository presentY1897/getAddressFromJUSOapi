import { table } from './table';
import { file } from './file';
// 인터페이스로 구현해야할 거 같음.

class converter {
    target: file;
    conversionFunc: Function;

    constructor(file: file, conversionFunc: Function) {
        this.target = file;
        this.conversionFunc = conversionFunc;
    }

    do() {
        this.conversionFunc(this.target);
    }
}

export { converter };