import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportProductSalesComponent } from './reportproductsales.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ReportProductSalesComponent,
                children: [
                    {
                        path: '',
                        component: ReportProductSalesComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ReportProductSalesRoutingModule {
}
