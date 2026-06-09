import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InfoValueService } from '../../services/info-value.service';

@Component({
    selector: 'app-info-value-list',
    templateUrl: `./info-value-list.component.html`,
})
export class InfoValueListComponent implements OnInit {

    formFilter: FormGroup;

    constructor(public service: InfoValueService,
        private fb: FormBuilder) { }

    init() {
        this.formFilter = this.fb.group({});
    }

    ngOnInit(): void {
        this.init();
    }
}