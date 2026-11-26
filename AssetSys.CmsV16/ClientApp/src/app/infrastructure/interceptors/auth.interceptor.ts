import { Injectable } from "@angular/core";
import { HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError } from 'rxjs/operators';
import { AuthService } from "@appkkkh/modules/user/auth";
import { toApiResponse } from "@appkkkh/core/base/api-response";

/** API đăng nhập bằng session (login/logout/config/SSO) — tự xử lý 401 (vd sai mật khẩu). */
const SESSION_API = '/auth/session/';

/**
 * Chỉ xử lý phiên đăng nhập. Đăng nhập bằng cookie SID (HttpOnly) nên không còn gắn/refresh token:
 * 401 = phiên hết hoặc chưa đăng nhập -> về màn đăng nhập.
 *
 * Các status khác đã được ErrorInterceptor quy đổi về envelope { statusCode,
 * message } nên không tới được đây nữa. Lưu ý 403 theo chuẩn mới là "không đủ
 * quyền" (hoặc sai CSRF/Origin) chứ không phải phiên hết hạn, nên không đăng xuất người dùng.
 */
@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(private authService: AuthService) { }

    /**
     * Response giả lập để caller không treo khi phiên đã hết.
     *
     * Dùng câu chung thay vì message của backend vì đây là lỗi kỹ thuật, người dùng
     * chỉ cần biết phải đăng nhập lại.
     */
    private expiredResponse(error: HttpErrorResponse): Observable<any> {
        return of(new HttpResponse({
            status: 200, body: {
                statusCode: 1,
                message: 'Phiên làm việc đã hết hạn, bạn vui lòng đăng nhập lại.',
                data: null,
                err: error
            }
        }));
    }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<any> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {

                if (error.status !== 401) return throwError(() => error);

                // Đăng nhập sai mật khẩu cũng là 401: trả envelope (message BE đã dịch) cho màn đăng nhập.
                if (req.url.includes(SESSION_API)) {
                    return of(new HttpResponse({ status: 200, body: toApiResponse(error) }));
                }

                this.authService.handleSessionExpired();
                return this.expiredResponse(error);
            })
        );
    }
}
