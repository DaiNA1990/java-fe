import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
    selector: 'app-info-page-number',
    template: `
        <p-inputNumber [formControl]="formCtrl"
            mode="decimal"
            [showButtons]="false"
            [placeholder]="formItem.placeholder || ''"
            inputId="minmax-buttons"
            [min]="min"
            [max]="max"
            [minFractionDigits]="isDecimal ? 2 : 0"
            [maxFractionDigits]="isDecimal ? 5 : 0"
            [useGrouping]="isCurrency"
            [inputStyle]="{'text-align':'right'}" />
    `,
})
export class InfoPageNumberComponent implements OnInit {

    @Input() formCtrl: FormControl;
    @Input() formItem: any;
    @Input() isDecimal: boolean = false;
    @Input() isCurrency: boolean = true;
    @Input() readOnly: boolean = false;

    min: number = 0;
    max: number = Number.MAX_SAFE_INTEGER;

    constructor(private changeDetectorRef: ChangeDetectorRef) { }

    init() {

        try {

            if (this.formItem.isReadOnly || this.readOnly)
                this.formCtrl.disable();

            if (this.formItem.expressionValidate === null || this.formItem.expressionValidate === '')
                return;

            const expression = JSON.parse(this.formItem.expressionValidate);

            this.min = parseInt(expression.find((c: any) => c.enable && c.code === 'min')?.value) || 0;
            this.max = parseInt(expression.find((c: any) => c.enable && c.code === 'max')?.value) || Number.MAX_SAFE_INTEGER;

        } catch (ex) {
            console.log(ex);
        }
    }

    ngOnInit(): void {
        this.init();
    }
}
