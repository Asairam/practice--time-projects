import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierBiddingComponent } from './supplier-bidding.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierBiddingComponent,
    children: [
      {
        path: '',
        component: SupplierBiddingComponent,
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierBiddingRoutingModule { }
