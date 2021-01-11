import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierLandingComponent } from './supplier-landing.component';
const routes: Routes = [
  {
    path: '',
    component: SupplierLandingComponent,
    children: [
      {
        path: '',
        component: SupplierLandingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierLandingRoutingModule { }
