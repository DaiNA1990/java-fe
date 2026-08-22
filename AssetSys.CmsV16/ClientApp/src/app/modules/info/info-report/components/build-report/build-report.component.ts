import { ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { InfoReportService } from '../../services/info-report.service';

@Component({
    selector: 'app-info-report-build-report',
    templateUrl: `./build-report.component.html`,
    standalone: false
})
export class InfoReportBuildReportComponent {

    report: any = null;

    isVisible: boolean = false;

    constructor(public infoReportService: InfoReportService,
        private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder) {
    }

    open(report: any) {
        this.report = report;
        this.isVisible = true;
    }

    close() {
        this.isVisible = false;
    }

    onHiden() {
        this.report = null;
    }

    ngOnInit(): void {

    }
}
