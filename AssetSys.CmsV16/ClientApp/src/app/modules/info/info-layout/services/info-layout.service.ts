import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';
import { AppCons } from '@appkkkh/core/contants/app.cons';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfoLayoutService extends BaseService {
  constructor() {
    super();
    this.setResource(AppCons.API_BASE.DEVELOP_TOOL, 'info-layouts');
  }

  /** Bắt đầu sửa: khoá layout. */
  lockEdit = (id: any): Observable<any> => this.put(`${this.idPath(id)}/edit-lock`);

  /** Kết thúc sửa: mở khoá layout. */
  unlockEdit = (id: any): Observable<any> => this.del(`${this.idPath(id)}/edit-lock`);

}
