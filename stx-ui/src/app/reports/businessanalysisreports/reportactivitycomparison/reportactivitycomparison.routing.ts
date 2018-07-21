import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportActivityComparisonComponent } from './reportactivitycomparison.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ReportActivityComparisonComponent,
                children: [
                    {
                        path: '',
                        component: ReportActivityComparisonComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ReportActivityComparisonRoutingModule {
}
