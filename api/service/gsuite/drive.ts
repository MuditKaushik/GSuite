import { GoogleClient } from './gsuit-authorize';
import { google, drive_v3 } from 'googleapis';
import { getFilesFromTemp, removeFileFromTemp } from '../utility';
import { Observable, Observer } from '@reactivex/rxjs';
import { IGoogleFileDetail } from '../../model/google';
import * as fs from 'fs';
export class GSuiteDrive {
    constructor() { }
    public setAuthorizeClient(code: string): Observable<boolean> {
        return Observable.create((observer: Observer<boolean>) => {
            Observable.fromPromise(GoogleClient.client.getToken(code)).subscribe((authToken) => {
                GoogleClient.client.setCredentials(authToken.tokens);
                google.options({ auth: GoogleClient.client });
                observer.next(true);
            }, (err) => {
                observer.next(err);
            });
        });
    }
    public getGSuiteFiles(): Observable<Array<drive_v3.Schema$File>> {
        return Observable.create((observer: Observer<Array<drive_v3.Schema$File>>) => {
            Observable.fromPromise(google.drive({ version: "v3" }).files.list({
                q: "'mudit.mohan@powerschoolid.com' in owners or 'mudit.mohan@powerschoolid.com' in readers or sharedWithMe = true AND trashed = false",
                spaces: 'drive'
            }))
                .subscribe((result) => {
                    (result.data.files) ? observer.next(result.data.files) : observer.next([]);
                }, (err) => {
                    observer.error(err);
                });
        });
    }
    public createGSuitFolder(folderName: string): Observable<drive_v3.Schema$File> {
        return Observable.create((observer: Observer<drive_v3.Schema$File>) => {
            Observable.fromPromise(google.drive({ version: "v3" }).files.create({
                requestBody: {
                    name: folderName,
                    mimeType: 'application/vnd.google-apps.folder'
                }
            })).subscribe((result) => {
                (result.status == 200) ? observer.next(result.data) : observer.next({});
            }, (err) => {
                observer.error(err);
            });
        });
    }
    public copyGSuiteFiles(fileId: string, parentId: string): Observable<boolean> {
        return Observable.create((observer: Observer<boolean>) => {
            Observable.fromPromise(google.drive({ version: "v3" }).files.copy({
                fileId: fileId,
                requestBody: {
                    name: `copt of ${fileId}`,
                    parents: (parentId) ? [parentId] : [],
                }
            })).subscribe((result) => {
                (result.status === 200) ?
                    this.GSuiteCreateReadOnlyPermissions(fileId).subscribe((fileId) => {
                        observer.next(true);
                    }) :
                    observer.next(false);
            }, (err) => {
                observer.error(err);
            });
        });
    }
    public getFileDetailsById(fileId: string): Observable<drive_v3.Schema$File> {
        return Observable.create((observer: Observer<drive_v3.Schema$File>) => {
            Observable.fromPromise(google.drive({ version: "v3" }).files.get({
                fileId: fileId
            })).subscribe((result) => {
                (result.status === 200) ? observer.next(result.data) : observer.next({});
            }, (err) => {
                observer.error(err);
            });
        });
    }
    public deleteDrivefile(fileId: string): Observable<boolean> {
        return Observable.create((observer: Observer<boolean>) => {
            Observable.fromPromise(google.drive({ version: "v3" }).files.delete({
                fileId: fileId
            })).subscribe((result) => {
                (result.status == 204) ? observer.next(true) : observer.next(false);
            }, (err) => {
                observer.error(err);
            }, () => {
                observer.complete();
            });
        });
    }
    public createTeamDrive(): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            Observable.fromPromise(google.drive({ version: "v3" }).teamdrives.create({
                requestId: '',
                requestBody: {}
            })).subscribe((teamDrive) => { });
        });
    }
    public getGSuiteDriveToken(): Observable<any> {
        return Observable.create((observer: Observer<any>) => {
            return observer.next(GoogleClient.client.credentials);
        });
    }
    public uploadFilesToGSuite(parentId: string): Observable<Array<drive_v3.Schema$File>> {
        return Observable.create((observer: Observer<Array<drive_v3.Schema$File>>) => {
            let createdFiles: Array<drive_v3.Schema$File> = [];
            getFilesFromTemp().subscribe((filesDetail) => {
                filesDetail.forEach((fileData) => {
                    this.GSuiteCreateFile(fileData, parentId).subscribe((file) => {
                        let fileUpload: drive_v3.Schema$File = file.data;
                        createdFiles.push(fileUpload);
                        if (createdFiles.length === filesDetail.length) {
                            observer.next(createdFiles);
                            removeFileFromTemp(filesDetail).subscribe((result) => {
                                console.log('all files deleted.', result);
                            });
                        }
                    });
                });
            });
        });
    }
    private GSuiteCreateReadOnlyPermissions(fileId: string): Observable<string> {
        return Observable.create((observer: Observer<string>) => {
            Observable.fromPromise(google.drive({ version: "v3" }).permissions.create({
                fileId: fileId,
                requestBody: {
                    type: 'user',
                    role: 'reader',
                    emailAddress: 'unifiedclassroompowershcool@gmail.com'
                }
            })).subscribe((result) => {
                (result.status === 200) ? observer.next(<string>result.data.id) : observer.next('');
            });
        });
    }
    private GSuiteCreateFile(fileData: IGoogleFileDetail, parentId: string): Observable<any> {
        return Observable.fromPromise(google.drive({ version: "v3" }).files.create({
            media: {
                body: fs.createReadStream(fileData.location),
                mediaType: 'application/pdf'
            },
            requestBody: {
                name: fileData.fileName,
                parents: (parentId) ? [parentId] : []
            }
        }));
    }

    // private TeacherAssignmentPermission(): drive_v3.Schema$Permission {
    //     return <drive_v3.Schema$Permission>{
    //         type: 'user',
    //         role: 'reader',
    //         domain: 'powerschoolid.com'
    //     };
    // }
}