import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShareModule } from '../common/share.module';
import { MembercheckinRoutingModule } from './membercheckin-routing.module';
import { MembercheckinComponent } from './membercheckin.component';

@NgModule({
  imports: [
    CommonModule,
    MembercheckinRoutingModule,
    ShareModule
  ],
  declarations: [MembercheckinComponent]
})
export class MemberCheckInModule { }
