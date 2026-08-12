import { Injectable } from '@angular/core';
import { BaseService } from '@appkkkh/core/base/base.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class InfoLayoutService extends BaseService {
  constructor() {
    super();
    this.setModule('InfoLayout');
  }

}
