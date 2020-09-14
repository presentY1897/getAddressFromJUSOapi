import { table } from "./file/table";

class tableViewer {
    dataTable: table | null = null;
    containerElement: HTMLDivElement;
    showFunc: Function;
    hideFunc: Function;

    constructor(element: HTMLDivElement, showFunc: Function, hideFunc: Function) {
        this.containerElement = element;
        this.showFunc = showFunc;
        this.hideFunc = hideFunc;
    }

    tableContainer?: HTMLTableElement = undefined;
    private buildContainer() {
        this.tableContainer = document.createElement('table');
        this.containerElement.appendChild(this.tableContainer);
    }
    tableHeader: HTMLTableSectionElement | null = null;
    tableColumns: HTMLTableHeaderCellElement[] = [];
    private buildColumn(columns: string[]) {
        this.tableHeader = document.createElement('thead');
        this.tableContainer !== undefined ? this.tableContainer.appendChild(this.tableHeader) : null;
        const tableHeadRow = document.createElement('tr');
        this.tableHeader.appendChild(tableHeadRow);

        columns.forEach(column => {
            const element = document.createElement('th');
            element.innerText = column;
            this.tableColumns.push(element);
            tableHeadRow.appendChild(element);
        });
    }
    tableBody: HTMLTableSectionElement | null = null;
    private buildRows(rows: string[][]) {
        this.tableBody = document.createElement('tbody');
        this.tableContainer !== undefined ? this.tableContainer.appendChild(this.tableBody) : null;
        rows.forEach(row => {
            const rowElement = document.createElement('tr');
            row.forEach(col => {
                const colElement = document.createElement('td');
                colElement.innerText = col;
                rowElement.appendChild(colElement);
            });
            this.tableBody !== null ? this.tableBody.appendChild(rowElement) : null;
        });
    }
    set(table: table) {
        this.dataTable = table;
        this.containerElement.innerHTML = '';
        this.buildContainer();
        this.buildColumn(table.columns);
        this.buildRows(table.rows);
    }

    show() {
        this.showFunc(this.containerElement);
    }
    hide() {
        this.hideFunc(this.containerElement);
    }
};

export { tableViewer }