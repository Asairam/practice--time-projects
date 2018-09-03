import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { OnlineGiftRoutingModule } from './onlinegiftrouting.module';
import { OnlineGiftComponent } from './onlinegift.component';
import { TranslateModule } from 'ng2-translate';

@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    OnlineGiftRoutingModule,
    FormsModule
  ],
  declarations: [OnlineGiftComponent]
})
export class OnlineGiftModule { }
