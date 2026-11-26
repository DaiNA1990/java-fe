import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';
import { AppCons } from '@appkkkh/core/contants/app.cons';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService extends BaseService {
  constructor() {
    super();
    this.setResource(AppCons.API_BASE.MANAGE_SYSTEM, 'user-roles');
  }

  getRolesByUser = (data: any): Observable<any> => this.get('', data);

  getRolesCurrentUser = (): Observable<any> => this.get('me');

  addRole = (data: any): Observable<any> => this.post('assignments', data);

  /** roleId lên path, body {actionIds}. */
  addActionForRole = (data: any): Observable<any> => {
    const { roleId, ...body } = data ?? {};
    return this.put(`${this.idPath(roleId)}/actions`, body);
  }

}
