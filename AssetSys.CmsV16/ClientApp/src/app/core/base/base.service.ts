import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from "rxjs";
import { first, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AppCons } from '../contants/app.cons';
import { Language } from '../contants/app.enum';

export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface RequestOptions {
  responseType?: 'json' | 'blob' | 'text';
  observe?: 'body' | 'response';
  /** Query string cho POST/PUT/PATCH (GET/DELETE lấy query từ data). */
  params?: any;
}

/**
 * Service gọi API theo chuẩn REST: /gateway/<BasePath>/v1/<resource>[/<sub>].
 *
 * Tên method CRUD giữ như cũ để component không phải đổi:
 * getList → GET {resource}, getById → GET {resource}/{id},
 * addOrEdit → POST {resource} | PUT {resource}/{id}, onOff → PATCH {resource}/{id}/visibility,
 * delete → DELETE {resource}/{id} (tham số phụ lên query).
 */
@Injectable()
export class BaseService {

  private http = inject(HttpClient);

  protected basePath!: string;
  protected resource!: string;

  constructor() {}

  protected setResource(basePath: string, resource: string) {
    this.basePath = basePath;
    this.resource = resource;
  }

  getList = (data: any): Observable<any> => this.get('', data);

  autocomplete = (data: any): Observable<any> => this.get('autocomplete', data);

  getById = (data: any): Observable<any> => this.get(this.idPath(data?.id));

  addOrEdit = (data: any): Observable<any> => this.hasId(data?.id)
    ? this.put(this.idPath(data.id), data)
    : this.post('', data);

  onOff = (data: any): Observable<any> => this.patch(`${this.idPath(data?.id)}/visibility`, { status: data?.status });

  delete = (data: any): Observable<any> => {
    const { id, ...params } = data ?? {};
    return this.del(this.idPath(id), params);
  }

  get = (api: string, data: any = null, options?: RequestOptions) => this.httpRequest('GET', api, data, options);

  post = (api: string, data: any = null, options?: RequestOptions) => this.httpRequest('POST', api, data, options);

  put = (api: string, data: any = null, options?: RequestOptions) => this.httpRequest('PUT', api, data, options);

  patch = (api: string, data: any = null, options?: RequestOptions) => this.httpRequest('PATCH', api, data, options);

  del = (api: string, data: any = null, options?: RequestOptions) => this.httpRequest('DELETE', api, data, options);

  downloadFile = (api: string, data: any = null, options?: RequestOptions) => this.httpRequest('GET', api, data, options);

  protected hasId = (id: any): boolean => id !== undefined && id !== null && id !== '';

  protected idPath = (id: any): string => encodeURIComponent(String(id ?? ''));

  /**
   * Encode tên file đặt trên path. Giữ nguyên dấu '/' của file dạng groupCode/x.docx
   * vì server từ chối %2F.
   */
  protected filePath = (filename: string): string =>
    String(filename ?? '').split('/').map(encodeURIComponent).join('/');

  protected urlOf(basePath: string, resource: string, api: string = ''): string {
    const url = `${environment.apiUrl}${AppCons.API_GATEWAY}/${basePath}/${AppCons.API_VERSION}/${resource}`;
    return api ? `${url}/${api}` : url;
  }

  protected buildUrl(api: string): string {
    return this.urlOf(this.basePath, this.resource, api);
  }

  httpRequest(method: HttpMethod, api: string, data: any, options?: RequestOptions) {
    return this.request(method, this.buildUrl(api), data, options);
  }

  protected request(method: HttpMethod, url: string, data: any, options?: RequestOptions) {
    const isQueryMethod = method === 'GET' || method === 'DELETE';

    const query: any = { ...((isQueryMethod ? data : options?.params) ?? {}) };
    Object.keys(query).forEach(key => { if (query[key] === undefined || query[key] === null) delete query[key]; });

    // server lấy ngôn ngữ qua query param lang (không đọc header Accept-Language),
    // gửi cho mọi request để message trong response về đúng ngôn ngữ đang chọn
    const lang = localStorage.getItem(AppCons.LANGUAGE_KEY) || Language.VI;

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept-Language': lang
      }),
      params: { ...query, lang },
      body: isQueryMethod ? undefined : data,
      responseType: options?.responseType ?? 'json',
      observe: options?.observe ?? 'body'
    };

    // Không gắn Authorization: đăng nhập bằng cookie SID (HttpOnly) trình duyệt tự gửi, gateway đổi lấy JWT.
    // Header X-CSRF-Token do HttpClientXsrfModule (app.module) gắn cho request ghi — URL phải tương đối.

    if (!(data instanceof FormData) && httpOptions.responseType === 'json') {
      httpOptions.headers = httpOptions.headers.set('Content-Type', 'application/json');
    }

    return this.http.request(method, url, httpOptions as any).pipe(first(), take(1));
  }
}
