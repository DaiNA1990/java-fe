import { Component, forwardRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { UserRolePageActionMapService } from '../../services/user-role-page-action-map.service';

@Component({
    selector: 'app-user-role-page-action-map-edit',
    templateUrl: `./user-role-page-action-map-edit.component.html`,
    providers: [
        {
            provide: NbDialogBaseComponent,
            multi: true,
            useExisting: forwardRef(() => UserRolePageActionMapEditComponent)
        }
    ]
})
export class UserRolePageActionMapEditComponent extends NbDialogBaseComponent {

    constructor(public userRolePageActionMapService: UserRolePageActionMapService,
        private formBuilder: FormBuilder) {
        super(userRolePageActionMapService);
    }

    buildForm() {
        this.form = this.formBuilder.group({
		    id: [null, [Validators.nullValidator]],
		    roleId: [null, [Validators.nullValidator]],
		    pageActionId: [null, [Validators.nullValidator]],
		    displayOrder: [null, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
