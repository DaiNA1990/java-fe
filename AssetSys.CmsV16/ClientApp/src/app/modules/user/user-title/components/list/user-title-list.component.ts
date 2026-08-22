import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserTitleService } from '../../services/user-title.service';

@Component({
    selector: 'app-user-title-list',
    templateUrl: `./user-title-list.component.html`,
    standalone: false
})
export class UserTitleListComponent implements OnInit {

    formFilter: FormGroup;

    constructor(public userTitleService: UserTitleService,
        private formBuilder: FormBuilder) { }

    init() {
        this.formFilter = this.formBuilder.group({});
    }

    ngOnInit(): void {
        this.init();
    }
}