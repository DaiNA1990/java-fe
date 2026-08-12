import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';
import { Observable } from 'rxjs';

@Injectable()
export class InfoFormService extends BaseService {
  constructor() {
    super();
    this.setModule('InfoForm');
  }

  getByLayoutCode = (data: any): Observable<any> => this.get('GetByLayoutCode', data);

}
