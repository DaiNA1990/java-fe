import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class InfoPropertyService extends BaseService {
  constructor() {
    super();
    this.setModule('InfoProperty');
  }

}
