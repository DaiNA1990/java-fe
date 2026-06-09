import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InfoReportService } from '../../services/info-report.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { InfoReportBuildReportComponent } from '../build-report/build-report.component';
import { AuthService } from '@appkkkh/modules/user/auth';

@Component({
  selector: 'app-info-report-list',
  templateUrl: `./info-report-list.component.html`,
})
export class InfoReportListComponent implements OnInit {
  formFilter: FormGroup;

  groupId: number | null = null;
  currentUser: any;
  @ViewChild(InfoReportBuildReportComponent)
    buildReportModal: InfoReportBuildReportComponent;

  constructor(
    public service: InfoReportService,
    public messageService: MessageService,
    public confirmationService: ConfirmationService,
    private auth: AuthService,
    private fb: FormBuilder
  ) {}

  openBuildReport(item: any) {
    this.buildReportModal.open(item);
  }

  init() {
    this.formFilter = this.fb.group({});
  }
  async ngOnInit(): Promise<void> {
    this.init();
    if (this.currentUser !== null) this.currentUser = null;
    this.currentUser = await firstValueFrom(this.auth.currentUserSubject);
  }
}
