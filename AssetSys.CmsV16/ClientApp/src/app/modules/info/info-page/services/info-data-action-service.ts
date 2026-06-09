import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';

@Injectable()
export class InfoDataActionService extends BaseService {
  constructor() {
    super();
    this.setModule('InfoDataAction');
  }

}
