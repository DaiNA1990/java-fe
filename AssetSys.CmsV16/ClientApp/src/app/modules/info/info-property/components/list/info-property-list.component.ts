import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InfoPropertyService } from '../../services/info-property.service';

@Component({
    selector: 'app-info-property-list',
    templateUrl: `./info-property-list.component.html`,
})
export class InfoPropertyListComponent implements OnInit {

    @Input() groupId: number;

    formFilter: FormGroup;

    constructor(public service: InfoPropertyService,
        private fb: FormBuilder) { }

    init() {
        this.formFilter = this.fb.group({
            groupId: [this.groupId, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        this.init();
    }
}