import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TbpReportReportComponent } from './tbpreport.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: TbpReportReportComponent,
                children: [
                    {
                        path: '',
                        component: TbpReportReportComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class TbpReportRoutingModule {
}
