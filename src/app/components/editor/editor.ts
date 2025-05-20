export interface EditorContent {
    content: Array<{
        content: Array<{
            text: string;
        }>;
    }>;
}

export interface RawTextResult {
    text: string;
    lengthTable: number[];
}