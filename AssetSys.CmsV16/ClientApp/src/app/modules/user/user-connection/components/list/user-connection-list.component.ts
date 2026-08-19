import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserConnectionService } from '../../services/user-connection.service';

@Component({
    selector: 'app-user-connection-list',
    templateUrl: `./user-connection-list.component.html`,
})
export class UserConnectionListComponent implements OnInit {

    formFilter: FormGroup;

    constructor(public userConnectionService: UserConnectionService,
        private formBuilder: FormBuilder) { }

    init() {
        this.formFilter = this.formBuilder.group({});
    }

    ngOnInit(): void {
        this.init();
    }
}