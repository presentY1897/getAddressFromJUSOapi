let fileDataController = {
    files: [],
    currentFile: null
};
(() => {
    class File {
        constructor(name) {
            this.name = name;
        }
        setRawData(raw) {
            this.raw = raw;
        }
        makePreviewRows(length = 20) {
            let rows = this.raw.split('\r\n');
            let data = rows.slice(0, length).filter(row => row != "").map(row => {
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
            this.previewData = data;
        }
    }
    let reader = new this.FileReader();
    reader.onload = function() {
        let file = fileDataController.currentFile;
        file.setRawData(reader.result)
        file.makePreviewRows();
        setDataPreviewTable(file.previewData);
    };

    (function setupInputFileChange() {
        $('#inputFile').on('change', (e) => {
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
                tr.append(makeThAndAppend('#' + index, 'col'));
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
        let file = fileDataController.currentFile;
        if (file != null) {
            var fileListElement = document.createElement('li');
            fileListElement.setAttribute('class', 'list-group-item');
            fileListElement.dataset.file = file;
            fileListElement.innerText = file.name;

            $('#upload_file_list')[0].append(fileListElement);
        };
    });
})();