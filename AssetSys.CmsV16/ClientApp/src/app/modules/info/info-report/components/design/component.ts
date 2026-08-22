import {
  ChangeDetectorRef,
  Component,
  Input,
  OnInit,
  ViewChild,
} from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InfoReportSetupService } from '../../../info-report-setup/services/info-report-setup.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InfoFormReportSetupComponent } from '../report-setup/subs/component';
import { InfoFormReportComponent } from '../report-setup/component';

@Component({
    selector: 'app-info-report-design',
    templateUrl: `./component.html`,
    styles: [
        `
      .cdk-drag-animating {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
      }

      .cdk-drop-list-dragging {
        transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);

        .cdk-drag:not(.cdk-drag-placeholder) {
          transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
        }
      }

      .cdk-drag-preview {
        box-sizing: border-box;
        border-radius: 4px;
        box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2),
          0 8px 10px 1px rgba(0, 0, 0, 0.14), 0 3px 14px 2px rgba(0, 0, 0, 0.12);
        overflow: hidden;
      }

      .cdk-drag-placeholder {
        background-color: rgba(150, 150, 200, 0.1);
        border: 1px dashed #abc;
        padding: 5px;
      }
    `,
    ],
    providers: [ConfirmationService, MessageService],
    standalone: false
})
export class InfoReportDesignComponent implements OnInit {
  @Input() reportId: number | null;

  @ViewChild(InfoFormReportSetupComponent, { static: false })
  reportSetupChild: InfoFormReportSetupComponent;
  @ViewChild(InfoFormReportComponent, { static: false })
  repotSetup: InfoFormReportComponent;

  item: any;

  reportSetup: any;

  formControl: FormGroup;

  itemChosen(item: any) {
    this.reportSetupChild.itemChosen(item);
  }

  itemSave(item: any) {
    this.repotSetup.itemSave(item);
  }

  constructor(
    public infoReportSetupService: InfoReportSetupService,
    private confirmationService: ConfirmationService,
    private messageService: MessageService,
    private changeDetectorRef: ChangeDetectorRef,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {}
}
