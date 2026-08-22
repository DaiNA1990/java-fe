import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserLevelService } from '../../services/user-level.service';

@Component({
    selector: 'app-user-level-list',
    templateUrl: `./user-level-list.component.html`,
    standalone: false
})
export class UserLevelListComponent implements OnInit {

    formFilter: FormGroup;

    constructor(public userLevelService: UserLevelService,
        private formBuilder: FormBuilder) { }

    init() {
        this.formFilter = this.formBuilder.group({});
    }

    ngOnInit(): void {
        this.init();
    }
}