import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InfoPropertyService } from '../../services/info-property.service';

@Component({
    selector: 'app-info-property-list',
    templateUrl: `./info-property-list.component.html`,
    standalone: false
})
export class InfoPropertyListComponent implements OnInit {

    @Input() groupId: number;

    formFilter: FormGroup;

    constructor(public infoPropertyService: InfoPropertyService,
        private formBuilder: FormBuilder) { }

    init() {
        this.formFilter = this.formBuilder.group({
            groupId: [this.groupId, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        this.init();
    }
}