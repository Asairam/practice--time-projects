import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ReportGiftsComponent } from './reportgifts.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ReportGiftsComponent,
                children: [
                    {
                        path: '',
                        component: ReportGiftsComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ReportGiftsRoutingModule {
}
