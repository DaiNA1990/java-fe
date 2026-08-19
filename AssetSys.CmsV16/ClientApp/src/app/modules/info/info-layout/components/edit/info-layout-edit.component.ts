import { Component, forwardRef, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { InfoLayoutService } from '../../services/info-layout.service';

@Component({
    selector: 'app-info-layout-edit',
    templateUrl: `./info-layout-edit.component.html`,
    providers: [
        {
            provide: NbDialogBaseComponent,
            multi: true,
            useExisting: forwardRef(() => InfoLayoutEditComponent)
        }
    ]
})
export class InfoLayoutEditComponent extends NbDialogBaseComponent {
    
    @Input() groupId: number | null;

    typeLayout = [
        {
            value: 1,
            text: 'Form'
        },
        {
            value: 2,
            text: 'Bảng'
        }
    ]

    constructor(public infoLayoutService: InfoLayoutService,
        private formBuilder: FormBuilder) {
        super(infoLayoutService);
    }

    buildForm() {
        this.form = this.formBuilder.group({
		    id: [null, [Validators.nullValidator]],
		    groupId: [this.groupId, [Validators.nullValidator]],
		    typeId: [null, [Validators.nullValidator]],
		    name: [null, [Validators.required]],
		    code: [null, [Validators.required]],
		    description: [null, [Validators.nullValidator]],
		    isShow: [null, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
