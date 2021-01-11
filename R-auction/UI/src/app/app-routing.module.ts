import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthGuard } from './authService/_guards/auth.guard';
import { PageNotFoundComponent } from './shared/component/page-not-found/page-not-found.component';
import { CustomPreloading } from '../app/authService/custom-preloading';
import * as config from './appConfig/app.config';
import * as routerconfig from './appConfig/router.config';
import { ShowSchedulersComponent } from './component/buyer/show-schedulers/show-schedulers.component';
const routes: Routes = [
  { path: 'login', loadChildren: './component/login/login.module#LoginModule' },
  { path: '', redirectTo: 'login', pathMatch: 'full', canActivate: [AuthGuard] },
  { path: routerconfig.buyer_router_links.ADMIN_PANEL, loadChildren: './component/buyer/admin-panel/admin-panel.module#AdminPanelModule'}, 
  { path: routerconfig.buyer_router_links.BUYER_DASHBOARD, loadChildren: './component/buyer/buyer-landing/buyer-landing.module#BuyerLandingModule', canActivate: [AuthGuard], data: { roles: config.ROLE_ACCESS_CONTROL.both, animation:'BuyerLanding' } },
  { path: routerconfig.supplier_router_links.SUPPLIER_DASHBOARD, loadChildren: './component/supplier/supplier-landing/supplier-landing.module#SupplierLandingModule', canActivate: [AuthGuard], data: { roles: config.ROLE_ACCESS_CONTROL.both_supplier } },
  { path: routerconfig.buyer_router_links.CREATE_AUCTION, loadChildren: './component/buyer/edit/edit.module#EditModule', canActivate: [AuthGuard], data: { roles: config.ROLE_ACCESS_CONTROL.both } },
  { path: 'createclone', loadChildren: './component/buyer/edit/edit.module#EditModule', canActivate: [AuthGuard], data: { roles: config.ROLE_ACCESS_CONTROL.both } },
  { path: routerconfig.buyer_router_links.BUYER_LIST_VIEW, loadChildren: './component/buyer/status-details/status-details.module#StatusDetailsModule', canActivate: [AuthGuard], data: { roles: config.ROLE_ACCESS_CONTROL.both, preload: true } },
  { path: routerconfig.supplier_router_links.PARTICIPANT_LIST_VIEW, loadChildren: './component/supplier/supplier-status-details/supplier-status-details.module#SupplierStatusDetailsModule', canActivate: [AuthGuard], data: { roles: config.ROLE_ACCESS_CONTROL.both_supplier, preload: true } },
  { path: routerconfig.buyer_router_links.EDIT_AUCTION +'/:id', loadChildren: './component/buyer/edit/edit.module#EditModule', canActivate: [AuthGuard], data: { roles: config.ROLE_ACCESS_CONTROL.both, preload: true } },
  { path: routerconfig.buyer_router_links.LIVE_AUCTION, loadChildren: './component/buyer/live-auction-details/live-auction-details.module#LiveAuctionDetailsModule', canActivate: [AuthGuard], data: { roles: config.ROLE_ACCESS_CONTROL.both } },
  { path: 'livebidding/:id', loadChildren: './component/buyer/live-bidding/live-bidding.module#LiveBiddingModule', canActivate: [AuthGuard], data: { roles: config.ROLE_ACCESS_CONTROL.both } },
  { path: routerconfig.supplier_router_links.PARTICIPANT_SUMMARY_VIEW+'/:id', loadChildren: './component/supplier/supplier-bidding/supplier-bidding.module#SupplierBiddingModule', canActivate: [AuthGuard], data: { roles: config.ROLE_ACCESS_CONTROL.both_supplier } },
  { path: routerconfig.supplier_router_links.PARTICIPANT_BID_HIS_VIEW+'/:id', loadChildren: './component/supplier/supplier-bidding/supplier-bidding.module#SupplierBiddingModule', canActivate: [AuthGuard], data: { roles: config.ROLE_ACCESS_CONTROL.both_supplier } },
  { path: 'reports', loadChildren: './component/reports/reports.module#ReportsModule', canActivate: [AuthGuard], data: { roles: config.ROLE_ACCESS_CONTROL.buyer, animation:'Reports' } },
  { path: 'cloneauction', loadChildren: './component/buyer/clone-auction/clone-auction.module#CloneAuctionModule', canActivate: [AuthGuard], data: { roles: config.ROLE_ACCESS_CONTROL.both, auctionID: null } },
  { path: routerconfig.buyer_router_links.BUYER_SEARCH, loadChildren: './component/buyer/status-details/status-details.module#StatusDetailsModule', canActivate: [AuthGuard], data: { roles: config.ROLE_ACCESS_CONTROL.both } },
  { path: routerconfig.supplier_router_links.PARTICIPANT_SEARCH, loadChildren: './component/supplier/supplier-status-details/supplier-status-details.module#SupplierStatusDetailsModule', canActivate: [AuthGuard], data: { roles: config.ROLE_ACCESS_CONTROL.both_supplier } },
  { path: 'templateauction', loadChildren: './component/buyer/template-auction/template-auction.module#TemplateAuctionModule' , canActivate: [AuthGuard], data: { roles: config.ROLE_ACCESS_CONTROL.buyer, auctionID: null } },
  { path: 'viewallnotification', loadChildren: './shared/component/notificationlist/notificationlist.module#NotificationlistModule' },
  { path: routerconfig.buyer_router_links.CALENDAR_VIEW, component: ShowSchedulersComponent, canActivate: [AuthGuard],data: { roles: config.ROLE_ACCESS_CONTROL.both }  }, 
  { path: 'page-not-found', component: PageNotFoundComponent, canActivate: [AuthGuard] },
  { path: '**', redirectTo: '/page-not-found' }
];
@NgModule({
  imports: [RouterModule.forRoot(routes), RouterModule.forRoot(routes, {
    preloadingStrategy: CustomPreloading
  })
  ],
  exports: [RouterModule],
  providers: [CustomPreloading]
})
export class AppRoutingModule { }
