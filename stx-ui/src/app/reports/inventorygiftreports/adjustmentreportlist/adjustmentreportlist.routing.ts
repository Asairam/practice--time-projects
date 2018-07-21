import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AdjustmentReportListComponent } from './adjustmentreportlist.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AdjustmentReportListComponent,
                children: [
                    {
                        path: '',
                        component: AdjustmentReportListComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AdjustmentReportListRoutingModule {
}
