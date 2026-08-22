import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { InfoPropertyService } from '@appkkkh/modules/info/info-property/services/info-property.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import icons from '@appkkkh/_metronic/shared/keenicon/icons.json';
import { InfoFormDesignComponent } from '../../../design/component';
import { InfoFormService } from '@appkkkh/modules/info/info-form/services/info-form.service';

@Component({
    selector: 'app-info-form-property-build-data',
    templateUrl: `./component.html`,
    providers: [ConfirmationService, MessageService],
    standalone: false
})
export class InfoFormPropertyBuildDataComponent implements OnInit {

    @Input() formCtrl: AbstractControl = new FormControl();

    formControl: FormGroup;
    formItemControl: FormGroup;
    formReferenceControl: FormGroup;

    visible: boolean = false;

    lst: any[] = [];

    lstReference: any[] = [];

    constructor(public infoFormService: InfoFormService,
        public infoPropertyService: InfoPropertyService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder) {
    }

    addItem() {
        this.lst.push(this.formItemControl.value);
        this.formItemControl.reset();
    }

    removeItem(item: any) {
        this.lst.splice(this.lst.indexOf(item), 1);
    }

    addReferenceItem() {
        this.lstReference.push({
            name: this.formReferenceControl.controls.name.value,
            value: this.formReferenceControl.controls.value.value
        });
        this.formReferenceControl.controls.name.setValue(null);
        this.formReferenceControl.controls.value.setValue(null);
    }

    removeReferenceItem(item: any) {
        this.lstReference.splice(this.lstReference.indexOf(item), 1);
    }

    open() {
        this.visible = true;
        this.changeDetectorRef.detectChanges();
    }

    save() {
      console.log('this.formControl.controls',this.formControl.controls)
        if (this.formControl.controls.typeData.value === 'CUSTOM')
            this.formControl.controls.data.setValue(this.lst);

        if (this.formControl.controls.typeData.value === 'REFERENCE' || this.formControl.controls.typeData.value === 'API')
            this.formControl.controls.data.setValue({
                code: this.formReferenceControl.controls.code.value,
                sortField: this.formReferenceControl.controls.sortField.value,
                list: this.lstReference
            });

        if (this.formControl.invalid) {
            this.formControl.markAllAsTouched();
            this.messageService.add({ severity: 'warn', summary: 'Thông báo', detail: 'Vui lòng nhập đúng các trường thông tin', life: 3000 });
            return;
        }

        this.formCtrl.setValue(JSON.stringify(this.formControl.value));

        this.visible = false;
    }

    init() {

        let obj: any = null;

        try {
            obj = JSON.parse(this.formCtrl.value);
        } catch (ex) {
            console.log(ex);
        }

        if (obj !== null && obj.typeData === 'CUSTOM' && Array.isArray(obj.data))
            this.lst = obj.data;

        if (obj !== null && (obj.typeData === 'REFERENCE' || obj.typeData === 'API'))
            this.lstReference = obj.data.list || [];

        this.formControl = this.formBuilder.group({
            typeData: [obj?.typeData || null, [Validators.required]],
            data: [obj?.data || null, [Validators.required]]
        });

        this.formItemControl = this.formBuilder.group({
            name: [null, [Validators.required]],
            value: [null, [Validators.required]]
        });

        this.formReferenceControl = this.formBuilder.group({
            code: [obj !== null && (obj.typeData === 'REFERENCE' || obj.typeData === 'API') ? obj.data?.code : null, [Validators.required]],
            sortField: [obj !== null && (obj.typeData === 'REFERENCE' || obj.typeData === 'API') ? obj.data?.sortField : null],
            name: [null, [Validators.required]],
            value: [null, [Validators.required]]
        });

        this.changeDetectorRef.detectChanges();
    }

    ngOnInit(): void {
        this.init();
    }
}
