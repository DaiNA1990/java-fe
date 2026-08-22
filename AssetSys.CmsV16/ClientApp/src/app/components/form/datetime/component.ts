import { Component, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { NbBaseComponent } from '../../form.base';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DatePipe } from '@angular/common';

@Component({
    selector: 'nb-datetime',
    template: `
  <nb-form-box [formCtrl]="formCtrl" [name]="name" [label]="label" [message]="message" [hint]="hint"
    [tooltip]="tooltip" [iconStart]="iconStart" [iconEnd]="iconEnd" [readonly]="readonly" [hasValidator]="hasValidator">
    <p-calendar [placeholder]="placeholder" 
      dateFormat="dd/mm/yy"
      [iconDisplay]="'input'" 
      [showIcon]="true" 
      [showTime]="true"
      [(ngModel)]="value" />
  </nb-form-box>
  `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => NbDatetimeComponent),
        },
        {
            provide: NbBaseComponent,
            multi: true,
            useExisting: forwardRef(() => NbDatetimeComponent)
        },
        DatePipe
    ],
    standalone: false
})
export class NbDatetimeComponent extends NbBaseComponent implements OnInit, OnDestroy, ControlValueAccessor {

  constructor(private datePipe: DatePipe) {
    super();
  }

  setValueControl(val: any){
		this.formCtrl.setValue(val !== null ? this.datePipe.transform(val, 'yyyy-MM-dd HH:mm:ss') : val);
	}

  ngOnInit() {
    super.ngOnInit();
  }

}
