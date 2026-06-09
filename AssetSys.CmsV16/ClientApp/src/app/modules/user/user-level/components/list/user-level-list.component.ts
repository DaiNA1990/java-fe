import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserLevelService } from '../../services/user-level.service';

@Component({
    selector: 'app-user-level-list',
    templateUrl: `./user-level-list.component.html`,
})
export class UserLevelListComponent implements OnInit {

    formFilter: FormGroup;

    constructor(public service: UserLevelService,
        private fb: FormBuilder) { }

    init() {
        this.formFilter = this.fb.group({});
    }

    ngOnInit(): void {
        this.init();
    }
}