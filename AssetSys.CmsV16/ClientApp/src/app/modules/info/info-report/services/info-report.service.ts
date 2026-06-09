import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfoReportService extends BaseService {
  constructor() {
    super();
    this.setModule('InfoReport');
    this.setPath('reportapi');
  }
  executeReport = (data: any): Observable<any> => this.post('ExecuteReport', data);
  getStatusProcessReport = (data: any): Observable<any> => this.get('GetStatusProcessReport', data);
  uploadTemplate(data: any): Observable<any> {
    return this.post('UploadTemplate', data);
  }

  downloadTemplate(data: any): Observable<any> {
    return this.downloadFile('DonwloadTemplate', data, { responseType: 'blob', observe: 'response' });
  }
  donwloadReportFile(data: any): Observable<any> {
    return this.downloadFile('DonwloadReportFile', data, { responseType: 'blob', observe: 'response' });
  }
}
