import { Component, forwardRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { UserDepartmentService } from '../../services/user-department.service';

@Component({
    selector: 'app-user-department-edit',
    templateUrl: `./user-department-edit.component.html`,
    providers: [
        {
            provide: NbDialogBaseComponent,
            multi: true,
            useExisting: forwardRef(() => UserDepartmentEditComponent)
        }
    ]
})
export class UserDepartmentEditComponent extends NbDialogBaseComponent {

    constructor(public service: UserDepartmentService,
        private fb: FormBuilder) {
        super(service);
    }

    buildForm() {
        this.form = this.fb.group({
		    id: [null, [Validators.nullValidator]],
		    typeId: [null, [Validators.nullValidator]],
		    name: [null, [Validators.nullValidator]],
		    code: [null, [Validators.nullValidator]],
		    codeSecond: [null, [Validators.nullValidator]],
		    parentId: [null, [Validators.nullValidator]],
		    displayOrder: [null, [Validators.nullValidator]],
		    description: [null, [Validators.nullValidator]],
		    isShow: [null, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
