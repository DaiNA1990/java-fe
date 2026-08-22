import { Component, ContentChild, Input, TemplateRef, ViewChild } from '@angular/core';

@Component({
    selector: 'nb-table-col',
    template: '',
    standalone: false
})
export class NbTableColumnComponent {

  @Input('field') field: string;
  @Input('header') header: string;
  @Input('type') type: string;
  @Input('titleFooter') titleFooter: string;
  @Input('sumToFooter') sumToFooter: boolean = false;
  @Input('countToFooter') countToFooter: boolean = false;
  @Input() canSort: boolean = false;
  @Input() sticky: boolean = false;
  @Input() stickyEnd: boolean = false;
  @Input() columnTemplate: TemplateRef<any>;
  @Input() columnTemplateEdit: TemplateRef<any>;
  @Input() columnTemplateFooter: TemplateRef<any>;

  @ContentChild('body') bodyTemplate: TemplateRef<any>;

}
