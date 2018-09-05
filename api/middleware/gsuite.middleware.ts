import { Request, Response, NextFunction } from 'express';
import { GoogleClient } from '../service/gsuite';

export function GSuiteMiddleware(req: Request, res: Response, next: NextFunction) {
    let googleClient = GoogleClient.client;
    if (req.query.code || (googleClient.credentials && googleClient.credentials.access_token)) {
        next();
    } else {
        res.send(googleClient.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/drive']
        }));
    }
}

export function GSuiteAuthClient(req: Request, res: Response, next: NextFunction) {
    let tokenData = GoogleClient.client.credentials;
    if (tokenData && tokenData.access_token) {
        GoogleClient.setClient = tokenData;
        next();
    } else {
        res.type('html').send(GoogleClient.client.generateAuthUrl({
            access_type: 'offline',
            scope: ['https://www.googleapis.com/auth/drive']
        }));
    }
}
