import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InfoFormService } from '../../services/info-form.service';
import { firstValueFrom } from 'rxjs';
import { InfoPropertyService } from '@appkkkh/modules/info/info-property/services/info-property.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import icons from '@appkkkh/_metronic/shared/keenicon/icons.json';
import controlTypes from './controls.json';
import cssClass from './css-class.json';
import { InfoFormDesignComponent } from '../design/component';
import { ResponseCode } from '@appkkkh/core/contants/app.enum';

@Component({
    selector: 'app-info-form-property',
    templateUrl: `./component.html`,
    providers: [ConfirmationService, MessageService],
    standalone: false
})
export class InfoFormPropertyComponent implements OnInit {

    private parent: any = inject(InfoFormDesignComponent, { optional: true });

    isLoadProperty: boolean = true;

    formControl: FormGroup;
    controlTypes: any[] | undefined = controlTypes;
    classItems: any[] = cssClass;
    iconItems: any[] = Object.entries(icons.categories).map((c: any) => c[1]).join().split(',').map(s => ({ text: s, value: s }));
    sizeItems: any[] = [...Array(12).keys()].map((i: any) => ({
        "text": `${i + 1}`,
        "value": i + 1
    }));

    propertyItem: any = null;

    lastControlType: string | null = null;
    lastDisplayOrder: number = 0;

    get layoutId() {
        return this.propertyItem?.layoutId;
    }

    get groupId() {
        return this.propertyItem?.layout?.groupId || this.parent.groupId;
    }

    propertyDS = () => this.infoPropertyService.autocomplete({
        groupId: this.groupId,
        pageSize: Number.MAX_SAFE_INTEGER
    });

    formDS = () => this.infoFormService.autocomplete({
        layoutId: this.layoutId,
        pageSize: Number.MAX_SAFE_INTEGER
    });

    constructor(public infoFormService: InfoFormService,
        public infoPropertyService: InfoPropertyService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder) {
    }

    saveLastValue() {
        this.lastDisplayOrder = this.formControl.value['displayOrder'];
        this.lastControlType = this.formControl.value['controlType'];
    }

    itemChosen(item: any) {

        this.propertyItem = item;
        this.formControl.controls['layoutId'].setValue(item.layoutId);
        this.isLoadProperty = false;

        setTimeout(() => {

            Object.entries(item).forEach(entry => {
                const [key, value] = entry;
                if (this.formControl.controls[key] !== undefined) {
                    if (typeof value === 'string' && /^\d{4}-\d{1,2}-\d{1,2}/.test(value)) {
                        this.formControl.controls[key].setValue(new Date(value));
                    } else {
                        this.formControl.controls[key].setValue(value);
                    }
                }
            });

            this.saveLastValue();

            this.isLoadProperty = true;

            this.changeDetectorRef.detectChanges();

        }, 0);
    }

    async itemSave() {

        const index = this.parent.controls.findIndex((item: any) => item.id === this.formControl.controls['id'].value);

        if(this.parent.controls[index] === undefined)
        {
            this.messageService.add({ severity: 'warn', summary: 'Thông báo', detail: 'Lựa chọn control cần chỉnh sửa.', life: 3000 });
            return;
        }

        Object.assign(this.parent.controls[index], this.formControl.value);

        if (this.formControl.controls['id'].value !== null && this.formControl.controls['id'].value < 1)
            this.formControl.controls['id'].setValue(null);

        const res = await firstValueFrom(this.infoFormService.addOrEdit(this.formControl.value));

        if (res.statusCode !== ResponseCode.ZERO)
        {
            this.messageService.add({ severity: 'warn', summary: 'Thông báo', detail: res.message, life: 3000 });
            return;
        }

        this.parent.controls[index].id = res.data.id;
        this.formControl.controls['id'].setValue(res.data.id);

        this.saveLastValue();

        this.changeDetectorRef.detectChanges();

        this.messageService.add({ severity: 'success', summary: 'Thông báo', detail: 'Cập nhật thông tin thành công', life: 3000 });
    }

    init() {
        this.formControl = this.formBuilder.group({
            id: [null, [Validators.nullValidator]],
            layoutId: [null, [Validators.nullValidator]],
            propertyId: [null, [Validators.nullValidator]],
            parentId: [null, [Validators.nullValidator]],
            size: [null, [Validators.nullValidator]],
            displayOrder: [null, [Validators.nullValidator]],
            name: [null, [Validators.required]],
            code: [null, [Validators.nullValidator]],
            message: [null, [Validators.nullValidator]],
            hint: [null, [Validators.nullValidator]],
            placeholder: [null, [Validators.nullValidator]],
            controlType: [null, [Validators.required]],
            defaultValue: [null, [Validators.nullValidator]],
            cssClass: [null, [Validators.nullValidator]],
            cssStyle: [null, [Validators.nullValidator]],
            icon: [null, [Validators.nullValidator]],
            iconClass: [null, [Validators.nullValidator]],
            action: [null, [Validators.nullValidator]],
            referenceCode: [null, [Validators.nullValidator]],
            expressionValidate: [null, [Validators.nullValidator]],
            expressionDisplay: [null, [Validators.nullValidator]],
            expressionReadonly: [null, [Validators.nullValidator]],
            expressionData: [null, [Validators.nullValidator]],
            lookupData: [null, [Validators.nullValidator]],
            permission: [null, [Validators.nullValidator]],
            isRequired: [null, [Validators.nullValidator]],
            isShow: [null, [Validators.nullValidator]],
            isReadOnly: [null, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        this.init();
    }
}
