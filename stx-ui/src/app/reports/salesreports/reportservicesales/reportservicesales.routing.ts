import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportServiceSalesComponent } from './reportservicesales.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ReportServiceSalesComponent,
                children: [
                    {
                        path: '',
                        component: ReportServiceSalesComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class  ReportServiceSalesRoutingModule {
}
