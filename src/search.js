var data = null;
window.onload = function() {
    let fileDataController = {};
    let tempFileData = {};
    (function setupInputFileChange() {
        $('#inputFile').on('change', (e) => {
            var fileName = $(e.target).val();
            $(e.target).next('.custom-file-label').html(fileName);

            tempFileData = {};
            ([...$('#inputFile')[0].files]).forEach(file => reader.readAsText(file, "euc-kr"));

        });
    })();

    let dropArea = document.getElementById('dragdropdiv');
    let callAjaxButton = document.getElementById('api_start_button');
    let downloadButton = document.getElementById('download_result_button');
    let reader = new this.FileReader();
    var count = 0;
    reader.onload = function() {
        tempFileData.rawData = reader.result;
        var rows = reader.result.split('\r\n');
        data = rows.slice(0, 20).filter(row => row != "").map(row => {
            var exceptCol = row.split('"');
            var col = exceptCol
                .filter(element => element != "")
                .map((element, index) => {
                    if (index % 2 == 0) return element.split(',').filter(e => e != "")
                    else return element
                })
                .reduce((acc, curr) => acc.concat(curr));
            return col;
        });
        data.forEach(cols => cols.forEach(element => element.split('"').join('').split('\r\n').join('')));
        dropArea.textContent = '0/' + data.length;
        setDataPreviewTable(data);
    };

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

    callAjaxButton.onclick = function() {
        if (data != null) {
            data[0].push('result');
            data.slice(1, data.length).forEach(address => {
                callJusoAPI(address[1], function(e) {
                    count++;
                    dropArea.textContent = count + '/' + data.length;
                    if (typeof e.results.juso[0] != 'undefined')
                        address.push(e.results.juso[0].jibunAddr);
                });
            });
        };
    };
    downloadButton.onclick = function() {
        makeResultDownloadButton();
    };

    var makeResultDownloadButton = function() {
        var encodedUri = (function makeResult() {
            let csvContent = new Blob([
                new Uint8Array([0xEF, 0xBB, 0xBF]),
                data.map(row => row.map(col => {
                    if (col.search(',')) return '"' + col + '"';
                    return col
                }).join(',')).join('\n')
            ], {
                type: "data:text/csv;charset=utf-8"
            });
            return URL.createObjectURL(csvContent);
        })();
        (function saveData() {
            let forSaveAElement = document.createElement('a');
            forSaveAElement.href = encodedUri;
            forSaveAElement.download = 'result.csv';
            forSaveAElement.click();
        })();
    };

    (function stopDropFunction() {
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropArea.addEventListener(eventName, preventDefaults, false)
        });

        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        };
    })();

    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        let dt = e.dataTransfer;
        let files = dt.files;

        handleFiles(files);
    };

    function handleFiles(files) {
        ([...files]).forEach(uploadFile);
    };

    function uploadFile(file) {
        reader.readAsText(file, "euc-kr");
    };

    function callJusoAPI(keyword, successCallback) {
        $.ajax({
            url: 'http://www.juso.go.kr/addrlink/addrLinkApiJsonp.do',
            type: 'POST',
            dataType: 'jsonp',
            crossDomain: true,
            data: {
                currentpage: 1,
                countPerPage: 5,
                resultType: 'json',
                confmKey: document.getElementById('api_key_input').value,
                keyword: keyword
            },
            success: successCallback,
            error: function(e) {
                let errorDiv = document.getElementById('errordiv');
                let p = document.createElement('p');
                p.innerText = e;
                errorDiv.append(p);
            }
        });
    }
}