class conversionFunction {
    name: string;
    func: Function; // maybe possible more strict declare

    constructor(name: string, func: Function) {
        this.name = name;
        this.func = func;
    }
}

class conversionList {
    private conversionFunctions: conversionFunction[] = [];
    private targetConversion: conversionFunction | null = null;

    addConversionFunction(conversionFunction: conversionFunction) {
        this.conversionFunctions.push(conversionFunction);
    }

    target() {
        return this.targetConversion;
    }
    setTarget(name: string) {
        const _target = this.conversionFunctions.find(element => element.name == name);
        if (_target !== undefined) { this.targetConversion = _target; return true; }
        else return false;
    }
}

export { conversionList, conversionFunction }