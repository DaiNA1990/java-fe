import { Component, forwardRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../services/user.service';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { UserDepartmentService } from '@appkkkh/modules/user/user-department/services/user-department.service';
import { UserLevelService } from '@appkkkh/modules/user/user-level/services/user-level.service';
import { UserTitleService } from '@appkkkh/modules/user/user-title/services/user-title.service';
import { UserRoleService } from '@appkkkh/modules/user/user-role/services/user-role.service';

/// USER_CMS
@Component({
  selector: 'app-user-edit',
  templateUrl: `./user-edit.component.html`,
  providers: [
    {
      provide: NbDialogBaseComponent,
      multi: true,
      useExisting: forwardRef(() => UserEditComponent)
    }
  ]
})
export class UserEditComponent extends NbDialogBaseComponent {

  departmentDataSource = () => this.departmentservice.autocomplete({});
  levelDataSource = () => this.levelService.autocomplete({});
  titleDataSource = () => this.titleService.autocomplete({});
  roleDataSource = () => this.roleService.autocomplete({});

  constructor(public service: UserService,
    public departmentservice: UserDepartmentService,
    public levelService: UserLevelService,
    public titleService: UserTitleService,
    public roleService: UserRoleService,
    private fb: FormBuilder) {
    super(service);
  }

  buildForm() {
    this.form = this.fb.group({
      id: [null, [Validators.nullValidator]],
      parentId: [null, [Validators.nullValidator]],
      departmentId: [null, [Validators.nullValidator]],
      levelId: [null, [Validators.nullValidator]],
      titleId: [null, [Validators.nullValidator]],
      code: [null, [Validators.required]],
      twoFACode: [null, [Validators.required]],
      userName: [null, [Validators.required]],
      password: [null, [Validators.required]],
      firstName: [null, [Validators.nullValidator]],
      lastName: [null, [Validators.required]],
      phone: [null, [Validators.required]],
      email: [null, [Validators.required]],
      dateOfBirth: [null, [Validators.nullValidator]],
      gender: [null, [Validators.nullValidator]],
      address: [null, [Validators.nullValidator]],
      pictureId: [null, [Validators.nullValidator]],
      description: [null, [Validators.nullValidator]],
      createdBy: [null, [Validators.nullValidator]],
      updatedBy: [null, [Validators.nullValidator]],
      dateCreated: [null, [Validators.nullValidator]],
      dateUpdated: [null, [Validators.nullValidator]],
      isShow: [null, [Validators.nullValidator]],
      isTwoFactorEmail: [null, [Validators.nullValidator]],
      isTwoFactorPhone: [null, [Validators.nullValidator]],
    });
  }

  ngOnInit(): void {
    super.ngOnInit();
  }
}
