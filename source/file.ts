class file{
    name: string;
    path: string;
    raw: string;
    data: any;

    constructor(params:{name: string, path: string, raw:string, data: any}) {
        this.name = params.name;
        this.path = params.path;
        this.raw  = params.raw;
        this.data = params.data;
    }
}

export { file };