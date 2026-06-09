import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InfoDataService } from '../../services/info-data.service';

@Component({
    selector: 'app-info-data-list',
    templateUrl: `./info-data-list.component.html`,
})
export class InfoDataListComponent implements OnInit {

    formFilter: FormGroup;

    constructor(public service: InfoDataService,
        private fb: FormBuilder) { }

    init() {
        this.formFilter = this.fb.group({});
    }

    ngOnInit(): void {
        this.init();
    }
}