import { fileHtmlElement } from './file/fileHTMLElement';

class fileHtmlElementController {
    private elementList: fileHtmlElement[] = [];
    targetElement: fileHtmlElement | null = null;
    private fileListElementId: string;
    private listElement: HTMLUListElement = document.getElementById(this.fileListElementId) as HTMLUListElement;

    constructor(fileListElementId: string) {
        this.fileListElementId = fileListElementId;
    }

    appendFile(fileParam: { file: import("./file/csvFile").csvFile; setStyleFunc: () => void | undefined; setBindingClickEvent: () => void | undefined; }) {
        let htmlElement = new fileHtmlElement(fileParam);
        this.targetElement = htmlElement;

        this.insertElements(htmlElement);
        this.removeElementsActive();
    }

    private insertElements(htmlElement: fileHtmlElement) {
        this.elementList.push(htmlElement);
        this.listElement.appendChild(htmlElement.element);
    }
    private removeElementsActive() {
        [...this.listElement.children].forEach(child => child.classList.remove('active'));
    }
};

export { fileHtmlElementController };