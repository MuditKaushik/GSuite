import { Router, Request, Response } from 'express';
import { GSuiteDrive } from '../service/gsuite';
export class GoogleAuthCallback {
    private get drive() { return new GSuiteDrive(); }
    constructor(route: Router) {
        route.get('/callback', this.authClientCallback.bind(this));
    }
    authClientCallback(req: Request, res: Response) {
        this.drive.setAuthorizeClient(req.query.code).subscribe((result) => {
            res.status(200).send(result);
        });
    }
}