import { ChangeDetectorRef, Component, EventEmitter, Input, Output } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { InfoPropertyService } from '@appkkkh/modules/info/info-property/services/info-property.service';
import { InfoLayoutService } from '@appkkkh/modules/info/info-layout/services/info-layout.service';
import { InfoGroupService } from '@appkkkh/modules/info/info-group/services/info-group.service';
import { CONDITION_TREE_STYLES, insertConditionRule, sortConditionRules } from '../condition-tree';

interface CondRuleVM {
    field: string;
    operator: string;
    /** Như expressionData: hằng, "{biểu thức JSONata}" (vd {don_vi}), ghép chuỗi "{a}.{b}", "new Date()". */
    value: string;
    /** Lựa chọn của dropdown "Chèn" - chỉ để chèn token vào value, không lưu. */
    pick: string | null;
}

interface CondGroupVM {
    id: number;
    condition: 'and' | 'or';
    rules: (CondRuleVM | CondGroupVM)[];
}

interface LayoutOption {
    code: string;
    name: string;
    groupId: any;
    label: string;
}

interface Option {
    name: string;
    value: string;
}

interface OptionGroup {
    label: string;
    items: Option[];
}

/** Toán tử không cần giá trị. */
const NO_VALUE_OPERATORS = ['is null', 'is not null'];

/** Field hệ thống có trên mọi bản ghi Mongo (không nằm trong danh sách thuộc tính của group). */
const SYSTEM_TARGET_FIELDS: Option[] = [
    { name: 'ID bản ghi (id)', value: 'id' },
    { name: 'ID bản ghi cha (parent_id)', value: 'parent_id' },
    { name: 'Đã trình / đang khoá quy trình (workflow_locked)', value: 'workflow_locked' },
];

/** Token chung của context JSONata (BE: ValidatorActionService.CurrentRecord.context). */
const SYSTEM_TOKENS: Option[] = [
    { name: 'ID bản ghi này', value: '{id}' },
    { name: 'ID bản ghi cha', value: '{parentId}' },
    { name: 'Đơn vị người bấm', value: '{currentUser.companyCode}' },
    { name: 'Phòng ban người bấm', value: '{currentUser.departmentCode}' },
    { name: 'Tài khoản người bấm', value: '{currentUser.userName}' },
    { name: 'Ngày hiện tại', value: 'new Date()' },
];

/**
 * Popup cấu hình rule PRE_ACTION / FORM_VALIDATE (nút build-action): kiểm bản ghi của layout khác trước khi lưu /
 * trình / duyệt. Ghi vào rule: target = mã layout cần kiểm, data = JSON
 * {"rule","falsemsg","workflowActions","where"} - BE đọc ở ValidatorActionService.validatePreActions.
 */
@Component({
    selector: 'app-info-form-property-build-pre-validate',
    templateUrl: './component.html',
    styles: [CONDITION_TREE_STYLES, `
        .pv-field { flex: 1 1 0; min-width: 0; }
        .pv-operator { flex: 0 0 150px; }
        .pv-insert { flex: 0 0 120px; }

        :host ::ng-deep .pv-field .p-dropdown,
        :host ::ng-deep .pv-insert .p-dropdown {
            width: 100%;
            height: 100%;
            border-radius: 0;
        }

        :host ::ng-deep .pv-field:first-child .p-dropdown {
            border-top-left-radius: 0.475rem;
            border-bottom-left-radius: 0.475rem;
        }

        :host ::ng-deep .pv-layout,
        :host ::ng-deep .pv-layout .p-autocomplete,
        :host ::ng-deep .pv-chips,
        :host ::ng-deep .pv-chips .p-chips {
            width: 100%;
        }

        ::ng-deep .pv-insert-panel { min-width: 320px; }
    `]
})
export class InfoFormPropertyBuildPreValidateComponent {

    /** Group đang cấu hình - nguồn field của bản ghi đang thao tác (và group cha cho parentData). */
    @Input() groupId: any;

    /** Bắn ra sau khi bấm Áp dụng (rule đã được ghi target + data). */
    @Output() changed = new EventEmitter<void>();

    visible = false;

    errorText: string | null = null;

    layout: LayoutOption | null = null;

    layoutSuggestions: LayoutOption[] = [];

