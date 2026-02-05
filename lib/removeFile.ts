import * as fs from 'fs';

export function removeFile(file: string) {
    if (fs.existsSync(file)) {
        fs.unlinkSync(file);
    }
}