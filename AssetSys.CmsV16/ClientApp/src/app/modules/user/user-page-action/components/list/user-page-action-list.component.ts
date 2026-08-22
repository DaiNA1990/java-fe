import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserPageActionService } from '../../services/user-page-action.service';
import { NbPageListComponent } from '@appkkkh/components/page/list/component';
import { UserPageActionEditComponent } from '../edit/user-page-action-edit.component';

@Component({
    selector: 'app-user-page-action-list',
    templateUrl: `./user-page-action-list.component.html`,
    standalone: false
})
export class UserPageActionListComponent implements OnInit {

    isVisible: boolean = false;

    formFilter: FormGroup;

    @ViewChild(NbPageListComponent) pageList: NbPageListComponent;
    @ViewChild(UserPageActionEditComponent) formEdit: UserPageActionEditComponent;

    constructor(public userPageActionService: UserPageActionService,
        private formBuilder: FormBuilder) { }

    open(pageId: number) {
        this.formFilter.patchValue({
            pageId: pageId,
        });
        this.formEdit.pageId = pageId;
        this.isVisible = true;
        this.pageList.getList();
    }

    close() {
        this.isVisible = false;
    }

    init() {
        this.formFilter = this.formBuilder.group({
            pageId: [null, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        this.init();
    }
}