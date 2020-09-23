import Chart from "chart.js";

class chartContainer {
    containerElement: HTMLCanvasElement
    data: number[] = [0, 0, 0, 0]
    chart: Chart

    constructor(containerName: string) {
        this.containerElement = document.getElementById(containerName) as HTMLCanvasElement;
        this.chart = new Chart(this.containerElement, {
            type: 'doughnut',
            data: {
                datasets: [{
                    data: this.data,
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
    }

    show() {

    }
    hide() {

    }

    addOnProgress() {
        this.data[0] -= 1;
        this.data[1] += 1;
        this.chart.update();
    }
    addOnComplete() {
        this.data[1] -= 1;
        this.data[2] += 1;
        this.chart.update();
    }
    addOnFail() {
        this.data[1] -= 1;
        this.data[3] += 1;
        this.chart.update();
    }
    dataUpdate(data: Array<number>) {
        this.data = data;
        this.chart.update();
    }
}

export { chartContainer };