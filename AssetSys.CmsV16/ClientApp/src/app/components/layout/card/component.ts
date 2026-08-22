import { Component, OnInit, OnDestroy, ChangeDetectorRef, Input, ContentChild, TemplateRef } from '@angular/core';

@Component({
    selector: 'nb-layout-card',
    template: `<div class="card card-stretch card-bordered" [class]="cardClass">
        <div class="card-header" [class]="headerClass" style="min-height: 55px;">
            <h3 class="card-title align-items-start flex-column">
                <span class="card-label fw-bold text-gray-800">{{title}}</span>
                <ng-content select="[title]"></ng-content>
            </h3>
            <div class="card-toolbar flex-row-fluid justify-content-end gap-5">
                <ng-content select="[toolbar]"></ng-content>
            </div>
        </div>     
        <div class="card-body" [class]="bodyClass">
            <ng-content></ng-content>
        </div>
        <ng-container *ngTemplateOutlet="footerTemplate !== undefined ? ft : null"></ng-container>
    </div>
    <ng-template #ft>
        <div class="card-footer" [class]="footerClass">
            <ng-container *ngTemplateOutlet="footerTemplate"></ng-container>
        </div>
    </ng-template>`,
    standalone: false
})
export class NbLayoutCardComponent implements OnInit, OnDestroy {

    @Input() title: string;
    @Input() cardClass: string;
    @Input() bodyClass: string;
    @Input() headerClass: string;
    @Input() footerClass: string;

    @ContentChild('footer') footerTemplate!: TemplateRef<any>;

    constructor(private cdr: ChangeDetectorRef) {
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
    }

}
