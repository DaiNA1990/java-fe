import { ChangeDetectorRef, Component, forwardRef, inject, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, AbstractControl, NG_VALUE_ACCESSOR } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { InfoPropertyService } from '@appkkkh/modules/info/info-property/services/info-property.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { InfoFormService } from '@appkkkh/modules/info/info-form/services/info-form.service';
import { InfoLayoutService } from '@appkkkh/modules/info/info-layout/services/info-layout.service';
import { AutoCompleteCompleteEvent } from 'primeng/autocomplete';
import actionData from './action.json';

interface FCAction {
    target?: string;
    event?: string;
    action?: string;
    data?: string;
    rules: FCAction[];
}

@Component({
    selector: 'app-info-form-property-build-action',
    templateUrl: `./component.html`,
    providers: [ConfirmationService, MessageService]
})
export class InfoFormPropertyBuildActionComponent implements OnInit {

    @Input() groupId: any;
    @Input() layoutId: any;
    @Input() formCtrl: AbstractControl;

    visible: boolean = false;

    lstForms: any[] = [];

    lstLayouts: any[] = [];

    targets: any[];

    actions: any[] = actionData.actions;

    events: any[] = actionData.events;

    dataActions: FCAction = {
        rules: [
            {
                target: '',
                event: '',
                action: '',
                data: '',
                rules: []
            }
        ]
    }

    get hasAction() {
        return this.dataActions.rules.filter((c: FCAction) => c.target !== '').length > 0;
    }

    constructor(public infoPropertyService: InfoPropertyService,
        public infoFormService: InfoFormService,
        public infoLayoutService: InfoLayoutService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder) {
    }

    addCondition(item: FCAction) {

        if (item.rules === undefined || item.rules === null)
            item.rules = [];

        item.rules.push({
            target: '',
            event: '',
            action: '',
            data: '',
            rules: []
        });
    }

    removeCondition(item: FCAction, parent: FCAction) {
        parent.rules.splice(parent.rules.indexOf(item), 1);
    }

    addConditionGroup(item: FCAction) {
        item.rules.push({
            rules: [
                {
                    target: '',
                    event: '',
                    action: '',
                    data: '',
                    rules: []
                }
            ]
        });
    }

    removeConditionGroup(item: FCAction, parent: FCAction) {
        parent.rules.splice(parent.rules.indexOf(item), 1);
    }

    open() {
        this.visible = true;
        this.changeDetectorRef.detectChanges();
    }

    save() {
        this.formCtrl.setValue(JSON.stringify(this.dataActions));
        this.visible = false;
    }

    search(event: AutoCompleteCompleteEvent) {

        this.targets = this.lstForms.filter((c: any) => c.indexOf(event.query) > -1);

        this.targets.push(...this.lstLayouts.filter((c: any) => c.indexOf(event.query) > -1))

        this.changeDetectorRef.detectChanges();
    }

    select(event: any, item: any) {
        item.target = event.value.split('(')[1].split(')')[0];
    }

    async init() {

        const res = await firstValueFrom(this.infoFormService.getList({
            groupId: this.groupId,
            pageSize: Number.MAX_SAFE_INTEGER
        }));

        this.lstForms = res.data.list.map((item: any) => `${item.controlType}: ${item.name}(${item.code})`);

        const resLayout = await firstValueFrom(this.infoLayoutService.getList({
            groupId: this.groupId,
            pageSize: Number.MAX_SAFE_INTEGER
        }));

        this.lstLayouts = resLayout.data.list.map((item: any) => `Layout: ${item.name}(${item.code})`);

        try {
            if (this.formCtrl.value !== null && this.formCtrl.value !== '')
                this.dataActions = JSON.parse(this.formCtrl.value);
        } catch (error) {

        }

        this.changeDetectorRef.detectChanges();
    }

    ngOnInit(): void {
        this.init();
    }
}
