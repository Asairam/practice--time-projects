import { NgModule } from '@angular/core';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CommonModule } from '@angular/common';
import { ModalModule } from 'ngx-bootstrap/modal';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { ClientAppointmentsRoutingModule } from './clientappointments.routing';
import { ClientAppointmentsComponent } from './clientappointments.component';
import { ShareModule } from '../../common/share.module';
import { TranslateModule, TranslateLoader, TranslateStaticLoader, TranslateService } from 'ng2-translate';
import { ColorPickerModule } from 'ngx-color-picker';
import { CKEditorModule } from 'ngx-ckeditor';
@NgModule({
  imports: [
    ShareModule,
    ClientAppointmentsRoutingModule,
    BsDropdownModule,
    TabsModule.forRoot(),
    ModalModule,
    FormsModule, ReactiveFormsModule,
    CommonModule,
    TranslateModule,
    ColorPickerModule,
    CKEditorModule
  ],
  declarations: [ClientAppointmentsComponent]
})
export class ClientAppointmentsModule { }
