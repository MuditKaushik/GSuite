import { IGoogleDoc } from './IGoogleDoc';
export interface IGoogleFileData {
    action: string;
    docs: Array<IGoogleDoc>;
}