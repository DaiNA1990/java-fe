import { ChangeDetectorRef, Component, forwardRef, inject } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { UserRoleService } from '@appkkkh/modules/user/user-role/services/user-role.service';
import { MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';
import { UserPageActionService } from '@appkkkh/modules/user/user-page-action/services/user-page-action.service';

@Component({
    selector: 'app-user-role-action-map-assign',
    templateUrl: `./user-role-action-map-assign.component.html`,
    providers: [MessageService]
})
export class UserRoleActionMapAssignComponent {

    public messageService = inject(MessageService);

    isVisible: boolean = false;

    roleId: number;

    source: any[];
    target: any[];

    constructor(public service: UserRoleService,
        public userPageActionService: UserPageActionService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef) {
    }

    open(roleId: number) {
        this.roleId = roleId;
        this.isVisible = true;
        this.getData();
        this.getActionAssign(roleId);
    }

    close() {
        this.isVisible = false;
    }

    async submit() {

        const res = await firstValueFrom(this.service.addActionForRole({ 
            roleId: this.roleId,
            actionIds: this.target.map(action => action.id)
        }));

        this.messageService.add({ severity: 'info', summary: 'Success', detail: res.message });
        this.close();
        this.cdr.markForCheck();
    }

    getData() {
        this.userPageActionService.getList({ pageSize: Number.MAX_SAFE_INTEGER }).subscribe(res => {
            this.source = res.data.list;
            this.source.forEach(item => {
                item.name = `${item.pageItem.name} => ${item.name}`;
            });

            this.source.sort((a, b) => a.name.localeCompare(b.name));

            this.cdr.markForCheck();
        })
    }

    getActionAssign(roleId: number) {
        this.userPageActionService.getList({roleId: roleId, pageSize: Number.MAX_SAFE_INTEGER}).subscribe(res => {
            this.target = res.data.list;
            this.target.forEach(item => {
                item.name = `${item.pageItem.name} => ${item.name}`;
            });

            this.target.sort((a, b) => a.name.localeCompare(b.name));
            this.cdr.markForCheck();
        })
    }

    ngOnInit(): void {
    }
}
