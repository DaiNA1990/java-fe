import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InfoValueService } from '../../services/info-value.service';

@Component({
    selector: 'app-info-value-list',
    templateUrl: `./info-value-list.component.html`,
    standalone: false
})
export class InfoValueListComponent implements OnInit {

    formFilter: FormGroup;

    constructor(public infoValueService: InfoValueService,
        private formBuilder: FormBuilder) { }

    init() {
        this.formFilter = this.formBuilder.group({});
    }

    ngOnInit(): void {
        this.init();
    }
}