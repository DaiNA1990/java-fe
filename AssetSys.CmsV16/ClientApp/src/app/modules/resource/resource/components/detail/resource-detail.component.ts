import { ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NbDialogBaseComponent } from '@appkkkh/components/page/dialog/dialog.base';
import { firstValueFrom, map } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { ResponseCode } from '@appkkkh/core/contants/app.enum';
import { ResourceInfoService } from '../../services/resource.service';

@Component({
    selector: 'app-resource-detail',
    templateUrl: `./resource-detail.component.html`,
    providers: [
        {
            provide: NbDialogBaseComponent,
            multi: true,
            useExisting: forwardRef(() => ResourceInfoDetailComponent)
        }
    ],
    standalone: false
})
export class ResourceInfoDetailComponent extends NbDialogBaseComponent {

    @Input() parentCode: string;

    histories: any[] = [];

    // isApprove: boolean = false;

    // formApprove: FormGroup;

    // statusDS: any[] = [
    //     {
    //         value: 2,
    //         text: 'Duyệt'
    //     }, {
    //         value: 3,
    //         text: 'Từ chối'
    //     }];

    // userDS = () => this.userService.autocomplete({});
    // //statusDS = () => this.resourceInfoService.getStatus();
    // cateDS = () => this.cateService.autocomplete({ parentCode: this.cateCode || null });
    // ticketDS = () => this.resourceInfoService.getList({ isNoStatus: true }).pipe(
    //     map(res => {
    //         return {
    //             data: {
    //                 list: res.data.list.map((i: any) => {
    //                     return {
    //                         text: `${i.name} - ${i.parent.title}`,
    //                         value: i.id
    //                     };
    //                 }),
    //                 total: res.data.total
    //             },
    //             statusCode: 0
    //         };
    //     }),
    // );

    constructor(public resourceInfoService: ResourceInfoService,
        private confirmationService: ConfirmationService,
        private formBuilder: FormBuilder) {
        super(resourceInfoService, false);
    }

    buildForm() {
        this.form = this.formBuilder.group({
            id: [0, [Validators.nullValidator]],
            userId: [null, [Validators.nullValidator]],
            assignId: [null, [Validators.nullValidator]],
            statusId: [1, [Validators.nullValidator]],
            parentId: [null, [Validators.nullValidator]],
            categoryId: [null, [Validators.nullValidator]],
            title: [null, [Validators.nullValidator]],
            detail: [null, [Validators.nullValidator]],
            note: [null, [Validators.nullValidator]],
            dateStart: [null, [Validators.nullValidator]],
            dateEnd: [null, [Validators.nullValidator]],
            name: [null, [Validators.nullValidator]],
            phone: [null, [Validators.nullValidator]],
            email: [null, [Validators.nullValidator]],
            identify: [null, [Validators.nullValidator]],
            address: [null, [Validators.nullValidator]],
            organization: [null, [Validators.nullValidator]],
            isShow: [true, [Validators.nullValidator]],
            peoples: [null, [Validators.nullValidator]],
            transports: [null, [Validators.nullValidator]],
        });
    }

    async getHistory() {
        // const res = await firstValueFrom(this.ticketUserMapService.getList({ guestCode: this.resData.data.code }));
        // this.histories = res.data.list;
        // this.cdr.detectChanges();
    }

    onShow() {
        if(this.parentCode === 'GUEST_CARD')
            this.getHistory();
    }

    ngOnInit(): void {
        super.ngOnInit();
    }
}
