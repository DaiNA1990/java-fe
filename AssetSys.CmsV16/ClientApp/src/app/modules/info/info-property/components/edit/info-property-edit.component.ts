import { Component, forwardRef, Input } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { InfoPropertyService } from '../../services/info-property.service';

@Component({
    selector: 'app-info-property-edit',
    templateUrl: `./info-property-edit.component.html`,
    providers: [
        {
            provide: NbDialogBaseComponent,
            multi: true,
            useExisting: forwardRef(() => InfoPropertyEditComponent)
        }
    ]
})
export class InfoPropertyEditComponent extends NbDialogBaseComponent {

    @Input() groupId: number | null;

    orgUnitField = new FormControl('org-none');
    orgUnitFields = [
        { value: 'org-none', name: 'Không' },
        { value: 'org-company', name: 'Mã đơn vị' },
        { value: 'org-department', name: 'Mã phòng ban' },
    ];

    typeDatas = [
        {
            value: 'string',
            text: 'string'
        },
        {
            value: 'number',
            text: 'number'
        },
        {
            value: 'date',
            text: 'date'
        },
        {
            value: 'decimal',
            text: 'decimal'
        },
        {
            value: 'currency',
            text: 'currency'
        },
        {
            value: 'bool',
            text: 'bool'
        },
        {
            value: 'array',
            text: 'array'
        },
        {
            value: 'table',
            text: 'table'
        }
    ]

    constructor(public infoPropertyService: InfoPropertyService,
        private formBuilder: FormBuilder) {
        super(infoPropertyService);
    }

    buildForm() {
        this.form = this.formBuilder.group({
            id: [null, [Validators.nullValidator]],
            groupId: [this.groupId, [Validators.nullValidator]],
            typeData: [null, [Validators.required]],
            name: [null, [Validators.required]],
            code: [null, [Validators.required]],
            description: [null, [Validators.nullValidator]],
            isShow: [null, [Validators.nullValidator]],
            permission: [null, [Validators.nullValidator]],
            isWorkflowManaged: [false, [Validators.nullValidator]],
            isCompanyField: [false, [Validators.nullValidator]],
            isDepartmentField: [false, [Validators.nullValidator]],
            isUnique: [false, [Validators.nullValidator]],
            orgUnits: [null, [Validators.nullValidator]],
        });

        // Chỉ chọn 1 trong 2 cờ (hoặc không chọn) - control phụ, không nằm trong form nên không gửi lên API
        this.orgUnitField = new FormControl('org-none');
        this.subscriptions.push(this.orgUnitField.valueChanges.subscribe((v: any) => {
            this.form.controls['isCompanyField'].setValue(v === 'org-company');
            this.form.controls['isDepartmentField'].setValue(v === 'org-department');
        }));

        this.subscriptions.push(this.form.controls['code'].valueChanges.subscribe((c: any) => {
            this.form.controls['code'].setValue(c.replaceAll(' ', '_').replaceAll('-', '_').toLowerCase(), {
                emitEvent: false
            });
        }));
    }

    // Sau khi load dữ liệu sửa: đổi 2 cờ boolean -> giá trị radio
    onShow(): void {
        const v = this.form.controls['isCompanyField'].value ? 'org-company'
            : this.form.controls['isDepartmentField'].value ? 'org-department'
            : 'org-none';
        this.orgUnitField.setValue(v);
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
