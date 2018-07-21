import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MarketingClientFiltersComponent } from './marketingclientfilters.component';
const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: '',
        component: MarketingClientFiltersComponent,
        children: [
          {
              path: '',
              component: MarketingClientFiltersComponent
          }
      ]
      }
    ])
  ],
  exports: [RouterModule]
})
export class MarketingClientFiltersRoutingModule { }
