import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InfoFormService } from '../../services/info-form.service';

@Component({
    selector: 'app-info-form-list',
    templateUrl: `./info-form-list.component.html`,
    standalone: false
})
export class InfoFormListComponent implements OnInit {

    @Input() layoutId: number | null;
    @Input() groupId: number | null;

    formFilter: FormGroup;

    constructor(public infoFormService: InfoFormService,        
        private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder) {
    }

    init() {
        this.formFilter = this.formBuilder.group({
            layoutId: [this.layoutId, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        this.init();
    }
}