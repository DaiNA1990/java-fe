import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserPageService } from '../../services/user-page.service';
import { UserPageActionListComponent } from '@appkkkh/modules/user/user-page-action/components/list/user-page-action-list.component';

@Component({
    selector: 'app-user-page-list',
    templateUrl: `./user-page-list.component.html`,
})
export class UserPageListComponent implements OnInit {

    formFilter: FormGroup;

    @ViewChild(UserPageActionListComponent) addAcionsModal: UserPageActionListComponent;

    constructor(public userPageService: UserPageService,
        private formBuilder: FormBuilder) { }

    addActions(pageId: number) {
        this.addAcionsModal.open(pageId);
    }

    init() {
        this.formFilter = this.formBuilder.group({});
    }

    ngOnInit(): void {
        this.init();
    }
}