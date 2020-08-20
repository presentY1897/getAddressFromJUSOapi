import { csvFile } from './csvFile';

class fileHtmlElement {
    targetFile: csvFile;
    element: HTMLLIElement;

    constructor(param: { file: csvFile, setStyleFunc: () => void | undefined, setBindingClickEvent: () => void | undefined }) {
        this.targetFile = param.file;
        this.element = document.createElement('li');
        this.element.innerText = param.file.name;
        param.setStyleFunc !== undefined ? this.setElementStyle = param.setStyleFunc : null;
        param.setBindingClickEvent !== undefined ? this.bindingElementClickEvent = param.setBindingClickEvent : null;
        this.setElementStyle();
        this.bindingElementClickEvent();
    }

    private setElementStyle() {
        this.element.setAttribute('class', 'list-group-item');
        this.element.classList.add('active');
    }

    private bindingElementClickEvent() {

    }

};

export { fileHtmlElement };