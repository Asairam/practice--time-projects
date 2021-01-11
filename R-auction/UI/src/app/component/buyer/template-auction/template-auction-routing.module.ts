import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TemplateAuctionComponent } from './template-auction.component';

const routes: Routes = [
  {
    path: '',
    component: TemplateAuctionComponent,
    children: [
      {
        path: '',
        component: TemplateAuctionComponent
      }
    ]
  }  
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TemplateAuctionRoutingModule { }
