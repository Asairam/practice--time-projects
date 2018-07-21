import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ClientAppointmentsComponent } from './clientappointments.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: ClientAppointmentsComponent,
                children: [
                    {
                        path: '',
                        component: ClientAppointmentsComponent
                    }
                ]
            }
        ])
    ],
    exports: [
        RouterModule
    ]
  })
export class ClientAppointmentsRoutingModule { }
