import { Component, OnInit, Input, forwardRef, OnDestroy, TemplateRef } from '@angular/core';
import { NG_VALUE_ACCESSOR, ControlValueAccessor } from '@angular/forms';
import { NbBaseComponent } from '../../form.base';
import { DropdownFilterEvent } from 'primeng/dropdown';

@Component({
    selector: 'nb-select',
    template: `
    <nb-form-box [formCtrl]="formCtrl" [name]="name" [label]="label" [message]="message" [hint]="hint"
      [tooltip]="tooltip" [iconStart]="iconStart" [iconEnd]="iconEnd" [readonly]="readonly" [hasValidator]="hasValidator">
      <p-dropdown [options]="items"
        [(ngModel)]="value"
        [placeholder]="placeholder"
        [showClear]="true"
        [editable]="isEdit"
        [filter]="isFilter"
        [group]="isGroup"
        [optionLabel]="fieldText"
        [optionValue]="fieldValue"
        (onFilter)="onFilter($event)">
        @if (isGroup; as group) {
          <ng-template let-group pTemplate="group">
            <span>{{ group[fieldText] }}</span>
          </ng-template>
        }
      </p-dropdown>
    </nb-form-box>
    `,
    styles: [`
    ::ng-deep {
        .p-dropdown-items {
            margin: 0;
            padding-left: 0;
        }
    }
    `],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => NbSelectComponent),
        },
        {
            provide: NbBaseComponent,
            multi: true,
            useExisting: forwardRef(() => NbSelectComponent)
        }
    ],
    standalone: false
})
export class NbSelectComponent extends NbBaseComponent implements OnInit, OnDestroy, ControlValueAccessor {

    @Input() fieldValue: string = 'value';
    @Input() fieldText: string = 'text';
    @Input() isEdit: boolean = false;
    @Input() isFilter: boolean = false;
    @Input() isGroup: boolean = false;
    @Input() optionTemplate: TemplateRef<any>;

    constructor() {
        super();
    }

    async onFilter(e: DropdownFilterEvent){
        super.getData(e.filter);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }

}
