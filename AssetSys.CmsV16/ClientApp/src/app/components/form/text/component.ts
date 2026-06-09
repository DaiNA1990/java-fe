import { Component, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NbBaseComponent } from '../../form.base';

@Component({
  selector: 'nb-text',
  template: `
  <nb-form-box [formCtrl]="formCtrl" [name]="name" [label]="label" [message]="message" [hint]="hint"
    [tooltip]="tooltip" [iconStart]="iconStart" [iconEnd]="iconEnd" [readonly]="readonly" [hasValidator]="hasValidator">
    <input type="text" [(ngModel)]="value" [readonly]="readonly" [disabled]="disabled"  pInputText [placeholder]="placeholder" (keyup)="changeFn($event)" />
  </nb-form-box>
  `,
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => NbTextComponent),
    },
    {
      provide: NbBaseComponent,
      multi: true,
      useExisting: forwardRef(() => NbTextComponent)
    }
  ]
})
export class NbTextComponent extends NbBaseComponent implements OnInit, OnDestroy, ControlValueAccessor {

  constructor() {
    super();
  }

  changeFn(e: any) {
    this.onChange.emit(e.target.value);
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
