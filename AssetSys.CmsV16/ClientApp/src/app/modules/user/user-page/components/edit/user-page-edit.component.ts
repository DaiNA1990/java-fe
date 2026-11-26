import { Component, forwardRef } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { AppCons } from '@appkkkh/core/contants/app.cons';
import { map } from 'rxjs';
import { UserPageService } from '../../services/user-page.service';

@Component({
    selector: 'app-user-page-edit',
    templateUrl: `./user-page-edit.component.html`,
    providers: [
        {
            provide: NbDialogBaseComponent,
            multi: true,
            useExisting: forwardRef(() => UserPageEditComponent)
        }
    ]
})
export class UserPageEditComponent extends NbDialogBaseComponent {

    constructor(public userPageService: UserPageService,
        private formBuilder: FormBuilder) {
        super(userPageService);
    }

    /**
     * Danh sách chọn cấp cha. Bỏ chính trang đang sửa và các trang con của nó để không tạo vòng
     * cha-con. nb-select chỉ render sau loadForm nên lúc gọi đã có form.controls.id.
     */
    parentDS = () => this.userPageService.getList({ pageSize: AppCons.MAX_PAGE_SIZE }).pipe(
        map((res: any) => {
            const all: any[] = res.data?.list ?? [];
            const excludedIds = this.getSelfAndDescendantIds(this.form.controls.id.value, all);
            const list = all
                .filter(p => !excludedIds.has(p.id))
                .map(p => ({ ...p, text: `${p.name} (${p.code})` }));
            return { ...res, data: { ...res.data, list } };
        })
    );

    private getSelfAndDescendantIds(id: number | null, all: any[]): Set<number> {
        const ids = new Set<number>();
        if (id === null || id === undefined)
            return ids;

        const stack: number[] = [id];
        let cur: number | undefined;
        while ((cur = stack.pop()) !== undefined) {
            ids.add(cur);
            all.filter(p => p.parentId === cur && !ids.has(p.id)).forEach(p => stack.push(p.id));
        }
        return ids;
    }

    buildForm() {
        this.form = this.formBuilder.group({
		    id: [null, [Validators.nullValidator]],
		    parentId: [null, [Validators.nullValidator]],
		    name: [null, [Validators.required]],
		    code: [null, [Validators.required]],
		    displayOrder: [null, [Validators.nullValidator]],
		    router: [null, [Validators.pattern(/^\//), Validators.maxLength(500)]],
		    icon: [null, [Validators.maxLength(100)]],
		    description: [null, [Validators.nullValidator]],
		    isShow: [false, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
