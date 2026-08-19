import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserCodeService } from '../../services/user-code.service';

@Component({
    selector: 'app-user-code-list',
    templateUrl: `./user-code-list.component.html`,
})
export class UserCodeListComponent implements OnInit {

    formFilter: FormGroup;

    constructor(public userCodeService: UserCodeService,
        private formBuilder: FormBuilder) { }

    init() {
        this.formFilter = this.formBuilder.group({});
    }

    ngOnInit(): void {
        this.init();
    }
}