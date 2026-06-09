import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class UserPageActionService extends BaseService {
  constructor() {
    super();
    this.setModule('UserPageAction');
    this.setPath('userapi');
  }

}
