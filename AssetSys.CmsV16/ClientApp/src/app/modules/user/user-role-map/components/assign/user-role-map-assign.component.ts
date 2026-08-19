import { ChangeDetectorRef, Component, forwardRef, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserRoleMapService } from '../../services/user-role-map.service';
import { UserRoleService } from '@appkkkh/modules/user/user-role/services/user-role.service';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-user-role-map-assign',
    templateUrl: `./user-role-map-assign.component.html`,
    providers: [MessageService]
})
export class UserRoleMapAssignComponent {

    public messageService = inject(MessageService);

    isVisible: boolean = false;

    userId: number;

    source: any[];
    target: any[];

    constructor(public userRoleMapService: UserRoleMapService,
        public userRoleService: UserRoleService,
        private formBuilder: FormBuilder,
        private changeDetectorRef: ChangeDetectorRef) {
    }

    open(userId: number) {
        this.userId = userId;
        this.isVisible = true;
        this.getData();
        this.getRoleAssign(userId);
    }

    close() {
        this.isVisible = false;
    }

    async submit() {

        const res = await firstValueFrom(this.userRoleService.addRole({ 
            userId: this.userId,
            roleIds: this.target.map(role => role.id)
        }));

        this.messageService.add({ severity: 'info', summary: 'Success', detail: res.message });
        this.close();
        this.changeDetectorRef.markForCheck();
    }

    getData() {
        this.userRoleService.getList({ pageSize: Number.MAX_SAFE_INTEGER }).subscribe(res => {
            this.source = res.data.list;
            this.changeDetectorRef.markForCheck();
        })
    }

    getRoleAssign(userId: number) {
        this.userRoleService.getRolesByUser({userId: userId}).subscribe(res => {
            this.target = res.data.list;
            this.changeDetectorRef.markForCheck();
        })
    }

    ngOnInit(): void {
    }
}
