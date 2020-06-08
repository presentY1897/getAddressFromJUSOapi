let fileDataController = {
    files: [],
    currentFile: null,
    isCurrentFile: function(checkFile) { if (this.currentFile == checkFile) return true; return false; }
};
class File {
    constructor(name, type = 'uploaded') {
        this.name = name;
        this.type = type;
    }
    setRawData(raw) {
        this.raw = raw;
    }
    _makeRowData(length) {
        let data = this.raw.split('\r\n').slice(0, length).filter(row => row != "").map(row => {
            var col = row.split('"')
                .filter(element => element != "")
                .map((element, index) => {
                    if (index % 2 == 0) return element.split(',').filter(e => e != "")
                    else return element
                })
                .reduce((acc, curr) => acc.concat(curr));
            return col;
        });
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
}
(() => {
    let reader = new this.FileReader();
    reader.onload = function() {
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

            var fileName = $(e.target).val();
            $(e.target).next('.custom-file-label').html(fileName);
            ([...$('#inputFile')[0].files]).forEach(uploadFile => {
                let file = new File(uploadFile.name);
                fileDataController.files.push(file);
                fileDataController.currentFile = file;
                reader.readAsText(uploadFile, "euc-kr");
            });
        });
    })();

    var initializeTable = function() {
        var table = $('#selected_file_table');
        table.empty();
    }
    var setDataPreviewTable = function(data) {
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
            fileListElement.dataset.file = file;
            fileListElement.innerText = file.name;

            $(fileListElement).addClass('active');
            $('#upload_file_list')[0].append(fileListElement);

            $(fileListElement).on('click', () => {
                let currentFile = fileListElement.dataset.file;
                if (fileDataController.currentFile == currentFile) {
                    $(fileListElement).removeClass('active');
                    fileDataController.currentFile = null;
                } else {
                    $(fileListElement).addClass('active');
                    fileDataController.currentFile = currentFile;
                };
            });
        };
    });
})();