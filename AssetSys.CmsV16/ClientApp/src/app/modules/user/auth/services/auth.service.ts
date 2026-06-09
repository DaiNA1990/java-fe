import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, tap } from 'rxjs';
import { BaseService } from '@appkkkh/core/base/base.service';
import { HttpClient } from '@angular/common/http';
import { ResponseCode } from '@appkkkh/core/contants/app.enum';

@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {

  currentUserSubject: BehaviorSubject<any>;
  actionsCodeSubject: BehaviorSubject<[]>;

  constructor() {
    super();
    this.setModule('Auth');
    this.setPath('authapi');
    this.currentUserSubject = new BehaviorSubject<any>(undefined);
    this.actionsCodeSubject = new BehaviorSubject<[]>([]);
  }

  registration = (data: any): Observable<any> => this.post('Registration', data);

  login = (data: any): Observable<any> => this.post('Login', data);

  logout = (): Observable<any> => this.post('Logout');

  forgetPassword = (data: any): Observable<any> => this.post('ForgetPassword', data);

  resetPassword = (data: any): Observable<any> => this.post('ResetPassword', data);

  refreshToken = (token: any): Observable<any> => this.post('RefreshToken', { refreshToken: token });

  getActions = (): Observable<any> => this.get('GetActions', null);

  getInfo = (): Observable<any> => this.get('GetInfo').pipe(tap((res: any) => {
    if (res.statusCode === ResponseCode.ZERO) {
      this.currentUserSubject.next(res.data);
    }
  }));

  loadPermissions = (codes: []): void => {
    this.actionsCodeSubject.next(codes);
  }

  hasPermission = (permissions: string | string[]): boolean => {
    if (permissions === undefined || permissions === null || permissions === '')
      return true;
    return this.actionsCodeSubject.value.some((code: string) => {
      if (typeof permissions === 'string') {
        if (permissions.indexOf(',') > -1)
          return permissions.split(',').map((p: string) => p.trim()).includes(code);
        return code === permissions;
      } else if (Array.isArray(permissions)) {
        return permissions.includes(code);
      }
      return false;
    })
  }

}
