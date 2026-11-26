import { ChangeDetectorRef, Component, ElementRef, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InfoFormService } from '../../services/info-form.service';
import { firstValueFrom } from 'rxjs';
import { InfoPropertyService } from '@appkkkh/modules/info/info-property/services/info-property.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CdkDragEnd, CdkDragMove } from '@angular/cdk/drag-drop';
import { ResponseCode } from '@appkkkh/core/contants/app.enum';
import { InfoFormPropertyComponent } from '../property/component';
import { InfoLayoutService } from '@appkkkh/modules/info/info-layout/services/info-layout.service';
import { InfoFormControlComponent } from '../control/component';

@Component({
    selector: 'app-info-form-design',
    templateUrl: `./component.html`,
    styles: [
        `
        .cdk-drag-animating {
            transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
        }

        .cdk-drop-list-dragging {
            transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);

            .cdk-drag:not(.cdk-drag-placeholder) {
            transition: transform 250ms cubic-bezier(0, 0, 0.2, 1);
            }
        }

        .cdk-drag-preview {
            box-sizing: border-box;
            border-radius: 4px;
            box-shadow: 0 5px 5px -3px rgba(0, 0, 0, 0.2), 0 8px 10px 1px rgba(0, 0, 0, 0.14),
                0 3px 14px 2px rgba(0, 0, 0, 0.12);
            overflow: hidden;
        }

        /* phân biệt cấp cha-con: mỗi cấp 1 màu (viền trái + nền nhạt + badge), lặp lại sau 6 cấp */
        .design-node {
            --depth-color: 62, 151, 255;
            border-left: 4px solid rgb(var(--depth-color)) !important;
            border-left-style: solid !important;
            background-color: rgba(var(--depth-color), 0.05);
        }

        .design-node[data-depth="1"] { --depth-color: 80, 205, 137; }
        .design-node[data-depth="2"] { --depth-color: 114, 57, 234; }
        .design-node[data-depth="3"] { --depth-color: 246, 166, 9; }
        .design-node[data-depth="4"] { --depth-color: 23, 193, 232; }
        .design-node[data-depth="5"] { --depth-color: 241, 65, 108; }

        .design-node-chosen {
            box-shadow: 0 0 0 2px rgba(var(--depth-color), 0.6);
        }

        .design-depth-badge {
            display: inline-block;
            min-width: 26px;
            padding: 1px 6px;
            border-radius: 4px;
            font-size: 0.75rem;
            text-align: center;
            color: #fff;
            background-color: rgb(var(--depth-color));
        }

        .design-type-badge {
            padding: 1px 6px;
            border-radius: 4px;
            font-size: 0.75rem;
            font-weight: 500;
            color: rgb(var(--depth-color));
            background-color: rgba(var(--depth-color), 0.12);
        }

        /* khoảng trống tạm mở ra ở vị trí sẽ thả */
        .design-drop-gap {
            height: 48px;
            margin-bottom: 0.75rem;
            border: 2px dashed rgb(var(--depth-color, 62, 151, 255));
            border-radius: 0.475rem;
            background-color: rgba(var(--depth-color, 62, 151, 255), 0.08);
            animation: design-gap-open 150ms ease-out;
        }

        .design-drop-gap-col {
            flex: 0 0 64px;
            width: 64px;
            height: auto;
            min-height: 48px;
            padding: 0;
        }

        @keyframes design-gap-open {
            from { height: 0; min-height: 0; opacity: 0; }
            to { opacity: 1; }
        }

        .design-drop-placeholder {
            height: 4px;
            margin: 4px 0;
            border-radius: 2px;
            background-color: rgb(var(--depth-color));
        }

        .design-search-match {
            background-color: var(--bs-warning-light, #fff8dd);
        }

        .design-search-current {
            background-color: var(--bs-warning-light, #fff8dd);
            outline: 2px solid var(--bs-warning, #f6c000);
            outline-offset: 2px;
        }

        .cdk-drag-placeholder {
            background-color: rgba(150, 150, 200, 0.1);
            border: 1px dashed #abc;
            padding: 5px;
        }
        `
    ],
    providers: [ConfirmationService, MessageService]
})
export class InfoFormDesignComponent implements OnInit {

