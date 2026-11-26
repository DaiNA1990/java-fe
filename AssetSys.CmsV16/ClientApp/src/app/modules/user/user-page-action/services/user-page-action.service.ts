import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';
import { AppCons } from '@appkkkh/core/contants/app.cons';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserPageActionService extends BaseService {
  constructor() {
    super();
    this.setResource(AppCons.API_BASE.MANAGE_SYSTEM, 'user-page-actions');
  }

  /** Action đã gán cho role: GET ?roleId= (handler riêng phía BE, trả {list, total}). */
  getActionsByRole = (roleId: number): Observable<any> => this.get('', { roleId });

}
