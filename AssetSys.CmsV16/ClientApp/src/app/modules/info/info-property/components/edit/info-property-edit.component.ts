import { Component, forwardRef, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
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
        });

        this.subscriptions.push(this.form.controls['code'].valueChanges.subscribe((c: any) => {
            this.form.controls['code'].setValue(c.replaceAll(' ', '_').replaceAll('-', '_').toLowerCase(), {
                emitEvent: false
            });
        }));
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
