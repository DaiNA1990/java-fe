import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class UserDepartmentService extends BaseService {
  constructor() {
    super();
    this.setModule('UserDepartment');
    this.setPath('userapi');
  }

}
