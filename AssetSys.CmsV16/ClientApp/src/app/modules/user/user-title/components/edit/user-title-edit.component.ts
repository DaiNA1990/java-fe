import { Component, forwardRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { UserTitleService } from '../../services/user-title.service';

@Component({
    selector: 'app-user-title-edit',
    templateUrl: `./user-title-edit.component.html`,
    providers: [
        {
            provide: NbDialogBaseComponent,
            multi: true,
            useExisting: forwardRef(() => UserTitleEditComponent)
        }
    ]
})
export class UserTitleEditComponent extends NbDialogBaseComponent {

    constructor(public userTitleService: UserTitleService,
        private formBuilder: FormBuilder) {
        super(userTitleService);
    }

    buildForm() {
        this.form = this.formBuilder.group({
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
