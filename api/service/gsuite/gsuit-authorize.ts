import { google } from 'googleapis';
import * as config from 'config';
import { IGoogleConfig } from '../../model/google';
import { Observable } from '@reactivex/rxjs';
import { UserRefreshClient, Compute, JWT } from 'google-auth-library';

export function AuthorizeGSuite(): Observable<Compute | JWT | UserRefreshClient> {
    let GSuitConfig = config.get<IGoogleConfig>("personal");
    return Observable.fromPromise(google.auth.getClient({
        credentials: {
            client_email: GSuitConfig.client_email,
            private_key: GSuitConfig.private_key
        },
        projectId: GSuitConfig.project_id,
        scopes: [
            'https://www.googleapis.com/auth/drive',
            'https://www.googleapis.com/auth/drive.readonly',
            'https://www.googleapis.com/auth/drive.file',
            'https://www.googleapis.com/auth/drive.metadata',
            'https://www.googleapis.com/auth/drive.metadata.readonly'
        ]
    }));
}
