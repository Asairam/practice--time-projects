import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AbcReportComponent } from './abcreport.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AbcReportComponent,
                children: [
                    {
                        path: '',
                        component: AbcReportComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class AbcReportRoutingModule {
}
