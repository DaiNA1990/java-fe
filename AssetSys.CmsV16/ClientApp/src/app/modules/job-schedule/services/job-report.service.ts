import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobReportService extends BaseService {
  constructor() {
    super();
    this.setModule('JobSchedule');
    this.setPath('reportapi');
  }
  run = (data: any): Observable<any> => this.post('run', data);
  deleted = (data: any): Observable<any> => this.get('deleted', data);
  jobById = (data: any): Observable<any> => this.get('jobById', data);
  jobStatus = (data: any): Observable<any> => this.get('JobStatus', data);
}
