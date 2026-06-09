import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserNotifyService } from '../../services/user-notify.service';

@Component({
    selector: 'app-user-notify-list',
    templateUrl: `./user-notify-list.component.html`,
})
export class UserNotifyListComponent implements OnInit {

    formFilter: FormGroup;

    constructor(public service: UserNotifyService,
        private fb: FormBuilder) { }

    init() {
        this.formFilter = this.fb.group({});
    }

    ngOnInit(): void {
        this.init();
    }
}