import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SetupClientPreferenceComponent } from './setupclientpre.component';
@NgModule({
  imports: [
      RouterModule.forChild([
          {
              path: '',
              component: SetupClientPreferenceComponent,
              children: [
                  {
                      path: '',
                      component: SetupClientPreferenceComponent
                  }
              ]
          }
      ])
  ],
  exports: [
      RouterModule
  ]
})
export class SetupClientRoutingModule { }
