import { ChangeDetectorRef, Component, forwardRef, inject } from '@angular/core';
import { AppCons } from '@appkkkh/core/contants/app.cons';
import { FormBuilder, Validators } from '@angular/forms';
import { UserRoleService } from '@appkkkh/modules/user/user-role/services/user-role.service';
import { MessageService } from 'primeng/api';
import { firstValueFrom, forkJoin } from 'rxjs';
import { UserPageActionService } from '@appkkkh/modules/user/user-page-action/services/user-page-action.service';
import { UserPageService } from '@appkkkh/modules/user/user-page/services/user-page.service';

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

    constructor(public userRoleService: UserRoleService,
        public userPageActionService: UserPageActionService,
        public userPageService: UserPageService,
        private formBuilder: FormBuilder,
        private changeDetectorRef: ChangeDetectorRef) {
    }

    open(roleId: number) {
        this.roleId = roleId;
        this.isVisible = true;
        this.source = [];
        this.target = [];
        this.loadData(roleId);
    }

    close() {
        this.isVisible = false;
    }

    async submit() {

        const res = await firstValueFrom(this.userRoleService.addActionForRole({ 
            roleId: this.roleId,
            actionIds: this.target.map(action => action.id)
        }));

        this.messageService.add({ severity: 'info', summary: 'Success', detail: res.message });
        this.close();
        this.changeDetectorRef.markForCheck();
    }

    /**
     * Gắn thông tin chức năng vào action để phân biệt các chức năng trùng tên:
     * name = 'Tên chức năng => Tên action', pagePath = đường dẫn chức năng cha,
     * pageCode/pageRouter = mã và đường dẫn của chức năng.
     *
     * UserPageActionItem chỉ có pageId, không join tên trang nên tra từ danh sách user-pages.
     */
    decorate(item: any, pages: Map<number, any>) {
        const page = pages.get(item.pageId);
        item.actionName = item.name;
        item.name = page ? `${page.name} => ${item.name}` : item.name;
        item.pagePath = page ? this.parentPath(page, pages) : '';
        item.pageCode = page?.code ?? '';
        item.pageRouter = page?.router ?? '';
    }

    /** 'Cha cấp 1 › Cha cấp 2' của chức năng; chặn vòng lặp nếu dữ liệu parentId bị lỗi. */
    parentPath(page: any, pages: Map<number, any>): string {
        const names: string[] = [];
        const visited = new Set<number>([page.id]);
        let parent = pages.get(page.parentId);

        while (parent && !visited.has(parent.id)) {
            names.unshift(parent.name);
            visited.add(parent.id);
            parent = pages.get(parent.parentId);
        }

        return names.join(' › ');
    }

    /**
     * Tải song song toàn bộ action, action đã gán và danh sách chức năng, rồi bỏ action
     * đã gán khỏi danh sách bên trái để một action không nằm ở cả hai bên.
     */
    loadData(roleId: number) {
        forkJoin({
            all: this.userPageActionService.getList({ pageSize: AppCons.MAX_PAGE_SIZE }),
            assigned: this.userPageActionService.getActionsByRole(roleId),
            pages: this.userPageService.getList({ pageSize: AppCons.MAX_PAGE_SIZE })
        }).subscribe(({ all, assigned, pages }: any) => {
            const pageMap = new Map<number, any>((pages.data?.list ?? []).map((p: any) => [p.id, p]));
            const target: any[] = assigned.data?.list ?? [];
            const assignedIds = new Set(target.map(item => item.id));
            const source: any[] = (all.data?.list ?? []).filter((item: any) => !assignedIds.has(item.id));

            [...source, ...target].forEach(item => this.decorate(item, pageMap));

            // sắp theo đường dẫn cha trước để các chức năng cùng nhóm nằm cạnh nhau
            const sortKey = (x: any) => `${x.pagePath} › ${x.name}`;
            this.source = source.sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
            this.target = target.sort((a, b) => sortKey(a).localeCompare(sortKey(b)));
            this.changeDetectorRef.markForCheck();
        });
    }

    ngOnInit(): void {
    }
}
