import { Component, OnInit, OnDestroy, ChangeDetectorRef, ContentChildren, QueryList, TemplateRef } from '@angular/core';
import { NbLayoutGridItemComponent } from './col';

@Component({
    selector: 'nb-layout-grid',
    template: `<div class="row">
        <ng-container *ngFor="let col of cols">
            <ng-container *ngTemplateOutlet="col.template"></ng-container>
        </ng-container>        
    </div>`
})
export class NbLayoutGridComponent implements OnInit, OnDestroy {

    @ContentChildren(NbLayoutGridItemComponent) cols: QueryList<NbLayoutGridItemComponent>;

    constructor(private cdr: ChangeDetectorRef) {
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
    }

}
