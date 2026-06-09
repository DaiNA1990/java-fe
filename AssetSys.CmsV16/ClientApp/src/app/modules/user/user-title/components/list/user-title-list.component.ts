import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserTitleService } from '../../services/user-title.service';

@Component({
    selector: 'app-user-title-list',
    templateUrl: `./user-title-list.component.html`,
})
export class UserTitleListComponent implements OnInit {

    formFilter: FormGroup;

    constructor(public service: UserTitleService,
        private fb: FormBuilder) { }

    init() {
        this.formFilter = this.fb.group({});
    }

    ngOnInit(): void {
        this.init();
    }
}