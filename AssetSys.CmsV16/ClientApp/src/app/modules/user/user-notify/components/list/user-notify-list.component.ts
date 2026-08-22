import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserNotifyService } from '../../services/user-notify.service';

@Component({
    selector: 'app-user-notify-list',
    templateUrl: `./user-notify-list.component.html`,
    standalone: false
})
export class UserNotifyListComponent implements OnInit {

    formFilter: FormGroup;

    constructor(public userNotifyService: UserNotifyService,
        private formBuilder: FormBuilder) { }

    init() {
        this.formFilter = this.formBuilder.group({});
    }

    ngOnInit(): void {
        this.init();
    }
}