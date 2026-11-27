import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from '../../services/user.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { UserRoleMapAssignComponent } from '@appkkkh/modules/user/user-role-map/components/assign/user-role-map-assign.component';
import { AuthService } from '@appkkkh/modules/user/auth/services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { finalize } from 'rxjs/operators';
import { ResponseCode } from '@appkkkh/core/contants/app.enum';

@Component({
    selector: 'app-user-list',
    templateUrl: `./user-list.component.html`,
    // service riêng của màn (nb-page-list có ConfirmationService/MessageService của nó)
    providers: [ConfirmationService, MessageService],
})
export class UserListComponent implements OnInit {

    formFilter: FormGroup;

    @ViewChild(UserRoleMapAssignComponent) assignRoleModal: UserRoleMapAssignComponent;

    syncingKeycloak = false;
    keycloakSyncResult: any = null;
    keycloakSyncDialogVisible = false;

    constructor(public userService: UserService,
        public authService: AuthService,
        private formBuilder: FormBuilder,
        private confirmationService: ConfirmationService,
        private messageService: MessageService) { }

    assignRole(userId: number) {
        this.assignRoleModal.open(userId);
    }

    confirmSyncKeycloak(event: Event) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            header: 'Đồng bộ Keycloak',
            message: 'Đồng bộ toàn bộ tài khoản sang Keycloak? Tài khoản chưa có sẽ được tạo kèm mật khẩu hiện tại; '
                + 'tài khoản đã có chỉ cập nhật email, họ tên, trạng thái (không đổi mật khẩu). Không xoá tài khoản nào trên Keycloak.',
            icon: 'pi pi-exclamation-triangle',
            acceptLabel: 'Đồng bộ',
            rejectLabel: 'Huỷ',
            acceptIcon: 'none',
            rejectIcon: 'none',
            rejectButtonStyleClass: 'p-button-text',
            accept: () => this.syncKeycloak(),
        });
    }

    private syncKeycloak() {
        this.syncingKeycloak = true;
        this.userService.syncKeycloak()
            .pipe(finalize(() => this.syncingKeycloak = false))
            .subscribe((res: any) => {
                // lỗi đã được ErrorInterceptor quy đổi về envelope (statusCode khác 0, message đã dịch, error.detail)
                if (res.statusCode !== ResponseCode.ZERO) {
                    const detail = res.error?.detail ? `${res.message}: ${res.error.detail}` : res.message;
                    this.messageService.add({ severity: 'error', summary: 'Đồng bộ Keycloak', detail, life: 10000 });
                    return;
                }

                const r = res.data;
                this.keycloakSyncResult = r;
                this.messageService.add({
                    severity: r.aborted || r.failed > 0 ? 'warn' : 'success',
                    summary: res.message,
                    detail: `Tạo ${r.created}, cập nhật ${r.updated}, giữ nguyên ${r.unchanged}, bỏ qua ${r.skipped}, lỗi ${r.failed}`,
                    life: 6000,
                });
                this.keycloakSyncDialogVisible = r.aborted || r.failures?.length > 0 || r.warnings?.length > 0;
            });
    }

    init() {
        this.formFilter = this.formBuilder.group({
            name: [null, [Validators.nullValidator]],
            dateFrom: [null, [Validators.nullValidator]],
            dateTo: [null, [Validators.nullValidator]],
            isShow: [null, Validators.nullValidator]
        });
    }

    ngOnInit(): void {
        this.init();
    }
}
