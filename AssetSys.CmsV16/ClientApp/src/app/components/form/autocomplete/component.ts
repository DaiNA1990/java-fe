import { Component, OnInit, OnDestroy, Input, forwardRef, TemplateRef, Output, EventEmitter } from '@angular/core';
import { NbBaseComponent } from '../../form.base';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

interface AutoCompleteCompleteEvent {
  originalEvent: Event;
  query: string;
}

@Component({
  selector: 'nb-autocomplete',
  template: `
  <nb-form-box [formCtrl]="formCtrl" [name]="name" [label]="label" [message]="message" [hint]="hint"
    [tooltip]="tooltip" [iconStart]="iconStart" [iconEnd]="iconEnd" [readonly]="readonly" [hasValidator]="hasValidator">
    <p-autoComplete [(ngModel)]="value" 
      [placeholder]="placeholder" 
      [suggestions]="filteredItems"
      (completeMethod)="filterItems($event)" 
      (onSelect)="onSelect($event)" 
      [dropdown]="isDropdown"
      [showClear]="isShowClear"
      [optionLabel]="fieldText" 
      [optionValue]="fieldValue">
    </p-autoComplete>
  </nb-form-box>
  `,
  styles: [`
  ::ng-deep {
      .p-autocomplete-items {
          margin: 0;
          padding-left: 0;
      }
  }
  `],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => NbAutocompleteComponent),
    },
    {
      provide: NbBaseComponent,
      multi: true,
      useExisting: forwardRef(() => NbAutocompleteComponent)
    }
  ]
})
export class NbAutocompleteComponent extends NbBaseComponent implements OnInit, OnDestroy, ControlValueAccessor {

  @Input() fieldValue: string = 'value';
  @Input() fieldText: string = 'text';
  @Input() isValueText: boolean = false;
  @Input() isDropdown: boolean = true;
  @Input() isShowClear: boolean = true;
  @Input() optionTemplate: TemplateRef<any>;
  @Output() onTextChange: EventEmitter<any> = new EventEmitter<any>();

  filteredItems: any[];

  constructor() {
    super();
  }

  filterItems(event: AutoCompleteCompleteEvent) {

    let filtered: any[] = [];
    let query = event.query;

    for (let i = 0; i < (this.items as any[]).length; i++) {
      let item = (this.items as any[])[i];
      if (item[this.fieldText].toLowerCase().indexOf(query.toLowerCase()) == 0) {
        filtered.push(item);
      }
    }

    this.filteredItems = filtered;
  }

  onSelect(event: any): void {
    this.value = event.value[this.fieldValue];
    this.onChange.emit({
      value: this.value,
      item: event.value.value
    });
  }

  onComplete(event: AutoCompleteCompleteEvent) {
    this.getData();
  }

  ngOnInit() {
    super.ngOnInit();
  }

}
