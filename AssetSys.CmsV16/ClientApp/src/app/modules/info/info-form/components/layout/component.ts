import { ChangeDetectorRef, Component, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InfoFormService } from '../../services/info-form.service';
import { firstValueFrom } from 'rxjs';
import { InfoPropertyService } from '@appkkkh/modules/info/info-property/services/info-property.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import icons from '@appkkkh/_metronic/shared/keenicon/icons.json';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { InfoLayoutService } from '@appkkkh/modules/info/info-layout/services/info-layout.service';
import { InfoFormDesignComponent } from '../design/component';
import { InfoLayoutEditComponent } from '@appkkkh/modules/info/info-layout/components/edit/info-layout-edit.component';
import { InfoGroupService } from '@appkkkh/modules/info/info-group/services/info-group.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import { ResponseCode } from '@appkkkh/core/contants/app.enum';

@Component({
    selector: 'app-info-form-layout',
    templateUrl: `./component.html`,
    providers: [ConfirmationService, MessageService],
    standalone: false
})
export class InfoFormLayoutComponent implements OnInit {

    @Input() groupId: number | null;

    @ViewChild(InfoLayoutEditComponent, { static: false }) layoutEdit: InfoLayoutEditComponent;

    private parent: any = inject(InfoFormDesignComponent, { optional: true });

    groups: any[] = [];

    layouts: any[] = [];

    autoGroups: any[] = [];

    visible: boolean = false;

    isSubmiting: boolean = false;

    formCopyControl: FormGroup;

    layoutCopy: any;

    currentItem: any;

    constructor(public infoLayoutService: InfoLayoutService,
        public infoFormService: InfoFormService,
        public infoGroupService: InfoGroupService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder) {
    }

    search(event: AutoCompleteCompleteEvent) {
        this.autoGroups = this.groups.filter((c: any) => c.name.indexOf(event.query) > -1 || c.code.indexOf(event.query) > -1);
        this.changeDetectorRef.detectChanges();
    }

    showCopyDialog(item: any) {
        this.layoutCopy = item;
        this.formCopyControl.controls['group'].setValue(null);
        this.visible = true;
    }

    async getListGroups() {
        const res = await firstValueFrom(this.infoGroupService.getList({ pageSize: Number.MAX_SAFE_INTEGER }));
        this.groups = res.data.list;
        this.changeDetectorRef.detectChanges();
    }

    async getList() {
        const res = await firstValueFrom(this.infoLayoutService.getList({ groupId: this.groupId, pageSize: Number.MAX_SAFE_INTEGER }));
        this.layouts = res.data.list;
        this.changeDetectorRef.detectChanges();
        if (res.data.list.length > 0)
            this.builder(res.data.list[0]);
    }

    onSubmit(e: any) {
        this.getList();
    }

    async builder(item: any) {

        this.currentItem = item;

        const res = await firstValueFrom(this.infoLayoutService.editing({ id: item.id }));

        this.messageService.add({
            severity: res.statusCode === ResponseCode.ZERO ? 'success' : 'warn',
            summary: 'Thông báo',
            detail: res.message,
            life: 3000
        });

        if (res.statusCode === ResponseCode.ZERO)
            item.isEditing = true;

        this.parent.getList(item.id);
    }

    async unlock(item: any) {

        const res = await firstValueFrom(this.infoLayoutService.editing({ id: item.id, isEnd: true }));

        this.messageService.add({
            severity: res.statusCode === ResponseCode.ZERO ? 'success' : 'warn',
            summary: 'Thông báo',
            detail: res.message,
            life: 3000
        });

        if (res.statusCode === ResponseCode.ZERO)
            item.isEditing = false;

        this.changeDetectorRef.detectChanges();
    }

