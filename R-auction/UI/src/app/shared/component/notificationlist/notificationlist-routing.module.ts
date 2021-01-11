import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NotificationlistComponent } from './notificationlist.component';

const routes: Routes = [
  {
    path: '',
    component: NotificationlistComponent,
    children: [
      {
        path: '',
        component: NotificationlistComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class NotificationListRoutingModule { }
