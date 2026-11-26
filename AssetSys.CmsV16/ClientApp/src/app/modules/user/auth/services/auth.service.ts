import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, BehaviorSubject, of, tap } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { BaseService } from '@appkkkh/core/base/base.service';
import { AppCons } from '@appkkkh/core/contants/app.cons';
import { ResponseCode } from '@appkkkh/core/contants/app.enum';

/** Cách đăng nhập đang bật ở BE (manage-system app.session.local-enabled / sso.enabled). */
export interface AuthModeConfig {
  localEnabled: boolean;
  ssoEnabled: boolean;
}

export const SIGNIN_URL = '/auth/signin';

/**
 * Đăng nhập bằng session: BE đặt cookie SID (HttpOnly, JS không đọc được) + XSRF-TOKEN; FE không giữ token.
 * Mọi API đi qua gateway (cùng origin qua "/api"), gateway đổi cookie lấy JWT (forward-auth). Hết phiên = 401.
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService extends BaseService {

  private readonly router = inject(Router);

  currentUserSubject: BehaviorSubject<any>;
  actionsCodeSubject: BehaviorSubject<[]>;

  // bản gốc từ GetInfo, chưa cộng role theo layout
  private baseUser: any = null;

  private redirectingToSignin = false;

  constructor() {
    super();
    this.setResource(AppCons.API_BASE.MANAGE_SYSTEM, 'auth');
    this.currentUserSubject = new BehaviorSubject<any>(undefined);
    this.actionsCodeSubject = new BehaviorSubject<[]>([]);
  }

  registration = (data: any): Observable<any> => this.post('registration', data);

  forgetPassword = (data: any): Observable<any> => this.post('forget-password', data);

  resetPassword = (data: any): Observable<any> => this.post('reset-password', data);

  /** Cách đăng nhập đang bật. Lỗi -> coi như chỉ bật đăng nhập user/pass. */
  getAuthConfig = (): Observable<AuthModeConfig> => this.get('session/config').pipe(
    map((res: any) => ({
      localEnabled: res?.data?.localEnabled !== false,
      ssoEnabled: res?.data?.ssoEnabled === true,
    })),
    catchError(() => of({ localEnabled: true, ssoEnabled: false }))
  );

  /** Đăng nhập user/pass — thành công thì BE đặt cookie, response không có token. */
  sessionLogin = (data: { username: string; password: string }): Observable<any> => this.post('session/login', data);

  /**
   * Chuyển cả trang sang Keycloak (qua manage-system), đăng nhập xong quay về returnPath.
   * Lỗi thì BE chuyển về /auth/signin?error=SSO_FAILED | SSO_USER_NOT_FOUND | SSO_DISABLED.
   */
  ssoLogin(returnPath: string = '/'): void {
    const returnUrl = new URL(returnPath, window.location.origin).toString();
    window.location.href = `${this.buildUrl('session/sso/login')}?returnUrl=${encodeURIComponent(returnUrl)}`;
  }

  /** Đăng xuất: xoá phiên ở BE; phiên SSO thì chuyển sang Keycloak để đăng xuất luôn (BE trả logoutUrl). */
  logout(): void {
    this.post('session/logout').pipe(catchError(() => of(null))).subscribe((res: any) => {
      this.clearUser();
      const logoutUrl = res?.statusCode === ResponseCode.ZERO ? res?.data?.logoutUrl : null;
      if (logoutUrl) {
        window.location.href = logoutUrl;
        return;
      }
      this.router.navigateByUrl(SIGNIN_URL);
    });
  }

  /** API trả 401 (hết phiên): xoá thông tin user phía FE và về màn đăng nhập, giữ URL để quay lại. */
  handleSessionExpired(): void {
    if (this.redirectingToSignin || this.router.url.startsWith('/auth')) return;
    this.redirectingToSignin = true;
    const returnUrl = this.router.url;
    this.clearUser();
    this.router.navigate([SIGNIN_URL], { queryParams: { url: returnUrl } })
      .finally(() => this.redirectingToSignin = false);
  }

  getActions = (): Observable<any> => this.get('actions');

  getInfo = (): Observable<any> => this.get('me').pipe(tap((res: any) => {
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

  // so với roleCodes của user (khác hasPermission so với action code từ /auth/actions)
  hasRole = (role: string): boolean => (this.currentUserSubject.value?.roleCodes ?? []).includes(role);

  /** Xoá user/quyền đã nạp — đăng nhập user khác trong cùng SPA không thấy dữ liệu user cũ. */
  private clearUser(): void {
    this.baseUser = null;
    this.currentUserSubject.next(undefined);
    this.actionsCodeSubject.next([]);
  }
}
