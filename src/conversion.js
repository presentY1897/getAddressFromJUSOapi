(() => {
    $('#api_start_button').on('click', () => {
        var conversionSelect = $('#conversionSelector').val();
        fileDataController.currentFile.makeFullRow(); // todo: 한꺼번에 하자
        let data = fileDataController.currentFile.data;
        let isCallPositionApi = document.getElementById('positionApiCallCheck').checked;
        let addressApiKey = $('#address_api_key_input').val();
        let positionApiKey = $('#position_api_key_input').val();

        if (data == null) return false;

        (function callApiByAjax() {
            data[0].push('result');

            if (isCallPositionApi) {
                data[0].push('positionX');
                data[0].push('positionY');
            }

            data.slice(1, data.length).forEach(address => {
                callJusoAPI(
                    'http://www.juso.go.kr/addrlink/addrLinkApiJsonp.do', {
                        currentpage: 1,
                        countPerPage: 1,
                        resultType: 'json',
                        confmKey: addressApiKey,
                        keyword: address[1]
                    },
                    e => {
                        if (typeof e.results.juso[0] != 'undefined') {
                            if (conversionSelect == '도로명찾기') address.push(e.results.juso[0].roadAddr);
                            else if (conversionSelect == '주소찾기') address.push(e.results.juso[0].jibunAddr);
                        };
                        if (isCallPositionApi) {
                            var result = e.results.juso[0];
                            if (result != undefined)
                                callJusoAPI(
                                    'http://www.juso.go.kr/addrlink/addrCoordApiJsonp.do', {
                                        admCd: result.admCd,
                                        rnMgtSn: result.rnMgtSn,
                                        udrtYn: result.udrtYn,
                                        buldMnnm: result.buldMnnm,
                                        buldSlno: result.buldSlno,
                                        confmKey: positionApiKey,
                                        resultType: 'json'
                                    },
                                    e => {
                                        address.push(e.results.juso[0].entX);
                                        address.push(e.results.juso[0].entY);
                                    }
                                )
                        }
                    });
            });
        })();
    });

    function callJusoAPI(url, data, successCallback) {
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'jsonp',
            crossDomain: true,
            data: data,
            success: successCallback,
            error: function (e) {}
        });
    }
})();