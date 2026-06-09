import { ChangeDetectorRef, Component, inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { InfoPropertyService } from '@appkkkh/modules/info/info-property/services/info-property.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import icons from '@appkkkh/_metronic/shared/keenicon/icons.json';
import { InfoFormDesignComponent } from '../../../design/component';
import { InfoFormService } from '@appkkkh/modules/info/info-form/services/info-form.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';

@Component({
    selector: 'app-info-form-property-build-condition-readonly',
    templateUrl: `./component.html`,
    providers: [ConfirmationService, MessageService]
})
export class InfoFormPropertyBuildConditionReadOnlyComponent implements OnInit {

    @Input() groupId: any;
    @Input() formCtrl: AbstractControl = new FormControl();
    @Input() label: any;

    //private parent: any = inject(InfoFormDesignComponent, { optional: true });

    formControl: FormGroup;

    //propertyDS = () => this.propertyService.autocomplete({ groupId: this.groupId, pageSize: Number.MAX_SAFE_INTEGER });
    //formDS = () => this.service.autocomplete({ layoutId: this.layoutId, pageSize: Number.MAX_SAFE_INTEGER });

    visible: boolean = false;

    lstFields: any[] = [];

    lstAutoFields: any[] = [];

    operators: any[] = [
        {
            name: '=',
            value: '=='
        },
        {
            name: '<',
            value: '<'
        },
        {
            name: '<=',
            value: '<='
        },
        {
            name: '>=',
            value: '>='
        },
        {
            name: '>',
            value: '>'
        },
        {
            name: '!=',
            value: '!='
        },
        {
            name: 'in',
            value: 'in'
        },
        {
            name: 'not in',
            value: 'not in'
        },
        {
            name: 'contains',
            value: 'contains'
        },
        {
            name: 'is null',
            value: 'is null'
        },
        {
            name: 'is not null',
            value: 'is not null'
        }
    ];

    conditions: any = {
        affirmation: 'AFFIRMATIVE',
        condition: '',
        rules: [
            // {
            //     field: '',
            //     operator: '=',
            //     value: ''
            // },
            // {
            //     condition: 'or',
            //     rules: [
            //         {
            //             field: '',
            //             operator: 'contains',
            //             value: ''
            //         },
            //         {
            //             field: '',
            //             operator: 'contains',
            //             value: ''
            //         }
            //     ]
            // }
        ]
    }

    get hasCondition() {
        return this.conditions?.rules?.length > 0;
    }

    constructor(public service: InfoFormService,
        public propertyService: InfoPropertyService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder) {
    }

    addCondition(item: any) {
        item.rules.push({
            field: '',
            operator: '',
            value: ''
        });
    }

    removeCondition(item: any, parent: any) {
        parent.rules.splice(parent.rules.indexOf(item), 1);
    }

    addConditionGroup(item: any) {
        item.rules.push({
            condition: 'and',
            rules: [
                {
                    field: '',
                    operator: '',
                    value: ''
                }
            ]
        });
    }

    removeConditionGroup(item: any, parent: any) {
        parent.rules.splice(parent.rules.indexOf(item), 1);
    }

    search(event: AutoCompleteCompleteEvent) {

        this.lstAutoFields = this.lstFields.map((item: any) => `${item.name}(${item.code})`).filter((c: any) => c.indexOf(event.query) > -1);

        this.cdr.detectChanges();
    }

    select(event: any, item: any) {
        item.field = event.value.split('(')[1].split(')')[0];
    }

    open() {
        this.visible = true;
        this.cdr.detectChanges();
    }

    save() {

        this.formCtrl.setValue(this.conditions?.rules?.length > 0 ? JSON.stringify(this.conditions) : null);
        this.visible = false;

        if (this.formControl.invalid) {
            this.formControl.markAllAsTouched();
            this.messageService.add({ severity: 'warn', summary: 'Thông báo', detail: 'Vui lòng nhập đúng các trường thông tin', life: 3000 });
            return;
        }
    }

    async init() {

        this.formControl = this.fb.group({
            typeData: [null, [Validators.required]],
            data: [null, [Validators.required]]
        });

        try {
            if (this.formCtrl.value !== null)
                this.conditions = JSON.parse(this.formCtrl.value);
        } catch (ex) {
            console.log(ex + '\n' + this.formCtrl.value);
        }

        const res = await firstValueFrom(this.propertyService.getList({ groupId: this.groupId, pageSize: Number.MAX_SAFE_INTEGER }));

        this.lstFields = res.data.list;

        this.cdr.detectChanges();
    }

    ngOnInit(): void {
        this.init();
    }
}
