import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CloneAuctionComponent } from './clone-auction.component';

const routes: Routes = [
  {
    path: '',
    component: CloneAuctionComponent,
    children: [
      {
        path: '',
        component: CloneAuctionComponent
      }
    ]
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class CloneAuctionRoutingModule { }
