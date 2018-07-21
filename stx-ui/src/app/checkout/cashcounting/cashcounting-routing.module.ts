import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CashCountingComponent } from './cashcounting.component';
const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    {
        path: '',
        component: CashCountingComponent,
        children: [
            {
                path: '',
                component: CashCountingComponent
            }
        ]
    }
])],
  exports: [RouterModule]
})
export class CashCountingRoutingModule { }
