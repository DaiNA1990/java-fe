import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class UserCodeService extends BaseService {
  constructor() {
    super();
    this.setModule('UserCode');
    this.setPath('userapi');
  }

}
