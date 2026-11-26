import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserRoleService } from '../../services/user-role.service';
import { UserRoleActionMapAssignComponent } from '@appkkkh/modules/user/user-role-page-action-map/components/assign/user-role-action-map-assign.component';
import { AuthService } from '@appkkkh/modules/user/auth/services/auth.service';

@Component({
    selector: 'app-user-role-list',
    templateUrl: `./user-role-list.component.html`,
})
export class UserRoleListComponent implements OnInit {

    formFilter: FormGroup;

    @ViewChild(UserRoleActionMapAssignComponent) assignActionModal: UserRoleActionMapAssignComponent;

    constructor(public userRoleService: UserRoleService,
        public authService: AuthService,
        private formBuilder: FormBuilder) { }

    assignAction(roleId: number) {
        this.assignActionModal.open(roleId);
    }

    init() {
        this.formFilter = this.formBuilder.group({});
    }

    ngOnInit(): void {
        this.init();
    }
}