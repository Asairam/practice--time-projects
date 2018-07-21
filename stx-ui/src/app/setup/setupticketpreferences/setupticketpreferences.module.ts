import { NgModule } from '@angular/core';
// import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
 import { SetupTicketPreferencesRoutingModule } from './setupticketpreferences.routing';
 import { ShareModule } from '../../common/share.module';
 import { SetupTicketPreferencesComponent } from './setupticketpreferences.component';
// import { FroalaEditorModule, FroalaViewModule } from 'angular2-froala-wysiwyg';
import { TranslateModule, TranslateLoader, TranslateStaticLoader, TranslateService } from 'ng2-translate';
import { ColorPickerModule } from 'ngx-color-picker';
import { Ng2DeviceDetectorModule } from 'ng2-device-detector';
@NgModule({
  imports: [
     ShareModule,
    SetupTicketPreferencesRoutingModule,
  //  BsDropdownModule,
    TabsModule.forRoot(),
    Ng2DeviceDetectorModule.forRoot(),
    ModalModule.forRoot(),
    FormsModule, ReactiveFormsModule,
    CommonModule,
   // FroalaEditorModule.forRoot(), FroalaViewModule.forRoot(),
    TranslateModule,
    ColorPickerModule
  ],
  declarations: [SetupTicketPreferencesComponent]
})
export class SetupTicketPreferencesModule { }
