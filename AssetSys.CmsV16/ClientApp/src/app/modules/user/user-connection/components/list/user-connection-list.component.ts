import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserConnectionService } from '../../services/user-connection.service';

@Component({
    selector: 'app-user-connection-list',
    templateUrl: `./user-connection-list.component.html`,
})
export class UserConnectionListComponent implements OnInit {

    formFilter: FormGroup;

    constructor(public service: UserConnectionService,
        private fb: FormBuilder) { }

    init() {
        this.formFilter = this.fb.group({});
    }

    ngOnInit(): void {
        this.init();
    }
}