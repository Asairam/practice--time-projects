import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LiveAuctionDetailsComponent } from './live-auction-details.component';

const routes: Routes = [
  {
    path: '',
    component: LiveAuctionDetailsComponent,
    children: [
      {
        path: '',
        component: LiveAuctionDetailsComponent
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LiveAuctionDetailsRoutingModule { }
