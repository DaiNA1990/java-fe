import { Component, Input, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ResourceInfoService } from '../../services/resource.service';

@Component({
    selector: 'app-resource-list',
    templateUrl: `./resource-list.component.html`,
})
export class ResourceInfoListComponent implements OnInit {

    @Input() parentCode: string;

    formFilter: FormGroup;

    constructor(public resourceInfoService: ResourceInfoService,
        private formBuilder: FormBuilder) { }

    init() {
        this.formFilter = this.formBuilder.group({
            parentCode: [this.parentCode, Validators.nullValidator]
        });
    }

    ngOnInit(): void {
        this.init();
    }
}