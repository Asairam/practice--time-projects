import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../common/share.module';
import { FavouritesRoutingModule } from './favourites-routing.module';
import { FavouritesComponent } from './favourites.component';

@NgModule({
  imports: [
    CommonModule,
    FavouritesRoutingModule,
    ShareModule
  ],
  declarations: [FavouritesComponent]
})
export class FavouritesModule { }
