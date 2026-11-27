import { Injectable } from '@angular/core';
import { Observable } from "rxjs";
import { BaseService } from '@appkkkh/core/base/base.service';
import { AppCons } from '@appkkkh/core/contants/app.cons';

@Injectable({
  providedIn: 'root'
})
export class UserService extends BaseService {
  constructor() {
    super();
    this.setResource(AppCons.API_BASE.MANAGE_SYSTEM, 'users');
  }

  /** Admin đặt lại mật khẩu: userId lên path, body {password, confirmPassword}. */
  changePasswordUser = (data: any): Observable<any> => {
    const { id, userId, ...body } = data ?? {};
    return this.put(`${this.idPath(userId ?? id)}/password`, body);
  }

  changePassword = (data: any): Observable<any> => this.put('me/password', data);

  updateInfo = (data: any): Observable<any> => this.put('me', data);

  /**
   * Đồng bộ toàn bộ tài khoản sang Keycloak (tạo user chưa có kèm mật khẩu hiện tại, cập nhật email/họ tên/trạng thái).
   * data: { totalUsers, created, updated, unchanged, skipped, failed, aborted, abortReason, failures[], warnings[] }.
   */
  syncKeycloak = (): Observable<any> => this.post('keycloak-sync');

}
