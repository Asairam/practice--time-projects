import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupCompanyHoursComponent } from './setupcompanyhrs.component';

@NgModule({
  imports: [
      RouterModule.forChild([
          {
              path: '',
              component: SetupCompanyHoursComponent,
              children: [
                  {
                      path: '',
                      component: SetupCompanyHoursComponent
                  }
              ]
          }
      ])
  ],
  exports: [
      RouterModule
  ]
})
export class SetupCompanyHoursRoutingModule { }