    rule: 'EXISTS' | 'NOT_EXISTS' = 'EXISTS';

    falsemsg = '';

    workflowActions: string[] = [];

    where: CondGroupVM = this.newGroup();

    /** Field của group chứa layout cần kiểm (cột trái của điều kiện). */
    targetFields: Option[] = [...SYSTEM_TARGET_FIELDS];

    /** Token chèn vào ô giá trị: field bản ghi này, field bản ghi cha, token hệ thống. */
    tokenGroups: OptionGroup[] = [{ label: 'Hệ thống', items: SYSTEM_TOKENS }];

    // value trùng ValidatorActionService.PRE_ACTION_OPERATORS (BE) - toán tử khác BE báo lỗi cấu hình
    readonly operators = [
        { name: '=', value: '==' },
        { name: '!=', value: '!=' },
        { name: '<', value: '<' },
        { name: '<=', value: '<=' },
        { name: '>', value: '>' },
        { name: '>=', value: '>=' },
        { name: 'in (a,b,c)', value: 'in' },
        { name: 'not in (a,b,c)', value: 'not in' },
        { name: 'contains', value: 'contains' },
        { name: 'starts with', value: 'starts with' },
        { name: 'is null', value: 'is null' },
        { name: 'is not null', value: 'is not null' },
    ];

    /** Rule đang sửa (1 dòng của build-action). */
    private item: any = null;

    private groupSeq = 0;

    private tokensLoaded = false;

    constructor(private infoPropertyService: InfoPropertyService,
        private infoLayoutService: InfoLayoutService,
        private infoGroupService: InfoGroupService,
        private changeDetectorRef: ChangeDetectorRef) {
    }

    /** Dòng thao tác là rule kiểm trước khi thực hiện (dùng popup này thay cho ô nhập "Thông tin khác"). */
    static isPreValidate(item: any): boolean {
        return item?.action === 'PRE_ACTION' && item?.event === 'FORM_VALIDATE';
    }

    /** Tóm tắt cấu hình hiển thị ở ô "Thông tin khác" (chỉ đọc). */
    static summary(item: any): string {
        if (!item?.data) {
            return 'Chưa cấu hình - bấm để thiết lập';
        }

        let cfg: any;
        try {
            cfg = JSON.parse(item.data);
        } catch {
            return 'Cấu hình sai định dạng - bấm để thiết lập lại';
        }

        const count = (node: any): number => Array.isArray(node?.rules)
            ? node.rules.reduce((sum: number, r: any) => sum + (Array.isArray(r?.rules) ? count(r) : 1), 0)
            : 0;

        const parts = [
            cfg?.rule === 'NOT_EXISTS' ? 'Không được có bản ghi' : 'Phải có bản ghi',
            `${count(cfg?.where)} điều kiện`,
        ];
        if (Array.isArray(cfg?.workflowActions) && cfg.workflowActions.length > 0) {
            parts.push(`khi bấm ${cfg.workflowActions.join(', ')}`);
        }
        if (cfg?.falsemsg) {
            parts.push(`"${cfg.falsemsg}"`);
        }
        return parts.join(' · ');
    }

    async open(item: any): Promise<void> {
        this.item = item;

        let cfg: any = null;
        try {
            cfg = item?.data ? JSON.parse(item.data) : null;
        } catch {
            cfg = null;
        }

        this.rule = cfg?.rule === 'NOT_EXISTS' ? 'NOT_EXISTS' : 'EXISTS';
        this.falsemsg = cfg?.falsemsg ?? '';
        this.workflowActions = Array.isArray(cfg?.workflowActions) ? [...cfg.workflowActions] : [];
        this.where = this.toGroupVM(cfg?.where);
        this.layout = null;
        this.targetFields = [...SYSTEM_TARGET_FIELDS];
        this.errorText = null;

        this.visible = true;
        this.changeDetectorRef.detectChanges();

        await Promise.all([this.loadTokens(), this.loadLayout(item?.target)]);
    }

    async searchLayout(event: AutoCompleteCompleteEvent): Promise<void> {
        const res = await firstValueFrom(this.infoLayoutService.getList({
            keyword: event.query,
            pageSize: 50
        }));

        this.layoutSuggestions = (res?.data?.list ?? []).map((l: any) => this.toLayoutOption(l));
        this.changeDetectorRef.detectChanges();
    }

