import { IGoogleCapabilities } from './IGoogleCapability';
export interface IGoogleFile {
    id: string;
    mimeType: string;
    name: string;
    ownedByMe: boolean;
    trashed: boolean;
    parents: Array<string>;
    capabilities: Array<IGoogleCapabilities>;
}