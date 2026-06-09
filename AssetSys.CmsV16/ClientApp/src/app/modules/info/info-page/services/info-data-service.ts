import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';
import { Observable } from 'rxjs';

@Injectable()
export class InfoDataService extends BaseService {
  constructor() {
      super();
      this.setModule('InfoData');
    }

  saveData = (data: any): Observable<any> => this.post('SaveData', data);
  clone = (data: any): Observable<any> => this.post('Clone', data);
  collection = (data: any): Observable<any> => this.post('Collection', data);
  summaryData = (data: any): Observable<any> => this.post('summaryData', data);
  importExcel = (data: any): Observable<any> => this.post('ImportExcel', data);
  exportExcel(data: any): Observable<any> {
    return this.httpRequest('POST', 'ExportExcel', data, { responseType: 'blob', observe: 'response' });
  }
  getCount = (data: any): Observable<any> => this.post('GetCount', data);
  approveAll = (data: any): Observable<any> => this.post('ApproveAll', data);
  approvePB = (data: any): Observable<any> => this.post('ApprovePB', data);
  deleteByGroupCode = (data: any): Observable<any> => this.post('DeleteByGroupCode', data);
  getById = (data: any): Observable<any> => this.get('GetByIdByGroup', data);
  ValidateCustom = (data: any): Observable<any> => this.post('ValidateCustom', data);
  backgroundStatus = (data: any): Observable<any> => this.get('BackgroundStatus', data);
  getList = (data: any): Observable<any> => this.post('GetList', data);
}
