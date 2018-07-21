import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FavouritesComponent } from './favourites.component';
const routes: Routes = [];

@NgModule({
  imports: [
    RouterModule.forChild([
        {
            path: '',
            component: FavouritesComponent,
            children: [
                {
                    path: '',
                    component: FavouritesComponent
                }
            ]
        }
    ])
],
  exports: [RouterModule]
})
export class FavouritesRoutingModule { }
