import { classFile } from './file/classFile';
// 인터페이스로 구현해야할 거 같음.

class converter {
    target: classFile;
    conversionFunc: Function;

    constructor(file: classFile, conversionFunc: Function) {
        this.target = file;
        this.conversionFunc = conversionFunc;
    }

    do() {
        this.conversionFunc(this.target);
    }
};

export { converter };