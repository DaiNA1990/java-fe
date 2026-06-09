import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserRoleService } from '../../services/user-role.service';
import { UserRoleActionMapAssignComponent } from '@appkkkh/modules/user/user-role-page-action-map/components/assign/user-role-action-map-assign.component';

@Component({
    selector: 'app-user-role-list',
    templateUrl: `./user-role-list.component.html`,
})
export class UserRoleListComponent implements OnInit {

    formFilter: FormGroup;

    @ViewChild(UserRoleActionMapAssignComponent) assignActionModal: UserRoleActionMapAssignComponent;

    constructor(public service: UserRoleService,
        private fb: FormBuilder) { }

    assignAction(roleId: number) {
        this.assignActionModal.open(roleId);
    }

    init() {
        this.formFilter = this.fb.group({});
    }

    ngOnInit(): void {
        this.init();
    }
}