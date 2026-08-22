import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { InfoPropertyService } from '@appkkkh/modules/info/info-property/services/info-property.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InfoPropertyEditComponent } from '@appkkkh/modules/info/info-property/components/edit/info-property-edit.component';
import { RemoveUnicodePipe } from '@appkkkh/infrastructure/pipes/remove-unicode.pipe';

@Component({
    selector: 'app-info-form-data-field',
    templateUrl: `./component.html`,
    styles: [
        `::ng-deep {
            .p-panel-content {
                padding: 5px;
            }
        }
        `
    ],
    providers: [ConfirmationService, MessageService, RemoveUnicodePipe],
    standalone: false
})
export class InfoFormDataFieldComponent implements OnInit {

    @Input() groupId: number | null;

    @ViewChild(InfoPropertyEditComponent, { static: false }) propertyEdit: InfoPropertyEditComponent;

    keywordCtrl: AbstractControl = new FormControl();

    lstProperty: any[] = [];

    properties: any[] = [];

    visible: boolean = false;
    formAddGroupControl: FormGroup;
    autoGroups: any[] = [];
    isSubmiting: boolean = false;

    constructor(public infoPropertyService: InfoPropertyService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private removeUnicodePipe: RemoveUnicodePipe,
        private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder) {
    }

    async getList() {
        const res = await firstValueFrom(this.infoPropertyService.getList({ groupId: this.groupId, pageSize: Number.MAX_SAFE_INTEGER }));
        this.lstProperty = res.data.list;
        this.filter('');
    }

    open(item: any = null) {
        this.propertyEdit.showDialog(item);
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

    keywordChange(event: any) {
        this.filter(event);
    }

    filter(keyword: any) {
        this.properties = this.lstProperty.filter(x => x.name.toLowerCase().includes(keyword.toLowerCase()) || x.code.toLowerCase().includes(keyword.toLowerCase()));
        this.changeDetectorRef.detectChanges();
    }

    async deleteItemSubmit(item: any = null) {

        const res = await firstValueFrom(this.infoPropertyService.delete({ id: item.id }));

        this.messageService.add({
            severity: 'warn',
            summary: 'Thông báo',
            detail: res.message,
            life: 3000
        });

        this.changeDetectorRef.detectChanges();

        this.getList();
    }

    async onPropertySubmit(e: any) {
        this.getList();
    }

    openAddGroup() {
        this.visible = true;
    }

    async submit(event: any) {

        this.isSubmiting = true;

        for (const line of this.formAddGroupControl.value.fields.split('\n')) {
            const arr = line.split('|');

            await firstValueFrom(this.infoPropertyService.addOrEdit({
                name: arr[0],
                code: this.removeUnicodePipe.transform(arr[0]),
                typeData: this.removeUnicodePipe.transform(arr[1]),
                groupId: this.groupId,
                isShow: true
            }));

            this.isSubmiting = false;
        }

        this.messageService.add({
            severity: 'info',
            summary: 'Thông báo',
            detail: 'Thêm mới thành công',
            life: 3000
        });

        this.getList();

        this.visible = false;
    }

    ngOnInit(): void {

        this.formAddGroupControl = this.formBuilder.group({
            fields: [null, [Validators.nullValidator]],
        });

        this.getList();
    }
}
