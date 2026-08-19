import { Component, forwardRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { InfoGroupService } from '../../services/info-group.service';

@Component({
  selector: 'app-info-group-edit',
  templateUrl: `./info-group-edit.component.html`,
  providers: [
    {
      provide: NbDialogBaseComponent,
      multi: true,
      useExisting: forwardRef(() => InfoGroupEditComponent),
    },
  ],
})
export class InfoGroupEditComponent extends NbDialogBaseComponent {
  constructor(public infoGroupService: InfoGroupService, private formBuilder: FormBuilder) {
    super(infoGroupService);
  }
  modules = [
        {
            value: 'KH',
            text: 'Kế hoạch mua sắm'
        },
        {
            value: 'KK',
            text: 'Kiểm kê'
        },
        {
            value: 'TKKH',
            text: 'Triển khai kế hoạch'
        },
        {
            value: 'RPT',
            text: 'Báo cáo'
        }
    ]
  buildForm() {
    this.form = this.formBuilder.group({
      id: [null, [Validators.nullValidator]],
      name: [null, [Validators.required]],
      code: [null, [Validators.required]],
      description: [null, [Validators.nullValidator]],
      parentId: [null, [Validators.nullValidator]],
      isShow: [null, [Validators.nullValidator]],
      pathCode: [null, [Validators.nullValidator]],
      module: [null, [Validators.nullValidator]],
    });
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