    @Input() layoutId: number | null;
    @Input() groupId: number | null;

    @ViewChild(InfoFormPropertyComponent, { static: false }) propertyChild: InfoFormPropertyComponent;
    @ViewChild(InfoFormControlComponent, { static: false }) controlChild: InfoFormControlComponent;

    controls: any[] = [];

    layoutItem: any = null;

    constructor(public infoFormService: InfoFormService,
        public infoPropertyService: InfoPropertyService,
        public infoLayoutService: InfoLayoutService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef,
        private elementRef: ElementRef<HTMLElement>,
        private formBuilder: FormBuilder) {
    }

    // id -> mô tả lỗi cấu trúc cha-con (vòng lặp / mất cha)
    designErrors = new Map<any, string>();

    filterByParent(parent: any = null, path: any[] = []) {
        if (parent === null) {
            this.analyzeTree();
            return this.controls
                .filter(x => this.isRootItem(x))
                .sort((a, b) => a.displayOrder - b.displayOrder);
        }

        // path = danh sách id tổ tiên, chặn render lặp vô hạn
        return this.controls
            .filter(x => x.parentId === parent && x.id !== parent && !path.includes(x.id))
            .sort((a, b) => a.displayOrder - b.displayOrder);
    }

    private rootErrorIds = new Set<any>();

    private isRootItem(x: any) {
        return x.parentId === null || x.parentId === undefined || this.rootErrorIds.has(x.id);
    }

