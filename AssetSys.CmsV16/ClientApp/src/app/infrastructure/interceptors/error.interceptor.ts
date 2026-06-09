import { Injectable } from "@angular/core";
import { HttpRequest, HttpHandler, HttpInterceptor, HttpErrorResponse, HttpResponse } from "@angular/common/http";
import { Observable, of, throwError } from "rxjs";
import { catchError } from "rxjs/operators";

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {

    constructor() { }

    intercept(
        req: HttpRequest<any>,
        next: HttpHandler
    ): Observable<any> {
        return next.handle(req).pipe(
            catchError((error: HttpErrorResponse) => {
                if (error.status === 400
                    || error.status === 401
                    || error.status === 403
                    || error.status === 413)
                    return throwError(error);

                return of(new HttpResponse({
                    status: 200, body: {
                        statusCode: 1,
                        message: 'Kết nối không thành công, bạn vui lòng thử lại.',
                        data: null,
                        err: error
                    }
                }));
            })
        );
    }
}
