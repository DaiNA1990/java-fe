import { Component, forwardRef, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { UserPageActionService } from '../../services/user-page-action.service';

@Component({
    selector: 'app-user-page-action-edit',
    templateUrl: `./user-page-action-edit.component.html`,
    providers: [
        {
            provide: NbDialogBaseComponent,
            multi: true,
            useExisting: forwardRef(() => UserPageActionEditComponent)
        }
    ]
})
export class UserPageActionEditComponent extends NbDialogBaseComponent {

    @Input() pageId: number;

    constructor(public service: UserPageActionService,
        private fb: FormBuilder) {
        super(service);
    }

    buildForm() {
        this.form = this.fb.group({
		    id: [null, [Validators.nullValidator]],
		    pageId: [null, [Validators.nullValidator]],
		    name: [null, [Validators.nullValidator]],
		    code: [null, [Validators.nullValidator]],
		    isShow: [null, [Validators.nullValidator]],
        });
    }

    onShow(): void {
        this.form.patchValue({
            pageId: this.pageId 
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
