import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError, switchMap } from 'rxjs/operators';
import { Router } from "@angular/router";
import { AuthService } from "@appkkkh/modules/user/auth";
import { AppCons } from "@appkkkh/core/contants/app.cons";

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private router: Router,
        private authService: AuthService) { }

    setAuthToken(token: string, refresh: string) {
        localStorage.setItem(AppCons.TOKEN_KEY, token);
        localStorage.setItem(AppCons.TOKEN_REFRESH_KEY, refresh);
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {

                console.log('Error status code:', error.status);
                console.log('Error body:', error.message);
                console.log('req:', req);

                if (error.status === 400) {
                    this.router.navigate(['/error/403'], { queryParams: { returnUrl: this.router.url } });
                    return throwError(error);
                }

                if (error.status === 403) {
                    this.setAuthToken('', '');
                    this.router.navigate(['/auth/signin'], { queryParams: { url: document.location.pathname } });
                    return throwError(error);
                }

                if (error && error.status === 401) {

                    if(req.url.includes('/RefreshToken')) {
                        this.setAuthToken('', '');
                        this.router.navigate(['/auth/signin'], { queryParams: { url: document.location.pathname } });
                        return of(new HttpResponse({
                            status: 200, body: {
                                statusCode: 1,
                                message: 'Kết nối không thành công, bạn vui lòng thử lại.',
                                data: null,
                                err: error
                            }
                        }));
                    }

                    const refreshToken = localStorage.getItem(AppCons.TOKEN_REFRESH_KEY) ?? '';

                    if (refreshToken === '') {
                        this.setAuthToken('', '');
                        this.router.navigate(['/auth/signin'], { queryParams: { url: document.location.pathname } });
                        return of(new HttpResponse({
                            status: 200, body: {
                                statusCode: 1,
                                message: 'Kết nối không thành công, bạn vui lòng thử lại.',
                                data: null,
                                err: error
                            }
                        }));
                    }

                    return this.authService.refreshToken(refreshToken).pipe(
                        switchMap((res: any) => {
                            this.setAuthToken(res.data.token, res.data.refreshToken);
                            req = req.clone({ setHeaders: { 'Authorization': `Bearer ${res.data.token}` } });
                            return next.handle(req);
                        })
                    );
                }

                return throwError(error);
            })
        );
    }
}
