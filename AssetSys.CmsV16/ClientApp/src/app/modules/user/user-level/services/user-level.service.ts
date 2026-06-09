import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class UserLevelService extends BaseService {
  constructor() {
    super();
    this.setModule('UserLevel');
    this.setPath('userapi');
  }

}
