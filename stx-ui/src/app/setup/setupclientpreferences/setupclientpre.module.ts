import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { SetupClientRoutingModule } from './setupclientpre.routing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from 'ng2-translate';
import { ShareModule } from '../../common/share.module';
 import { SetupClientPreferenceComponent } from './setupclientpre.component';
@NgModule({
  imports: [
    SetupClientRoutingModule,
    BsDropdownModule,
    TabsModule.forRoot(),
    ModalModule,
    FormsModule, ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    ShareModule
  ],
  declarations: [SetupClientPreferenceComponent
   ]
})
export class SetupClientPreferenceModule { }
