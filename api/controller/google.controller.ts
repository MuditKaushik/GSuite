import { Router, Request, Response } from 'express';
import { GSuiteDrive } from '../service/gsuite';
import * as multer from 'multer';
import * as path from 'path';

export class GSuiteController {
    private get drive() { return new GSuiteDrive(); }
    constructor(route: Router) {
        route.get('/files', this.getDriveFiles.bind(this));
        route.get('/file/:id/detail', this.getDriveFileDetails.bind(this));
        route.get('/folder/:name', this.createDriveFolder.bind(this));
        route.post('/files/:id/copy', this.GSuiteFileCopy.bind(this));
        route.post('/files/upload/:parentId', multer({
            dest: path.resolve(__dirname, '../../temp/'),
            storage: multer.diskStorage({
                destination: (req, file, destcallback) => {
                    destcallback(null, path.resolve(__dirname, '../../temp/'))
                },
                filename: (req, file, callbackFile) => {
                    callbackFile(null, file.originalname);
                }
            })
        }).array('file', 100), this.uploadGSuiteFile.bind(this));
        route.delete('/file/:id', this.deleteDriveFile.bind(this));
    }
    getFileDetails(req: Request, res: Response) {
        this.drive.getFileDetailsById(req.params.id).subscribe((result) => {
            res.status(200).send(result);
        }, (err) => {
            res.status(400).send(err);
        });
    }
    uploadGSuiteFile(req: Request, res: Response) {
        this.drive.uploadFilesToDrive(req.params.parentId).subscribe((filesUploaded) => {
            res.status(200).send(filesUploaded);
        }, (err) => {
            res.status(400).send(err);
        });
    }
    GSuiteFileCopy(req: Request, res: Response) {
        this.drive.copyDriveFiles(req.params.id, req.body.parentId).subscribe((result) => {
            res.status(200).send(result);
        }, (err) => {
            res.status(400).send(err);
        });
    }
    getDriveFiles(req: Request, res: Response) {
        this.drive.getDriveFiles().subscribe((files) => {
            res.status(200).send(files);
        }, (err) => {
            res.status(400).send(err);
        });
    }
    getDriveFileDetails(req: Request, res: Response) {
        this.drive.getFileDetailsByFileId(req.params.id).subscribe((file) => {
            res.status(200).send(file);
        }, (err) => {
            res.status(400).send(err);
        });
    }
    createDriveFolder(req: Request, res: Response) {
        this.drive.createDriveFolder(req.params.name).subscribe((file) => {
            res.status(200).send(file);
        }, (err) => {
            res.status(400).send(err);
        });
    }
    deleteDriveFile(req: Request, res: Response) {
        this.drive.deleteDrivefile(req.params.id).subscribe((file) => {
            res.status(200).send(file);
        }, (err) => {
            res.status(400).send(err);
        });
    }
}