import { fileController } from './fileController';
import { csvFile } from './csvFile';

let inputFileController = new fileController();

let fileEncoding = 'euc-kr';
let fileInputId = 'inputFile';
let fileInputElement: HTMLInputElement = document.getElementById(fileInputId) as HTMLInputElement;

let fileInputReact: (file: File) => void = function (file) {
    let inputFile = new csvFile({ file: file, encoding: fileEncoding });
    inputFileController.addFile(inputFile);
    inputFileController.targetFile = inputFile;
};
let fileInputElementEvent: (this: HTMLInputElement, ev: Event) => void = function (_) {
    (function removeFileControllerTarget() { inputFileController.targetFile = null })();

    if (fileInputElement.files !== null) {
        [...fileInputElement.files].forEach(fileInputReact)
    }
};

(function initFileInputEvent() {
    if (fileInputElement !== null) {
        fileInputElement.addEventListener('change', fileInputElementEvent)
    }
})();