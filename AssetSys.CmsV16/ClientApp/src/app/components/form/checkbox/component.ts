import { Component, OnInit, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NbBaseComponent } from '../../form.base';

@Component({
    selector: 'nb-checkbox',
    template: `
  <nb-form-box [formCtrl]="formCtrl" [name]="name" [label]="label" [message]="message" [hint]="hint"
    [tooltip]="tooltip" [iconStart]="iconStart" [iconEnd]="iconEnd" [readonly]="readonly" [hasValidator]="hasValidator">
    <label class="form-check form-check-custom form-check-solid mt-2">
        <input class="form-check-input" type="checkbox" [(ngModel)]="value" />
        <span class="form-check-label" *ngIf="placeholder !== ''">{{placeholder}}</span>
    </label>
  </nb-form-box>
  `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => NbCheckboxComponent),
        },
        {
            provide: NbBaseComponent,
            multi: true,
            useExisting: forwardRef(() => NbCheckboxComponent)
        }
    ],
    standalone: false
})
export class NbCheckboxComponent extends NbBaseComponent implements OnInit, ControlValueAccessor {
  
  constructor() {
    super();
  }
}
