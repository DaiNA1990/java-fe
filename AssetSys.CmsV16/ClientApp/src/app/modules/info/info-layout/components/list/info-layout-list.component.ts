import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InfoLayoutService } from '../../services/info-layout.service';

@Component({
    selector: 'app-info-layout-list',
    templateUrl: `./info-layout-list.component.html`,
})
export class InfoLayoutListComponent implements OnInit {

    @Input() groupId: number | null;
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

    formFilter: FormGroup;

    constructor(public service: InfoLayoutService,
        private fb: FormBuilder) { }

    loadForm(item: any){
        this.onChange.emit(item);
    }

    init() {
        this.formFilter = this.fb.group({
            groupId: [this.groupId, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        this.init();
    }
}