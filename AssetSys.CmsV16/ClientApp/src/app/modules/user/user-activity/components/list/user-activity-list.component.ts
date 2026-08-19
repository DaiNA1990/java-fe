import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserActivityService } from '../../services/user-activity.service';

@Component({
    selector: 'app-user-activity-list',
    templateUrl: `./user-activity-list.component.html`,
})
export class UserActivityListComponent implements OnInit {

    formFilter: FormGroup;

    constructor(public userActivityService: UserActivityService,
        private formBuilder: FormBuilder) { }

    init() {
        this.formFilter = this.formBuilder.group({});
    }

    ngOnInit(): void {
        this.init();
    }
}