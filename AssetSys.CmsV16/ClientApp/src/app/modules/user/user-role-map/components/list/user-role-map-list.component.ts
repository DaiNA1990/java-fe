import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserRoleMapService } from '../../services/user-role-map.service';

@Component({
    selector: 'app-user-role-map-list',
    templateUrl: `./user-role-map-list.component.html`,
})
export class UserRoleMapListComponent implements OnInit {

    formFilter: FormGroup;

    constructor(public service: UserRoleMapService,
        private fb: FormBuilder) { }

    init() {
        this.formFilter = this.fb.group({});
    }

    ngOnInit(): void {
        this.init();
    }
}