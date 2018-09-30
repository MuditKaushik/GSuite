import * as config from 'config';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { IGoogleConfig } from '../../model/google';
import { Observable } from '@reactivex/rxjs';

export function GoogleAuthClient(): Observable<OAuth2Client> {
    let accountConfig = config.get<IGoogleConfig>('serviceAccount');
    let authClientPromise = google.auth.getClient({
        credentials: {
            client_email: accountConfig.client_email,
            private_key: accountConfig.private_key
        },
        projectId: accountConfig.project_id,
        scopes: ['https://www.googleapis.com/auth/drive']

    });
    return Observable.fromPromise(authClientPromise);
}
