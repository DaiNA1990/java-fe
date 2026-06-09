import { Component, OnInit, Input, forwardRef, OnDestroy, TemplateRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NbBaseComponent } from '../../form.base';

@Component({
    selector: 'nb-select-tree',
    template: `
    <nb-form-box [formCtrl]="formCtrl" [name]="name" [label]="label" [message]="message" [hint]="hint"
        [tooltip]="tooltip" [iconStart]="iconStart" [iconEnd]="iconEnd" [readonly]="readonly" [hasValidator]="hasValidator">
        <p-treeSelect [(ngModel)]="value" 
            [options]="items" 
            [selectionMode]="'single'"
            [placeholder]="placeholder" />
    </nb-form-box>
    `,
    styles: [`
    ::ng-deep {
        ul {
            margin: 0;
            padding-left: 0;
        }
    }
    `],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => NbSelectTreeComponent),
        },
        {
            provide: NbBaseComponent,
            multi: true,
            useExisting: forwardRef(() => NbSelectTreeComponent)
        }
    ]
})
export class NbSelectTreeComponent extends NbBaseComponent implements OnInit, OnDestroy, ControlValueAccessor {

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
