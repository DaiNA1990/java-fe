import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { InfoPropertyService } from '@appkkkh/modules/info/info-property/services/info-property.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import icons from '@appkkkh/_metronic/shared/keenicon/icons.json';
import { InfoFormDesignComponent } from '../../../design/component';
import { InfoFormService } from '@appkkkh/modules/info/info-form/services/info-form.service';

@Component({
    selector: 'app-info-form-property-build-validate',
    templateUrl: `./component.html`,
    providers: [ConfirmationService, MessageService]
})
export class InfoFormPropertyBuildValidateComponent implements OnInit {

    @Input() formCtrl: AbstractControl = new FormControl();

    visible: boolean = false;

    validateData: any[] = [
        {
            name: 'Bắt buộc',
            code: 'require',
            enable: false,
            value: null,
            message: null
        },
        {
            name: 'Duy nhất',
            code: 'unique',
            enable: false,
            value: null,
            message: null
        },
        {
            name: 'Giới hạn ký tự từ',
            code: 'min-length',
            enable: false,
            value: null,
            message: null
        },
        {
            name: 'Giới hạn ký tự đến',
            code: 'max-length',
            enable: false,
            value: null,
            message: null
        },
        {
            name: 'Giới hạn giá trị từ',
            code: 'min',
            enable: false,
            value: null,
            message: null
        },
        {
            name: 'Giới hạn giá trị đến',
            code: 'max',
            enable: false,
            value: null,
            message: null
        },
        {
            name: 'Expression',
            code: 'expression',
            enable: false,
            value: null,
            message: null
        }
    ]

    get numberValidate() {
        return this.validateData.filter((c: any) => c.enable === true).length;
    }

    constructor(public infoFormService: InfoFormService,
        public infoPropertyService: InfoPropertyService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder) {
    }

    open() {
        this.visible = true;
        this.changeDetectorRef.detectChanges();
    }

    save() {
        this.formCtrl.setValue(JSON.stringify(this.validateData));
        this.visible = false;
    }

    init() {
        try {
            Object.assign(this.validateData, JSON.parse(this.formCtrl.value));
        } catch (ex) {
            console.log(ex);
        }
    }

    ngOnInit(): void {
        this.init();
    }
}