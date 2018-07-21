import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupCompanyInfoComponent } from './setupcompanyinfo.component';

@NgModule({
  imports: [
      RouterModule.forChild([
          {
              path: '',
              component: SetupCompanyInfoComponent,
              children: [
                  {
                      path: '',
                      component: SetupCompanyInfoComponent
                  }
              ]
          }
      ])
  ],
  exports: [
      RouterModule
  ]
})
export class SetupCompanyInfoRoutingModule { }
