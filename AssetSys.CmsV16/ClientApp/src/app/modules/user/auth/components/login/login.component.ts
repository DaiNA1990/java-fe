import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseCode } from '@appkkkh/core/contants/app.enum';
import { AppCons } from '@appkkkh/core/contants/app.cons';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styles: [
        `:host {
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
  }`
    ],
    standalone: false
})
export class LoginComponent implements OnInit, OnDestroy {
  defaultAuth: any = {
    email: localStorage.getItem('username') ?? 'admin@website.com',
    password: '123@123a',
  };
  loginForm: FormGroup;
  hasError: boolean;
  returnUrl: string;
  message: string;
  isLoading$: Observable<boolean>;
  isLoadingSubject: BehaviorSubject<boolean>;

  private unsubscribe: Subscription[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private changeDetectorRef: ChangeDetectorRef
  ) {
    this.isLoadingSubject = new BehaviorSubject<boolean>(false);
    this.isLoading$ = this.isLoadingSubject.asObservable();
  }

  ngOnInit(): void {
    this.initForm();
    this.returnUrl = this.activatedRoute.snapshot.queryParams['url'.toString()] || '/';
  }

  get f() {
    return this.loginForm.controls;
  }

  initForm() {
    this.loginForm = this.formBuilder.group({
      email: [
        this.defaultAuth.email,
        Validators.compose([
          Validators.required,
          //Validators.email,
          Validators.minLength(3),
          Validators.maxLength(320),
        ]),
      ],
      password: [
        this.defaultAuth.password,
        Validators.compose([
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
        ]),
      ],
    });
  }

  submit() {
    this.hasError = false;
    this.isLoadingSubject.next(true);
    const loginSubscr = this.authService
      .login({ username: this.f.email.value, password: this.f.password.value })
      .pipe(first())
      .subscribe((res: any) => {
        this.isLoadingSubject.next(false);
        if (res.statusCode === ResponseCode.ZERO) {
          localStorage.setItem(AppCons.TOKEN_KEY, res.data.token);
          localStorage.setItem(AppCons.TOKEN_REFRESH_KEY, res.data.refreshToken);
          localStorage.setItem('username', this.f.email.value);
          this.router.navigate([this.returnUrl ?? '/']);
        }
        this.hasError = res.statusCode !== ResponseCode.ZERO;
        this.message = res.message;
        this.changeDetectorRef.markForCheck();
      });
    this.unsubscribe.push(loginSubscr);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
