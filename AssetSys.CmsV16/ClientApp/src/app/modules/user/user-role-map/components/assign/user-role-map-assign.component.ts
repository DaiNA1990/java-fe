import { ChangeDetectorRef, Component, forwardRef, inject } from '@angular/core';
import { AppCons } from '@appkkkh/core/contants/app.cons';
import { FormBuilder, Validators } from '@angular/forms';
import { UserRoleMapService } from '../../services/user-role-map.service';
import { UserRoleService } from '@appkkkh/modules/user/user-role/services/user-role.service';
import { MessageService } from 'primeng/api';
import { firstValueFrom, forkJoin } from 'rxjs';

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
        this.source = [];
        this.target = [];
        this.loadData(userId);
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

    /**
     * Tải song song toàn bộ role và role đã gán cho user, rồi bỏ role đã gán khỏi
     * danh sách bên trái để một role không nằm ở cả hai bên.
     */
    loadData(userId: number) {
        forkJoin({
            all: this.userRoleService.getList({ pageSize: AppCons.MAX_PAGE_SIZE }),
            assigned: this.userRoleService.getRolesByUser({ userId: userId })
        }).subscribe(({ all, assigned }: any) => {
            // GetRolesByUser trả thẳng mảng UserRoleItem, không bọc { list, total }
            const target: any[] = Array.isArray(assigned.data) ? assigned.data : assigned.data?.list ?? [];
            const assignedIds = new Set(target.map(item => item.id));

            this.source = (all.data?.list ?? []).filter((item: any) => !assignedIds.has(item.id));
            this.target = target;
            this.changeDetectorRef.markForCheck();
        });
    }

    ngOnInit(): void {
    }
}
