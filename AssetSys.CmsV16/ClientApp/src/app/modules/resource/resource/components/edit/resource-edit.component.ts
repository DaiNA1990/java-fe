import { Component, forwardRef, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { ResourceInfoService } from '../../services/resource.service';

@Component({
    selector: 'app-resource-edit',
    templateUrl: `./resource-edit.component.html`,
    providers: [
        {
            provide: NbDialogBaseComponent,
            multi: true,
            useExisting: forwardRef(() => ResourceInfoEditComponent)
        }
    ]
})
export class ResourceInfoEditComponent extends NbDialogBaseComponent {

    @Input() parentCode: string;

    constructor(public resourceInfoService: ResourceInfoService,
        private formBuilder: FormBuilder) {
        super(resourceInfoService);
    }

    buildForm() {
        this.form = this.formBuilder.group({
		    id: [null, [Validators.nullValidator]],
		    parentCode: [this.parentCode, [Validators.nullValidator]],
		    code: [null, [Validators.required]],
		    name: [null, [Validators.required]],
		    value: [null, [Validators.nullValidator]],
		    nameAscii: [null, [Validators.nullValidator]],
            displayOrder: [null, [Validators.nullValidator]],
            summary: [null, [Validators.nullValidator]],
		    detail: [null, [Validators.nullValidator]],
		    isShow: [true, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
