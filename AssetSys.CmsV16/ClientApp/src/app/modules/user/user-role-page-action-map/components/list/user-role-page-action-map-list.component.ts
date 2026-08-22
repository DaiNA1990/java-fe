import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserRolePageActionMapService } from '../../services/user-role-page-action-map.service';

@Component({
    selector: 'app-user-role-page-action-map-list',
    templateUrl: `./user-role-page-action-map-list.component.html`,
    standalone: false
})
export class UserRolePageActionMapListComponent implements OnInit {

    formFilter: FormGroup;

    constructor(public userRolePageActionMapService: UserRolePageActionMapService,
        private formBuilder: FormBuilder) { }

    init() {
        this.formFilter = this.formBuilder.group({});
    }

    ngOnInit(): void {
        this.init();
    }
}