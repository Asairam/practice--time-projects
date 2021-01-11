import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditComponent } from './edit.component';
import { EditRoutingModule } from './edit-routing.module';
import { SharedModule } from '../../../shared/module/shared.module';
import { BasicinfoComponent } from './basicinfo/basicinfo.component';
import { ItemsComponent } from './items/items.component';
// import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { FileUploadModule } from 'ng2-file-upload';
import { TextFieldModule } from '@angular/cdk/text-field';
import { SwiperModule } from 'ngx-useful-swiper';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { ParticpantComponent } from './particpant/particpant.component';
import { HostCohostComponent } from './host-cohost/host-cohost.component';
import { CustomFieldComponent } from './custom-field/custom-field.component';
import { ItemsCardsComponent } from './items/item-card/item-card.component';
import { ListItemComponent } from './items/list-item/list-item.component';
import { ItemService } from './items/items.service';
// import { PoHistoryComponent } from './items/po-history/po-history.component';
import { EditService } from './edit.service';
import { RawDataReportItemHeaderComponent } from './basicinfo/template/rawDataReportItemHeader.component';
import { PreliminarybidsCopy20200830Component } from './particpant/preliminarybids/preliminarybids-copy-20200830.component';

 
/* NgRx */
import { StoreModule } from '@ngrx/store';
import { reducer } from './state/editmodule.reducer';


@NgModule({
  declarations: [EditComponent, BasicinfoComponent, ItemsComponent, ParticpantComponent, HostCohostComponent, CustomFieldComponent, ItemsCardsComponent, ListItemComponent,
    RawDataReportItemHeaderComponent,
    PreliminarybidsCopy20200830Component
  ],
  imports: [
    CommonModule,
    EditRoutingModule,
    SharedModule,
    // OwlDateTimeModule,
    // OwlNativeDateTimeModule,
    FileUploadModule,
    TextFieldModule,
    SwiperModule,
    NgbModule,
    StoreModule.forFeature('editModule', reducer),
  ],
  entryComponents: [RawDataReportItemHeaderComponent, PreliminarybidsCopy20200830Component],
  providers: [ItemService, EditService],
  exports: []
})
export class EditModule { }
