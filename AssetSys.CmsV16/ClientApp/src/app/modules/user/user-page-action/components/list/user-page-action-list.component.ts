import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserPageActionService } from '../../services/user-page-action.service';
import { NbPageListComponent } from '@appkkkh/components/page/list/component';
import { UserPageActionEditComponent } from '../edit/user-page-action-edit.component';

@Component({
    selector: 'app-user-page-action-list',
    templateUrl: `./user-page-action-list.component.html`,
})
export class UserPageActionListComponent implements OnInit {

    isVisible: boolean = false;

    formFilter: FormGroup;

    @ViewChild(NbPageListComponent) pageList: NbPageListComponent;
    @ViewChild(UserPageActionEditComponent) formEdit: UserPageActionEditComponent;

    constructor(public service: UserPageActionService,
        private fb: FormBuilder) { }

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
        this.formFilter = this.fb.group({
            pageId: [null, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        this.init();
    }
}