import * as fs from 'fs';
import * as path from 'path';
import { IGoogleFileDetail } from '../../model/google';
import { Observable, Observer } from '@reactivex/rxjs';

export function getFilesFromTemp(): Observable<Array<IGoogleFileDetail>> {
    return Observable.create((observer: Observer<Array<IGoogleFileDetail>>) => {
        let folderPath: string = path.resolve(__dirname, '../../../temp');
        let filesData: Array<IGoogleFileDetail> = [];
        fs.readdirSync(folderPath, { encoding: "utf8" }).forEach((file) => {
            filesData.push({
                fileName: file,
                location: `${folderPath}\\${file}`,
                type: ''
            });
        });
        observer.next(filesData);
    });
}

export function removeFileFromTemp(fileData: Array<IGoogleFileDetail>): Observable<boolean> {
    return Observable.create((observer: Observer<boolean>) => {
        fileData.forEach((file) => {
            fs.exists(file.location, (exists) => {
                if (exists) {
                    fs.unlinkSync(file.location);
                }
            });
        });
        observer.next(true);
        observer.complete();
    });
}