import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InfoReportSetupService } from '../../services/info-report-setup.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { ResponseCode } from '@appkkkh/core/contants/app.enum';

@Component({
    selector: 'app-info-report-setup-list',
    templateUrl: `./info-report-setup-list.component.html`,
    standalone: false
})
export class InfoReportSetupListComponent implements OnInit {
  constructor(
    public infoReportSetupService: InfoReportSetupService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService,
    private formBuilder: FormBuilder
  ) {}
  ngOnInit(): void {
  }
}