    copyItem(event: any) {

        if (this.formCopyControl.value["to"] === 'OTHER_GROUP' && this.formCopyControl.value['group'] === null) {
            this.messageService.add({
                severity: 'warn',
                summary: 'Thông báo',
                detail: 'Vui lòng chọn nhóm',
                life: 3000
            });
            return;
        }

        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: this.formCopyControl.value["to"] === 'CLONE'
                ? `Bạn muốn copy ${this.layoutCopy.name}?`
                : `Bạn muốn copy ${this.layoutCopy.name} vào nhóm ${this.formCopyControl.value['group'].name}?`,
            header: 'Xác nhận',
            icon: 'pi pi-exclamation-triangle',
            acceptIcon: "none",
            acceptLabel: "Copy",
            rejectIcon: "none",
            rejectLabel: "Đóng",
            rejectButtonStyleClass: "p-button-text",
            accept: () => {
                this.copy(this.layoutCopy);
            }
        });
    }

    async copy(item: any) {

        this.isSubmiting = true;

        const res = await firstValueFrom(this.infoFormService.getList({ layoutId: item.id, pageSize: Number.MAX_SAFE_INTEGER }));

        const resLayout = await firstValueFrom(this.infoLayoutService.addOrEdit({
            "groupId": this.formCopyControl.value["to"] === 'CLONE'
                ? item.groupId
                : this.formCopyControl.value['group'].id,
            "typeId": null,
            "name": `${item.name} - Copy`,
            "code": `${item.code}_copy`,
            "description": null,
            "group": null,
            "isShow": true,
            "isDeleted": false
        }));

        await this.copyForm(resLayout.data.id, null, null, res.data.list);

        this.messageService.add({
            severity: 'success',
            summary: 'Thông báo',
            detail: 'Copy thông tin thành công.',
            life: 3000
        });

        this.isSubmiting = false;

        this.visible = false;

        if (this.formCopyControl.value["to"] === 'CLONE')
            await this.getList();
    }

    async copyForm(layoutId: any, parentId: any, newParentId: any, lst: any[]) {

        for (const item of lst.filter((c: any) => c.parentId === parentId)) {

            const res = await firstValueFrom(this.infoFormService.addOrEdit({
                "layoutId": layoutId,
                "propertyId": item.propertyId,
                "parentId": newParentId,
                "name": item.name,
                "code": item.code,
                "message": item.message,
                "hint": item.hint,
                "placeholder": item.placeholder,
                "size": item.size,
                "cssClass": item.cssClass,
                "cssStyle": item.cssStyle,
                "icon": item.icon,
                "iconClass": item.iconClass,
                "action": item.action,
                "referenceCode": item.referenceCode,
                "displayOrder": item.displayOrder,
                "defaultValue": item.defaultValue,
                "controlType": item.controlType,
                "expressionValidate": item.expressionValidate,
                "expressionDisplay": item.expressionDisplay,
                "expressionReadonly": item.expressionReadonly,
                "expressionData": item.expressionData,
                "lookupData": item.lookupData,
                "permission": item.lookupData,
                "isRequired": item.isRequired,
                "isShow": true,
                "isDeleted": false,
                "isReadOnly": item.isReadOnly
            }));

            await this.copyForm(layoutId, item.id, res.data.id, lst);
        }
    }

    async init() {

        this.formCopyControl = this.formBuilder.group({
            to: ['CLONE', [Validators.required]],
            group: [null, [Validators.required]]
        });

        await this.getListGroups();
        await this.getList();
    }

    open(item: any = null) {
        this.layoutEdit.showDialog(item);
    }

    deleteItem(event: any, item: any = null) {
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
                this.deleteItemSubmit(item);
            }
        });
    }

    async deleteItemSubmit(item: any = null) {

        const res = await firstValueFrom(this.infoLayoutService.delete({ id: item.id }));

        this.messageService.add({
            severity: 'warn',
            summary: 'Thông báo',
            detail: res.message,
            life: 3000
        });

        this.changeDetectorRef.detectChanges();

        this.getList();
    }

    ngOnInit(): void {
        this.init();
    }
}
