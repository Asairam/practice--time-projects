import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MarketingReportDeleteComponent } from './marketingreportdelete.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: MarketingReportDeleteComponent,
                children: [
                    {
                        path: '',
                        component: MarketingReportDeleteComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MarketingReportDeleteRoutingModule {
}
