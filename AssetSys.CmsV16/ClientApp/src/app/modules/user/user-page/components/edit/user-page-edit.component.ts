import { Component, forwardRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { UserPageService } from '../../services/user-page.service';

@Component({
    selector: 'app-user-page-edit',
    templateUrl: `./user-page-edit.component.html`,
    providers: [
        {
            provide: NbDialogBaseComponent,
            multi: true,
            useExisting: forwardRef(() => UserPageEditComponent)
        }
    ]
})
export class UserPageEditComponent extends NbDialogBaseComponent {

    constructor(public service: UserPageService,
        private fb: FormBuilder) {
        super(service);
    }

    buildForm() {
        this.form = this.fb.group({
		    id: [null, [Validators.nullValidator]],
		    parentId: [null, [Validators.nullValidator]],
		    name: [null, [Validators.required]],
		    code: [null, [Validators.required]],
		    displayOrder: [null, [Validators.nullValidator]],
		    description: [null, [Validators.nullValidator]],
		    isShow: [false, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
