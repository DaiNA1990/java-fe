import { Component, forwardRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { UserCodeService } from '../../services/user-code.service';

@Component({
    selector: 'app-user-code-edit',
    templateUrl: `./user-code-edit.component.html`,
    providers: [
        {
            provide: NbDialogBaseComponent,
            multi: true,
            useExisting: forwardRef(() => UserCodeEditComponent)
        }
    ]
})
export class UserCodeEditComponent extends NbDialogBaseComponent {

    constructor(public userCodeService: UserCodeService,
        private formBuilder: FormBuilder) {
        super(userCodeService);
    }

    buildForm() {
        this.form = this.formBuilder.group({
		    id: [null, [Validators.nullValidator]],
		    typeId: [null, [Validators.nullValidator]],
		    userId: [null, [Validators.nullValidator]],
		    code: [null, [Validators.nullValidator]],
		    dateExpired: [null, [Validators.nullValidator]],
		    isShow: [null, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
