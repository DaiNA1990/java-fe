import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from "rxjs";
import { first, take } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { AppCons } from '../contants/app.cons';

@Injectable()
export class BaseService {

  private http = inject(HttpClient);

  protected module!: string;
  protected path: string = 'planapi';

  constructor() {}

  protected setModule(module: string) {
    this.module = module;
  }

  setPath(path: string) {
    this.path = path;
  }

  //getUrlRequset = (action: string): string => `${environment.apiUrl}${this.module}/${action}`;

  getList = (data: any): Observable<any> => this.get('GetList', data);

  autocomplete = (data: any): Observable<any> => this.get('Autocomplete', data);

  getById = (data: any): Observable<any> => this.get('GetById', data);

  addOrEdit = (data: any): Observable<any> => this.post('AddOrEdit', data);

  onOff = (data: any): Observable<any> => this.post('OnOff', data);

  delete = (data: any): Observable<any> => this.post('Delete', data);

  // importExcel = (data: any): Observable<any> => this.post('ImportExcel', data);

  // exportExcel = (api: string, data: any = null, options: any) => this.httpRequest('POST', api, data, options);

  getImportTemplate = (): Observable<any> => this.get('GetTemplateImport');

  post = (api: string, data: any = null) => this.httpRequest('POST', api, data);

  get = (api: string, data: any = null) => this.httpRequest('GET', api, data);

  downloadFile = (api: string, data: any = null, options: any) => this.httpRequest('GET', api, data, options);

  httpRequest(method: string, api: string, data: any,
  options?: {
    responseType?: 'json' | 'blob' | 'text';
    observe?: 'body' | 'response';
  }) {
    const url = environment.apiUrl + this.path + '/' + this.module + '/' + api;

    if (method === 'GET' && data !== undefined && data !== null)
      Object.keys(data).forEach(key => { if (data[key] === undefined || data[key] === null) delete data[key]; });

    const httpOptions = {
      headers: new HttpHeaders({
        'Accept-Language': localStorage.getItem(AppCons.LANGUAGE_KEY) ?? ''
      }),
      params: method === 'GET' ? data : null,
      responseType: options?.responseType ?? 'json',
      observe: options?.observe ?? 'body'
    };

    const token = localStorage.getItem(AppCons.TOKEN_KEY) ?? '';

    if (token !== '')
      httpOptions.headers = httpOptions.headers.set('Authorization', `Bearer ${token}`);

    if (!(data instanceof FormData) && httpOptions.responseType === 'json') {
      httpOptions.headers = httpOptions.headers.set('Content-Type', 'application/json');
    }

    const actionMethod = method === 'POST'
      ? this.http.post(url, data, httpOptions as any)
      : this.http.get(url, httpOptions as any);

    return actionMethod.pipe(first(), take(1));
  }
}
