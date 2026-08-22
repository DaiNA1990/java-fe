import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { provideTranslateService } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { providePrimeNG } from 'primeng/config';
import Lara from '@primeuix/themes/lara';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './infrastructure/interceptors/auth.interceptor';
import { ErrorInterceptor } from './infrastructure/interceptors/error.interceptor';
import { AuthGuard } from './modules/user/auth/services/auth.guard';

@NgModule({ declarations: [
        AppComponent
    ],
    bootstrap: [AppComponent], imports: [BrowserModule,
        BrowserAnimationsModule,
        ClipboardModule,
        AppRoutingModule,
        InlineSVGModule.forRoot(),
        NgbModule], providers: [
        { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
        { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
        AuthGuard,
        provideHttpClient(withInterceptorsFromDi()),
        provideTranslateService(),
        providePrimeNG({
            theme: {
                preset: Lara,
                options: {
                    // Metronic đã có dark mode riêng qua [data-bs-theme], khớp selector
                    // để PrimeNG đổi theme cùng lúc thay vì theo prefers-color-scheme.
                    darkModeSelector: '[data-bs-theme="dark"]',
                },
            },
        })
    ] })
export class AppModule { }
