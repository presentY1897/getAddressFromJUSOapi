import Chart from "chart.js";

class chartContainer {
    containerElement: HTMLCanvasElement
    data: number[] = [0, 0, 0, 0]
    config = {
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
    };
    chart: Chart

    constructor(containerName: string) {
        this.containerElement = document.getElementById(containerName) as HTMLCanvasElement;
        this.chart = new Chart(this.containerElement, this.config);
    }

    show() {

    }
    hide() {

    }

    addOnProgress() {
        this.config.data.datasets[0].data[0] -= 1;
        this.config.data.datasets[0].data[1] += 1;
        this.chart.update();
    }
    addOnComplete() {
        this.config.data.datasets[0].data[1] -= 1;
        this.config.data.datasets[0].data[2] += 1;
        this.chart.update();
    }
    addOnFail() {
        this.config.data.datasets[0].data[1] -= 1;
        this.config.data.datasets[0].data[3] += 1;
        this.chart.update();
    }
    dataUpdate(data: Array<number>) {
        this.config.data.datasets[0].data = data;
        this.chart.update();
    }
}

export { chartContainer };