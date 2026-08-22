import { Directive, Input, TemplateRef, ViewContainerRef } from '@angular/core';
import { AuthService } from '@appkkkh/modules/user/auth/services/auth.service';

@Directive({
    selector: '[appPermission]',
    standalone: false
})
export class PermissionDirective {
    constructor(
        private templateRef: TemplateRef<any>,
        private viewContainer: ViewContainerRef,
        private permissionService: AuthService
    ) { }

    @Input() set appPermission(permissions: string | string[]) {
        const hasPermission = this.permissionService.hasPermission(permissions);

        if (hasPermission) {
            this.viewContainer.createEmbeddedView(this.templateRef);
        } else {
            this.viewContainer.clear();
        }
    }
}