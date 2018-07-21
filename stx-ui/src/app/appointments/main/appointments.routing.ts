import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppointmentsComponent } from './appointments.component';

@NgModule({
  imports: [
      RouterModule.forChild([
          {
              path: '',
              component: AppointmentsComponent,
              children: [
                  {
                      path: '',
                      component: AppointmentsComponent
                  }
              ]
          }
      ])
  ],
  exports: [
      RouterModule
  ]
})
export class AppointmentsRoutingModule { }
