import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class UserRoleMapService extends BaseService {
  constructor() {
    super();
    this.setModule('UserRoleMap');
    this.setPath('userapi');
  }

}
