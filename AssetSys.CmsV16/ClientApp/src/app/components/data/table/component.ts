import { Component, ContentChild, ContentChildren, EventEmitter, Input, OnDestroy, OnInit, Output, QueryList, TemplateRef } from '@angular/core';
import { NbTableColumnComponent } from './col';
import { DatePipe } from '@angular/common';
import op from 'object-path';

@Component({
  selector: 'nb-table',
  templateUrl: './component.html',
  styles: [`
  ::ng-deep {
    .p-datatable .p-datatable-tbody > tr > td {
      border: 1px dashed #f1f1f4;
      border-width: 0 0 1px 0;
    }
  }
  `],
  providers: [
    DatePipe
  ]
})
export class NbTableComponent implements OnInit, OnDestroy {

  @Input() items = <any>[];
  @Input() selectedItems = <any>[];
  @Input() totalRecords = 0;
  @Input() columns: QueryList<NbTableColumnComponent>;
  @Input() rowActionWidth = '180px';
  @Input() minWidth = '50rem';
  @Input() isRowCheckbox = true;
  @Input() isShowPagingReport = true;
  @Input() isScrollable = false;
  @Input() scrollHeight = '';

  // @ContentChild('header') headerTemplate!: TemplateRef<any>;
  // @ContentChild('body') bodyTemplate!: TemplateRef<any>;

  @ContentChild('rowActions') rowActionsTemplate: TemplateRef<any>;

  @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

  constructor(private datePipe: DatePipe) {

  }

  getText(item: any, col: any) {

    if (col.bodyTemplate !== undefined)
      return null;

    const typeData = typeof op.get(item, col.field);

    const str = typeData === 'string' ? op.get(item, col.field) : '';

    if (col.type === 'datetime') {
      return this.datePipe.transform(Date.parse(str), 'dd/MM/yyyy HH:mm:ss');
    }

    if (/^\d{4}-\d{1,2}-\d{1,2}/.test(str)) {
      return this.datePipe.transform(Date.parse(str), 'dd/MM/yyyy');
    }

    if (typeData === 'boolean') {
      return item[col.field] ? 'Có' : 'Không';
    }

    return op.get(item, col.field);
  }

  onSelectionChange(e: any) {
    this.onChange.emit({ selection: e });
  }

  onPage(e: any) {
    this.onChange.emit({ page: e });
  }

  onSort(e: any) {
    this.onChange.emit({ sort: e });
  }

  onFilter(e: any) {
    this.onChange.emit({ filter: e });
  }

  ngOnDestroy() {

  }

  ngOnInit() {
  }

}
