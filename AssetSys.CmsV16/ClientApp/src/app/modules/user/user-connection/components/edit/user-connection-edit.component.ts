import { Component, forwardRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { UserConnectionService } from '../../services/user-connection.service';

@Component({
    selector: 'app-user-connection-edit',
    templateUrl: `./user-connection-edit.component.html`,
    providers: [
        {
            provide: NbDialogBaseComponent,
            multi: true,
            useExisting: forwardRef(() => UserConnectionEditComponent)
        }
    ],
    standalone: false
})
export class UserConnectionEditComponent extends NbDialogBaseComponent {

    constructor(public userConnectionService: UserConnectionService,
        private formBuilder: FormBuilder) {
        super(userConnectionService);
    }

    buildForm() {
        this.form = this.formBuilder.group({
		    id: [null, [Validators.nullValidator]],
		    typeId: [null, [Validators.nullValidator]],
		    userId: [null, [Validators.nullValidator]],
		    code: [null, [Validators.nullValidator]],
		    device: [null, [Validators.nullValidator]],
		    isShow: [null, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
