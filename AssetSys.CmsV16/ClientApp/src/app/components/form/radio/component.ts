import { Component, OnInit, forwardRef, OnDestroy } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NbBaseComponent } from '../../form.base';

@Component({
    selector: 'nb-radio',
    template: `
    <nb-form-box [formCtrl]="formCtrl" [name]="name" [label]="label" [message]="message" [hint]="hint"
        [tooltip]="tooltip" [iconStart]="iconStart" [iconEnd]="iconEnd" [readonly]="readonly" [hasValidator]="hasValidator">
        <div class="d-flex mt-2">
            <div *ngFor="let option of dataSource" class="field-checkbox" style="margin-right:8px">
                <p-radioButton [inputId]="option.value" [value]="option.value" [(ngModel)]="value"></p-radioButton>
                <label [for]="option.value" style="margin-left:3px">{{ option.name }}</label>
            </div>
        </div>            
    </nb-form-box>
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => NbRadioComponent),
        },
        {
            provide: NbBaseComponent,
            multi: true,
            useExisting: forwardRef(() => NbRadioComponent)
        }
    ],
    standalone: false
})
export class NbRadioComponent extends NbBaseComponent implements OnInit, OnDestroy, ControlValueAccessor {

    constructor() {
        super();
    }

    ngOnInit() {
        super.ngOnInit();
    }

}
