import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class InfoReportSetupService extends BaseService {
  constructor() {
    super();
    this.setModule('InfoReportSetup');
    this.setPath('reportapi');
  }

}
