import { Component, forwardRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { InfoDataService } from '../../services/info-data.service';

@Component({
    selector: 'app-info-data-edit',
    templateUrl: `./info-data-edit.component.html`,
    providers: [
        {
            provide: NbDialogBaseComponent,
            multi: true,
            useExisting: forwardRef(() => InfoDataEditComponent)
        }
    ]
})
export class InfoDataEditComponent extends NbDialogBaseComponent {

    constructor(public infoDataService: InfoDataService,
        private formBuilder: FormBuilder) {
        super(infoDataService);
    }

    buildForm() {
        this.form = this.formBuilder.group({
		    id: [null, [Validators.nullValidator]],
		    groupId: [null, [Validators.nullValidator]],
		    isShow: [null, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
