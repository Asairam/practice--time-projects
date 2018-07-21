import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { NewClientComponent } from './newclient.component';
const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forChild([
    {
        path: '',
        component: NewClientComponent,
        children: [
            {
                path: '',
                component: NewClientComponent
            }
        ]
    }
])],
  exports: [RouterModule]
})
export class NewClientRoutingModule { }
