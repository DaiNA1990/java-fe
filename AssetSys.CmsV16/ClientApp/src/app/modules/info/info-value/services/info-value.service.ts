import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';
import { AppCons } from '@appkkkh/core/contants/app.cons';

@Injectable({
  providedIn: 'root'
})
export class InfoValueService extends BaseService {
  constructor() {
    super();
    this.setResource(AppCons.API_BASE.BUDGET_PLAN, 'info-values');
  }

}
