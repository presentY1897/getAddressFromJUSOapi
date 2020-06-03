var data = null;
window.onload = function() {

    let callAjaxButton = document.getElementById('api_start_button');
    let downloadButton = document.getElementById('download_result_button');
    var count = 0;

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