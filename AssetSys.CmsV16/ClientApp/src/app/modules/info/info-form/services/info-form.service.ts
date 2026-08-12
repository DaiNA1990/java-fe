import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class InfoFormService extends BaseService {
  constructor() {
    super();
    this.setModule('InfoForm');
    this.setPath('configapi');
  }

}
