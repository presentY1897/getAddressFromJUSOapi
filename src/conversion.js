(() => {
    $('#api_start_button').on('click', () => {
        var conversionSelect = $('#conversionSelector').val();
        let data = fileDataController.currentFile.data;
        switch (conversionSelect) {
            default: if (data == null) {
                    break;
                };
            data[0].push('result');
            let apiKey = $('#api_key_input').val();
            case '도로명찾기':
                    data.slice(1, data.length).forEach(address => {
                    callJusoAPI('http://www.juso.go.kr/addrlink/addrLinkApiJsonp.do',
                        address[1],
                        apiKey,
                        function(e) {
                            if (typeof e.results.juso[0] != 'undefined')
                                address.push(e.results.juso[0].jibunAddr);
                        });
                });
                break;
            case '주소찾기':
                    data.slice(1, data.length).forEach(address => {
                    callJusoAPI('http://www.juso.go.kr/addrlink/addrLinkApiJsonp.do',
                        address[1],
                        apiKey,
                        function(e) {
                            if (typeof e.results.juso[0] != 'undefined')
                                address.push(e.results.juso[0].jibunAddr);
                        });
                });
                break;
        }
    });

    function callJusoAPI(url, keyword, apiKey, successCallback) {
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'jsonp',
            crossDomain: true,
            data: {
                currentpage: 1,
                countPerPage: 5,
                resultType: 'json',
                confmKey: apiKey,
                keyword: keyword
            },
            success: successCallback,
            error: function(e) {}
        });
    }
})();