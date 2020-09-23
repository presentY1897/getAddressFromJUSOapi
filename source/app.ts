import { fileController } from './fileController';
import { classFile } from './file/classFile';
import { csvFile } from './file/csvFile';
import { tempFile } from './file/tempFile'
import { pageViewController } from './pageViewingControl';
import { tabPage } from './pageView/tabPage';
import { tableViewer } from './tableViewer';
import { converter } from './converter';
import { chartContainer } from './chart/chartContainer';

const inputFileController = new fileController(document.getElementById('upload_file_list') as HTMLElement);
const outputFileController = new fileController(document.getElementById('analysis_file_list') as HTMLElement);

const fileEncoding = 'euc-kr';
const fileInputId = 'inputFile';
const fileInputElement: HTMLInputElement = document.getElementById(fileInputId) as HTMLInputElement;
const fileInputNameElement: HTMLLabelElement = document.querySelector('.custom-file-label') as HTMLLabelElement;

const fileClickEvent: (file: classFile) => void = function (file) {
    const targetColumnSelectElement = document.getElementById('targetColumnDropdown');
    targetColumnSelectElement !== null ? targetColumnSelectElement.innerHTML = '' : null;
    file.data.columns.forEach((column, idx) => {
        var element = document.createElement('a');
        element.classList.add('dropdown-item');
        element.innerText = column;
        element.dataset.id = idx.toString();
        element.addEventListener('click', () => {
            targetColumnSelectElement !== null ? targetColumnSelectElement.dataset.id = idx.toString() : null;
            const conversionColumnNameElement = document.getElementById('dropdownMenuButton');
            conversionColumnNameElement !== null ? conversionColumnNameElement.innerText = column : null;
        });
        targetColumnSelectElement !== null ? targetColumnSelectElement.appendChild(element) : null;
    })

    tableViewElement.set(file.data);
    tableViewElement.show();
}

let fileInputReact: (value: File, index: number, array: File[]) => void = function (file) {
    let inputFile = new csvFile({ file: file, encoding: fileEncoding, clickEvent: fileClickEvent });
    inputFileController.addFile(inputFile, 'li');
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
        const header = (inputFileController.targetFile as csvFile).raw.split('\n')[0];
        const maxLineCount = 10;
        (inputFileController.targetFile as csvFile).makeTable({ header: header, isIncludeHeader: true, delimiter: ',', endOfLine: '\n', embracer: '"', maxLineCount: maxLineCount });
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

const progressChartCont = new chartContainer('chart');
(function initConverter() {
    const coversionFunction = async function (apikey: string, row: string[], targetColumnNum: number, resultColumnNum: number, conversionColumn: string) {
        const getUrl = 'http://www.juso.go.kr/addrlink/addrLinkApiJsonp.do';

        let formData = new FormData();
        formData.append('currentpage', '1');
        formData.append('countPerPage', '1');
        formData.append('dataType', 'jsonp');
        formData.append('resultType', 'json');
        formData.append('confmKey', apikey);
        formData.append('keyword', row[targetColumnNum]);
        progressChartCont.addOnProgress();
        await fetch(getUrl, {
            method: 'POST',
            body: formData
        }).then(response => response.text())
            .then(result => result.slice(1, result.length - 1))
            .then(result => JSON.parse(result))
            .then(data => {
                row[resultColumnNum] = data.results.juso !== null && data.results.juso.length > 0 ? data.results.juso[0][conversionColumn] : '';
                progressChartCont.addOnComplete();
            });
    }

    const okayButton = document.getElementById('api_start_button');
    if (okayButton !== null) okayButton.addEventListener('click', () => {
        const apiKeyInput = document.getElementById('address_api_key_input') as HTMLInputElement;
        let apiKey = apiKeyInput !== null ? apiKeyInput.value as string : '';
        let file = inputFileController.targetFile as csvFile;

        if (apiKey !== '' && file !== null) {
            let jusoConversionFunction = function (file: classFile) {
                progressChartCont.dataUpdate([file.data.rows.length, 0, 0, 0]);

                const targetColumnSelectElement = document.getElementById('targetColumnDropdown');
                let targetColumnIdx = 1; // initialize must be changed
                if (targetColumnSelectElement !== null && targetColumnSelectElement.dataset.id !== undefined)
                    targetColumnIdx = parseInt(targetColumnSelectElement.dataset.id);
                let resultColumnIdx = file.data.columns.length - 1;
                file.data.rows.forEach(async row => {
                    if (row.length - 1 < resultColumnIdx) row.push('');
                    await coversionFunction(apiKey, row, targetColumnIdx, resultColumnIdx, 'jibunAddr');
                });
            };
            let newFile = new tempFile({ name: file.name, encoding: fileEncoding, clickEvent: fileClickEvent });
            outputFileController.addFile(newFile, 'li');

            const header = file.raw.split('\n')[0];
            newFile.data = file.makeTable({ header: header, isIncludeHeader: true, delimiter: ',', endOfLine: '\n', embracer: '"', maxLineCount: file.raw.split('\n').length - 1 });
            newFile.data.columns.push('result');
            let jusoCoverter = new converter(newFile, jusoConversionFunction);
            jusoCoverter.do();
        }
    });
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