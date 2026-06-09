import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserRoleMapAssignComponent } from '@appkkkh/modules/user/user-role-map/components/assign/user-role-map-assign.component';

@Component({
    selector: 'app-user-list',
    templateUrl: `./user-list.component.html`,
})
export class UserListComponent implements OnInit {

    formFilter: FormGroup;

    @ViewChild(UserRoleMapAssignComponent) assignRoleModal: UserRoleMapAssignComponent;

    constructor(public userService: UserService,
        private fb: FormBuilder) { }

    assignRole(userId: number) {
        this.assignRoleModal.open(userId);
    }

    init() {
        this.formFilter = this.fb.group({
            name: [null, [Validators.nullValidator]],
            dateFrom: [null, [Validators.nullValidator]],
            dateTo: [null, [Validators.nullValidator]],
            isShow: [null, Validators.nullValidator]
        });
    }

    ngOnInit(): void {
        this.init();
    }
}
