import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserActivityService } from '../../services/user-activity.service';

@Component({
    selector: 'app-user-activity-list',
    templateUrl: `./user-activity-list.component.html`,
})
export class UserActivityListComponent implements OnInit {

    formFilter: FormGroup;

    constructor(public service: UserActivityService,
        private fb: FormBuilder) { }

    init() {
        this.formFilter = this.fb.group({});
    }

    ngOnInit(): void {
        this.init();
    }
}