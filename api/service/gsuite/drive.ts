import { OAuth2Client } from 'google-auth-library';
import { GoogleAuthClient } from './gsuit-authorize';
import { google, drive_v3 } from 'googleapis';
import { getFilesFromTemp, removeFileFromTemp } from '../utility';
import { Observable, Observer } from '@reactivex/rxjs';
import { IGoogleFileDetail, IGooglePermissions } from '../../model/google';
import * as fs from 'fs';
import { AxiosResponse } from 'axios';
export class GSuiteDrive {
    constructor() { }
    public getGSuiteFiles(): Observable<Array<drive_v3.Schema$File>> {
        return Observable.create((observer: Observer<Array<drive_v3.Schema$File>>) => {
            GoogleAuthClient().subscribe((authClient: OAuth2Client) => {
                Observable.fromPromise(google.drive({ version: "v3", auth: authClient }).files.list({
                    q: "'mudit.mohan@powerschoolid.com' in owners or 'mudit.mohan@powerschoolid.com' in readers or sharedWithMe = true AND trashed = false",
                    spaces: 'drive'
                })).subscribe((result) => {
                    (result.data.files) ? observer.next(result.data.files) : observer.next([]);
                }, (err) => {
                    observer.error(err);
                });
            });
        });
    }
    public getDriveFiles(): Observable<Array<drive_v3.Schema$File>> {
        return Observable.create((observer: Observer<drive_v3.Schema$FileList>) => {
            GoogleAuthClient().subscribe((authClient: OAuth2Client) => {
                Observable.fromPromise(google.drive({ version: "v3", auth: authClient }).files.list({
                    q: "trashed = false",
                })).subscribe((result) => {
                    (result.status == 200) ? observer.next(result.data) : observer.next(<drive_v3.Schema$FileList>[]);
                }, (err) => {
                    observer.error(err);
                });
            });
        });
    }
    public createDriveFolder(folderName: string): Observable<drive_v3.Schema$File> {
        return Observable.create((observer: Observer<drive_v3.Schema$File>) => {
            GoogleAuthClient().subscribe((authClient: OAuth2Client) => {
                Observable.fromPromise(google.drive({ version: "v3", auth: authClient })
                    .files.create({
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
        });
    }
    public copyDriveFiles(fileId: string, parentId: string): Observable<boolean> {
        return Observable.create((observer: Observer<boolean>) => {
            GoogleAuthClient().subscribe((authClient: OAuth2Client) => {
                Observable.fromPromise(google.drive({ version: "v3", auth: authClient })
                    .files.copy({
                        fileId: fileId,
                        requestBody: {
                            name: `copt of ${fileId}`,
                            parents: (parentId) ? [parentId] : [],
                        }
                    })).subscribe((result) => {
                        if (result.status === 200) {
                            let teacherPermissions = this.getPermissions('unifiedclassroompowershcool@gmail.com', 'gmail.com');
                            let studentPermissions = this.getPermissions('muditk18@gmail.com', 'gmail.com');
                            let permissions = [studentPermissions.owner, teacherPermissions.commenter, teacherPermissions.reader];
                            this.setPermissions(fileId, permissions, authClient)
                                .subscribe((permissionResult) => {
                                    (permissionResult.length === permissions.length) ?
                                        observer.next(true) :
                                        observer.next(false);
                                });
                        } else {
                            observer.next(false);
                        }
                    }, (err) => {
                        observer.error(err);
                    });
            });
        });
    }
    public getFileDetailsById(fileId: string): Observable<drive_v3.Schema$File> {
        return Observable.create((observer: Observer<drive_v3.Schema$File>) => {
            GoogleAuthClient().subscribe((authClient: OAuth2Client) => {
                Observable.fromPromise(google.drive({ version: "v3", auth: authClient })
                    .files.get({
                        fileId: fileId
                    })).subscribe((result) => {
                        (result.status === 200) ? observer.next(result.data) : observer.next({});
                    }, (err) => {
                        observer.error(err);
                    });
            });
        });
    }
    public deleteDrivefile(fileId: string): Observable<boolean> {
        return Observable.create((observer: Observer<boolean>) => {
            GoogleAuthClient().subscribe((authClient: OAuth2Client) => {
                Observable.fromPromise(google.drive({ version: "v3", auth: authClient })
                    .files.delete({
                        fileId: fileId
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
    public uploadFilesToDrive(parentId: string): Observable<Array<drive_v3.Schema$File>> {
        return Observable.create((observer: Observer<Array<drive_v3.Schema$File>>) => {
            let createdFiles: Array<drive_v3.Schema$File> = [];
            getFilesFromTemp().subscribe((filesDetail) => {
                filesDetail.forEach((fileData) => {
                    this.createDiveFile(fileData, parentId).subscribe((file) => {
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
    public getFileDetailsByFileId(fileId: string): Observable<drive_v3.Schema$File> {
        return Observable.create((observer: Observer<drive_v3.Schema$File>) => {
            GoogleAuthClient().subscribe((authClient: OAuth2Client) => {
                google.drive({
                    version: "v3",
                    auth: authClient,
                    params: {
                        fileId: fileId,
                        fields: 'fileExtension,fullFileExtension,id,kind,mimeType,name,originalFilename,owners,parents,webContentLink,webViewLink'
                    }
                }).files.get((err, res) => {
                    if (!err && res != null) {
                        observer.next(res.data);
                    } else {
                        observer.error(res);
                    }
                });
            });
        });
    }
    private setPermissions(fileId: string, permissions: Array<drive_v3.Schema$Permission>, authClient: OAuth2Client): Observable<Array<drive_v3.Schema$Permission>> {
        return Observable.create((observer: Observer<Array<drive_v3.Schema$Permission>>) => {
            let permissionsCreated: Array<drive_v3.Schema$Permission> = [];
            let observableArray: Array<Observable<AxiosResponse<drive_v3.Schema$Permission>>> = [];
            permissions.forEach((permission) => {
                observableArray.push(
                    Observable.fromPromise(google.drive({ version: "v3", auth: authClient }).permissions.create({
                        fileId: fileId,
                        requestBody: permission,
                        transferOwnership: (permission.role === 'owner') ? true : false
                    })));
            });
            Observable.forkJoin(observableArray).subscribe((results) => {
                results.forEach((result) => {
                    if (result.status === 200) {
                        permissionsCreated.push(result.data);
                        if (results.length === permissions.length) {
                            observer.next(permissionsCreated);
                            observer.complete();
                        }
                    }
                });
            }, (err) => {
                observer.error(err);
            });
        });
    }
    private createDiveFile(fileData: IGoogleFileDetail, parentId: string): Observable<any> {
        return Observable.create((observer: Observer<drive_v3.Schema$File>) => {
            GoogleAuthClient().subscribe((authClient: OAuth2Client) => {
                Observable.fromPromise(google.drive({ version: "v3", auth: authClient })
                    .files.create({
                        media: {
                            body: fs.createReadStream(fileData.location),
                            mediaType: 'application/pdf'
                        },
                        requestBody: {
                            name: fileData.fileName,
                            parents: (parentId) ? [parentId] : []
                        }
                    })).subscribe((result) => {
                        (result.status === 200) ? observer.next(result.data) : observer.next({});
                    }, (err) => {
                        observer.error(err);
                    });
            });
        });
    }
    private getPermissions(userEmail: string, domain: string): IGooglePermissions {
        return {
            commenter: {
                type: 'user',
                role: 'commenter',
                emailAddress: userEmail
            },
            domainReader: {
                type: 'domain',
                role: 'reader',
                domain: domain
            },
            owner: {
                type: 'user',
                role: 'owner',
                emailAddress: userEmail
            },
            reader: {
                type: 'user',
                role: 'reader',
                emailAddress: userEmail
            },
            writer: {
                type: 'user',
                role: 'writer',
                emailAddress: userEmail
            }
        };
    }
}