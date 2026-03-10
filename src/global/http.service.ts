import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { IHttpRequestConfig, IHttpResponse } from './interfaces/http.interface';

@Injectable()
export class HttpService {
  private readonly axiosInstance: AxiosInstance;

  constructor() {
    this.axiosInstance = axios.create();
  }

  async request<T = any>(
    config: IHttpRequestConfig,
  ): Promise<IHttpResponse<T>> {
    const axiosConfig: AxiosRequestConfig = {
      url: config.url,
      method: config.method || 'get',
      data: config.data,
      params: config.params,
      headers: config.headers,
      responseType: config.responseType as any,
    };

    const response: AxiosResponse<T> =
      await this.axiosInstance.request(axiosConfig);

    return {
      data: response.data,
      status: response.status,
      statusText: response.statusText,
      headers: response.headers,
    };
  }
}
