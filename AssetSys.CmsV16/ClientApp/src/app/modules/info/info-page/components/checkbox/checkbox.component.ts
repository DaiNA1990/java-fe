import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { InfoFormService } from '../../services/service';
import { CategoryService } from '../../services/category-service';
import { EventDataService } from '../../services/event-service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-checkbox',
  template: `
    <p-checkbox
      [formControl]="formCtrl"
      [ngStyle]="formItem.cssStyle"
      (onChange)="onChange($event)"
      [binary]="true"
    ></p-checkbox>
  `,
})

export class InfoPageCheckboxComponent implements OnInit, OnDestroy {
  @Input() formCtrl: FormControl;
  @Input() formItem: any;
  @Input() readOnly: any;

  items: any[] = [];

  subscriptions: Subscription[] = [];

  constructor(
    public service: InfoFormService,
    public categoryService: CategoryService,
    private events: EventDataService,
    private cdr: ChangeDetectorRef
  ) {}

  onChange(e: any) {
    if (
      this.formItem.action === undefined ||
      this.formItem.action === null ||
      this.formItem.action === ''
    )
      return;
    try {
      for (const action of JSON.parse(this.formItem.action).rules.filter(
        (c: any) => c.action === 'SELECT_ON_CHANGE'
      )) {
        if (
          (action.event == 'FORM_BIND_VALUE' ||
            action.event == 'FORM_SET_VALUE') &&
          !e.originalEvent &&
          (action.data == null || action.data != 'ANYTIME')
        ) {
          continue;
        }
        setTimeout(
          () =>
            this.events.emit({
              action: action,
              // value: _item,
              originalEvent: e.originalEvent,
            }),
          300
        );
      }
    } catch (ex) {
      console.log(ex);
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((el) => el.unsubscribe());
  }

  ngOnInit(): void {
    // throw new Error('Method not implemented.');
    if (this.formItem.isReadOnly || this.readOnly) this.formCtrl.disable();
  }
}
