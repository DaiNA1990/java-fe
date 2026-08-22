import { Component, forwardRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { UserNotifyService } from '../../services/user-notify.service';
import { UserService } from '@appkkkh/modules/user/user/services/user.service';

@Component({
    selector: 'app-user-notify-edit',
    templateUrl: `./user-notify-edit.component.html`,
    providers: [
        {
            provide: NbDialogBaseComponent,
            multi: true,
            useExisting: forwardRef(() => UserNotifyEditComponent)
        }
    ],
    standalone: false
})
export class UserNotifyEditComponent extends NbDialogBaseComponent {

    userDS = (keyword: any) => this.userService.autocomplete({ keyword: keyword });

    constructor(public userNotifyService: UserNotifyService,
        public userService: UserService,
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
