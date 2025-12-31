import { Post,ApiError,RequestOptions, RequestWithOptionsBody} from '@/types/api'

class ApiClient {
    private baseUrl: string;
    private defaultHeaders: Record<string, string> = {
        'Content-Type': 'application/json',
    };
    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }
    private async request<T>(endPoint: string, options: RequestWithOptionsBody = {}): Promise<T> {
        const url = `${this.baseUrl}${endPoint.startsWith('/') ? endPoint : `/${endPoint}`}`;
        const headers = {
            ...this.defaultHeaders,
            ...options.headers
        };
        const fetchOptions: RequestOptions = {
            ...options,
            headers
        }
        try {
            const response = await fetch(url, fetchOptions);
            if (!response.ok) {
                let errorData: ApiError | {message: string}
                try {
                    errorData = await response.json() as ApiError; 
                } catch (error) {
                    errorData = {
                        status: response.status,
                        message: response.statusText || 'Request failed',    
                    }
                }
                    throw new Error(errorData.message, {cause: errorData});
            }
                if(response.status === 204 || options.skipParse){
                    return null as T
                }
                return response.json() as Promise<T>;
        } catch (error) {
            console.error(`API request error: ${endPoint}`, error);
            throw error;
            
        }
    }
    get<T = unknown>(endpoint: string, options?: RequestOptions): Promise<T>{
        return this.request<T>(endpoint, {method: 'GET', ...options})
    }

    post<T = unknown, D = unknown>(endpoint: string, data: D, options?: RequestOptions): Promise<T>{
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(data),
            ...options,
        })
    }
    put<T = unknown, D = unknown>(endpoint: string, data: D, options?: RequestOptions): Promise<T>{
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data),
            ...options
        })
    }
    del<T = unknown>(endpoint: string, options?: RequestOptions): Promise<T>{
        return this.request<T>(endpoint, {
            method: 'DELETE',
            ...options
        })
    }
}

const client = new ApiClient('https://localhost:3000');
export const  {del, get, post, put} = client;