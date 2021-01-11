import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BuyerLandingComponent } from './buyer-landing.component';
const routes: Routes = [
  {
    path: '',
    component: BuyerLandingComponent,
    children: [
      {
        path: '',
        component: BuyerLandingComponent
      } 
    ]
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class BuyerLandingRoutingModule { }
