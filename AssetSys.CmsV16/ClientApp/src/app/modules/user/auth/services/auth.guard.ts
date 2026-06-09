import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable, forkJoin, of } from 'rxjs';
import { map } from 'rxjs/operators';
import { AuthService } from './auth.service';
import { ResponseCode } from '@appkkkh/core/contants/app.enum';
import { environment } from '@srckkkh/environments/environment';

@Injectable()
export class AuthGuard implements CanActivate {

  constructor(private router: Router,
    private authService: AuthService) { }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> {

    if (!environment.isForNx && route.data && route.data['permission']) {
      const permission = route.data['permission'];
      if (!this.authService.hasPermission(permission)) {
        this.router.navigateByUrl(environment.isForNx ? '/403' : '/auth/signin');
        return of(false);
      }
    }

    return forkJoin({
      getActionCodes: this.authService.getActions().pipe(
        map((res: any) => {
          if (res.statusCode === ResponseCode.ZERO)
            this.authService.loadPermissions(res.data);
          return res.statusCode === ResponseCode.ZERO;
        })),
      getUserInfo: this.authService.getInfo()
    }).pipe(map((res: any) => {
      if (!res.getActionCodes)
        this.router.navigateByUrl(environment.isForNx ? '/403' : '/auth/signin');
      return res.getActionCodes;
    }));
  }
}
