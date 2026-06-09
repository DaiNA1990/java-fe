import { Component, forwardRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { UserLevelService } from '../../services/user-level.service';

@Component({
    selector: 'app-user-level-edit',
    templateUrl: `./user-level-edit.component.html`,
    providers: [
        {
            provide: NbDialogBaseComponent,
            multi: true,
            useExisting: forwardRef(() => UserLevelEditComponent)
        }
    ]
})
export class UserLevelEditComponent extends NbDialogBaseComponent {

    constructor(public service: UserLevelService,
        private fb: FormBuilder) {
        super(service);
    }

    buildForm() {
        this.form = this.fb.group({
		    id: [null, [Validators.nullValidator]],
		    name: [null, [Validators.nullValidator]],
		    code: [null, [Validators.nullValidator]],
		    groupName: [null, [Validators.nullValidator]],
		    groupCode: [null, [Validators.nullValidator]],
		    summary: [null, [Validators.nullValidator]],
		    detail: [null, [Validators.nullValidator]],
		    isShow: [null, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
