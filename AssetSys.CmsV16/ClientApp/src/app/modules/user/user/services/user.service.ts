import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { BaseService } from '@appkkkh/core/base/base.service';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  constructor() {
    super();
    this.setModule('User');
    this.setPath('userapi');
  }

  changePasswordUser = (data: any): Observable<any> => this.post('ChangePasswordUser', data);

  changePassword = (data: any): Observable<any> => this.post('ChangePassword', data);

  updateInfo = (data: any): Observable<any> => this.post('UpdateInfo', data);

}
