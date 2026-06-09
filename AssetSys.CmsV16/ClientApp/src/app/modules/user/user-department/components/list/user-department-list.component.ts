import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserDepartmentService } from '../../services/user-department.service';

@Component({
    selector: 'app-user-department-list',
    templateUrl: `./user-department-list.component.html`,
})
export class UserDepartmentListComponent implements OnInit {

    formFilter: FormGroup;

    constructor(public service: UserDepartmentService,
        private fb: FormBuilder) { }

    init() {
        this.formFilter = this.fb.group({});
    }

    ngOnInit(): void {
        this.init();
    }
}