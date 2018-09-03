import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnlineBookSucessComponent } from './onlinebooksucess.component';

@NgModule({
  imports: [
      RouterModule.forChild([
          {
              path: '',
              component: OnlineBookSucessComponent,
              children: [
                  {
                      path: '',
                      component: OnlineBookSucessComponent
                  }
              ]
          }
      ])
  ],
  exports: [
      RouterModule
  ]
})
export class OnlineBookSucessRoutingModule { }
