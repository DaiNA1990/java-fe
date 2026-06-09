import { Component, OnInit, OnDestroy, TemplateRef, ViewChild, Input } from '@angular/core';

@Component({
    selector: 'nb-layout-grid-item',
    template: `        
        <ng-template>
            <div [ngClass]="size === undefined ? 'col' : 'col-' + size">
                <ng-content></ng-content>
            </div>
        </ng-template>        
    `
})
export class NbLayoutGridItemComponent implements OnInit, OnDestroy {

    @Input() size: string;

    @ViewChild(TemplateRef, { static: false }) template: TemplateRef<any>;

    constructor() {
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
    }

}
