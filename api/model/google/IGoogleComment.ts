import { IGoogleAuthor } from './IGoogleAuthor';
export interface IGoogleComments {
    id: string;
    htmlContent: string;
    quotedFileContent: IGoogleQuotedContent;
    author: IGoogleAuthor;
}
export interface IGoogleQuotedContent {
    mimeType: string;
    value: string;
}