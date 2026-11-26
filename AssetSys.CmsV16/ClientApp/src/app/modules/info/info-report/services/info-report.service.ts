import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';
import { AppCons } from '@appkkkh/core/contants/app.cons';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfoReportService extends BaseService {
  constructor() {
    super();
    this.setResource(AppCons.API_BASE.DEVELOP_TOOL, 'info-reports');
  }

  /** Chạy báo cáo ở service Report, trả file xlsx hoặc pdf. */
  executeReport = (data: any): Observable<any> =>
    this.request('POST', this.urlOf(AppCons.API_BASE.REPORT, 'info-reports', 'execute'), data,
      { responseType: 'blob', observe: 'response' });

  uploadTemplate(data: any): Observable<any> {
    return this.post('templates', data);
  }

  downloadTemplate(data: any): Observable<any> {
    return this.downloadFile(`templates/${this.filePath(data?.filename)}`, null, { responseType: 'blob', observe: 'response' });
  }
}
