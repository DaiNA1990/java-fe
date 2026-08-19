import { Component, forwardRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { UserRoleMapService } from '../../services/user-role-map.service';

@Component({
    selector: 'app-user-role-map-edit',
    templateUrl: `./user-role-map-edit.component.html`,
    providers: [
        {
            provide: NbDialogBaseComponent,
            multi: true,
            useExisting: forwardRef(() => UserRoleMapEditComponent)
        }
    ]
})
export class UserRoleMapEditComponent extends NbDialogBaseComponent {

    constructor(public userRoleMapService: UserRoleMapService,
        private formBuilder: FormBuilder) {
        super(userRoleMapService);
    }

    buildForm() {
        this.form = this.formBuilder.group({
		    id: [null, [Validators.nullValidator]],
		    userId: [null, [Validators.nullValidator]],
		    roleId: [null, [Validators.nullValidator]],
		    displayOrder: [null, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
