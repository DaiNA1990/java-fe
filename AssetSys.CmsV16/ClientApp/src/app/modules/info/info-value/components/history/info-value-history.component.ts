import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { InfoValueHistoryService } from '../../services/info-value-history.service';
import { firstValueFrom, Subscription } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-info-value-history',
    templateUrl: `./info-value-history.component.html`,
})
export class InfoValueHistoryComponent implements OnInit {

    isVisible: boolean = false;

    formFilter: FormGroup;

    lstData: any[] = [];

    subscriptions: Subscription[] = [];

    constructor(private route: ActivatedRoute,
        public service: InfoValueHistoryService,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef) { }

    open(dataId: number) {
        this.isVisible = true;
        this.getData(dataId);
    }

    close() {
        this.isVisible = false;
    }

    async getData(dataId: number) {
        const res = await firstValueFrom(this.service.getList({ dataId: dataId }));
        this.lstData = res.data;
        this.cdr.detectChanges();
    }

    init() {
        this.formFilter = this.fb.group({});
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(el => el.unsubscribe());
    }

    ngOnInit(): void {
        this.init();
        this.open(this.route.snapshot.params['dataId']);
    }
}