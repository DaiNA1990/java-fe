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
    ],
    standalone: false
})
export class InfoReportSetupEditComponent extends NbDialogBaseComponent {

    @Input() reportId:any;

    constructor(public infoReportSetupService: InfoReportSetupService,
        private formBuilder: FormBuilder) {
        super(infoReportSetupService);
    }

    buildForm() {
        this.form = this.formBuilder.group({
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
