import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class UserRolePageActionMapService extends BaseService {
  constructor() {
    super();
    this.setModule('UserRolePageActionMap');
    this.setPath('userapi');
  }

}
