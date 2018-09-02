import { Router, Request, Response } from 'express';
import { GSuiteDrive } from '../service/gsuite';

export class GSuiteController {
    private get drive() { return new GSuiteDrive(); }
    constructor(route: Router) {
        route.get('/callback', this.authClientCallback.bind(this));
        route.get('/files', this.getGSuiteToken.bind(this));
        route.delete('/file/:id', this.deleteGsuitFile.bind(this));
        route.get('/folder', this.createGSuitFolder.bind(this));
    }
    authClientCallback(req: Request, res: Response) {
        this.drive.setAuthorizeClient(req.query.code).subscribe((result) => {
            res.status(200).send(result);
        });
    }
    getGSuiteToken(req: Request, res: Response) {
        this.drive.getGSuiteFiles().subscribe((files) => {
            res.status(200).send(files);
        }, (err) => {
            res.status(400).send(err);
        });
    }
    createGSuitFolder(req: Request, res: Response) {
        this.drive.createGSuitFolder(`Teacher's Folder`).subscribe((file) => {
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