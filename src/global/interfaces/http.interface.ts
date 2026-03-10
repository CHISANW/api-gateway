export interface IHttpResponse<T = any> {
  data: T;
  status: number;
  statusText: string;
  headers: any;
}

export interface IHttpRequestConfig {
  url: string;
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch';
  data?: any;
  params?: any;
  headers?: any;
  responseType?: string;
}
