import { ChangeDetectorRef, Component, Input, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { InfoFormService } from '../../services/info-form.service';
import { firstValueFrom } from 'rxjs';
import { InfoPropertyService } from '@appkkkh/modules/info/info-property/services/info-property.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import icons from '@appkkkh/_metronic/shared/keenicon/icons.json';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { InfoPropertyEditComponent } from '@appkkkh/modules/info/info-property/components/edit/info-property-edit.component';
import controlTypes from '../property/controls.json';

@Component({
    selector: 'app-info-form-control',
    templateUrl: `./component.html`,
    providers: [ConfirmationService, MessageService],
    standalone: false
})
export class InfoFormControlComponent implements OnInit {

    controls: any[] = [];

    get getDropListsIds(){

        const lst: any[] = [];

        this.controls.forEach((i: any) => i.items.forEach((c: any) => lst.push(c.value)));

        return lst;
    }

    constructor(public infoPropertyService: InfoPropertyService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private changeDetectorRef: ChangeDetectorRef,
        private formBuilder: FormBuilder) {
    }

    ngOnInit(): void {
        this.controls = controlTypes;
    }
}