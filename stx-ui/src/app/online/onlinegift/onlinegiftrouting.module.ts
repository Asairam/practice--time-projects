import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OnlineGiftComponent } from './onlinegift.component';
const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild([
        {
            path: '',
            component: OnlineGiftComponent,
            children: [
                {
                    path: '',
                    component: OnlineGiftComponent
                }
            ]
        }
    ])
],
  exports: [RouterModule]
})
export class OnlineGiftRoutingModule { }
