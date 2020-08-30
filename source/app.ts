import { fileController } from './fileController';
import { csvFile } from './file/csvFile';
import { pageViewController } from './pageViewingControl';
import { tabPage } from './pageView/tabPage';

let inputFileController = new fileController();

let fileEncoding = 'euc-kr';
let fileInputId = 'inputFile';
let fileInputElement: HTMLInputElement = document.getElementById(fileInputId) as HTMLInputElement;
let fileInputNameElement: HTMLLabelElement = document.querySelector('.custom-file-label') as HTMLLabelElement;

let fileInputReact: (value: File, index: number, array: File[]) => void = function (file) {
    let inputFile = new csvFile({ file: file, encoding: fileEncoding });
    inputFileController.addFile(inputFile);
    inputFileController.targetFile = inputFile;
    fileInputNameElement.innerText = file.name;
};
let fileInputElementEvent: (this: HTMLInputElement, ev: Event) => void = function (_) {
    (function removeFileControllerTarget() { inputFileController.targetFile = null })();
    (function insertFileWhenInputFileIsNotNull() { fileInputElement.files !== null ? [...fileInputElement.files].forEach(fileInputReact) : null })();
};

(function initFileInputEvent() {
    fileInputElement !== null ? fileInputElement.addEventListener('change', fileInputElementEvent) : null;
})();


let pageViewControl = new pageViewController(
    [
        new tabPage('dashboardTab', 'dashboard_page'),
        new tabPage('fileUploadTab', 'fileupload_page'),
        new tabPage('workTab', 'work_page')
    ],
    (target: { classList: { add: (arg0: string) => any; }; }) => target.classList.add('d-none'),
    (target: { classList: { remove: (arg0: string) => any; }; }) => target.classList.remove('d-none')
)

pageViewControl.bindingSelectTabShowPage();