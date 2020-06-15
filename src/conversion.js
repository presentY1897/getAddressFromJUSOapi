(() => {
    $('#api_start_button').on('click', () => {
        var conversionSelect = $('#conversionSelector').val();
        fileDataController.currentFile.makeFullRow(); // todo: 한꺼번에 하자
        let data = fileDataController.currentFile.data;
        let isCallPositionApi = document.getElementById('positionApiCallCheck').checked;
        let addressApiKey = $('#address_api_key_input').val();
        let positionApiKey = $('#position_api_key_input').val();

        if (data == null) return false;

        let chartDataUpdate;
        (function createStatusChart() {
            var chartCanvas = document.getElementById('chart');
            var chart = new Chart(chartCanvas, {
                type: 'doughnut',
                data: {
                    datasets: [{
                        data: [data.length, 0, 0, 0],
                        backgroundColor: [
                            'rgba(89, 44, 28, 1)',
                            'rgba(205, 217, 199, 1)',
                            'rgba(92, 115, 57, 1)',
                            'rgba(238, 28, 28, 1)'
                        ]
                    }],
                    labels: [
                        '남은 데이터',
                        '분석 중',
                        '변환 완료',
                        '변환 실패'
                    ]
                },
                options: {}
            });
            chartDataUpdate = function(data) {
                data.forEach((element, index) => {
                    chart.data.datasets[0].data[index] = element;
                });
                chart.update();
            }
        })();

        var convsersionCount = 0;
        var stackCount = 0;
        var failCount = 0;

        let stepSize = 500;
        (function callApiByAjax() {
            data[0].push('result');

            if (isCallPositionApi) {
                data[0].push('positionX');
                data[0].push('positionY');
            }

            let chartUpdater = setInterval(() => {
                chartDataUpdate([data.length - stackCount, stackCount - convsersionCount, convsersionCount - failCount, failCount]);
            }, 150);
            const callAddressPromise = function(rows) {
                return new Promise((resolve) => {
                    rows.forEach(address => {
                        callJusoAPI(
                            'http://www.juso.go.kr/addrlink/addrLinkApiJsonp.do', {
                                currentpage: 1,
                                countPerPage: 1,
                                resultType: 'json',
                                confmKey: addressApiKey,
                                keyword: address[1]
                            },
                            e => {
                                convsersionCount++;
                                if (typeof e.results.juso[0] != 'undefined') {
                                    if (conversionSelect == '도로명찾기') address.push(e.results.juso[0].roadAddr);
                                    else if (conversionSelect == '주소찾기') address.push(e.results.juso[0].jibunAddr);
                                } else { failCount++; };
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
                                                if (convsersionCount == stackCount) resolve(convsersionCount);
                                            }
                                        )
                                } else {
                                    if (convsersionCount == stackCount) resolve(convsersionCount);
                                }
                            });
                    });
                })
            }
            data.slice(1, data.length).reduce((steps, step) => {
                if (steps[steps.length - 1] == null) {
                    var newArr = [step];
                    steps.push(newArr);
                } else if (steps[steps.length - 1].length < stepSize) {
                    steps[steps.length - 1].push(step);
                } else {
                    var newArr = [step];
                    steps.push(newArr);
                }
                return steps;
            }, []).reduce((promise, rows) => {
                return promise.then(() => {
                    count = 0;
                    stackCount += rows.length;
                    return callAddressPromise(rows);
                });
            }, Promise.resolve());
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
            error: function(e) {}
        });
    }
})();