import { Directive, OnInit, OnDestroy, ViewChild, inject, ChangeDetectorRef, Output, EventEmitter } from '@angular/core';
import { Subscription, firstValueFrom } from 'rxjs';
import { NbPageDialogComponent } from './component';
import { FormGroup } from '@angular/forms';
import { BaseService } from '@appkkkh/core/base/base.service';
import { MessageService } from 'primeng/api';
import { ResponseCode } from '@appkkkh/core/contants/app.enum';
import { NbPageListComponent } from '../list/component';

@Directive({
    providers: [MessageService],
    standalone: false
})
export abstract class NbDialogBaseComponent implements OnInit, OnDestroy {

    @Output() onSubmited: EventEmitter<any> = new EventEmitter<any>();

    public messageService = inject(MessageService);
    public cdr = inject(ChangeDetectorRef);
    private parent = inject(NbPageListComponent, { optional: true });

    isEdit: boolean = true;
    resData: any;
    form: FormGroup;
    subscriptions: Subscription[] = [];
    service: BaseService;

    @ViewChild(NbPageDialogComponent) pageDialog: NbPageDialogComponent;

    constructor(public _service: BaseService,
        _isEdit: boolean = true) {
        this.isEdit = _isEdit;
        this.service = _service;
    }

    checkValidate() {

        if (this.form.invalid) {
            Object.entries(this.form.controls).forEach(entry => entry[1].markAsTouched());
            return false;
        }

        return true;
    }

    async submit() {

        if (!this.checkValidate())
            return;

        const res = await firstValueFrom(this.service.addOrEdit(this.form.value));

        this.onSubmited.emit(res);

        if (res.statusCode !== ResponseCode.ZERO) {
            this.messageService.add({ severity: 'error', summary: 'Fail', detail: res.message, life: 3000 });
            return;
        }

        this.messageService.add({ severity: 'info', summary: 'Success', detail: res.message });

        if (this.parent !== null)
            this.parent.getList();

        this.pageDialog.close();
    }

    async showDialog(item?: any) {

        this.form.reset();
        this.resData = null;

        this.buildForm();

        this.pageDialog.show();

        if (item !== undefined && item !== null)
            await this.loadForm(item);

        this.pageDialog.showForm();
        this.onShow();
    }

    async loadForm(item?: any) {
        this.resData = await firstValueFrom(this.service.getById({ id: item.id }));
        Object.entries(this.resData.data).forEach(entry => {
            const [key, value] = entry;
            if (this.form.controls[key] !== undefined) {
                if (typeof value === 'string' && /^\d{4}-\d{1,2}-\d{1,2}/.test(value)) {
                    this.form.controls[key].setValue(new Date(value));
                } else {
                    this.form.controls[key].setValue(value);
                }
            }
        });
    }

    onShow(): void {
        return undefined;
    }

    buildForm(): void {
        return undefined;
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(el => el.unsubscribe());
    }

    ngOnInit(): void {
        this.buildForm();
    }

}
