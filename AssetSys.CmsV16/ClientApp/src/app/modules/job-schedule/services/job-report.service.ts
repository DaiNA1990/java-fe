import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JobReportService extends BaseService {
  constructor() {
    super();
  }

  // TODO: chuẩn URL mới chưa có API tương ứng cho màn này, tạm giữ URL cũ.
  protected override buildUrl(api: string): string {
    return `${environment.apiUrl}configapi/JobSchedule/${api}`;
  }

  run = (data: any): Observable<any> => this.post('run', data);
  deleted = (data: any): Observable<any> => this.get('deleted', data);
  jobById = (data: any): Observable<any> => this.get('jobById', data);
  jobStatus = (data: any): Observable<any> => this.get('JobStatus', data);
}
