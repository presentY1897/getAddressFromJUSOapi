import { classFile } from './file/classFile';

class fileController {
    files: classFile[] = [];
    targetFile: classFile | null = null;
    element: HTMLElement;

    constructor(element: HTMLElement) {
        this.element = element;
    }

    private makeElement(file: classFile, type: string, clickCallback: (file: classFile) => void) {
        let fileElement = document.createElement(type);
        fileElement.classList.add('list-group-item');
        fileElement.innerText = file.name;
        fileElement.addEventListener('click', () => {
            this.targetFile = file;
            clickCallback(file);
        });
        return fileElement;
    }

    addFile(file: classFile, type: string) {
        this.files.push(file);
        this.element.appendChild(this.makeElement(file, type, file.clickEvent));
    }
    removeSelectFile(file: classFile) {
        var selectedFileIdx = this.files.findIndex(_file => _file == file);
        selectedFileIdx != -1 ? this.files.splice(selectedFileIdx, 1) : null;
    }
    clearFiles() {
        this.files = [];
    }
};

export { fileController };