import { fileController } from './fileController';
import { csvFile } from './file/csvFile';
import { pageViewController } from './pageViewingControl';
import { tabPage } from './pageView/tabPage';
import { tableViewer } from './tableViewer';

const inputFileController = new fileController();

const fileEncoding = 'euc-kr';
const fileInputId = 'inputFile';
const fileInputElement: HTMLInputElement = document.getElementById(fileInputId) as HTMLInputElement;
const fileInputNameElement: HTMLLabelElement = document.querySelector('.custom-file-label') as HTMLLabelElement;

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

const fileOkayButtonId = 'acceptFile';
const fileInputOkayButton: HTMLButtonElement = document.getElementById(fileOkayButtonId) as HTMLButtonElement;
const fileOkayEvent: (this: HTMLButtonElement, ev: Event) => void = function (_) {
    if (inputFileController.targetFile !== null) {
        inputFileController.targetFile.makeTable({ header: '', isIncludeHeader: true, delimiter: ',', endOfLine: '\n', embracer: '"', maxLineCount: 20 });
        tableViewElement.set(inputFileController.targetFile.data);
        tableViewElement.show();
    };
};
(function initFileInputEvent() {
    fileInputElement !== null ? fileInputElement.addEventListener('change', fileInputElementEvent) : null;
    fileInputOkayButton !== null ? fileInputOkayButton.addEventListener('click', fileOkayEvent) : null;
})();
let tableViewElement: tableViewer;
(function initTableViewer() {
    tableViewElement = new tableViewer(
        document.getElementById('selected_file_table') as HTMLDivElement,
        (element: HTMLElement) => { element.classList.remove('d-none'); },
        (element: HTMLElement) => { element.classList.add('d-none'); }
    );
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