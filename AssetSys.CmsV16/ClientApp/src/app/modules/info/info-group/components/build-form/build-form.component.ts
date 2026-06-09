import { ChangeDetectorRef, Component, forwardRef, Input } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { InfoGroupService } from '../../services/info-group.service';

@Component({
    selector: 'app-info-group-build-form',
    templateUrl: `./build-form.component.html`,
})
export class InfoGroupBuildFormComponent {

    group: any = null;
    layoutId: number | null = null;

    isVisible: boolean = false;

    constructor(public service: InfoGroupService,
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder) {
    }

    open(group: any) {
        this.group = group;
        this.layoutId = null;
        this.isVisible = true;
    }

    close() {
        this.isVisible = false;
    }

    onHiden() {
        this.group = null;
        this.layoutId = null;
    }

    layoutChange(e: any){
        this.layoutId = null;
        setTimeout(() => {
            this.layoutId = e.id;
            this.cdr.detectChanges();
        }, 10);
    }

    ngOnInit(): void {
        
    }
}
