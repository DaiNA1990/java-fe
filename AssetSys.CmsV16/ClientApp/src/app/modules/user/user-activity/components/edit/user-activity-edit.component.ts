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
    ],
    standalone: false
})
export class UserActivityEditComponent extends NbDialogBaseComponent {

    constructor(public userActivityService: UserActivityService,
        private formBuilder: FormBuilder) {
        super(userActivityService);
    }

    buildForm() {
        this.form = this.formBuilder.group({
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
