import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupInventGroupsComponent } from './setupinventgroups.component';
import { SetupInventoryGroupsRoutingModule } from './setupinventorygroups.routing';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    SetupInventoryGroupsRoutingModule,
    ShareModule
  ],
  declarations: [SetupInventGroupsComponent]
})
export class SetupInventoryGroupsModule { }
