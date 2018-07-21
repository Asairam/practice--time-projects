import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportVisitTypeOverviewComponent } from './reportvisittypeoverview.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ReportVisitTypeOverviewComponent,
                children: [
                    {
                        path: '',
                        component: ReportVisitTypeOverviewComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ReportVisitTypeOverviewRoutingModule {
}
