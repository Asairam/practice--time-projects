import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { MonthlyBussinessAnalysisComponent } from './monthlybussinessanalysis.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: MonthlyBussinessAnalysisComponent,
                children: [
                    {
                        path: '',
                        component: MonthlyBussinessAnalysisComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class MonthlyBussinessAnalysisRoutingModule {
}
