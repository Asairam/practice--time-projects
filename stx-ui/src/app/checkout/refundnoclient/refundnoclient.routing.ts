import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RefundnoclientComponent } from './refundnoclient.component';

// const routes: Routes = [];

@NgModule({
  imports: [
      RouterModule.forChild([
          {
              path: '',
              component: RefundnoclientComponent,
              children: [
                  {
                      path: '',
                      component: RefundnoclientComponent
                  }
              ]
          }
      ])
  ],
  exports: [
      RouterModule
  ]
})
export class RefundnoclientRoutingModule { }
