import { Component, Input } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';

@Component({
    selector: 'nb-form-box',
    template: `
    <div class="d-flex flex-column fv-row fv-plugins-icon-container pb-5">
        <label class="d-flex align-items-center fs-6 fw-semibold mb-2" *ngIf="label !== ''">
            <span [ngClass]="{'required': hasValidator}">{{label}}:</span>
            <span class="ms-1" placement="top" [ngbTooltip]="tooltip" *ngIf="tooltip !== ''">
                <app-keenicon name="information-5" class="text-gray-500 fs-6"></app-keenicon>
            </span>
        </label>
        <div class="position-relative p-fluid">
            <ng-content></ng-content>
        </div>
        <div class="text-muted fs-7 mt-3" [innerHTML]="hint" *ngIf="hint !== '' && !(formCtrl.touched && formCtrl.invalid)">
        </div>
        <div class="fv-plugins-message-container fv-plugins-message-container--enabled invalid-feedback"
            [innerHTML]="message" *ngIf="formCtrl.touched && formCtrl.invalid"></div>
    </div>
    `,
})
export class NbBoxComponent {

    @Input() formCtrl: AbstractControl;
	@Input() name: string = '';
	@Input() label: string = '';
	@Input() message: string = '';
	@Input() hint: string = '';
	@Input() tooltip: string = '';
	@Input() iconStart: string;
	@Input() iconEnd: string;
	@Input() readonly: boolean = false;
	@Input() hasValidator: boolean = false;

}
