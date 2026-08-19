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

    constructor(private activatedRoute: ActivatedRoute,
        public infoValueHistoryService: InfoValueHistoryService,
        private formBuilder: FormBuilder,
        private changeDetectorRef: ChangeDetectorRef) { }

    open(dataId: number) {
        this.isVisible = true;
        this.getData(dataId);
    }

    close() {
        this.isVisible = false;
    }

    async getData(dataId: number) {
        const res = await firstValueFrom(this.infoValueHistoryService.getList({ dataId: dataId }));
        this.lstData = res.data;
        this.changeDetectorRef.detectChanges();
    }

    init() {
        this.formFilter = this.formBuilder.group({});
    }

    ngOnDestroy(): void {
        this.subscriptions.forEach(el => el.unsubscribe());
    }

    ngOnInit(): void {
        this.init();
        this.open(this.activatedRoute.snapshot.params['dataId']);
    }
}