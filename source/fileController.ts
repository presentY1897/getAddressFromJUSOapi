import { csvFile } from './file/csvFile';

class fileController {
    files: csvFile[] = [];
    targetFile: csvFile | null = null;

    addFile(file: csvFile) {
        this.files.push(file);
    }
    removeSelectFile(file: csvFile) {
        var selectedFileIdx = this.files.findIndex(_file => _file == file);
        selectedFileIdx != -1 ? this.files.splice(selectedFileIdx, 1) : null;
    }
    clearFiles() {
        this.files = [];
    }
};

export { fileController };