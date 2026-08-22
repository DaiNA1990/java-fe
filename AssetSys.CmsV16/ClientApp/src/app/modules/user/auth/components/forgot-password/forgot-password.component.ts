import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';
import { AuthService } from '../../services/auth.service';
import { first } from 'rxjs/operators';

enum ErrorStates {
  NotSubmitted,
  HasError,
  NoError,
}

@Component({
    selector: 'app-forgot-password',
    templateUrl: './forgot-password.component.html',
    styles: [`:host {
    width: 100%;
    @media (min-width: 992px) {
      .login-form {
        width: 100%;
        max-width: 450px;
  
        .mat-form-field {
          width: 100%;
        }
      }
    }
  }`],
    standalone: false
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm: FormGroup;
  errorState: ErrorStates = ErrorStates.NotSubmitted;
  errorStates = ErrorStates;
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  private unsubscribe: Subscription[] = [];
  constructor(private formBuilder: FormBuilder, private authService: AuthService) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.initForm();
  }

  get f() {
    return this.forgotPasswordForm.controls;
  }

  initForm() {
    this.forgotPasswordForm = this.formBuilder.group({
      email: [
        'admin@demo.com',
        Validators.compose([
          Validators.required,
          Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320),
        ]),
      ],
    });
  }

  submit() {
    this.errorState = ErrorStates.NotSubmitted;
    const forgotPasswordSubscr = this.authService
      .forgetPassword(this.f.email.value)
      .pipe(first())
      .subscribe((result: boolean) => {
        this.errorState = result ? ErrorStates.NoError : ErrorStates.HasError;
      });
    this.unsubscribe.push(forgotPasswordSubscr);
  }
}
