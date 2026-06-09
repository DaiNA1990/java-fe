import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class JobScheduleService extends BaseService {
  constructor() {
    super();
    this.setModule('JobSchedule');
    this.setPath('jobapi');
  }

  queues = (data: any): Observable<any> => this.get('queues', data);
  enqueued = (data: any): Observable<any> => this.get('enqueued', data);
  processing = (data: any): Observable<any> => this.get('processing', data);
  succeeded = (data: any): Observable<any> => this.get('succeeded', data);
  failed = (data: any): Observable<any> => this.get('failed', data);
  scheduled = (data: any): Observable<any> => this.get('scheduled', data);
  servers = (data: any): Observable<any> => this.get('servers', data);
  recurring = (data: any): Observable<any> => this.get('recurring', data);
  stats = (data: any): Observable<any> => this.get('stats', data);
  retries = (data: any): Observable<any> => this.get('retries', data);
  awaiting = (data: any): Observable<any> => this.get('awaiting', data);
  deleted = (data: any): Observable<any> => this.get('deleted', data);
  jobById = (data: any): Observable<any> => this.get('jobById', data);
  delete = (data: any): Observable<any> => this.post('delete', data);
  run = (data: any): Observable<any> => this.post('run', data);
}
