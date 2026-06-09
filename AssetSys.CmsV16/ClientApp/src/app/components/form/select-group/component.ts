import { Component, OnInit, Input, forwardRef, OnDestroy, TemplateRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NbBaseComponent } from '../../form.base';

@Component({
    selector: 'nb-select-group',
    template: `
    <nb-form-box [formCtrl]="formCtrl" [name]="name" [label]="label" [message]="message" [hint]="hint"
        [tooltip]="tooltip" [iconStart]="iconStart" [iconEnd]="iconEnd" [readonly]="readonly" [hasValidator]="hasValidator">
        <p-cascadeSelect [(ngModel)]="value"  
            [options]="items"									
            [optionLabel]="fieldText" 
            [optionValue]="fieldValue" 
            [optionGroupLabel]="fieldText"									
            [optionGroupChildren]="['childs']" 
            [placeholder]="placeholder" />
    </nb-form-box>
    `,
    styles: [`
    ::ng-deep {
        .p-cascadeselect-panel {
            margin: 0;
            padding-left: 0;
        }
    }
    `],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => NbSelectGroupComponent),
        },
        {
            provide: NbBaseComponent,
            multi: true,
            useExisting: forwardRef(() => NbSelectGroupComponent)
        }
    ]
})
export class NbSelectGroupComponent extends NbBaseComponent implements OnInit, OnDestroy, ControlValueAccessor {

    @Input() fieldValue: string = 'value';
    @Input() fieldText: string = 'text';
    @Input() optionTemplate: TemplateRef<any>;

    constructor() {
        super();
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

}
