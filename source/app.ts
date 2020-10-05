import { fileController } from './fileController';
import { classFile } from './file/classFile';
import { csvFile } from './file/csvFile';
import { tempFile } from './file/tempFile'
import { pageViewController } from './pageViewingControl';
import { tabPage } from './pageView/tabPage';
import { tableViewer } from './tableViewer';
import { converter } from './converter';
import { chartContainer } from './chart/chartContainer';
import { conversionFunction, conversionList } from './conversionList';

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

const conversionFunctionsController = new conversionList();
const progressChartCont = new chartContainer('chart');
(function initConverter() {
    conversionFunctionsController.addConversionFunction(new conversionFunction(
        'jibunConversionFunction',
        function (apikey: string, row: string[], targetColumnNum: number, resultColumnNum: number, conversionColumn: string) {
            const getUrl = 'https://www.juso.go.kr/addrlink/addrLinkApiJsonp.do';

            let formData = new FormData();
            formData.append('currentpage', '1');
            formData.append('countPerPage', '1');
            formData.append('dataType', 'jsonp');
            formData.append('resultType', 'json');
            formData.append('confmKey', apikey);
            formData.append('keyword', row[targetColumnNum]);
            progressChartCont.addOnProgress();
            return fetch(getUrl, {
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
    ));
    conversionFunctionsController.addConversionFunction(new conversionFunction(
        'roadConversionFunction',
        function (apikey: string, row: string[], targetColumnNum: number, resultColumnNum: number, conversionColumn: string) {
            const getUrl = 'https://www.juso.go.kr/addrlink/addrLinkApiJsonp.do';

            let formData = new FormData();
            formData.append('currentpage', '1');
            formData.append('countPerPage', '1');
            formData.append('dataType', 'jsonp');
            formData.append('resultType', 'json');
            formData.append('confmKey', apikey);
            formData.append('keyword', row[targetColumnNum]);
            progressChartCont.addOnProgress();
            return fetch(getUrl, {
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
    ));

    const getCoordinateAPI = new conversionFunction(
        'coordinateFunction',
        function (apikey: string, row: string[], targetColumnNum: number, resultColumnNum: number, conversionColumn: string) {
            const getUrl = 'https://www.juso.go.kr/addrlink/addrCoordApiJsonp.do';

            let formData = new FormData();
            formData.append('currentpage', '1');
            formData.append('countPerPage', '1');
            formData.append('dataType', 'jsonp');
            formData.append('resultType', 'json');
            formData.append('confmKey', apikey);
            formData.append('keyword', row[targetColumnNum]);
            progressChartCont.addOnProgress();
            return fetch(getUrl, {
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
    )

    const conversionTypeSelector = document.getElementById('conversionSelector') as HTMLSelectElement;
    conversionTypeSelector.addEventListener('change', () => {
        if (conversionTypeSelector.value == '도로명찾기') { // change as more functionally
            conversionFunctionsController.setTarget('roadConversionFunction');
        } else if (conversionTypeSelector.value == '주소찾기') {
            conversionFunctionsController.setTarget('jibunConversionFunction');
        } else { // add none type select option reaction
            conversionFunctionsController.setTarget('jibunConversionFunction');
        }
    });
    const okayButton = document.getElementById('api_start_button');
    const checkGetCoordinate = document.getElementById('positionApiCallCheck') as HTMLInputElement;
    const getCoordinateAPIInput = document.getElementById('positionApiGroup') as HTMLDivElement;
    if (checkGetCoordinate !== null && getCoordinateAPIInput !== null) {
        checkGetCoordinate.addEventListener('change', () => {
            checkGetCoordinate.checked ?
                getCoordinateAPIInput.style.display = '' :
                getCoordinateAPIInput.style.display = 'none';
        })
    }
    if (okayButton !== null) okayButton.addEventListener('click', () => {
        const apiKeyInput = document.getElementById('address_api_key_input') as HTMLInputElement;
        let apiKey = apiKeyInput !== null ? apiKeyInput.value as string : 'U01TX0FVVEgyMDIwMTAwNDE2MjEzMDExMDI1MTA=';
        const coordinateApiKey = 'U01TX0FVVEgyMDIwMTAwNDE2MjIzNDExMDI1MTE=';
        let file = inputFileController.targetFile as csvFile;

        if (apiKey !== '' && file !== null) {
            let jusoConversionFunction = function (file: classFile) {
                progressChartCont.dataUpdate([file.data.rows.length, 0, 0, 0]);

                const targetColumnSelectElement = document.getElementById('targetColumnDropdown');
                let targetColumnIdx = 1; // initialize must be changed
                if (targetColumnSelectElement !== null && targetColumnSelectElement.dataset.id !== undefined)
                    targetColumnIdx = parseInt(targetColumnSelectElement.dataset.id);
                let resultColumnIdx = file.data.columns.length - 1;
                const stackDividCount = 100;
                file.data.rows.reduce((acc: string[][][], curr: string[], idx: number): string[][][] => {
                    idx % stackDividCount == 0 ? acc.push([[]]) : '';
                    const lastAcc = acc[acc.length - 1];
                    lastAcc.push(curr);
                    return acc;
                }, []).reduce(async (prePromise: Promise<unknown>, stack: string[][]) => {
                    return await prePromise.then(() => new Promise(resolve => {
                        const completeResolve = resolve;
                        let resolveCheckCount = 0;
                        // maybe await not needed;
                        stack.map(async row => await new Promise(async resolve => {
                            if (row.length - 1 < resultColumnIdx) row.push('');
                            const conversionFuncObj = conversionFunctionsController.target();
                            if (conversionFuncObj !== null) {
                                await conversionFuncObj.func(apiKey, row, targetColumnIdx, resultColumnIdx, 'jibunAddr').then((_: any) => {
                                    resolve();
                                    resolveCheckCount++;
                                    if (resolveCheckCount === stackDividCount)
                                        completeResolve();
                                });
                            }
                        }));
                    }));
                }, Promise.resolve());
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

const downloadButton = document.getElementById('download_result_button') as HTMLElement;
downloadButton.addEventListener('click', () => {
    if (outputFileController.targetFile !== null) {
        const encodedUri = (function makeResult() {
            const csvContent = new Blob([
                new Uint8Array([0xEF, 0xBB, 0xBF]),
                outputFileController.targetFile.data.rows.map(row => row.map(col => {
                    if (col.search(',')) return '"' + col + '"';
                    return col
                }).join(',')).join('\n')
            ], {
                type: "data:text/csv;charset=utf-8"
            });
            return URL.createObjectURL(csvContent);
        })();
        (function saveData() {
            const forSaveAElement = document.createElement('a');
            forSaveAElement.href = encodedUri;
            forSaveAElement.download = 'result.csv';
            forSaveAElement.click();
        })();
    }
});

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