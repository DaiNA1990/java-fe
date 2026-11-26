import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

/** Mở dialog đổi mật khẩu từ bất kỳ đâu (dialog đặt sẵn ở layout). */
@Injectable({
  providedIn: 'root'
})
export class UserChangePasswordService {

  openSubject = new Subject<void>();

  open = (): void => this.openSubject.next();

}
