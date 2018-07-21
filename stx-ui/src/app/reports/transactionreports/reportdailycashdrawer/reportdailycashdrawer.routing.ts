import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportDailyCashDrawerComponent } from './reportdailycashdrawer.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ReportDailyCashDrawerComponent,
                children: [
                    {
                        path: '',
                        component: ReportDailyCashDrawerComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ReportDailyCashDrawerRoutingModule {
}
