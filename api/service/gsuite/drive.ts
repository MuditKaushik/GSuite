import { AuthorizeGSuite } from './gsuit-authorize';
import { google, drive_v3 } from 'googleapis';
import { Observable, Observer } from '@reactivex/rxjs';

export class GSuiteDrive {
    constructor() { }
    public getGSuiteFiles(): Observable<Array<drive_v3.Schema$File>> {
        return Observable.create((observer: Observer<Array<drive_v3.Schema$File>>) => {
            AuthorizeGSuite().subscribe((authClient) => {
                Observable.fromPromise(google.drive({ version: "v3", auth: authClient }).files.list()).subscribe((result) => {
                    (result.data.files) ? observer.next(result.data.files) : observer.next([]);
                }, (err) => {
                    observer.error(err);
                }, () => {
                    observer.complete();
                });
            });
        });
    }
    public createGSuitFolder(folderName: string): Observable<drive_v3.Schema$File> {
        return Observable.create((observer: Observer<drive_v3.Schema$File>) => {
            AuthorizeGSuite().subscribe((authClient) => {
                Observable.fromPromise(google.drive({ version: "v3", auth: authClient }).files.create({
                    requestBody: {
                        parents: [],
                        name: folderName,
                        mimeType: 'application/vnd.google-apps.folder'
                    }
                })).subscribe((result) => {
                    (result.status == 200) ? observer.next(result.data) : observer.next({});
                });
            }, (err) => {
                observer.error(err);
            }, () => {
                observer.complete();
            });
        });
    }
    public deleteDrivefile(fileId: string): Observable<boolean> {
        return Observable.create((observer: Observer<boolean>) => {
            AuthorizeGSuite().subscribe((authClient) => {
                Observable.fromPromise(google.drive({ version: "v3", auth: authClient }).files.delete({
                    fileId: fileId,
                    supportsTeamDrives: true
                })).subscribe((result) => {
                    (result.status == 204) ? observer.next(true) : observer.next(false);
                }, (err) => {
                    observer.error(err);
                }, () => {
                    observer.complete();
                });
            });
        });
    }
    public createTeamDrive(): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            AuthorizeGSuite().subscribe((authClient) => {
                Observable.fromPromise(google.drive({ version: "v3", auth: authClient }).teamdrives.create({
                    requestId: '',
                    requestBody: {}
                }))
                    .subscribe((teamDrive) => { });
            }, (err) => {
                observer.error(err);
            }, () => {
                observer.complete();
            });
        });
    }
}