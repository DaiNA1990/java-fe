import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';
import { AppCons } from '@appkkkh/core/contants/app.cons';
import { Observable } from 'rxjs';

/**
 * InfoData không có nhóm CRUD chung (GET danh sách, autocomplete, onOff).
 * Dùng search/count, getByIdByGroup, save; delete dùng của BaseService
 * (DELETE {id}?layoutCode=&controlId=).
 */
@Injectable({
  providedIn: 'root'
})
export class InfoDataService extends BaseService {
  constructor() {
    super();
    this.setResource(AppCons.API_BASE.BUDGET_PLAN, 'info-data');
  }

  search = (data: any): Observable<any> => this.post('search', data);

  count = (data: any): Observable<any> => this.post('count', data);

  getByIdByGroup = (data: any): Observable<any> => {
    const { id, ...params } = data ?? {};
    return this.get(this.idPath(id), params);
  }

  /** Không có id: thêm mới (POST). Có id: cập nhật (PUT /{id}). */
  save = (data: any): Observable<any> => this.addOrEdit(data);

  /** id lên path, body còn controlId. */
  collection = (data: any): Observable<any> => {
    const { id, ...body } = data ?? {};
    return this.post(`${this.idPath(id)}/collection`, body);
  }

  exportExcel = (data: any): Observable<any> => this.post('export', data, { responseType: 'blob', observe: 'response' });

  importExcel = (data: any): Observable<any> => this.post('import', data);
}
