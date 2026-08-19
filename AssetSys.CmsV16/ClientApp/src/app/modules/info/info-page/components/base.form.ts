import { inject } from '@angular/core';
import { AuthService } from '@appkkkh/modules/user/auth/services/auth.service';

export class BaseFormPage{

    protected authService = inject(AuthService);

    constructor() {}

    // lấy thẳng từ auth, không truyền qua @Input nữa
    public get currentUser(): any {
        return this.authService.currentUserSubject.value;
    }

    public checkPermission(permission: string): boolean {
        return this.authService.hasPermission(permission);
    }

    public getExpressionData(name: any, expression: any) {

        if (expression === null
            || expression === ''
            || expression.indexOf(name) === -1)
            return null;

        const jdata = JSON.parse(expression);

        if (Array.isArray(jdata))
            return jdata.find((c: any) => c.typeData === name).data;

        return jdata.data;
    }

    public downloadFileTrigger(href: any, name: string) {
        const link = document.createElement('a');
        link.href = href;
        link.target = '_blank';
        link.download = name;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    public initPath(formItem: any,module: any = null) {
      const mod = module ?? formItem?.layout?.module;
      let path = 'api';
      switch (mod) {
        case 'TKKH':
          path = 'executionapi';
          break;
        case 'KK':
          path = 'inventoryapi';
          break;
        case 'RPT':
          path = 'reportapi';
          break;
        default:
          path = 'planapi';
          break;
      }
      return path;
    }
}
