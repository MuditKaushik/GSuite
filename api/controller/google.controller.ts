import { Router, Request, Response } from 'express';
import { GSuiteDrive } from '../service/gsuite';

export class GSuiteController {
    private get drive() { return new GSuiteDrive(); }
    constructor(route: Router) {
        route.get('/drivefiles', this.getGSuiteToken.bind(this));
        route.delete('/drivefile/delete/:id', this.deleteGsuitFile.bind(this));
        route.get('/drivefolder', this.createGSuitFolder.bind(this));
    }
    getGSuiteToken(req: Request, res: Response) {
        this.drive.getGSuiteFiles().subscribe((files) => {
            res.send(files);
        });
    }
    createGSuitFolder(req: Request, res: Response) {
        this.drive.createGSuitFolder(`Teacher's Folder`).subscribe((file) => {
            res.send(file);
            return;
        });
    }
    deleteGsuitFile(req: Request, res: Response) {
        this.drive.deleteDrivefile(req.params.id).subscribe((file) => {
            res.send(file);
            return;
        });
    }
}