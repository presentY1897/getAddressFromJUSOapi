var data
window.onload = function() {
    let dropArea = document.getElementById('dragdropdiv');
    let callAjaxButton = document.getElementById('api_start_button');
    let downloadButton = document.getElementById('download_result_button');
    let reader = new this.FileReader();
    var count = 0;
    reader.onload = function() {
        var rows = reader.result.split('\n');
        data = rows.map(row => row.split(','));
        data.forEach(cols => cols.forEach(element => element.split('"').join('')));
        dropArea.textContent = '0/' + data.length;
    };

    callAjaxButton.onclick = function() {
        data[0].push('result');
        data.slice(1, data.length).forEach(address => {
            callJusoAPI(address[1], function(e) {
                console.log(count++);
                dropArea.textContent = count + '/' + data.length;
                if (typeof e.results.juso[0].jibunAddr != 'undefined')
                    address.push(e.results.juso[0].jibunAddr);
            });
        });
    };
    downloadButton.onclick = function() {
        makeResultDownloadButton();
    };

    var makeResultDownloadButton = function() {
        let csvContent = new Blob([data.map(e => e.join(",")).join("\r\n")], {
            type: "data:text/csv;charset=utf-8"
        });
        var encodedUri = URL.createObjectURL(csvContent);
        window.open(encodedUri, '_blank');
    };


    ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
        dropArea.addEventListener(eventName, preventDefaults, false)
    });

    function preventDefaults(e) {
        e.preventDefault()
        e.stopPropagation()
    };

    dropArea.addEventListener('drop', handleDrop, false);

    function handleDrop(e) {
        let dt = e.dataTransfer
        let files = dt.files

        handleFiles(files)
    };

    function handleFiles(files) {
        ([...files]).forEach(uploadFile)
    };

    function uploadFile(file) {
        let url = 'YOUR URL HERE'
        let formData = new FormData()

        formData.append('file', file)
        console.log(file);
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
                confmKey: 'devU01TX0FVVEgyMDIwMDUyNzE0MDUyNTEwOTgwMzU=',
                keyword: keyword
            },
            success: successCallback
        });
    }
}