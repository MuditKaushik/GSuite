import { Request, Response, NextFunction } from 'express';
export function GSuiteMiddleware(req: Request, res: Response, next: NextFunction) {
    // if (req.query.code || (google.auth.)) {
    //     next();
    // } else {
    //     res.send(authClient().generateAuthUrl({
    //         access_type: 'offline',
    //         scope: ['https://www.googleapis.com/auth/drive']
    //     }));
    // }
}
