import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class UserPageService extends BaseService {
  constructor() {
    super();
    this.setModule('UserPage');
    this.setPath('userapi');
  }

}
