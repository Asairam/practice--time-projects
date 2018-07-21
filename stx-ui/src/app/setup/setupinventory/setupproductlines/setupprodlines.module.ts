import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupProductLinesComponent } from './setupprodlines.component';
import { SetupProductLinesRoutingModule } from './setupprodlines.routing';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { FormsModule } from '@angular/forms';
import { ColorPickerModule } from 'ngx-color-picker';
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    ColorPickerModule,
    SetupProductLinesRoutingModule,
    ShareModule
  ],
  declarations: [SetupProductLinesComponent]
})
export class SetupProductLinesModule { }
