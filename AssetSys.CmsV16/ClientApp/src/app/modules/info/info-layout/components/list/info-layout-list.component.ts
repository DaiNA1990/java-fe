import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InfoLayoutService } from '../../services/info-layout.service';

@Component({
    selector: 'app-info-layout-list',
    templateUrl: `./info-layout-list.component.html`,
    standalone: false
})
export class InfoLayoutListComponent implements OnInit {

    @Input() groupId: number | null;
    @Output() onChange: EventEmitter<any> = new EventEmitter<any>();

    formFilter: FormGroup;

    constructor(public infoLayoutService: InfoLayoutService,
        private formBuilder: FormBuilder) { }

    loadForm(item: any){
        this.onChange.emit(item);
    }

    init() {
        this.formFilter = this.formBuilder.group({
            groupId: [this.groupId, [Validators.nullValidator]],
        });
    }

    ngOnInit(): void {
        this.init();
    }
}