import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MarketingReportEditComponent } from './marketingreportedit.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: MarketingReportEditComponent,
                children: [
                    {
                        path: '',
                        component: MarketingReportEditComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MarketingReportEditRoutingModule {
}
