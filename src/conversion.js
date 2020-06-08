(() => {
    $('#api_start_button').on('click', () => {
        var conversionSelect = $('#conversionSelector').val();
        let data = fileDataController.currentFile.data;
        let isCallPositionApi = document.getElementById('positionApiCallCheck').checked;
        switch (conversionSelect) {
            default: if (data == null) {
                    break;
                };
            data[0].push('result');
            let apiKey = $('#api_key_input').val();

            if (isCallPositionApi) {
                data[0].push('positionX');
                data[0].push('positionY');
            }

            case '도로명찾기':
                    data.slice(1, data.length).forEach(address => {
                    callJusoAPI(
                        'http://www.juso.go.kr/addrlink/addrLinkApiJsonp.do', {
                            currentpage: 1,
                            countPerPage: 1,
                            resultType: 'json',
                            confmKey: apiKey,
                            keyword: address[1]
                        },
                        e => {
                            if (typeof e.results.juso[0] != 'undefined') address.push(e.results.juso[0].roadAddr);
                            if (isCallPositionApi) {
                                var result = e.results.juso[0];
                                callJusoAPI(
                                    'http://www.juso.go.kr/addrlink/addrCoordApiJsonp.do', {
                                        admCd: result.admCd,
                                        rnMgtSn: result.rnMgtSn,
                                        udrtYn: result.udrtYn,
                                        buldMnnm: result.buldMnnm,
                                        buldSlno: result.buldSlno,
                                        confmKey: apiKey,
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
                break;
            case '주소찾기':
                    data.slice(1, data.length).forEach(address => {
                    callJusoAPI(
                        'http://www.juso.go.kr/addrlink/addrLinkApiJsonp.do', {
                            currentpage: 1,
                            countPerPage: 1,
                            resultType: 'json',
                            confmKey: apiKey,
                            keyword: address[1]
                        },
                        e => {
                            if (typeof e.results.juso[0] != 'undefined') address.push(e.results.juso[0].jibunAddr);
                            if (isCallPositionApi) {
                                var result = e.results.juso[0];
                                callJusoAPI(
                                    'http://www.juso.go.kr/addrlink/addrCoordApiJsonp.do', {
                                        admCd: result.admCd,
                                        rnMgtSn: result.rnMgtSn,
                                        udrtYn: result.udrtYn,
                                        buldMnnm: result.buldMnnm,
                                        buldSlno: result.buldSlno,
                                        confmKey: apiKey,
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
                break;
        }
    });

    function callJusoAPI(url, data, successCallback) {
        $.ajax({
            url: url,
            type: 'POST',
            dataType: 'jsonp',
            crossDomain: true,
            data: data,
            success: successCallback,
            error: function(e) {}
        });
    }
})();