import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';
import { Observable } from 'rxjs';

@Injectable()
export class CategoryService extends BaseService {
  constructor() {
    super();
    this.setModule('Category');
  }
  onetAPI = (data: any): Observable<any> => this.post('OnetAPI', data);
  getAssetQuantity = (data: any): Observable<any> => this.post('GetAssetQuantity', data);
}
