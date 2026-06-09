import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NbBreadcrumbModule } from '@appkkkh/components/page/breadcrumb/module';
import { InfoFormComponent } from './info-form.component';
import { InfoFormComponentsModule } from './components/info-form-components.module';

@NgModule({
    declarations: [
        InfoFormComponent
    ],
    imports: [
        CommonModule,
        RouterModule.forChild([
            {
                path: 'info/info-form',
                component: InfoFormComponent,
            },
        ]),
        InfoFormComponentsModule,
        NbBreadcrumbModule
    ],
})
export class InfoFormModule { }