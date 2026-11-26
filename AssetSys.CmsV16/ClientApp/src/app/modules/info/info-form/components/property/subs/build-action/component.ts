import { ChangeDetectorRef, Component, EventEmitter, forwardRef, inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { InfoPropertyService } from '@appkkkh/modules/info/info-property/services/info-property.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InfoFormService } from '@appkkkh/modules/info/info-form/services/info-form.service';
import { InfoLayoutService } from '@appkkkh/modules/info/info-layout/services/info-layout.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import actionData from './action.json';
import { CONDITION_TREE_STYLES } from '../condition-tree';
import { InfoFormPropertyBuildPreValidateComponent } from '../build-pre-validate/component';
import { CDK_DRAG_CONFIG, CdkDrag, CdkDragDrop, CdkDragMove, CdkDropList, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';

interface FCAction {
    target?: string;
    event?: string;
    action?: string;
    data?: string;
    rules: FCAction[];
}

@Component({
    selector: 'app-info-form-property-build-action',
    templateUrl: `./component.html`,
    styles: [CONDITION_TREE_STYLES, `
        .action-drag-handle { cursor: move; }

        /* dropdown Thao tác / Sự kiện: rộng cố định, phần còn lại nhường cho target + thông tin khác */
        .input-group > .action-select {
            flex: 0 0 220px;
            width: 220px;
        }

        :host ::ng-deep .input-group > .action-select .p-dropdown {
            width: 100%;
            height: 100%;
            border-radius: 0;
        }

        :host ::ng-deep .input-group > .action-select:first-child .p-dropdown {
            border-top-left-radius: 0.475rem;
            border-bottom-left-radius: 0.475rem;
        }

        /* panel gắn vào body nên không dùng :host */
        ::ng-deep .action-select-panel {
            min-width: 300px;
        }

        ::ng-deep .action-select-panel .p-dropdown-items-wrapper {
            max-height: 360px !important;
        }

        /* tiêu đề nhóm: dính trên đầu khi cuộn, nền màu nhạt theo nhóm (vẽ trong #groupTemp) */
        ::ng-deep .action-select-panel .p-dropdown-item-group {
            position: sticky;
            top: 0;
            z-index: 1;
            padding: 0;
            background: var(--bs-body-bg, #fff);
        }

        ::ng-deep .action-select-panel .p-dropdown-item {
            padding: 0.4rem 1rem;
        }

        ::ng-deep .action-select-panel .p-dropdown-item.p-highlight {
            background: var(--bs-primary-light, #f1faff);
        }

        ::ng-deep .action-select-panel .p-dropdown-item:not(.p-highlight):hover {
            background: var(--bs-gray-100, #f9f9f9);
        }

        ::ng-deep .action-select-panel .action-option-bar {
            width: 4px;
            min-height: 28px;
            border-radius: 2px;
        }

        .cdk-drag-placeholder {
            opacity: 0.35;
            border-style: dashed !important;
        }

        .cdk-drag-animating,
        .cdk-drop-list-dragging .cdk-drag:not(.cdk-drag-placeholder) {
            transition: transform 200ms cubic-bezier(0, 0, 0.2, 1);
        }

        .cdk-drag-preview {
            box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
        }
    `],
    providers: [ConfirmationService, MessageService,
        // preview kéo thả gắn vào body, phải nổi trên p-dialog (z-index ~1100)
        { provide: CDK_DRAG_CONFIG, useValue: { zIndex: 3000 } }]
})
export class InfoFormPropertyBuildActionComponent implements OnInit {

    @Input() groupId: any;
    @Input() layoutId: any;
    @Input() formCtrl: AbstractControl;
    // bắn ra sau khi bấm Lưu thông tin để component cha lưu control xuống DB
    @Output() saved = new EventEmitter<void>();

    visible: boolean = false;

    @ViewChild(InfoFormPropertyBuildPreValidateComponent) preValidate: InfoFormPropertyBuildPreValidateComponent;

    lstForms: any[] = [];

    lstLayouts: any[] = [];

    targets: any[];

    actions: any[] = actionData.actions;

    events: any[] = actionData.events;

    actionGroups: any[] = this.groupByPrefix(this.actions);

    eventGroups: any[] = this.groupByPrefix(this.events);

    dataActions: FCAction = {
        rules: [
            {
                target: '',
                event: '',
                action: '',
                data: '',
                rules: []
            }
        ]
    }

    get hasAction() {
        return this.dataActions.rules.filter((c: FCAction) => c.target !== '').length > 0;
    }

    constructor(public infoPropertyService: InfoPropertyService,
        public infoFormService: InfoFormService,
        public infoLayoutService: InfoLayoutService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder) {
    }

    addCondition(item: FCAction) {

        if (item.rules === undefined || item.rules === null)
            item.rules = [];

        item.rules.push({
            target: '',
            event: '',
            action: '',
            data: '',
            rules: []
        });

        this.refreshDropLists();
    }

    removeCondition(item: FCAction, parent: FCAction) {
        parent.rules.splice(parent.rules.indexOf(item), 1);
        this.refreshDropLists();
    }

    addConditionGroup(item: FCAction) {
        item.rules.push({
            rules: [
                {
                    target: '',
                    event: '',
                    action: '',
                    data: '',
                    rules: []
                }
            ]
        });

        this.refreshDropLists();
    }

    removeConditionGroup(item: FCAction, parent: FCAction) {
        parent.rules.splice(parent.rules.indexOf(item), 1);
        this.refreshDropLists();
    }

    // mỗi mảng rules đang hiển thị là 1 drop list; id gắn theo chính mảng đó
    private listIds = new WeakMap<any[], string>();
    private listSeq = 0;

    // xếp list cấp sâu trước: CDK chọn list đầu tiên (theo thứ tự connectedTo) chứa con trỏ,
    // nên phải ưu tiên list trong cùng thì mới thả được vào danh sách thao tác con
    dropListIds: string[] = [];

    listId(rules: any[]) {
        let id = this.listIds.get(rules);

        if (!id) {
            id = `action-list-${++this.listSeq}`;
            this.listIds.set(rules, id);
        }

        return id;
    }

    refreshDropLists() {
        const lists: { id: string, depth: number }[] = [];

        const walk = (node: any, depth: number) => {
            if (!Array.isArray(node?.rules))
                return;

            // list rỗng của thao tác con không được render (ngIf) -> bỏ qua
            if (node === this.dataActions || node.rules.length > 0)
                lists.push({ id: this.listId(node.rules), depth });

            node.rules.forEach((r: any) => walk(r, depth + 1));
        };

        walk(this.dataActions, 0);

        this.dropListIds = lists.sort((a, b) => b.depth - a.depth).map(x => x.id);
    }

    // không cho thả 1 thao tác vào danh sách con của chính nó
    // + list lồng nhau: CDK xét các list khác TRƯỚC list hiện tại, mà list cha luôn bao trùm list con
    //   -> list cha sẽ giành mất item khi đang sắp xếp trong list con. Nhường cho list trong cùng chứa con trỏ.
    canEnter = (drag: CdkDrag, drop: CdkDropList) => {
        if (this.containsList(drag.data, drop.data))
            return false;

        const { x, y } = this.pointer;
        const innerLists = Array.from(drop.element.nativeElement.querySelectorAll('.action-list')) as HTMLElement[];

        return !innerLists.some(el => {
            // bỏ qua list nằm trong chính item đang kéo
            if (drag.element.nativeElement.contains(el))
                return false;

            const r = el.getBoundingClientRect();
            return r.width > 0 && x >= r.left && x <= r.right && y >= r.top && y <= r.bottom;
        });
    };

    // vị trí con trỏ khi kéo, dùng cho canEnter
    private pointer = { x: 0, y: 0 };

    dragMoved(event: CdkDragMove<any>) {
        this.pointer = event.pointerPosition;
    }

    private containsList(node: any, list: any[]): boolean {
        if (!Array.isArray(node?.rules))
            return false;

        return node.rules === list || node.rules.some((r: any) => this.containsList(r, list));
    }

    dropAction(event: CdkDragDrop<any[]>) {
        if (event.previousContainer === event.container)
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        else
            transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

        this.refreshDropLists();
        this.changeDetectorRef.detectChanges();
    }

    open() {
        this.refreshDropLists();
        this.visible = true;
        this.changeDetectorRef.detectChanges();
    }

    /** Dòng Pre action + Form Validate: "Thông tin khác" là JSON cấu hình, nhập qua popup build-pre-validate. */
    isPreValidate(item: FCAction): boolean {
        return InfoFormPropertyBuildPreValidateComponent.isPreValidate(item);
    }

    preValidateSummary(item: FCAction): string {
        return InfoFormPropertyBuildPreValidateComponent.summary(item);
    }

    openPreValidate(item: FCAction) {
        this.preValidate.open(item);
    }

    onPreValidateChanged() {
        this.changeDetectorRef.detectChanges();
    }

    save() {
        this.formCtrl.setValue(JSON.stringify(this.dataActions));
        this.visible = false;
        this.saved.emit();
    }

    search(event: AutoCompleteCompleteEvent) {

        this.targets = this.lstForms.filter((c: any) => c.indexOf(event.query) > -1);

        this.targets.push(...this.lstLayouts.filter((c: any) => c.indexOf(event.query) > -1))

        this.changeDetectorRef.detectChanges();
    }

    /** Gom option theo tiền tố của value (MODAL_, FORM_, TABLE_...) để dropdown hiện theo nhóm. */
    groupByPrefix(items: any[]): any[] {
        // color: hậu tố class màu Metronic (badge-light-*, bg-*)
        const groups = [
            { prefix: 'MODAL_', label: 'Modal', color: 'info' },
            { prefix: 'FORM_', label: 'Form', color: 'primary' },
            { prefix: 'TABLE_', label: 'Bảng', color: 'success' },
            { prefix: 'SELECT_', label: 'Select', color: 'warning' },
            { prefix: 'WORKFLOW_', label: 'BPMN', color: 'danger' },
        ];
        const other = { label: 'Khác', color: 'dark', items: [] as any[] };
        const result = groups.map(g => ({ label: g.label, color: g.color, items: [] as any[] }));

        items.forEach(x => {
            const index = groups.findIndex(g => String(x.value).startsWith(g.prefix));
            const group = index > -1 ? result[index] : other;
            group.items.push({ ...x, color: group.color });
        });

        return [...result, other].filter(g => g.items.length > 0);
    }

    select(event: any, item: any) {
        item.target = event.value.split('(')[1].split(')')[0];
    }

    async init() {

        const res = await firstValueFrom(this.infoFormService.getList({
            groupId: this.groupId,
            pageSize: Number.MAX_SAFE_INTEGER
        }));

        this.lstForms = res.data.list.map((item: any) => `${item.controlType}: ${item.name}(${item.code})`);

        const resLayout = await firstValueFrom(this.infoLayoutService.getList({
            groupId: this.groupId,
            pageSize: Number.MAX_SAFE_INTEGER
        }));

        this.lstLayouts = resLayout.data.list.map((item: any) => `Layout: ${item.name}(${item.code})`);

        try {
            if (this.formCtrl.value !== null && this.formCtrl.value !== '')
                this.dataActions = JSON.parse(this.formCtrl.value);
        } catch (error) {

        }

        this.changeDetectorRef.detectChanges();
    }

    ngOnInit(): void {
        this.init();
    }
}
