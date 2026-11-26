import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable, from, of, throwError } from "rxjs";
import { catchError, map } from "rxjs/operators";
import { toApiResponse } from "@appkkkh/core/base/api-response";

/**
 * Backend đã chuyển sang chuẩn REST: HTTP status thật phản ánh kết quả, body lỗi
 * đổi shape (title/status/detail/code/traceId/errors).
 *
 * Interceptor này quy đổi lỗi về envelope cũ { data, statusCode, message } và
 * trả về như một response thành công, để toàn bộ màn hình đang kiểm tra
 * res.statusCode và hiển thị res.message vẫn chạy nguyên như trước.
 *
 * Riêng 401 ném tiếp cho AuthInterceptor (hết phiên -> về màn đăng nhập).
 */
@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<any> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 401) return throwError(() => error);

                // request tải file dùng responseType blob nên body lỗi cũng về
                // dạng Blob, phải đọc ra text mới parse được JSON
                if (error.error instanceof Blob)
                    return from(error.error.text()).pipe(
                        map((text: string) => this.toResponse(error, text))
                    );

                return of(this.toResponse(error));
            })
        );
    }

    /**
     * Status 200 ở đây là của response giả lập gửi về cho caller; status thật của
     * backend nằm trong body.error.status.
     */
    private toResponse(error: HttpErrorResponse, body: any = null): HttpResponse<any> {
        return new HttpResponse({ status: 200, body: toApiResponse(error, body) });
    }
}
