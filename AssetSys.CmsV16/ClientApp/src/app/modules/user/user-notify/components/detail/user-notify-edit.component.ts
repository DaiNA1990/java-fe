import { Component, forwardRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { UserNotifyService } from '../../services/user-notify.service';

@Component({
    selector: 'app-user-notify-detail',
    templateUrl: `./user-notify-detail.component.html`,
    providers: [
        {
            provide: NbDialogBaseComponent,
            multi: true,
            useExisting: forwardRef(() => UserNotifyDetailComponent)
        }
    ]
})
export class UserNotifyDetailComponent extends NbDialogBaseComponent {

    constructor(public userNotifyService: UserNotifyService,
        private formBuilder: FormBuilder) {
        super(userNotifyService);
    }

    buildForm() {
        this.form = this.formBuilder.group({
		    id: [null, [Validators.nullValidator]],
		    userId: [null, [Validators.nullValidator]],
		    typeId: [null, [Validators.nullValidator]],
		    objectId: [null, [Validators.nullValidator]],
		    redirectId: [null, [Validators.nullValidator]],
		    name: [null, [Validators.nullValidator]],
		    description: [null, [Validators.nullValidator]],
		    isViewed: [null, [Validators.nullValidator]],
		    isShow: [null, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
