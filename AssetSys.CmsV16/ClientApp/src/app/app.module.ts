import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { ClipboardModule } from 'ngx-clipboard';
import { provideTranslateService } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg-2';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { providePrimeNG } from 'primeng/config';
import { definePreset } from '@primeuix/themes';
import Lara from '@primeuix/themes/lara';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthInterceptor } from './infrastructure/interceptors/auth.interceptor';
import { ErrorInterceptor } from './infrastructure/interceptors/error.interceptor';
import { AuthGuard } from './modules/user/auth/services/auth.guard';

/**
 * Theme cũ là 'lara-light-blue'. Preset Lara của @primeuix mặc định primary =
 * emerald, nên override lại thang blue để giao diện không đổi tông sau khi nâng
 * PrimeNG lên styled mode (v19+).
 */
const LaraBlue = definePreset(Lara, {
    semantic: {
        primary: {
            50: '{blue.50}',
            100: '{blue.100}',
            200: '{blue.200}',
            300: '{blue.300}',
            400: '{blue.400}',
            500: '{blue.500}',
            600: '{blue.600}',
            700: '{blue.700}',
            800: '{blue.800}',
            900: '{blue.900}',
            950: '{blue.950}',
        },
    },
});

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
                preset: LaraBlue,
                options: {
                    // Metronic đã có dark mode riêng qua [data-bs-theme], khớp selector
                    // để PrimeNG đổi theme cùng lúc thay vì theo prefers-color-scheme.
                    darkModeSelector: '[data-bs-theme="dark"]',
                },
            },
        })
    ] })
export class AppModule { }
