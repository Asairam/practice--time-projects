import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SetupProductsComponent } from './setupproducts.component';
import { SetupProductsRoutingModule } from './setupproducts.routing';
import { ShareModule } from '../../../common/share.module';
import { TranslateModule } from 'ng2-translate';
import { FormsModule } from '@angular/forms';
@NgModule({
  imports: [
    CommonModule,
    TranslateModule,
    FormsModule,
    SetupProductsRoutingModule,
    ShareModule
  ],
  declarations: [SetupProductsComponent]
})
export class SetupProductsModule { }
