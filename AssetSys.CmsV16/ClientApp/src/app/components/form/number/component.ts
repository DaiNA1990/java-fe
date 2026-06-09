import { Component, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { NbBaseComponent } from '../../form.base';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
@Component({
  selector: 'nb-number',
  template: `
  <nb-form-box [formCtrl]="formCtrl" [name]="name" [label]="label" [message]="message" [hint]="hint"
    [tooltip]="tooltip" [iconStart]="iconStart" [iconEnd]="iconEnd" [readonly]="readonly" [hasValidator]="hasValidator">
    <p-inputNumber [(ngModel)]="value"> </p-inputNumber>
  </nb-form-box>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => NbNumberComponent),
    },
    {
      provide: NbBaseComponent,
      multi: true,
      useExisting: forwardRef(() => NbNumberComponent)
    }
  ]
})
export class NbNumberComponent extends NbBaseComponent implements OnInit, OnDestroy, ControlValueAccessor {

  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
