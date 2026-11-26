import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';
import { AppCons } from '@appkkkh/core/contants/app.cons';

@Injectable({
  providedIn: 'root'
})
export class UserTitleService extends BaseService {
  constructor() {
    super();
    this.setResource(AppCons.API_BASE.MANAGE_SYSTEM, 'user-titles');
  }

}
