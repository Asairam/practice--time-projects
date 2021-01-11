import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveBiddingComponent } from './live-bidding.component';

const routes: Routes = [
  {
    path: '',
    component: LiveBiddingComponent,
    children: [
      {
        path: '',
        component: LiveBiddingComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveBiddingRoutingModule { }
