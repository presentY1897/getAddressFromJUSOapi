class tabPage {
    tabClassName: string;
    viewPageId: string;

    constructor(tabClassName: string, viewPageId: string) {
        this.tabClassName = tabClassName;
        this.viewPageId = viewPageId;
    }
};

export { tabPage };