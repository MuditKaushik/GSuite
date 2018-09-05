import * as config from 'config';
import { OAuth2Client } from 'google-auth-library';
import { google } from 'googleapis';
import { IGoogleConfig } from '../../model/google';
import { Credentials } from 'google-auth-library/build/src/auth/credentials';

export class GoogleClient {
    private static _client: OAuth2Client = {} as OAuth2Client;
    static get client(): OAuth2Client {
        return this._client;
    }
    static set setClient(credentials: Credentials) {
        this._client.setCredentials(credentials);
    }
    constructor() {
        let GSuitConfig = config.get<IGoogleConfig>("powerschool");
        let oauthClient = new google.auth.OAuth2(
            GSuitConfig.client_id,
            GSuitConfig.client_secret,
            GSuitConfig.redirect_uris[0]);
        GoogleClient._client = oauthClient;
    }
}

