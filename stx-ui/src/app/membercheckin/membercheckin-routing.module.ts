import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { MembercheckinComponent } from './membercheckin.component';
const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild([
        {
            path: '',
            component: MembercheckinComponent,
            children: [
                {
                    path: '',
                    component: MembercheckinComponent
                }
            ]
        }
    ])
],
  exports: [RouterModule]
})
export class MembercheckinRoutingModule { }
