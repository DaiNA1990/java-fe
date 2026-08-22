import { filter } from 'rxjs/operators';
import { Component, OnInit, OnDestroy, Input, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NbBaseComponent } from '@appkkkh/components/form.base';

@Component({
    selector: 'nb-tree',
    template: `
    <nb-form-box
      [formCtrl]="formCtrl"
      [name]="name"
      [label]="label"
      [message]="message"
      [hint]="hint"
      [tooltip]="tooltip"
      [iconStart]="iconStart"
      [iconEnd]="iconEnd"
      [readonly]="readonly"
      [hasValidator]="hasValidator"
    >
      <p-tree
        class="w-full md:w-30rem"
        [value]="items"
        selectionMode="single"
        [filter]="true"
        filterPlaceholder="Từ khoá..."
        (selectionChange)="onNodeSelect($event)"
      >
        <ng-template let-node pTemplate="default">
          <div [ngClass]="{ 'custom-selected': isSelected(node) }">
            {{ node.label }}
          </div>
        </ng-template>
      </p-tree>
    </nb-form-box>
  `,
    styles: [
        `
      ::ng-deep {
        .p-tree-container {
          margin: 0;
          padding-left: 0;
        }
        .custom-selected {
          background-color: #28a745 !important; /* Xanh lá */
          color: white !important;
          font-weight: bold;
          padding: 2px 6px;
          border-radius: 4px;
        }
      }
    `,
    ],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            multi: true,
            useExisting: forwardRef(() => NbTreeComponent),
        },
        {
            provide: NbBaseComponent,
            multi: true,
            useExisting: forwardRef(() => NbTreeComponent),
        },
    ],
    standalone: false
})
export class NbTreeComponent
  extends NbBaseComponent
  implements OnInit, OnDestroy, ControlValueAccessor
{
  @Input() fieldValue: string = 'value';
  @Input() fieldText: string = 'text';

  constructor() {
    super();
  }

  selectionChange(e: any) {
    this.formCtrl.setValue(e.key);
  }

  async getData(keyword?: any) {
    await super.getData(keyword, () => {
      this.items = this.processTree(null, this.items);
    });
    this.restoreSelection();
  }

  selectedNode: any;
  highlightedKeys = new Set<string>();

  restoreSelection() {
    this.highlightedKeys.clear();
    const node = this.findNodeByKey(this.items, this.formCtrl.value);
    if (node) {
      this.selectedNode = node;
      this.highlightedKeys.add(node.key);

      // Thêm tất cả cha vào highlight
      let parent = node.data.parentId;
      if (parent) this.highlightedKeys.add(parent);
    }
  }

  onNodeSelect(event: any) {
    this.formCtrl.setValue(event.key);
    this.highlightedKeys.clear();
    const node = event;
    this.highlightedKeys.add(node.key);

    // Thêm tất cả cha vào highlight
    let parent = node.data.parentId;
    if (parent)
      this.highlightedKeys.add(parent);
  }

  // Hàm tìm node theo key
  findNodeByKey(nodes: any[], key: string): any | null {
    for (const node of nodes) {
      if (node.key === key) return node;
      if (node.children) {
        const found = this.findNodeByKey(node.children, key);
        if (found) return found;
      }
    }
    return null;
  }

  // Check highlight
  isSelected(node: any): boolean {
    return this.highlightedKeys.has(node.key);
  }

  processTree(parent: any, lst: []): [] {
    return lst.reduce(
      (a: any, o: any) => (
        o.parentId === parent &&
          a.push({
            checked: o.value === this.formCtrl.value,
            key: o.value,
            label: o.text,
            data: o,
            icon: 'pi pi-fw pi-cog',
            children: this.processTree(o.value, lst),
          }),
        a
      ),
      []
    );
  }

  ngOnInit() {
    super.ngOnInit();
  }
}
