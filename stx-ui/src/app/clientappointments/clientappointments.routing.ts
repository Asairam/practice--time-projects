import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ClientappointmentsComponent } from './clientappointments.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ClientappointmentsComponent,
                children: [
                    {
                        path: '',
                        component: ClientappointmentsComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
})
export class ClientappointmentsRoutingModule {
}
