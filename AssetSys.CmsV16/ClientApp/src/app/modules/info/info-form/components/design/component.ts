import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InfoFormService } from '../../services/info-form.service';
import { firstValueFrom } from 'rxjs';
import { InfoPropertyService } from '@appkkkh/modules/info/info-property/services/info-property.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
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

    constructor(public service: InfoFormService,
        public propertyService: InfoPropertyService,
        public infolayoutService: InfoLayoutService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder) {
    }

    filterByParent(parent: any = null) {
        return this.controls.filter(x => x.parentId === parent).sort((a, b) => a.displayOrder - b.displayOrder);
    }

    async getList(layoutId: any) {
        this.layoutId = layoutId;
        const resLayout = await firstValueFrom(this.infolayoutService.getById({ id: layoutId }));
        this.layoutItem = resLayout.data;
        const res = await firstValueFrom(this.service.getList({ layoutId: layoutId, pageSize: Number.MAX_SAFE_INTEGER }));
        this.controls = res.data.list;
        this.controls.forEach((item: any) => item.ddid = `${item.id}`);
        this.cdr.detectChanges();
    }

    getConnectedDropListsIds(id: any) {

        const lst: any[] = [];

        lst.push(...this.controls.filter((c: any) => c.id !== id).map((c: any) => c.ddid));

        lst.push(...this.controlChild.getDropListsIds);

        return lst;
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
            const res = await firstValueFrom(this.service.delete({ id: item.id }));
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: res.message, life: 3000 });
        } else {
            this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Xoá thông tin thành công.', life: 3000 });
        }

        this.cdr.detectChanges();
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

    itemCopyChild(parentId: any) {

        const lstCopy: any[] = this.controls.filter((c: any) => c.parentId === parentId);

        lstCopy.forEach((c: any) => c.childs = this.itemCopyChild(c.id));

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

        const dataProperty = await firstValueFrom(this.propertyService.getList({ groupId: this.groupId, pageSize: Number.MAX_SAFE_INTEGER }));

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

        const res = await firstValueFrom(this.service.addOrEdit({
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

    drop(event: CdkDragDrop<any>) {

        //console.log(event);

        //this.controls.filter(x => x.id === event.previousContainer.data.id).forEach(((item: any) => item.parentId = event.container.data.id));

        // if (event.previousContainer === event.container) {
        //   moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
        // } else {
        //   transferArrayItem(
        //     event.previousContainer.data,
        //     event.container.data,
        //     event.previousIndex,
        //     event.currentIndex,
        //   );
        // }
    }

    ngOnInit(): void {
    }
}
