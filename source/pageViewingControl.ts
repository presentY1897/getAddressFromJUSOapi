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
}

let pageViewControl = new pageViewController(
    [new tabPage('dashboardTab', 'dashboard_page'),
    new tabPage('fileUploadTab', 'fileupload_page'),
    new tabPage('workTab', 'work_page')],
    (target: { classList: { add: (arg0: string) => any; }; }) => target.classList.add('d-none'),
    (target: { classList: { remove: (arg0: string) => any; }; }) => target.classList.remove('d-none')
)

pageViewControl.bindingSelectTabShowPage();