export type Post = {
    id: number;
    title: string;
    body: string;
}

export type ApiError = {
    status: number;
    message: string;
    details?: string;
}

export interface RequestOptions extends  Omit<RequestInit, 'body'> {
    skipParse?: boolean
}
export interface RequestWithOptionsBody extends RequestOptions {
    body?: unknown;
}