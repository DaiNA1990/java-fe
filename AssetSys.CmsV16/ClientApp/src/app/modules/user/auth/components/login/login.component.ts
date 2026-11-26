import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, Observable, BehaviorSubject } from 'rxjs';
import { first, shareReplay } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ResponseCode } from '@appkkkh/core/contants/app.enum';
import { AuthModeConfig, AuthService } from '../../services/auth.service';

/** Mã lỗi BE gắn vào "?error=" khi luồng SSO quay về màn đăng nhập. */
const SSO_ERROR_MESSAGES: Record<string, string> = {
  SSO_USER_NOT_FOUND: 'Tài khoản SSO chưa được cấp quyền trong hệ thống.',
  SSO_DISABLED: 'Đăng nhập SSO đang tắt.',
  SSO_FAILED: 'Đăng nhập SSO không thành công, vui lòng thử lại.',
};

/** Chỉ nhận đường dẫn nội bộ ("/..."), chặn "//host" hoặc URL tuyệt đối (open redirect). */
function safeReturnPath(value: unknown): string {
  return typeof value === 'string' && value.startsWith('/') && !value.startsWith('//') ? value : '/';
}

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
  ]
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

  /** Cách đăng nhập đang bật (BE): ẩn/hiện form user/pass và nút SSO. */
  authConfig$: Observable<AuthModeConfig>;

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
    this.returnUrl = safeReturnPath(this.activatedRoute.snapshot.queryParams['url']);

    const ssoError: string | undefined = this.activatedRoute.snapshot.queryParams['error'];
    if (ssoError) {
      this.hasError = true;
      this.message = SSO_ERROR_MESSAGES[ssoError] ?? SSO_ERROR_MESSAGES['SSO_FAILED'];
    }

    this.authConfig$ = this.authService.getAuthConfig().pipe(shareReplay(1));

    // Chỉ bật SSO -> chuyển thẳng sang Keycloak. Vừa quay về kèm lỗi thì đứng lại để người dùng đọc lỗi
    // (không thì lặp vòng Keycloak <-> màn đăng nhập).
    this.unsubscribe.push(
      this.authConfig$.pipe(first()).subscribe((config) => {
        if (config.ssoEnabled && !config.localEnabled && !ssoError) this.loginWithSSO();
      })
    );
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
      .sessionLogin({ username: this.f.email.value, password: this.f.password.value })
      .pipe(first())
      .subscribe((res: any) => {
        this.isLoadingSubject.next(false);
        // Thành công: BE đã đặt cookie SID + XSRF-TOKEN, response không có token.
        if (res.statusCode === ResponseCode.ZERO) {
          localStorage.setItem('username', this.f.email.value);
          this.router.navigateByUrl(this.returnUrl);
        }
        this.hasError = res.statusCode !== ResponseCode.ZERO;
        this.message = res.message;
        this.changeDetectorRef.markForCheck();
      });
    this.unsubscribe.push(loginSubscr);
  }

  loginWithSSO() {
    this.authService.ssoLogin(this.returnUrl);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
