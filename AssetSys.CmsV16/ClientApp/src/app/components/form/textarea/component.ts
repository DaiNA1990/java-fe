import { Component, OnInit, OnDestroy, forwardRef } from '@angular/core';
import { NbBaseComponent } from '../../form.base';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
    selector: 'nb-textarea',
    template: `
  <nb-form-box [formCtrl]="formCtrl" [name]="name" [label]="label" [message]="message" [hint]="hint"
    [tooltip]="tooltip" [iconStart]="iconStart" [iconEnd]="iconEnd" [readonly]="readonly" [hasValidator]="hasValidator">
    <textarea rows="5" cols="30" pTextarea [(ngModel)]="value" [autoResize]="false"></textarea>
  </nb-form-box>
  `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => NbTextareaComponent),
        },
        {
            provide: NbBaseComponent,
            multi: true,
            useExisting: forwardRef(() => NbTextareaComponent)
        }
    ],
    standalone: false
})
export class NbTextareaComponent extends NbBaseComponent implements OnInit, OnDestroy, ControlValueAccessor {

  constructor() {
    super();
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
