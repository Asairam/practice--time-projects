import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupPaymentTypesComponent } from './setuppaymenttypes.component';

@NgModule({
  imports: [
      RouterModule.forChild([
          {
              path: '',
              component: SetupPaymentTypesComponent,
              children: [
                  {
                      path: '',
                      component: SetupPaymentTypesComponent
                  }
              ]
          }
      ])
  ],
  exports: [
      RouterModule
  ]
})
export class SetupPaymentTypesRoutingModule { }
