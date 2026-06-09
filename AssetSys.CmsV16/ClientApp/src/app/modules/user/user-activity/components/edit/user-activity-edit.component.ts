import { Component, forwardRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { UserActivityService } from '../../services/user-activity.service';

@Component({
    selector: 'app-user-activity-edit',
    templateUrl: `./user-activity-edit.component.html`,
    providers: [
        {
            provide: NbDialogBaseComponent,
            multi: true,
            useExisting: forwardRef(() => UserActivityEditComponent)
        }
    ]
})
export class UserActivityEditComponent extends NbDialogBaseComponent {

    constructor(public service: UserActivityService,
        private fb: FormBuilder) {
        super(service);
    }

    buildForm() {
        this.form = this.fb.group({
		    id: [null, [Validators.nullValidator]],
		    userId: [null, [Validators.nullValidator]],
		    name: [null, [Validators.nullValidator]],
		    description: [null, [Validators.nullValidator]],
		    isShow: [null, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
