import { google } from 'googleapis';

export class GSuiteDrive {
    GClient: any;
    constructor() { 
        this.GClient = new google.auth.OAuth2()
    }

}