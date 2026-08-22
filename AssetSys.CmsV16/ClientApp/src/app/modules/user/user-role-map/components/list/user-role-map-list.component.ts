import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserRoleMapService } from '../../services/user-role-map.service';

@Component({
    selector: 'app-user-role-map-list',
    templateUrl: `./user-role-map-list.component.html`,
    standalone: false
})
export class UserRoleMapListComponent implements OnInit {

    formFilter: FormGroup;

    constructor(public userRoleMapService: UserRoleMapService,
        private formBuilder: FormBuilder) { }

    init() {
        this.formFilter = this.formBuilder.group({});
    }

    ngOnInit(): void {
        this.init();
    }
}