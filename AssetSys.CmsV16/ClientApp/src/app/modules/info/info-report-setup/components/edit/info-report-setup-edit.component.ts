import { Component, forwardRef ,Input} from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { InfoReportSetupService } from '../../services/info-report-setup.service';

@Component({
    selector: 'app-info-report-setup-edit',
    templateUrl: `./info-report-setup-edit.component.html`,
    providers: [
        {
            provide: NbDialogBaseComponent,
            multi: true,
            useExisting: forwardRef(() => InfoReportSetupEditComponent)
        }
    ]
})
export class InfoReportSetupEditComponent extends NbDialogBaseComponent {

    @Input() reportId:any;

    constructor(public service: InfoReportSetupService,
        private fb: FormBuilder) {
        super(service);
    }

    buildForm() {
        this.form = this.fb.group({
		    id: [null, [Validators.nullValidator]],
        reportId: [this.reportId, [Validators.nullValidator]],
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