    // Tìm phần tử mất cha và vòng lặp cha-con; mỗi vòng lặp chọn 1 phần tử đưa ra gốc để vẫn hiển thị
    analyzeTree() {
        this.designErrors.clear();
        this.rootErrorIds.clear();

        const byId = new Map<any, any>(this.controls.map((c: any) => [c.id, c]));
        const label = (c: any) => `#${c.displayOrder}.${c.name ?? c.id}`;
        const done = new Set<any>();

        for (const start of this.controls) {
            if (done.has(start.id))
                continue;

            const chain: any[] = [];
            let cur: any = start;

            while (cur && !done.has(cur.id)) {
                const idx = chain.indexOf(cur);
                if (idx >= 0) {
                    const cycle = chain.slice(idx);
                    const names = [...cycle, cur].map(label).join(' → ');
                    cycle.forEach((c: any) => this.designErrors.set(c.id,
                        cycle.length === 1
                            ? `Lỗi: parentId trỏ vào chính nó (${c.parentId}).`
                            : `Lỗi vòng lặp cha-con: ${names}`));
                    const entry = [...cycle].sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id)[0];
                    this.rootErrorIds.add(entry.id);
                    break;
                }

                chain.push(cur);

                if (cur.parentId === null || cur.parentId === undefined)
                    break;

                const parent = byId.get(cur.parentId);
                if (!parent) {
                    this.designErrors.set(cur.id, `Lỗi: không tìm thấy đối tượng cha (parentId = ${cur.parentId}).`);
                    this.rootErrorIds.add(cur.id);
                    break;
                }

                cur = parent;
            }

            chain.forEach((c: any) => done.add(c.id));
        }
    }

    async getList(layoutId: any) {
        this.layoutId = layoutId;
        const resLayout = await firstValueFrom(this.infoLayoutService.getById({ id: layoutId }));
        this.layoutItem = resLayout.data;
        const [res] = await Promise.all([
            firstValueFrom(this.infoFormService.getList({ layoutId: layoutId, pageSize: Number.MAX_SAFE_INTEGER })),
            this.loadProperties()
        ]);
        this.controls = res.data.list;
        this.controls.forEach((item: any) => item.ddid = `${item.id}`);
        this.search(false);
        this.changeDetectorRef.detectChanges();
    }

    // propertyId -> { name, code } để tìm kiếm theo trường dữ liệu được gán
    private propertyMap = new Map<any, any>();

    async loadProperties() {
        const groupId = this.groupId || this.layoutItem?.groupId;

        if (!groupId)
            return;

        const res = await firstValueFrom(this.infoPropertyService.getList({ groupId, pageSize: Number.MAX_SAFE_INTEGER }));

        this.propertyMap = new Map((res?.data?.list ?? []).map((p: any) => [p.id, p]));
    }

    getPropertyLabel(item: any) {
        const p = this.propertyMap.get(item.propertyId);
        return p ? `Trường: ${p.name} (${p.code})` : '';
    }

    searchKeyword = '';
    searchMatches: any[] = [];
    searchMatchIds = new Set<any>();
    searchIndex = -1;

    private normalize(val: any) {
        return (val ?? '').toString().trim().toLowerCase();
    }

    // danh sách control theo đúng thứ tự đang hiển thị trên cây
    private flattenTree(parent: any = null, path: any[] = []): any[] {
        const result: any[] = [];

        for (const c of this.filterByParent(parent, path))
            result.push(c, ...this.flattenTree(c.id, [...path, c.id]));

        return result;
    }

    // từ khoá của lần tìm gần nhất (chỉ cập nhật khi Enter)
    searchedKeyword = '';

    search(scroll: boolean = true) {
        const keyword = this.searchedKeyword;

        if (keyword === '') {
            this.searchMatches = [];
            this.searchMatchIds.clear();
            this.searchIndex = -1;
            return;
        }

        // chỉ khớp chính xác mã của property được gán (không phân biệt hoa thường)
        this.searchMatches = this.flattenTree()
            .filter((c: any) => this.normalize(this.propertyMap.get(c.propertyId)?.code) === keyword);
        this.searchMatchIds = new Set(this.searchMatches.map((c: any) => c.id));
        this.searchIndex = this.searchMatches.length ? 0 : -1;

        if (scroll && this.searchMatches.length) {
            this.itemChosen(this.searchMatches[0]);
            this.scrollToMatch();
        }
    }

    // Enter: từ khoá mới -> tìm kiếm; từ khoá không đổi -> chuyển kết quả theo step
    searchEnter(step: number) {
        const keyword = this.normalize(this.searchKeyword);

        if (keyword !== this.searchedKeyword) {
            this.searchedKeyword = keyword;
            this.search();
            return;
        }

        this.searchMove(step);
    }

    // nút mũi tên: chuyển sang kết quả kế tiếp và chọn control đó
    searchMove(step: number) {
        if (!this.searchMatches.length)
            return;

        const total = this.searchMatches.length;
        this.searchIndex = (this.searchIndex + step + total) % total;

        this.itemChosen(this.searchMatches[this.searchIndex]);
        this.scrollToMatch();
    }

    searchClear() {
        this.searchKeyword = '';
        this.searchedKeyword = '';
        this.search(false);
    }

    private scrollToMatch() {
        const item = this.searchMatches[this.searchIndex];

        if (!item)
            return;

        this.changeDetectorRef.detectChanges();

        setTimeout(() => {
            const host = this.elementRef.nativeElement;
            const el = host.querySelector(`[data-design-id="${item.id}"]`) as HTMLElement | null;
            const canvas = host.querySelector('.design-canvas') as HTMLElement | null;

            if (!el || !canvas)
                return;

            // chỉ cuộn khung thiết kế; scrollIntoView cuộn cả các khung cha (splitter/modal) làm lệch mất header panel
            const elRect = el.getBoundingClientRect();
            const canvasRect = canvas.getBoundingClientRect();
            const top = canvas.scrollTop + (elRect.top - canvasRect.top) - (canvas.clientHeight - elRect.height) / 2;

            canvas.scrollTo({ top: Math.max(0, top), behavior: 'smooth' });
        });
    }

    // node có phải chính ancestor hoặc nằm trong nhánh con của ancestor
    private isSelfOrDescendant(node: any, ancestor: any) {
        const byId = new Map<any, any>(this.controls.map((c: any) => [c.id, c]));
        const seen = new Set<any>();

        for (let cur = node; cur && !seen.has(cur.id); cur = byId.get(cur.parentId)) {
            if (cur.id === ancestor.id)
                return true;

            seen.add(cur.id);
        }

        return false;
    }

    itemChosen(item: any) {

        this.controls.filter(x => x.isDesignChosen).forEach((c: any) => c.isDesignChosen = false);

        item.isDesignChosen = true;

        this.propertyChild.itemChosen(item);
    }

    itemRemove(event: Event, item: any) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: `Bạn muốn xoá ${item.name}?`,
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: "none",
            acceptLabel: "Xoá",
            rejectIcon: "none",
            rejectLabel: "Đóng",
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.itemRemoveSubmit(item);
            }
        });
    }

    async itemRemoveSubmit(item: any) {

        if (this.controls.some((i: any) => i.parentId === item.id)) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Thông báo',
                detail: 'Đối tượng có các đối tượng con, vui lòng xoá hoặc chuyển trước khi xoá.',
                life: 3000
            });
            return;
        }

        const index = this.controls.findIndex((i: any) => i.id === item.id);

        this.controls.splice(index, 1);

        if (item.id > 0) {
            const res = await firstValueFrom(this.infoFormService.delete({ id: item.id }));
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: res.message, life: 3000 });
        } else {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Xoá thông tin thành công.', life: 3000 });
        }

        this.changeDetectorRef.detectChanges();
    }

    itemAdd(item?: any) {
        this.controls.push({
            layoutId: this.layoutId,
            propertyId: null,
            parentId: item?.id || null,
            name: null,
            code: null,
            message: null,
            placeholder: null,
            defaultValue: null,
            hint: null,
            size: null,
            cssClass: null,
            cssStyle: null,
            icon: null,
            iconClass: null,
            action: null,
            referenceCode: null,
            displayOrder: parseInt(this.propertyChild.lastDisplayOrder.toString()) + 1,
            controlType: this.propertyChild.lastControlType,
            expressionValidate: null,
            expressionDisplay: null,
            expressionReadonly: null,
            expressionData: null,
            permission: null,
            lookupData: null,
            id: -new Date().getTime(),
            isShow: true,
            isReadOnly: false,
            isDeleted: false
        });

        this.itemChosen(this.controls[this.controls.length - 1]);
    }

    itemCopy(item?: any) {

        item.childs = this.itemCopyChild(item.id);

        localStorage.setItem('formItemsCopy', JSON.stringify(item));

        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Copy success', life: 3000 });
    }

    itemCopyChild(parentId: any, path: any[] = [parentId]) {

        const lstCopy: any[] = this.controls.filter((c: any) => c.parentId === parentId && !path.includes(c.id));

        lstCopy.forEach((c: any) => c.childs = this.itemCopyChild(c.id, [...path, c.id]));

        return lstCopy;
    }

    async itemPate(event: any, item?: any) {

        const itemCopy = JSON.parse(localStorage.getItem('formItemsCopy') || '{}');

        const txtClipboard = await navigator.clipboard.readText();

        if (itemCopy.id === undefined && txtClipboard === '') {
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Vui lòng thực hiện copy trước khi pate.', life: 3000 });
            return;
        }

        if (itemCopy.id !== undefined)
        {
            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: `Bạn muốn gán vào ${item?.name || 'lựa chọn'}?`,
                header: 'Xác nhận',
                icon: 'pi pi-exclamation-triangle',
                acceptIcon: "none",
                acceptLabel: "Pate",
                rejectIcon: "none",
                rejectLabel: "Đóng",
                rejectButtonStyleClass: "p-button-text",
                accept: () => {
                    this.itemPateProcess(item, itemCopy);
                }
            });

            return;
        }

        if (txtClipboard !== '')
            this.confirmationService.confirm({
                target: event.target as EventTarget,
                message: `Bạn muốn gán clipboard vào ${item.name || 'lựa chọn'}?`,
                header: 'Xác nhận',
                icon: 'pi pi-exclamation-triangle',
                acceptIcon: "none",
                acceptLabel: "Pate",
                rejectIcon: "none",
                rejectLabel: "Đóng",
                rejectButtonStyleClass: "p-button-text",
                accept: () => {
                    this.itemPateClipboardProcess(item, txtClipboard);
                }
            });
    }

    async itemPateClipboardProcess(item?: any, content?: string) {

        if(item.id < 1){
            this.messageService.add({ severity: 'error', summary: 'Thông báo', detail: 'Vui lòng chọn đối tượng trước khi pate.', life: 3000 });
            return;
        }

        const lines = content?.split(/\r?\n/).filter(line => line.trim() !== '');

        const dataProperty = await firstValueFrom(this.infoPropertyService.getList({ groupId: this.groupId, pageSize: Number.MAX_SAFE_INTEGER }));

        let _index = 1;

        for (const name of lines!) {

            const property = dataProperty.data.list.find((i: any) => i.name === name);

            if (!property)
                continue;

            let formItem = {
                propertyId: property.id,
                name: property.name,
                code: property.code,
                message: 'Vui lòng nhập thông tin',
                hint: 'Vui lòng nhập thông tin',
                placeholder: 'Vui lòng nhập thông tin',
                displayOrder: _index,
                controlType: 'text',
                id: null,
                isShow: true,
                isDeleted: false
            }

            await this.itemPateChild(formItem, item.id);

            _index += 1;
        }

        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Pate from clipboard success', life: 3000 });

        await this.getList(this.layoutId);
    }


    async itemPateProcess(item?: any, itemCopy?: any) {

        await this.itemPateChild(itemCopy, item?.id);

        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Pate success', life: 3000 });

        localStorage.removeItem('formItemsCopy');

        await this.getList(this.layoutId);
    }

    async itemPateChild(item: any, parentId: any) {

        const res = await firstValueFrom(this.infoFormService.addOrEdit({
            layoutId: this.layoutId,
            propertyId: item.propertyId || null,
            parentId: parentId || null,
            name: item.name,
            code: null,
            message: item.message,
            hint: item.hint,
            size: item.size,
            placeholder: item.placeholder,
            defaultValue: item.defaultValue,
            cssClass: item.cssClass,
            cssStyle: item.cssStyle,
            icon: item.icon,
            iconClass: item.iconClass,
            action: item.action,
            displayOrder: item.displayOrder,
            controlType: item.controlType,
            referenceCode: item.referenceCode,
            expressionValidate: item.expressionValidate,
            expressionDisplay: item.expressionDisplay,
            expressionReadonly: item.expressionReadonly,
            expressionData: item.expressionData,
            permission: null,
            lookupData: item.lookupData,
            id: null,
            isShow: item.isShow,
            isDeleted: false
        }));

        if(item.childs !== undefined)
            for (const i of item.childs)
                await this.itemPateChild(i, res.data.id);

    }

    // vị trí sẽ thả khi đang kéo: chèn trước control beforeId (null = cuối danh sách) của cha parentId
    dropHint: { parentId: any, beforeId: any, index: number } | null = null;

    isDropGap(parentId: any, beforeId: any) {
        return this.dropHint !== null && this.dropHint.parentId === parentId && this.dropHint.beforeId === beforeId;
    }

    dragMoved(event: CdkDragMove<any>) {
        const hint = this.getDropHint(event.source.data, event.pointerPosition);

        // chỉ render lại khi vị trí thay đổi
        if (hint?.parentId === this.dropHint?.parentId && hint?.beforeId === this.dropHint?.beforeId)
            return;

        this.dropHint = hint;
        this.changeDetectorRef.detectChanges();
    }

    async dragEnded(event: CdkDragEnd<any>) {
        const hint = this.dropHint;

        this.dropHint = null;
        this.changeDetectorRef.detectChanges();

        if (hint)
            await this.moveItem(event.source.data, hint.parentId, hint.index);
    }

    private getDropHint(item: any, point: { x: number, y: number }) {

        // preview của CDK có pointer-events: none nên elementFromPoint lấy được phần tử bên dưới
        const el = document.elementFromPoint(point.x, point.y) as HTMLElement | null;

        if (!el || !this.elementRef.nativeElement.contains(el))
            return null;

        const nodeEl = el.closest('[data-design-node]');
        const target = nodeEl ? this.controls.find((c: any) => `${c.id}` === nodeEl.getAttribute('data-design-node')) : null;

        // thả vào chính nó / nhánh con của nó -> không hợp lệ
        if (target && this.isSelfOrDescendant(target, item))
            return null;

        // không nằm trên control nào nhưng vẫn trong vùng thiết kế -> cấp gốc
        if (!target && !el.closest('.design-canvas'))
            return null;

        const { parentId, index } = this.getDropPosition(target, item, point);

        // vẫn đúng vị trí cũ -> không cần di chuyển
        if ((item.parentId ?? null) === parentId && this.getSiblings(parentId, null).indexOf(item) === index)
            return null;

        const siblings = this.getSiblings(parentId, item);

        return { parentId, index, beforeId: siblings[index]?.id ?? null };
    }

    private getElementRect(attr: string, id: any): DOMRect | undefined {
        return this.elementRef.nativeElement.querySelector(`[${attr}="${id}"]`)?.getBoundingClientRect();
    }

    // anh em cùng cha (trừ control đang kéo), theo thứ tự hiển thị
    private getSiblings(parentId: any, exclude: any) {
        return this.controls
            .filter((c: any) => (c.parentId ?? null) === parentId && c !== exclude)
            .sort((a, b) => a.displayOrder - b.displayOrder);
    }

    // thả lên thanh tiêu đề của target -> đứng trước/sau target (cùng cha)
    // thả vào phần thân target -> thành con của target, vị trí theo các con hiện có
    // target = null: vùng trống của cấp gốc
    private getDropPosition(target: any, item: any, point: { x: number, y: number }) {

        const header = target ? this.getElementRect('data-design-id', target.id) : undefined;

        if (header && point.y >= header.top && point.y <= header.bottom) {
            const parentId = target.parentId ?? null;
            const siblings = this.getSiblings(parentId, item);
            const after = target.controlType === 'grid-item'
                ? point.x > header.left + header.width / 2
                : point.y > header.top + header.height / 2;

            return { parentId, index: siblings.indexOf(target) + (after ? 1 : 0) };
        }

        const parentId = target ? target.id : null;
        let index = 0;

        this.getSiblings(parentId, item).forEach((c: any, i: number) => {
            const r = this.getElementRect('data-design-node', c.id);
            if (r && (point.y > r.bottom || (point.y >= r.top && point.x > r.left + r.width / 2)))
                index = i + 1;
        });

        return { parentId, index };
    }

    private async moveItem(item: any, parentId: any, index: number) {

        const siblings = this.getSiblings(parentId, item);
        siblings.splice(index, 0, item);

        item.parentId = parentId;

        // đánh lại số thứ tự cho các anh em ở cha mới
        const changed = siblings.filter((c: any, i: number) => {
            const isChanged = c === item || c.displayOrder !== i + 1;
            c.displayOrder = i + 1;
            return isChanged;
        });

        const chosen = this.controls.find((c: any) => c.isDesignChosen);
        if (chosen && changed.includes(chosen))
            this.propertyChild.formControl.patchValue({ parentId: chosen.parentId, displayOrder: chosen.displayOrder });

        this.changeDetectorRef.detectChanges();

        // control chưa lưu (id âm) chỉ đổi trên giao diện
        try {
            for (const c of changed.filter((x: any) => x.id > 0)) {
                const res = await firstValueFrom(this.infoFormService.addOrEdit(this.toPayload(c)));
                if (res.statusCode !== ResponseCode.ZERO)
                    throw new Error(res.message);
            }

            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Di chuyển thành công.', life: 3000 });
        } catch (e: any) {
            this.messageService.add({ severity: 'warn', summary: 'Thông báo', detail: e?.message || 'Di chuyển không thành công.', life: 3000 });
            await this.getList(this.layoutId);
        }
    }

    // chỉ gửi các field có trên form thuộc tính (bỏ ddid, isDesignChosen, childs...)
    private toPayload(item: any) {
        const payload: any = {};

        Object.keys(this.propertyChild.formControl.controls).forEach(key => payload[key] = item[key] ?? null);

        return payload;
    }

    ngOnInit(): void {
    }
}
