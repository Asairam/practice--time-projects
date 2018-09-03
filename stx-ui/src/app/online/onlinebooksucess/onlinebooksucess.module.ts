import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OnlineBookSucessRoutingModule } from './onlinebooksucess-routing.module';
import { OnlineBookSucessComponent } from './onlinebooksucess.component';

@NgModule({
  imports: [
    CommonModule,
    OnlineBookSucessRoutingModule
  ],
  declarations: [OnlineBookSucessComponent]
})
export class OnlineBookSucessModule { }
