import { Component, forwardRef } from '@angular/core';
import { AbstractControl, FormBuilder, ValidationErrors, Validators } from '@angular/forms';
import { firstValueFrom } from 'rxjs';
import { MessageService } from 'primeng/api';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { ResponseCode } from '@appkkkh/core/contants/app.enum';
import { UserService } from '../../services/user.service';
import { UserChangePasswordService } from './user-change-password.service';

@Component({
  selector: 'app-user-change-password',
  templateUrl: `./user-change-password.component.html`,
  providers: [
    MessageService,
    {
      provide: NbDialogBaseComponent,
      multi: true,
      useExisting: forwardRef(() => UserChangePasswordComponent)
    }
  ]
})
export class UserChangePasswordComponent extends NbDialogBaseComponent {

  constructor(public userService: UserService,
    private changePasswordService: UserChangePasswordService,
    private formBuilder: FormBuilder) {
    super(userService);
  }

  buildForm() {
    this.form = this.formBuilder.group({
      currentPassword: [null, [Validators.required]],
      password: [null, [Validators.required]],
      rePassword: [null, [Validators.required, this.matchPassword]],
    });

    // đổi mật khẩu mới thì kiểm tra lại ô nhập lại
    this.subscriptions.push(this.form.controls['password'].valueChanges
      .subscribe(() => this.form.controls['rePassword'].updateValueAndValidity({ emitEvent: false })));
  }

  private matchPassword = (control: AbstractControl): ValidationErrors | null => {
    const password = control.parent?.get('password')?.value;
    return control.value && control.value !== password ? { notMatch: true } : null;
  }

  async submit() {

    if (!this.checkValidate())
      return;

    const res = await firstValueFrom(this.userService.changePassword(this.form.value));

    if (res.statusCode !== ResponseCode.ZERO) {
      this.messageService.add({ severity: 'error', summary: 'Fail', detail: res.message, life: 3000 });
      return;
    }

    this.messageService.add({ severity: 'info', summary: 'Success', detail: res.message || 'Đổi mật khẩu thành công' });

    this.pageDialog.close();
  }

  ngOnInit(): void {
    super.ngOnInit();
    this.subscriptions.push(this.changePasswordService.openSubject.subscribe(() => this.showDialog()));
  }
}
