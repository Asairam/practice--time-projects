import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { MatPaginatorModule } from '@angular/material';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { SharedModule } from '../app/shared/module/shared.module';
import { HeaderComponent } from '../app/shared/component/header/header.component';
import { MessageComponent } from './shared/component/message/message.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CommonPopupComponent } from './shared/component/common-popup/common-popup.component';
import { MoreoptionComponent } from './component/buyer/edit/basicinfo/moreoption/moreoption.component';
import { PageNotFoundComponent } from './shared/component/page-not-found/page-not-found.component';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ServerErrorInterceptorService } from './authService/server-error-interceptor.service';
import { FilterColumnComponent } from './shared/component/filter-column/filter-column.component';
import { ViewPopupComponent } from './shared/component/view-popup/view-popup.component';
import { ItemPopupComponent } from './component/buyer/edit/items/item-popup/item-popup.component';
import { BasicinfoPopupComponent } from './shared/component/basicinfo-popup/basicinfo-popup.component';
import { LotPopupComponent } from './shared/component/lot-popup/lot-popup.component';
import { LotPopupViewOnlyComponent } from './shared/component/lot-popup-view-only/lot-popup-view-only.component';
import { PreliminarybidsComponent } from './component/buyer/edit/particpant/preliminarybids/preliminarybids.component';
// import { SuppAuctionAcceptPopupComponent } from './component/supplier/supplier-bidding/supp-auction-accept-popup/supp-auction-accept-popup.component';
import { VendormodificationComponent } from './component/buyer/edit/particpant/vendormodification/vendormodification.component';
import { LoaderComponent } from './shared/component/loader/loader.component';
import { CommonLoaderService } from './shared/component/loader/loader.service';
import { LoaderInterceptor } from './shared/component/loader/loader.interceptor';
import { BidviewPopupComponent } from './component/supplier/supplier-bidding/bidview-popup/bidview-popup.component';
import { CustomFieldPopupComponent } from './shared/component/custom-field-popup/custom-field-popup.component';
import { AppInitService } from './commonService/app-init.service';
import { AuditLogComponent } from './component/buyer/audit-log/audit-log.component';
import { ItemPopupHolderComponent } from './component/buyer/edit/items/item-popup-holder/item-popup-holder.component';
import { ItemDetailAttachmentComponent } from './component/buyer/edit/items/item-detail-attachment/item-detail-attachment.component';
import { PrintpreviewComponent } from './component/buyer/edit/printpreview/printpreview.component';
import { MailTemplateComponent } from './shared/component/mail-template/mail-template.component';
import { PreitemPipe } from './shared/pipe/preitem.pipe';
import { MmcsComponent } from './component/buyer/edit/items/mmcs/mmcs.component';
import { MmcsAttachComponent } from './component/buyer/edit/items/mmcs-attach/mmcs-attach.component';
import { MmcsLongDescComponent } from './component/buyer/edit/items/mmcs-long-desc/mmcs-long-desc.component';
import { SupplierCurrencyComponent } from './component/buyer/live-bidding/supplier-currency/supplier-currency.component';
import { AddChipComponent } from './shared/component/add-chip/add-chip.component';
import { AttachDocumentComponent } from './shared/component/attach-document/attach-document.component';
import { QueryOfflineComponent } from './shared/component/query-offline/query-offline.component';
import { EditProfileComponent } from './shared/component/edit-profile/edit-profile.component';
import { VendorCodePopupComponent } from './component/login/vendor-code-popup/vendor-code-popup.component';
// import { RemarkComponent } from './shared/component/remark/remark.component';
import { LiveParticipantRemarkComponent } from './component/buyer/edit/particpant/live-participant-remark/live-participant-remark.component';
import { DecimalPipe } from '@angular/common';
import { PublishConfirmationComponent } from './component/buyer/edit/publish-confirmation/publish-confirmation.component';
import { ParticipantMailPopupComponent } from './component/buyer/edit/particpant/participant-mail-popup/participant-mail-popup.component';
import { HostCohostMailPopupComponent } from './component/buyer/edit//host-cohost/host-cohost-mail-popup/host-cohost-mail-popup.component';
import { ShowCardSuppliersComponent } from './shared/component/show-card-suppliers/show-card-suppliers.component';
import { NotificationComponent } from './shared/component/notification/notification.component';
// import { NotificationlistComponent } from './shared/component/notificationlist/notificationlist.component';
import { RepublishQuestionComponent } from './component/buyer/status-details/republish-question/republish-question.component';

import { ShowSchedulersComponent } from './component/buyer/show-schedulers/show-schedulers.component';
import { CalendarModule, DateAdapter } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
/* NgRx */
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { reducer } from './state/app.reducer';
import { PoHistoryComponent } from './component/buyer/edit/items/po-history/po-history.component';
import { RoundsAuctionComponent } from './component/buyer/edit/basicinfo/rounds-auction/rounds-auction.component';
// import { PoHistoryComponent } from './items/po-history/po-history.component';



export function init(appInitService: AppInitService) {
  return () => appInitService.init();
}
export function loadUrls(appInitService: AppInitService) {
  return () => appInitService.loadUrls();
}

@NgModule({
  declarations: [
    AppComponent, HeaderComponent, MoreoptionComponent,MessageComponent,AttachDocumentComponent,QueryOfflineComponent,
    CommonPopupComponent, PageNotFoundComponent, FilterColumnComponent, ViewPopupComponent, ItemPopupComponent, 
    BasicinfoPopupComponent, LotPopupComponent, LoaderComponent, VendormodificationComponent, BidviewPopupComponent, 
    PreliminarybidsComponent, CustomFieldPopupComponent, AuditLogComponent, ItemPopupHolderComponent, 
    PrintpreviewComponent, MailTemplateComponent, PreitemPipe, MmcsComponent, MmcsAttachComponent, SupplierCurrencyComponent, 
    AddChipComponent, EditProfileComponent, MmcsLongDescComponent, ItemDetailAttachmentComponent, VendorCodePopupComponent, 
    PublishConfirmationComponent, ParticipantMailPopupComponent, HostCohostMailPopupComponent, ShowCardSuppliersComponent, NotificationComponent,
    ShowSchedulersComponent,RepublishQuestionComponent, LotPopupViewOnlyComponent, LiveParticipantRemarkComponent, PoHistoryComponent,
    RoundsAuctionComponent],
  imports: [
    BrowserModule,
    StoreModule.forRoot({}),    
    AppRoutingModule, SharedModule, BrowserAnimationsModule, MatPaginatorModule ,
    StoreDevtoolsModule.instrument({
      name: 'Auction App Devtools',
      maxAge: 25,
      logOnly: false
    }),
    CalendarModule.forRoot({
      provide: DateAdapter,
      useFactory: adapterFactory,
    }),
    StoreModule.forFeature('appModule', reducer),
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: ServerErrorInterceptorService, multi: true },
    CommonLoaderService,
    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },
    AppInitService,
    { provide: APP_INITIALIZER, useFactory: init, deps: [AppInitService], multi: true },
    { provide: APP_INITIALIZER, useFactory: loadUrls, deps: [AppInitService], multi: true },
    DecimalPipe
  ],

  bootstrap: [AppComponent],
  entryComponents: [
    CommonPopupComponent, 
    ViewPopupComponent,
    AttachDocumentComponent, 
    PublishConfirmationComponent, 
    VendorCodePopupComponent,
    RepublishQuestionComponent
  ]
})
export class AppModule { }


