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

  // bản gốc từ GetInfo, chưa cộng role theo layout
  private baseUser: any = null;

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
      this.baseUser = res.data;
      this.currentUserSubject.next(res.data);
    }
  }));

  loadPermissions = (codes: []): void => {
    this.actionsCodeSubject.next(codes);
  }

  /**
   * Cộng thêm subFunction của layout đang mở vào roleCodes.
   *
   * Luôn tính lại từ baseUser (bản gốc từ GetInfo) chứ không cộng dồn lên giá
   * trị hiện tại, để role của layout trước không đọng lại khi chuyển layout.
   */
  applyLayoutRoles = (pathCode: string): void => {
    const user = this.baseUser;

    if (user === null || user === undefined) return;

    const roles: string[] = [];

    user.functionRoles
      .filter((c: any) => c.functionCode === pathCode)
      .forEach((c: any) => roles.push(...c.subFunction.split(';')));

    this.currentUserSubject.next({
      ...user,
      roleCodes: Array.from(new Set([...user.roleCodes, ...roles]))
    });
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
