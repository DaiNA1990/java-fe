import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UserRoleService extends BaseService {
  constructor() {
    super();
    this.setModule('UserRole');
    this.setPath('userapi');
  }

  getRolesByUser = (data: any): Observable<any> => this.get('GetRolesByUser', data);

  getRolesCurrentUser = (): Observable<any> => this.get('GetRolesCurrentUser');

  addRole = (data: any): Observable<any> => this.post('AddRole', data);

  addActionForRole = (data: any): Observable<any> => this.post('AddActionForRole', data);

}
