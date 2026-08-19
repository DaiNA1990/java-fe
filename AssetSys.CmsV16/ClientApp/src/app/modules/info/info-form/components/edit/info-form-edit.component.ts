import { Component, forwardRef, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { InfoFormService } from '../../services/info-form.service';
import { InfoPropertyService } from '@appkkkh/modules/info/info-property/services/info-property.service';

@Component({
    selector: 'app-info-form-edit',
    templateUrl: `./info-form-edit.component.html`,
    providers: [
        {
            provide: NbDialogBaseComponent,
            multi: true,
            useExisting: forwardRef(() => InfoFormEditComponent)
        }
    ]
})
export class InfoFormEditComponent extends NbDialogBaseComponent {

    @Input() layoutId: number | null;
    @Input() groupId: number | null;

    propertyDS = () => this.infoPropertyService.autocomplete({ groupId: this.groupId, pageSize: Number.MAX_SAFE_INTEGER });
    formDS = () => this.infoFormService.autocomplete({ layoutId: this.layoutId, pageSize: Number.MAX_SAFE_INTEGER });

    controlTypes = [
        {
            value: 'plantext',
            text: 'Plantext'
        },
        {
            value: 'text',
            text: 'Text'
        },
        {
            value: 'textarea',
            text: 'Textarea'
        },
        {
            value: 'select',
            text: 'Select'
        },
        {
            value: 'autocomplete',
            text: 'Autocomplete'
        },
        {
            value: 'checkbox',
            text: 'Checkbox'
        },
        {
            value: 'datetime',
            text: 'Datetime'
        },
        {
            value: 'number',
            text: 'Number'
        },
        {
            value: 'radio',
            text: 'Radio'
        },
        {
            value: 'grid',
            text: 'Grid'
        },
        {
            value: 'grid-item',
            text: 'Grid item'
        }
    ]

    constructor(public infoFormService: InfoFormService,
        public infoPropertyService: InfoPropertyService,
        private formBuilder: FormBuilder) {
        super(infoFormService);
    }

    buildForm() {
        this.form = this.formBuilder.group({
            id: [null, [Validators.nullValidator]],
            layoutId: [this.layoutId, [Validators.nullValidator]],
            propertyId: [null, [Validators.nullValidator]],
            parentId: [null, [Validators.nullValidator]],
            size: [null, [Validators.nullValidator]],
            displayOrder: [null, [Validators.nullValidator]],
            name: [null, [Validators.required]],
            message: [null, [Validators.nullValidator]],
            hint: [null, [Validators.nullValidator]],
            controlType: [null, [Validators.required]],
            expressionValidate: [null, [Validators.nullValidator]],
            expressionDisplay: [null, [Validators.nullValidator]],
            expressionReadonly: [null, [Validators.nullValidator]],
            expressionData: [null, [Validators.nullValidator]],
            lookupData: [null, [Validators.nullValidator]],
            isShow: [null, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
