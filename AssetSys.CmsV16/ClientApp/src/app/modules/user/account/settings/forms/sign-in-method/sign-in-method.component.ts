import { ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
    selector: 'app-sign-in-method',
    templateUrl: './sign-in-method.component.html',
    standalone: false
})
export class SignInMethodComponent implements OnInit, OnDestroy {
  showChangeEmailForm: boolean = false;
  showChangePasswordForm: boolean = false;
  isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  isLoading: boolean;
  private unsubscribe: Subscription[] = [];

  constructor(private changeDetectorRef: ChangeDetectorRef) {
    const loadingSubscr = this.isLoading$
      .asObservable()
      .subscribe((res) => (this.isLoading = res));
    this.unsubscribe.push(loadingSubscr);
  }

  ngOnInit(): void {}

  toggleEmailForm(show: boolean) {
    this.showChangeEmailForm = show;
  }

  saveEmail() {
    this.isLoading$.next(true);
    setTimeout(() => {
      this.isLoading$.next(false);
      this.showChangeEmailForm = false;
      this.changeDetectorRef.detectChanges();
    }, 1500);
  }

  togglePasswordForm(show: boolean) {
    this.showChangePasswordForm = show;
  }

  savePassword() {
    this.isLoading$.next(true);
    setTimeout(() => {
      this.isLoading$.next(false);
      this.showChangePasswordForm = false;
      this.changeDetectorRef.detectChanges();
    }, 1500);
  }

  ngOnDestroy() {
    this.unsubscribe.forEach((sb) => sb.unsubscribe());
  }
}
