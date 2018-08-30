import { IGoogleCapabilities } from './IGoogleCapability';
export interface IGoogleFileCopy {
    id: string;
    name: string;
    parents: Array<string>;
    fileExtension: string;
    fullFileExtension: string;
    capabilities: IGoogleCapabilities;
}