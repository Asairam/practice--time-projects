import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { StatusDetailsComponent } from './status-details.component';

const routes: Routes = [
  {
    path: '',
    component: StatusDetailsComponent,
    children: [
      {
        path: '',
        component: StatusDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class StatusDetailsRoutingModule { }