    async onLayoutSelect(): Promise<void> {
        await this.loadTargetFields();
    }

    onLayoutClear(): void {
        this.targetFields = [...SYSTEM_TARGET_FIELDS];
    }

    isGroup(rule: any): boolean {
        return Array.isArray(rule?.rules);
    }

    isNoValue(operator: string): boolean {
        return NO_VALUE_OPERATORS.includes(operator);
    }

    valuePlaceholder(operator: string): string {
        return operator === 'in' || operator === 'not in' ? 'vd 03,04 hoặc {ds_ma}' : 'vd 03 hoặc {don_vi}';
    }

    /** Chèn token đã chọn ở dropdown "Chèn" vào cuối ô giá trị. "new Date()" chỉ dùng 1 mình nên thay cả ô. */
    insertToken(rule: CondRuleVM): void {
        const token = rule.pick;
        rule.pick = null;
        if (!token) {
            return;
        }
        rule.value = token === 'new Date()' ? token : `${rule.value ?? ''}${token}`;
    }

    addRule(group: CondGroupVM): void {
        insertConditionRule(group, this.newRule());
    }

    addGroup(group: CondGroupVM): void {
        group.rules.push(this.newGroup());
    }

    remove(item: any, parent: CondGroupVM): void {
        parent.rules.splice(parent.rules.indexOf(item), 1);
    }

    apply(): void {
        sortConditionRules(this.where);

        this.errorText = this.validate();
        if (this.errorText) {
            return;
        }

        const cfg: any = {
            rule: this.rule,
            falsemsg: this.falsemsg.trim(),
        };

        const actions = this.workflowActions.map(a => String(a).trim()).filter(a => a !== '');
        if (actions.length > 0) {
            cfg.workflowActions = Array.from(new Set(actions));
        }

        cfg.where = this.fromGroupVM(this.where);

        this.item.target = this.layout!.code;
        this.item.data = JSON.stringify(cfg);

        this.visible = false;
        this.changed.emit();
    }

    /** @return thông báo lỗi đầu tiên, null nếu hợp lệ */
    private validate(): string | null {
        if (!this.layout?.code) {
            return 'Chọn layout cần kiểm';
        }
        if (!this.falsemsg.trim()) {
            return 'Nhập thông báo lỗi';
        }
        return this.validateGroup(this.where);
    }

    private validateGroup(group: CondGroupVM): string | null {
        if (group.rules.length === 0) {
            return 'Nhóm điều kiện không được để trống';
        }

        for (const rule of group.rules) {
            const error = this.isGroup(rule)
                ? this.validateGroup(rule as CondGroupVM)
                : this.validateRule(rule as CondRuleVM);
            if (error) {
                return error;
            }
        }

        return null;
    }

    private validateRule(rule: CondRuleVM): string | null {
        if (!rule.field) {
            return 'Chọn field cho mọi điều kiện';
        }
        if (!rule.operator) {
            return `Chọn toán tử cho điều kiện "${rule.field}"`;
        }
        if (this.isNoValue(rule.operator)) {
            return null;
        }

        const value = (rule.value ?? '').trim();
        if (value === '') {
            return `Nhập giá trị cho điều kiện "${rule.field}"`;
        }
        if (!this.bracesBalanced(value)) {
            return `Giá trị của điều kiện "${rule.field}" thiếu dấu { hoặc }`;
        }
        if (/\{\s*\}/.test(value)) {
            return `Giá trị của điều kiện "${rule.field}" có biểu thức rỗng {}`;
        }
        return null;
    }

    private bracesBalanced(value: string): boolean {
        let depth = 0;
        for (const c of value) {
            if (c === '{') {
                depth++;
            } else if (c === '}' && --depth < 0) {
                return false;
            }
        }
        return depth === 0;
    }

    private async loadLayout(code: string): Promise<void> {
        const layoutCode = (code ?? '').trim();
        if (!layoutCode) {
            return;
        }

        const res = await firstValueFrom(this.infoLayoutService.getList({
            keyword: layoutCode,
            pageSize: 50
        }));

        const found = (res?.data?.list ?? []).find((l: any) => l.code === layoutCode);
        this.layout = found
            ? this.toLayoutOption(found)
            : { code: layoutCode, name: layoutCode, groupId: null, label: `${layoutCode} (không tìm thấy layout)` };

        await this.loadTargetFields();
    }

    private async loadTargetFields(): Promise<void> {
        this.targetFields = [...SYSTEM_TARGET_FIELDS];

        if (this.layout?.groupId == null) {
            this.changeDetectorRef.detectChanges();
            return;
        }

        this.targetFields = [...await this.loadFieldOptions(this.layout.groupId), ...SYSTEM_TARGET_FIELDS];
        this.changeDetectorRef.detectChanges();
    }

    /** Token chèn: field bản ghi này ({ma}), field bản ghi cha ({parentData.ma}), token hệ thống. Nạp 1 lần. */
    private async loadTokens(): Promise<void> {
        if (this.tokensLoaded || this.groupId == null) {
            return;
        }

        const [fields, parentGroupId] = await Promise.all([
            this.loadFieldOptions(this.groupId),
            this.loadParentGroupId(),
        ]);
        const parentFields = parentGroupId != null ? await this.loadFieldOptions(parentGroupId) : [];

        this.tokenGroups = [
            { label: 'Field bản ghi này', items: fields.map(f => ({ name: f.name, value: `{${f.value}}` })) },
            ...(parentFields.length > 0
                ? [{ label: 'Field bản ghi cha', items: parentFields.map(f => ({ name: f.name, value: `{parentData.${f.value}}` })) }]
                : []),
            { label: 'Hệ thống', items: SYSTEM_TOKENS },
        ];
        this.tokensLoaded = true;
        this.changeDetectorRef.detectChanges();
    }

    private async loadParentGroupId(): Promise<any> {
        try {
            const res = await firstValueFrom(this.infoGroupService.getById({ id: this.groupId }));
            return res?.data?.parentId ?? null;
        } catch {
            return null;
        }
    }

    private async loadFieldOptions(groupId: any): Promise<Option[]> {
        const res = await firstValueFrom(this.infoPropertyService.getList({
            groupId,
            pageSize: Number.MAX_SAFE_INTEGER
        }));

        return (res?.data?.list ?? [])
            .filter((p: any) => p?.code)
            .map((p: any) => ({ name: `${p.name} (${p.code})`, value: p.code }));
    }

    private toLayoutOption(l: any): LayoutOption {
        const groupName = l?.group?.name ? ` - ${l.group.name}` : '';
        return {
            code: l.code,
            name: l.name,
            groupId: l.groupId ?? l.group?.id ?? null,
            label: `${l.name} (${l.code})${groupName}`,
        };
    }

    private newRule(): CondRuleVM {
        return { field: '', operator: '==', value: '', pick: null };
    }

    private newGroup(): CondGroupVM {
        return { id: ++this.groupSeq, condition: 'and', rules: [this.newRule()] };
    }

    private toGroupVM(node: any): CondGroupVM {
        const rules = Array.isArray(node?.rules) ? node.rules : [];
        const group: CondGroupVM = {
            id: ++this.groupSeq,
            condition: node?.condition === 'or' ? 'or' : 'and',
            rules: rules.map((r: any) => this.isGroup(r) ? this.toGroupVM(r) : this.toRuleVM(r)),
        };

        if (group.rules.length === 0) {
            group.rules.push(this.newRule());
        }

        return group;
    }

    private toRuleVM(rule: any): CondRuleVM {
        return {
            field: rule?.field ?? '',
            operator: rule?.operator ?? '==',
            value: rule?.value == null ? '' : String(rule.value),
            pick: null,
        };
    }

    private fromGroupVM(group: CondGroupVM): any {
        return {
            condition: group.condition,
            rules: group.rules.map(r => this.isGroup(r) ? this.fromGroupVM(r as CondGroupVM) : this.fromRuleVM(r as CondRuleVM)),
        };
    }

    private fromRuleVM(rule: CondRuleVM): any {
        const out: any = { field: rule.field, operator: rule.operator };

        if (this.isNoValue(rule.operator)) {
            return out;
        }

        const value = (rule.value ?? '').trim();
        // workflow_locked lưu boolean trên Mongo - "true" dạng chuỗi sẽ không khớp
        out.value = rule.field === 'workflow_locked' && (value === 'true' || value === 'false')
            ? value === 'true'
            : value;

        return out;
    }
}
