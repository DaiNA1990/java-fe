import { Component, forwardRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { InfoReportService } from '../../services/info-report.service';

@Component({
    selector: 'app-info-report-edit',
    templateUrl: `./info-report-edit.component.html`,
    providers: [
        {
            provide: NbDialogBaseComponent,
            multi: true,
            useExisting: forwardRef(() => InfoReportEditComponent)
        }
    ],
    standalone: false
})
export class InfoReportEditComponent extends NbDialogBaseComponent {

    constructor(public infoReportService: InfoReportService,
        private formBuilder: FormBuilder) {
        super(infoReportService);
    }

    buildForm() {
        this.form = this.formBuilder.group({
		    id: [null, [Validators.nullValidator]],
		    name: [null, [Validators.required]],
		    code: [null, [Validators.required]],
        linkTemp: [null, [Validators.nullValidator]],
		    description: [null, [Validators.nullValidator]],
		    isShow: [null, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
