import { Component, forwardRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { InfoValueService } from '../../services/info-value.service';

@Component({
    selector: 'app-info-value-edit',
    templateUrl: `./info-value-edit.component.html`,
    providers: [
        {
            provide: NbDialogBaseComponent,
            multi: true,
            useExisting: forwardRef(() => InfoValueEditComponent)
        }
    ]
})
export class InfoValueEditComponent extends NbDialogBaseComponent {

    constructor(public service: InfoValueService,
        private fb: FormBuilder) {
        super(service);
    }

    buildForm() {
        this.form = this.fb.group({
		    id: [null, [Validators.nullValidator]],
		    dataId: [null, [Validators.nullValidator]],
		    propertyId: [null, [Validators.nullValidator]],
		    value: [null, [Validators.nullValidator]],
		    isShow: [null, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
