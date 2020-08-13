import { file } from './file';

class fileController {
    files: file[] = [];
    targetFile: file | null = null;

    addFile(file: file) {
        this.files.push(file);
    }
    removeSelectFile(file: file) {
        var selectedFileIdx = this.files.findIndex(_file => _file == file);
        selectedFileIdx != -1 ? this.files.splice(selectedFileIdx, 1) : null;
    }
    clearFiles() {
        this.files = [];
    }
}

export { fileController };