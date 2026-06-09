import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';

@Component({
    selector: 'nb-layout-builder',
    template: ``
})
export class NbLayoutBuilderComponent implements OnInit, OnDestroy {

    constructor(private cdr: ChangeDetectorRef) {
    }

    ngOnDestroy(): void {
    }

    ngOnInit(): void {
    }

}
