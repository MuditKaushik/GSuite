import { drive_v3 } from 'googleapis';
export interface IGooglePermissions {
    owner: drive_v3.Schema$Permission;
    reader: drive_v3.Schema$Permission;
    writer: drive_v3.Schema$Permission;
    commenter: drive_v3.Schema$Permission;
    domainReader: drive_v3.Schema$Permission;
}
