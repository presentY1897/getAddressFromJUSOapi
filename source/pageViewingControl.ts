import { tabPage } from './pageView/tabPage';

class pageViewController {
    private tabPageConfigs: tabPage[] = [];
    hideFunc: Function;
    showFunc: Function;

    constructor(configs: tabPage[], hideFunc: Function, showFunc: Function) {
        this.tabPageConfigs = configs;
        this.hideFunc = hideFunc;
        this.showFunc = showFunc;
    }
    private hideOtherExceptTarget(target: tabPage) {
        this.tabPageConfigs.filter(element => element != target).forEach(element => {
            let targetPage = document.getElementById(element.viewPageId);
            this.hideFunc(targetPage);
        });
    }
    bindingSelectTabShowPage() {
        this.tabPageConfigs.forEach(element =>
            [...document.getElementsByClassName(element.tabClassName)].forEach(tab =>
                tab.addEventListener('click', _ => {
                    let targetPage = document.getElementById(element.viewPageId);
                    this.showFunc(targetPage);
                    this.hideOtherExceptTarget(element);
                }))
        )
    }
};

export { pageViewController };