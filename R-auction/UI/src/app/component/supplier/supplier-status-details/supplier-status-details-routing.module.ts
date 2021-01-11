import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SupplierStatusDetailsComponent } from './supplier-status-details.component';

const routes: Routes = [
  {
    path: '',
    component: SupplierStatusDetailsComponent,
    children: [
      {
        path: '',
        component: SupplierStatusDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierStatusDetailsRoutingModule { }
