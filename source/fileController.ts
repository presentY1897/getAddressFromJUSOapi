import { csvFile } from './file/csvFile';

class fileController {
    files: csvFile[] = [];
    targetFile: csvFile | null = null;
    element: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
    }

    private makeElement(file: csvFile, type: string, clickCallback: (file: csvFile) => void) {
        let fileElement = document.createElement(type);
        fileElement.innerText = file.name;
        fileElement.addEventListener('click', () => {
            this.targetFile = file;
            clickCallback(file);
        });
        return fileElement;
    }

    addFile(file: csvFile, type: string) {
        this.files.push(file);
        this.element.appendChild(this.makeElement(file, type, file.clickEvent));
    }
    removeSelectFile(file: csvFile) {
        var selectedFileIdx = this.files.findIndex(_file => _file == file);
        selectedFileIdx != -1 ? this.files.splice(selectedFileIdx, 1) : null;
    }
    clearFiles() {
        this.files = [];
    }
};

export { fileController };