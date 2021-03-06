let fileDataController = {
    files: [],
    currentFile: null,
    isCurrentFile: checkFile => this.currentFile == checkFile
};
class FileListController {
    constructor() {
        this.files = files ? files : [];
        this.selectedFiles = [];
    }
    get fileList() {
        return this.files;
    }
    get selectedList() {
        return this.selectedFiles;
    }
    addSelectedFile(file) {
        if (this.selectedFiles.findIndex(file) == -1) this.selectedFiles.push(file);
    }
    removeSelectedFile(file) {
        var findIndex = this.selectedFiles.findIndex(file);
        if (findIndex != -1) this.selectedFiles.splice(findIndex, 1);
    }
    clearSelectedFiles() {
        this.selectedFiles = [];
    }
}
class File {
    constructor(name, type = 'uploaded') {
        this.name = name;
        this.type = type;
    }
    setRawData(raw) {
        this.raw = raw;
    }
    _makeRowData(length) {
        let data = this.raw
            .split('\r\n').slice(0, length)
            .filter(row => row != "").map(row =>
                row.split('"')
                .filter(element => element != "")
                .map((element, index) => {
                    if (index % 2 == 0) return element.split(',').filter(e => e != "")
                    else return element
                })
                .reduce((acc, curr) => acc.concat(curr))
            );
        data.forEach(cols => cols.forEach(element => element.split('"').join('').split('\r\n').join('')));
        return data;
    }
    makePreviewRows(length = 20, isFirstHeader = false) {
        let data = this._makeRowData(length);
        this.previewData = data;
        if (isFirstHeader) {
            this.previewData.header = data.splice(0, 1)[0];
            this.isFirstHeader = true;
            this.header = this.previewData.header;
        }
    }
    makeFullRow() {
        let data = this._makeRowData(undefined);
        this.data = data;
        if (this.isFirstHeader) this.header = data.splice(0, 1)[0];
    }
    setCurrentFile() {
        fileDataController.currentFile = this;
    }
}
var mainFileController = new FileListController();
(() => {
    let reader = new this.FileReader();
    reader.onload = function () {
        let file = fileDataController.currentFile;
        file.setRawData(reader.result)
        file.makePreviewRows(21, true);
        setDataPreviewTable(file.previewData);
    };

    (function setupInputFileChange() {
        $('#inputFile').on('change', (e) => {
            (function removeBeforeUploadedFile() {
                fileDataController.files = fileDataController.files.map(file => file.type != 'uploaded');
                if (fileDataController.currentFile != null && fileDataController.currentFile.type == 'uploaded') fileDataController.currentFile = null;
            })();

            ([...$('#inputFile')[0].files]).forEach(uploadFile => {
                let file = new File(uploadFile.name);

                (function insertFileToController() {
                    mainFileController.addSelectedFile(file);
                })();

                fileDataController.files.push(file);
                fileDataController.currentFile = file;
                reader.readAsText(uploadFile, "euc-kr");
            });
        });
    })();

    var initializeTable = function () {
        var table = $('#selected_file_table');
        table.empty();
    }
    var setDataPreviewTable = function (data) {
        initializeTable();
        var table = $('#selected_file_table');
        let column_count;

        function makeThAndAppend(text, scope) {
            var th = document.createElement('th');
            th.setAttribute('scope', scope);
            th.innerText = text;
            return th;
        };

        (function makeTableHeader() {
            var head = document.createElement('thead');
            table.append(head);
            var tr = document.createElement('tr');
            head.append(tr);
            column_count = data.reduce((count, row) => {
                if (row.length > count) count = row.length;
                return count;
            }, 0);

            tr.append(makeThAndAppend('#', 'col'));
            Array.from({
                length: column_count
            }, (_, index) => {
                if (data.header == undefined) {
                    tr.append(makeThAndAppend('#' + index, 'col'));
                } else {
                    tr.append(makeThAndAppend(data.header[index], 'col'));
                }
            });
        })();

        (function fillTable() {
            var body = document.createElement('tbody');
            table.append(body);

            data.forEach((row, index) => {
                var tr = document.createElement('tr');
                body.append(tr);
                tr.append(makeThAndAppend(index, 'row'));

                Array.from({
                    length: column_count
                }, (_, index) => {
                    var td = document.createElement('td');
                    td.innerText = row[index];
                    tr.append(td);
                });
            })
        })();
    };

    $('#acceptFile').on('click', () => {
        if (fileDataController.currentFile != null) {
            initializeTable();
            let file =
                (function copyNewFileFromUploadedFile() {
                    let newFile = Object.assign(new File(), fileDataController.currentFile);
                    newFile.type = 'accepted';
                    fileDataController.files.push(newFile);
                    fileDataController.currentFile = newFile;
                    return newFile;
                })();

            var fileListElement = document.createElement('li');
            fileListElement.setAttribute('class', 'list-group-item');
            fileListElement.innerText = file.name;
            file.htmlElement = fileListElement;

            $(fileListElement).addClass('active');
            $('#upload_file_list').children().each((_, target) => $(target).removeClass('active'));
            $('#upload_file_list')[0].append(fileListElement);
            var elementClickEvent = function () {
                file.setCurrentFile();
                let currentFile = fileDataController.currentFile;
                if (fileDataController.currentFile == currentFile) {
                    $(fileListElement).removeClass('active');
                    fileDataController.currentFile = null;
                } else {
                    $('#upload_file_list').children().each((_, target) => $(target).removeClass('active'));
                    $(fileListElement).addClass('active');
                    fileDataController.currentFile = currentFile;
                };

                var changeAsColumns = function (columns) {
                    var comboBox = document.getElementById('targetColumnDropdown');
                    var createColumnElement = function (name, idx) {
                        var element = document.createElement('a');
                        element.classList.add('dropdown-item');
                        element.innerText = +idx + '. ' + name;
                        element.dataset.id = idx;
                        element.addEventListener('click', _ => {
                            file.targetColumnId = idx;
                        });
                        return element;
                    };
                    columns.forEach((column, idx) => comboBox.appendChild(createColumnElement(column, idx)));
                };
                changeAsColumns(file.previewData.header);
            }
            $(fileListElement).on('click', elementClickEvent);
        };
    });
})();