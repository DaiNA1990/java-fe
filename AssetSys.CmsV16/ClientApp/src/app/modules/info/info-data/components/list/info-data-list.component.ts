import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InfoDataService } from '../../services/info-data.service';

@Component({
    selector: 'app-info-data-list',
    templateUrl: `./info-data-list.component.html`,
    standalone: false
})
export class InfoDataListComponent implements OnInit {

    formFilter: FormGroup;

    constructor(public infoDataService: InfoDataService,
        private formBuilder: FormBuilder) { }

    init() {
        this.formFilter = this.formBuilder.group({});
    }

    ngOnInit(): void {
        this.init();
    }
}