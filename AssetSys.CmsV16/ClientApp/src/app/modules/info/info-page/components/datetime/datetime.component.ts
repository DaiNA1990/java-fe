import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { InfoFormService } from '../../services/info-form.service';
import { FormControl } from '@angular/forms';
import { dateUtil } from '../../components/date-util';
import dayjs from 'dayjs';
import { Subscription } from 'rxjs';
import { evaluateExpression } from '../expression-utils';

@Component({
    selector: 'app-info-page-datetime',
    template: `
        <p-calendar [formControl]="formCtrl"
            [placeholder]="formItem.placeholder || ''"
            dateFormat="dd/mm/yy"
            [readonlyInput]="true"
            [minDate]="min"
            [maxDate]="max"
            (onSelect)="onSelect($event)"
            [appendTo]="'body'" />
    `,
})
export class InfoPageDatetimeComponent implements OnDestroy, OnInit {

    @Input() formCtrl: FormControl;
    @Input() formItem: any;
    @Input() readOnly: any;

    min: Date;
    max: Date;

    subscriptions: Subscription[] = [];

    constructor(public infoFormService: InfoFormService,
        private changeDetectorRef: ChangeDetectorRef) { }

    onSelect(e: any) {
        this.formCtrl.setValue(dayjs(e).toISOString(), { emitEvent: false, emitModelToViewChange: false });
    }

    init() {

        try {
            if (this.formItem.isReadOnly || this.readOnly)
                this.formCtrl.disable();

            if (this.formItem.expressionValidate === null || this.formItem.expressionValidate === '')
                return;

            const expression = JSON.parse(this.formItem.expressionValidate);

            const _minValue = expression.find((c: any) => c.enable && c.code === 'min')?.value || null;
            const _maxValue = expression.find((c: any) => c.enable && c.code === 'max')?.value || null;

            if (_minValue !== null) {
                if (_minValue.indexOf('Date') > -1) {
                    this.min = evaluateExpression(_minValue);
                } else {
                    this.min = new Date(_minValue) || undefined;
                }
            }

            if (_maxValue !== null) {
                if (_maxValue.indexOf('Date') > -1) {
                    this.max = evaluateExpression(_maxValue);
                } else {
                    this.max = new Date(_maxValue) || undefined;
                }
            }

        } catch (ex) {
            console.log(ex);
        }
    }

    setValue() {
      if (this.formCtrl.value != null && typeof this.formCtrl.value === 'string') {
          const _date = dateUtil.parseDate(this.formCtrl.value);
          this.formCtrl.setValue(_date);
      }
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(el => el.unsubscribe());
    }

    ngOnInit(): void {

        this.setValue();

        this.subscriptions.push(this.formCtrl.valueChanges.subscribe((value: any) => this.setValue()));

        this.init();
    }
}
