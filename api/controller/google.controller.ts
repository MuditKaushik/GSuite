import { Router, Request, Response } from 'express';
import { GSuiteDrive } from '../service/gsuite';
import * as multer from 'multer';
import * as path from 'path';

export class GSuiteController {
    private get drive() { return new GSuiteDrive(); }
    constructor(route: Router) {
        route.get('/token', this.getGSuiteDriveToken.bind(this));
        route.get('/files', this.getGSuiteFiles.bind(this));
        route.get('/file/:id/detail', this.getFileDetails.bind(this));
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
        route.post('/files/:id/copy', this.GSuiteFileCopy.bind(this));
        route.delete('/file/:id', this.deleteGsuitFile.bind(this));
        route.get('/folder/:name', this.createGSuitFolder.bind(this));
    }
    getFileDetails(req: Request, res: Response) {
        this.drive.getFileDetailsById(req.params.id).subscribe((result) => { 
            res.send(result);
        });
    }
    uploadGSuiteFile(req: Request, res: Response) {
        this.drive.uploadFilesToGSuite(req.params.parentId).subscribe((filesUploaded) => {
            res.send(filesUploaded);
        });
    }
    GSuiteFileCopy(req: Request, res: Response) {
        this.drive.copyGSuiteFiles(req.params.id, req.body.parentId).subscribe((result) => {
            if (result) {
                res.status(200).send(result);
            } else {
                res.status(200).send(result);
            }
        });
    }
    getGSuiteDriveToken(req: Request, res: Response) {
        this.drive.getGSuiteDriveToken().subscribe((tokendata) => {
            res.status(200).send(tokendata);
        });
    }
    getGSuiteFiles(req: Request, res: Response) {
        this.drive.getGSuiteFiles().subscribe((files) => {
            res.status(200).send(files);
        }, (err) => {
            res.status(400).send(err);
        });
    }
    createGSuitFolder(req: Request, res: Response) {
        this.drive.createGSuitFolder(req.params.name).subscribe((file) => {
            res.status(200).send(file);
        }, (err) => {
            res.status(400).send(err);
        });
    }
    deleteGsuitFile(req: Request, res: Response) {
        this.drive.deleteDrivefile(req.params.id).subscribe((file) => {
            res.status(200).send(file);
        }, (err) => {
            res.status(400).send(err);
        });
    }
}