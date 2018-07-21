import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ApptDetailComponent } from './appointmentdetail.component';
import { ApptDetailModule } from './appointmentdetail.module';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ApptDetailComponent,
                children: [
                    {
                        path: '',
                        component: ApptDetailComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ApptDetailRoutingModule {
}
