import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserDepartmentService } from '../../services/user-department.service';

@Component({
    selector: 'app-user-department-list',
    templateUrl: `./user-department-list.component.html`,
    standalone: false
})
export class UserDepartmentListComponent implements OnInit {

    formFilter: FormGroup;

    constructor(public userDepartmentService: UserDepartmentService,
        private formBuilder: FormBuilder) { }

    init() {
        this.formFilter = this.formBuilder.group({});
    }

    ngOnInit(): void {
        this.init();
    }
}