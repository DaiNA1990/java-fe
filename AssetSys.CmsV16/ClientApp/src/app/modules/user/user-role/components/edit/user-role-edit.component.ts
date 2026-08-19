import { Component, forwardRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { UserRoleService } from '../../services/user-role.service';

@Component({
    selector: 'app-user-role-edit',
    templateUrl: `./user-role-edit.component.html`,
    providers: [
        {
            provide: NbDialogBaseComponent,
            multi: true,
            useExisting: forwardRef(() => UserRoleEditComponent)
        }
    ]
})
export class UserRoleEditComponent extends NbDialogBaseComponent {

    constructor(public userRoleService: UserRoleService,
        private formBuilder: FormBuilder) {
        super(userRoleService);
    }

    buildForm() {
        this.form = this.formBuilder.group({
		    id: [null, [Validators.nullValidator]],
		    name: [null, [Validators.nullValidator]],
		    code: [null, [Validators.nullValidator]],
		    displayOrder: [null, [Validators.nullValidator]],
		    description: [null, [Validators.nullValidator]],
		    isShow: [null, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
