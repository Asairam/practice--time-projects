import { NgModule } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import 'rxjs/add/operator/filter';
import { JwtHelper } from 'angular2-jwt';
@NgModule({
  imports: [
    RouterModule.forRoot([
      // --- Start of Menu URLs --- //
      { path: 'home', loadChildren: 'app/menu/menu.module#MenuModule' },
      { path: 'setup', loadChildren: 'app/menu/menu.module#MenuModule' },
      { path: 'setup/company', loadChildren: 'app/menu/menu.module#MenuModule' },
      { path: 'setup/services', loadChildren: 'app/menu/menu.module#MenuModule' },
      { path: 'setup/inventory', loadChildren: 'app/menu/menu.module#MenuModule' },
      { path: 'setup/workers', loadChildren: 'app/menu/menu.module#MenuModule' },
      { path: 'inventory', loadChildren: 'app/menu/menu.module#MenuModule' },
      { path: 'marketing', loadChildren: 'app/menu/menu.module#MenuModule' },
      { path: 'reports', loadChildren: 'app/menu/menu.module#MenuModule' },
      // --- End of Menu URLs --- //
      { path: '', loadChildren: 'app/login/login.module#LoginModule' },
      { path: 'clientlogin/:db', loadChildren: 'app/online/clientLogin/clientLogin.module#ClientLoginModule' },
      { path: 'onlinebook', loadChildren: 'app/online/onlinebook/onlinebook.module#OnlineBookModule' },
      { path: 'onlinebook/success', loadChildren: 'app/online/onlinebooksucess/onlinebooksucess.module#OnlineBookSucessModule' },
      { path: 'online/client/appts', loadChildren: 'app/online/onlineclientappts/onlineclientappts.module#OnlineClientApptsModule' },
      { path: 'online/client/add/:db', loadChildren: 'app/online/onlineclientadd/onlineclientadd.module#OnlineClientAddModule' },
      { path: 'online/package/purchase', loadChildren: 'app/online/onlinepackagepurchase/onlinepackagepurchase.module#OnlinePackagePurchaseModule' },
      { path: 'onlinegift/:param', loadChildren: 'app/online/onlinegift/onlinegift.module#OnlineGiftModule' },
      { path: 'onlinegift', loadChildren: 'app/online/onlinegift/onlinegift.module#OnlineGiftModule' },
      { path: 'signup', loadChildren: 'app/signup/signup.module#SignupModule' },
      { path: 'resetpassword/:token', loadChildren: 'app/reset/reset.module#ResetModule' },
      // { path: 'clientssearch', loadChildren: 'app/clients/main/clients.module#ClientsModule' },
      { path: 'client', loadChildren: 'app/clients/newclient/newclient.module#NewClientModule' },
      { path: 'client/quick/:action/:Id', loadChildren: 'app/clients/clientquickedit/clientquickedit.module#ClientQuickEditModule' },
      // { path: 'client/quick/add', loadChildren: 'app/clients/clientquickedit/clientquickedit.module#ClientQuickEditModule' },
      { path: 'client/quick/add', loadChildren: 'app/clients/newclient/newclient.module#NewClientModule' },
      { path: 'client/add', loadChildren: 'app/clients/newclient/newclient.module#NewClientModule' },
      { path: 'client/edit/bookstanding/:Id', loadChildren: 'app/clients/clientedit/clientedit.module#ClientEditModule' },
      // { path: 'client/edit/:Id', loadChildren: 'app/clients/clientedit/clientedit.module#ClientEditModule' },
      { path: 'client/edit/:Id', loadChildren: 'app/clients/newclient/newclient.module#NewClientModule' },
      { path: 'client/add/action/:isNewClient', loadChildren: 'app/clients/clientedit/clientedit.module#ClientEditModule' },
      { path: 'client/createtoken/:clientId', loadChildren: 'app/clients/createtoken/createtoken.module#CreateTokenModule' },
      { path: 'client/merge/:sourceId/:targetId', loadChildren: 'app/clients/mergeclient/mergeclient.module#MergeClientModule' },
      {
        path: 'checkout/cashcounting',
        loadChildren: 'app/checkout/cashcounting/cashcounting.module#CashCountingModule'
      },
      { path: 'checkout', loadChildren: 'app/checkout/main/checkout.module#CheckOutModule' },
      { path: 'checkout/list/:Id', loadChildren: 'app/checkout/main/checkout.module#CheckOutModule' },
      { path: 'checkout/refund/noclient', loadChildren: 'app/checkout/refundnoclient/refundnoclient.module#RefundnoclientModule' },
      { path: 'checkout/newticket', loadChildren: 'app/checkout/editticket/checkouteditticket.module#CheckOutEditTicketModule' },
      { path: 'checkout/:TicketId', loadChildren: 'app/checkout/editticket/checkouteditticket.module#CheckOutEditTicketModule' },
      { path: 'membershipedit/:clientId', loadChildren: 'app/checkout/checkoutmemberships/checkoutmemberships.module#CheckOutMembershipsModule' },
      { path: 'refunddetails/:clientId', loadChildren: 'app/checkout/checkoutrefunds/checkoutrefunds.module#CheckOutRefundsModule' },
      { path: 'cashinout', loadChildren: 'app/checkout/cashinout/cashinout.module#CashInOutModule' },
      { path: 'completedticketdetailsview/:TicketId', loadChildren: 'app/checkout/completedticket/completedticket.module#CompletedTicketModule' },
      { path: 'ticketlist', loadChildren: 'app/checkout/ticketlist/ticketlist.module#TicketListModule' },
      {
        path: 'appointment/book/:clientId/:appointmentId',
        loadChildren: 'app/clientappointments/clientappointments.module#ClientappointmentsModule'
      },
      {
        path: 'appointment/book/:clientId',
        loadChildren: 'app/clientappointments/clientappointments.module#ClientappointmentsModule'
      },
      {
        path: 'appointment/bookstandingappt/:Id',
        loadChildren: 'app/appointments/bookstandingappt/bookstandingappt.module#BookStandingApptModule'
      },
      {
        path: 'appointment/modifyappt/:clientId/:apptid',
        loadChildren: 'app/appointments/modifyappt/modifyappt.module#ModifyApptModule'
      },
      {
        path: 'appointmentdetail/:clientId/:apptid',
        loadChildren: 'app/appointments/appointmentdetail/appointmentdetail.module#ApptDetailModule'
      },
      {
        path: 'appointment/bookoutappointment',
        loadChildren: 'app/appointments/bookoutappointment/bookoutappointment.module#BookOutApptModule'
      },
      {
        path: 'setup/services/groups',
        loadChildren: 'app/setup/setupservices/setupservicegroups/setupservicegroups.module#SetupServiceGroupsModule'
      },
      {
        path: 'setup/services/resources',
        loadChildren: 'app/setup/setupservices/setupresources/setupresources.module#SetupResourcesModule'
      },
      {
        path: 'setup/services/details',
        loadChildren: 'app/setup/setupservices/setupservicedetails/setupservicedetails.module#SetupServiceDetailsModule'
      },
      {
        path: 'setup/services/classes',
        loadChildren: 'app/setup/setupservices/setupclasses/setupclasses.module#SetupClassesModule'
      },
      {
        path: 'setup/services/packages',
        loadChildren: 'app/setup/setupservices/setupservicepackages/setupservicepackages.module#SetupServicePackagesModule'
      },
      {
        path: 'setup/inventory/suppliers',
        loadChildren: 'app/setup/setupinventory/setupsuppliers/setupsuppliers.module#SetupSuppliersModule'
      },
      {
        path: 'setup/inventory/groups',
        loadChildren: 'app/setup/setupinventory/setupinventorygroups/setupinventorygroups.module#SetupInventoryGroupsModule'
      },
      {
        path: 'setup/inventory/productlines',
        loadChildren: 'app/setup/setupinventory/setupproductlines/setupprodlines.module#SetupProductLinesModule'
      },
      {
        path: 'setup/inventory/products',
        loadChildren: 'app/setup/setupinventory/setupproducts/setupproducts.module#SetupProductsModule'
      },
      {
        path: 'setup/appointments',
        loadChildren: 'app/setup/setupclientappointments/clientappointments.module#ClientAppointmentsModule'
      },
      {
        path: 'setup/clientpreference',
        loadChildren: 'app/setup/setupclientpreferences/setupclientpre.module#SetupClientPreferenceModule'
      },
      {
        path: 'setup/company/info',
        loadChildren: 'app/setup/setupcompany/setupcompanyinfo/setupcompanyinfo.module#SetupCompanyInfoModule'
      },
      {
        path: 'setup/company/hours',
        loadChildren: 'app/setup/setupcompany/setupcompanyhours/setupcompanyhours.module#SetupCompanyHoursModule'
      },
      {
        path: 'setup/company/hours/:id',
        loadChildren: 'app/setup/setupcompany/setupcompanyhours/setupcompanyhours.module#SetupCompanyHoursModule'
      },
      {
        path: 'setup/company/paymenttypes',
        loadChildren: 'app/setup/setupcompany/setuppaymenttypes/setuppaymenttypes.module#SetupPaymentTypesModule'
      },
      {
        path: 'setup/memberships',
        loadChildren: 'app/setup/setupmemberships/setupmemberships.module#SetupMembershipsModule'
      },
      {
        path: 'setup/workers/permissions',
        loadChildren: 'app/setup/setupworkers/setuppermissions/setuppermissions.module#SetupPermissionsModule'
      },
      {
        path: 'setup/workers/compensationscales',
        loadChildren: 'app/setup/setupworkers/setupcompansationscales/setupcompensationscales.module#SetupCompensationScalesModule'
      },
      {
        path: 'setup/workers/compensationmethods',
        loadChildren: 'app/setup/setupworkers/setupcompensationmethod/setupcompensationmethods.module#SetupCompensationMethodsModule'
      },
      {
        path: 'setup/workers/goals',
        loadChildren: 'app/setup/setupworkers/setupgoals/setupgoals.module#SetupGoalsModule'
      },
      {
        path: 'setup/workers/details',
        loadChildren: 'app/setup/setupworkers/setupworkersdetails/setupworkersdetails.modules#SetupWorkersDetailsModule'
      },
      {
        path: 'inventory/manage',
        loadChildren: 'app/inventory/manageinventory/manageinventory.module#ManageInventoryModule'
      },
      {
        path: 'inventory/purchaseorders',
        loadChildren: 'app/inventory/purchaseorders/purchaseorders.module#PurchaseOrderModule'
      },
      {
        path: 'inventory/usage',
        loadChildren: 'app/inventory/inventoryusage/inventoryusage.module#InventoryUsageModule'
      },
      {
        path: 'setup/ticketpreferences',
        loadChildren: 'app/setup/setupticketpreferences/setupticketpreferences.module#SetupTicketPreferencesModule'
      },
      {
        path: 'appointments',
        loadChildren: 'app/appointments/main/appointments.module#AppointmentModule'
      },
      {
        path: 'marketing/setuppromotions',
        loadChildren: 'app/marketing/setuppromotions/setuppromotions.module#SetupPromotionsModule'
      },
      {
        path: 'marketing/setuprewards',
        loadChildren: 'app/marketing/setuprewards/setuprewards.module#SetupRewardsModule'
      },
      {
        path: 'marketing/email',
        loadChildren: 'app/marketing/marketingemail/marketingemail.module#MarketingEmailModule'
      },
      {
        path: 'marketing/sets',
        loadChildren: 'app/marketing/marketingsets/marketingsets.module#MarketingSetsModule'
      },
      {
        path: 'marketing/reports',
        loadChildren: 'app/marketing/marketingreports/marketingreports.module#MarketingReportsModule'
      },
      {
        path: 'marketing/reportedit',
        loadChildren: 'app/marketing/marketingreportedit/marketingreportedit.module#MarketingReportEditModule'
      },
      {
        path: 'marketing/emailactivity',
        loadChildren: 'app/marketing/emailactivity/emailactivity.module#EmailActivityModule'
      },
      {
        path: 'giftbalances',
        loadChildren: 'app/giftbalances/giftbalances.module#GiftBalancesModule'
      },
      {
        path: 'timeclock',
        loadChildren: 'app/timeclock/timeclock.module#TimeClockModule'
      },
      {
        path: 'appointment/bookclass',
        loadChildren: 'app/appointments/bookclass/bookclass.module#BookClassModule'
      },
      {
        path: 'reports/reportwriterlist',
        loadChildren: 'app/reports/reportwriter/reportwriter/reportwriter.module#ReportWriterModule'
      },

      {
        path: 'reports/transaction/totalsheets',
        loadChildren: 'app/reports/transactionreports/totalsheets/totalsheets.module#TotalSheetsModule'
      },
      {
        path: 'reports/transaction/reportdailycashdrawer',
        loadChildren: 'app/reports/transactionreports/reportdailycashdrawer/reportdailycashdrawer.module#ReportDailyCashDrawerModule'
      },
      {
        path: 'reports/transaction/paymentdetails',
        loadChildren: 'app/reports/transactionreports/paymentdetails/paymentdetails.module#PaymentDetailsModule'
      },
      {
        path: 'reports/transaction/ticketlist',
        loadChildren: 'app/reports/transactionreports/ticketlist/ticketlist.module#TicketListModule'
      },
      {
        path: 'reports/sales/ticketsaleschart',
        loadChildren: 'app/reports/salesreports/ticketsaleschart/ticketsaleschart.module#TicketSalesChartModule'
      },
      {
        path: 'reports/sales/ticketsalesreport',
        loadChildren: 'app/reports/salesreports/ticketsalesreport/ticketsalesreport.module#TicketSalesReportModule'
      },
      {
        path: 'reports/sales/reportservicesales',
        loadChildren: 'app/reports/salesreports/reportservicesales/reportservicesales.module#ReportServiceSalesModule'
      },

      {
        path: 'reports/sales/reportproductsales',
        loadChildren: 'app/reports/salesreports/reportproductsales/reportproductsales.module#ReportProductSalesModule'
      },
      {
        path: 'reports/sales/productsaleschart',
        loadChildren: 'app/reports/salesreports/productsaleschart/productsaleschart.module#ProductSalesChartModule'
      },
      {
        path: 'reports/sales/productsalesbyrank',
        loadChildren: 'app/reports/salesreports/productsalesbyrank/productsalesbyrank.module#ProductSalesByRankModule'
      },
      {
        path: 'reports/businessanalysis/ticketanalysisreport',
        loadChildren: 'app/reports/businessanalysisreports/ticketanalysisreport/ticketanalysisreport.module#TicketAnalysisReportModule'
      },
      {
        path: 'reports/businessanalysis/clientretention',
        loadChildren: 'app/reports/businessanalysisreports/clientretention/clientretention.module#ClientRetentionModule'
      },
      {
        path: 'reports/businessanalysis/reportactivitycomparison',
        loadChildren: 'app/reports/businessanalysisreports/reportactivitycomparison/reportactivitycomparison.module#ReportActivityComparisonModule'
      },
      {
        path: 'reports/businessanalysis/monthlybussinessanalysis',
        loadChildren: 'app/reports/businessanalysisreports/monthlybussinessanalysis/monthlybussinessanalysis.module#MonthlyBussinessAnalysisModule'
      },
      {
        path: 'reports/businessanalysis/reportvisittypeoverview',
        loadChildren: 'app/reports/businessanalysisreports/reportvisittypeoverview/reportvisittypeoverview.module#ReportVisitTypeOverviewModule'
      },
      {
        path: 'reports/businessanalysis/tbpreport',
        loadChildren: 'app/reports/businessanalysisreports/tbpreport/tbpreport.module#TbpReportModule'
      },
      {
        path: 'reports/businessanalysis/abcreport',
        loadChildren: 'app/reports/businessanalysisreports/abcreport/abcreport.module#AbcReportModule'
      },
      {
        path: 'reports/inventorygift/onhandproduct',
        loadChildren: 'app/reports/inventorygiftreports/onhandproduct/onhandproduct.module#OnHandProductModule'
      },
      {
        path: 'reports/inventorygift/reportgifts',
        loadChildren: 'app/reports/inventorygiftreports/reportgifts/reportgifts.module#ReportGiftsModule'
      },
      {
        path: 'reports/inventorygift/inventoryusagereport',
        loadChildren: 'app/reports/inventorygiftreports/inventoryusagereport/inventoryusagereport.module#InventoryusageReportModule'
      },
      {
        path: 'reports/inventorygift/adjustmentreportlist',
        loadChildren: 'app/reports/inventorygiftreports/adjustmentreportlist/adjustmentreportlist.module#AdjustmentReportListModule'
      },
      {
        path: 'reports/compensation/processcompensation',
        loadChildren: 'app/reports/compensationreports/processcompensation/processcompensation.module#ProcessCompensationModule'
      },
      {
        path: 'reports/compensation/workertips',
        loadChildren: 'app/reports/compensationreports/workertips/workertips.module#WorkerTipsModule'
      },
      {
        path: 'reports/compensation/workergoals',
        loadChildren: 'app/reports/compensationreports/workergoals/workergoals.module#WorkerGoalModule'
      },
      {
        path: 'reports/reportwriter/reportwriter',
        loadChildren: 'app/reports/reportwriter/reportwriter/reportwriter.module#ReportWriterModule'
      },
      {
        path: 'appointment/waitinglist',
        loadChildren: 'app/appointments/waitinglist/waitinglist.module#WaitingListModule'
      },
      {
        path: 'appointment/classdetail',
        loadChildren: 'app/appointments/classdetail/classdetail.module#ClassDetailModule'
      },
      {
        path: 'appointment/bookoutdetail/:apptid',
        loadChildren: 'app/appointments/bookoutdetail/bookoutdetail.module#BookOutDetailModule'
      },
      {
        path: 'dashboard',
        loadChildren: 'app/dashboard/worker/dashboard.module#DashBoardModule'
      },
      {
        path: 'membercheckin',
        loadChildren: 'app/membercheckin/membercheckin.module#MemberCheckInModule'
      },
      {
        path: 'favourites',
        loadChildren: 'app/favourites/favourites.module#FavouritesModule'
      },
      {
        path: 'marketing/reportedit',
        loadChildren: 'app/marketing/marketingreportedit/marketingreportedit.module#MarketingReportEditModule'
      },
      {
        path: 'marketing/reportdelete',
        loadChildren: 'app/marketing/marketingreportdelete/marketingreportdelete.module#MarketingReportDeleteModule'
      },
      {
        path: 'marketing/client/filters/:id',
        loadChildren: 'app/marketing/marketingclientfilters/marketingclientfilters.module#MarketingClientFiltersModule'
      }
    ])
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {
  decodedToken: any;
  permissions: any;
  constructor(private router: Router) {
    this.router.events
      .filter(event => event instanceof NavigationEnd)
      .subscribe((event: NavigationEnd) => {
        try {
          const rights = localStorage.getItem('rights');
          if (rights) {
            this.decodedToken = new JwtHelper().decodeToken(rights);
            this.permissions = JSON.parse(this.decodedToken.data.permissions);
          } else {
            this.decodedToken = {};
            this.permissions = false;
          }
        } catch (error) {
          this.decodedToken = {};
          this.permissions = false;
        }
        if (!this.permissions) {
          this.permissions = {
            'Home': [
              {
                'pageName': 'GiftBalanceSearch',
                'allowAcces': false
              },
              {
                'pageName': 'MemberCheckIn',
                'allowAcces': false
              },
              {
                'pageName': 'OwnerDashboard',
                'allowAcces': false
              },
              {
                'pageName': 'SetupList',
                'allowAcces': false
              },
              {
                'pageName': 'TimeClock',
                'allowAcces': false
              },
              {
                'pageName': 'WorkerDashboard',
                'allowAcces': false
              }
            ],
            'Setup Company': [
              {
                'pageName': 'CompanyHoursEdit',
                'allowAcces': false
              },
              {
                'pageName': 'CompanyHoursList',
                'allowAcces': false
              },
              {
                'pageName': 'CompanyInfo',
                'allowAcces': false
              },
              {
                'pageName': 'SetupCompany',
                'allowAcces': false
              },
              {
                'pageName': 'SetupPaymentTypes',
                'allowAcces': false
              }
            ],
            'Setup Other': [
              {
                'pageName': 'SetupAppointments',
                'allowAcces': false
              },
              {
                'pageName': 'SetupClients',
                'allowAcces': false
              },
              {
                'pageName': 'SetupMemberships',
                'allowAcces': false
              },
              {
                'pageName': 'SetupTickets',
                'allowAcces': false
              }
            ],
            'Setup Service': [
              {
                'pageName': 'SetupClasses',
                'allowAcces': false
              },
              {
                'pageName': 'SetupResources',
                'allowAcces': false
              },
              {
                'pageName': 'SetupService',
                'allowAcces': false
              },
              {
                'pageName': 'SetupServiceGroups',
                'allowAcces': false
              },
              {
                'pageName': 'SetupServicePackage',
                'allowAcces': false
              },
              {
                'pageName': 'SetupServices',
                'allowAcces': false
              }
            ],
            'Setup Inventory': [
              {
                'pageName': 'SetupInventory',
                'allowAcces': false
              },
              {
                'pageName': 'SetupInventoryGroups',
                'allowAcces': false
              },
              {
                'pageName': 'SetupProductLines',
                'allowAcces': false
              },
              {
                'pageName': 'SetupProducts',
                'allowAcces': false
              },
              {
                'pageName': 'SetupSuppliers',
                'allowAcces': false
              }
            ],
            'Setup Workers': [
              {
                'pageName': 'CreateWorker',
                'allowAcces': false
              },
              {
                'pageName': 'Setup Permissions',
                'allowAcces': false
              },
              {
                'pageName': 'SetupCompensation',
                'allowAcces': false
              },
              {
                'pageName': 'SetupCompensationScales',
                'allowAcces': false
              },
              {
                'pageName': 'SetupGoal',
                'allowAcces': false
              },
              {
                'pageName': 'SetupWorker',
                'allowAcces': false
              },
              {
                'pageName': 'Worker Details',
                'allowAcces': false
              }
            ],
            'Clients': [
              {
                'pageName': 'ClientEdit',
                'allowAcces': false
              },
              {
                'pageName': 'ClientQuickAdd',
                'allowAcces': false
              },
              {
                'pageName': 'ClientQuickEdit',
                'allowAcces': false
              },
              {
                'pageName': 'ClientSearch',
                'allowAcces': false
              },
              {
                'pageName': 'CreateToken',
                'allowAcces': false
              },
              {
                'pageName': 'MergeClient',
                'allowAcces': false
              }
            ],
            'Appointments': [
              {
                'pageName': 'AppointmentDetail',
                'allowAcces': false
              },
              {
                'pageName': 'AppointmentList',
                'allowAcces': false
              },
              {
                'pageName': 'BookAppt',
                'allowAcces': false
              },
              {
                'pageName': 'BookClass',
                'allowAcces': false
              },
              {
                'pageName': 'BookOutAppointment',
                'allowAcces': false
              },
              {
                'pageName': 'BookOutAppointmentDetail',
                'allowAcces': false
              },
              {
                'pageName': 'BookStandingAppt',
                'allowAcces': false
              },
              {
                'pageName': 'ClassDetail',
                'allowAcces': false
              },
              {
                'pageName': 'ModifyAppt',
                'allowAcces': false
              },
              {
                'pageName': 'WaitingList',
                'allowAcces': false
              }
            ],
            'Inventory': [
              {
                'pageName': 'InventoryAdjustmentReport',
                'allowAcces': false
              },
              {
                'pageName': 'InventoryAdjustmentReportDelete',
                'allowAcces': false
              },
              {
                'pageName': 'InventoryAdjustmentReportList',
                'allowAcces': false
              },
              {
                'pageName': 'InventoryMenu',
                'allowAcces': false
              },
              {
                'pageName': 'InventoryReports',
                'allowAcces': false
              },
              {
                'pageName': 'InventoryUsage',
                'allowAcces': false
              },
              {
                'pageName': 'InventoryUsageReport',
                'allowAcces': false
              },
              {
                'pageName': 'ManageInventory',
                'allowAcces': false
              },
              {
                'pageName': 'PurchaseOrders',
                'allowAcces': false
              }
            ],
            'Tickets': [
              {
                'pageName': 'CashInOut',
                'allowAcces': false
              },
              {
                'pageName': 'CheckOut',
                'allowAcces': false
              },
              {
                'pageName': 'CompletedTicketDetailView',
                'allowAcces': false
              },
              {
                'pageName': 'CompletedTicketDetailViewPDF',
                'allowAcces': false
              },
              {
                'pageName': 'MembershipEdit',
                'allowAcces': false
              },
              {
                'pageName': 'RefundDetails',
                'allowAcces': false
              },
              {
                'pageName': 'ReportCashCounting',
                'allowAcces': false
              },
              {
                'pageName': 'TicketEdit',
                'allowAcces': false
              }
            ],
            'Reports': [
              {
                'pageName': 'BaseDetailReport',
                'allowAcces': false
              },
              {
                'pageName': 'BaseReport',
                'allowAcces': false
              },
              {
                'pageName': 'ClientRetention',
                'allowAcces': false
              },
              {
                'pageName': 'GroupingReport',
                'allowAcces': false
              },
              {
                'pageName': 'OnHandProductReport',
                'allowAcces': false
              },
              {
                'pageName': 'PaymentDetails',
                'allowAcces': false
              },
              {
                'pageName': 'ProcessCompensation',
                'allowAcces': false
              },
              {
                'pageName': 'ProcessCompensationDetail',
                'allowAcces': false
              },
              {
                'pageName': 'ProductChart',
                'allowAcces': false
              },
              {
                'pageName': 'ProductSales',
                'allowAcces': false
              },
              {
                'pageName': 'ProductSalesByRank',
                'allowAcces': false
              },
              {
                'pageName': 'ReportABC',
                'allowAcces': false
              },
              {
                'pageName': 'ReportActivityComparison',
                'allowAcces': false
              },
              {
                'pageName': 'ReportDailyCashDrawer',
                'allowAcces': false
              },
              {
                'pageName': 'ReportDailyTotalSheet',
                'allowAcces': false
              },
              {
                'pageName': 'ReportGifts',
                'allowAcces': false
              },
              {
                'pageName': 'ReportMonthlyBusinessAnalysis',
                'allowAcces': false
              },
              {
                'pageName': 'Reports',
                'allowAcces': false
              },
              {
                'pageName': 'ReportServiceSales',
                'allowAcces': false
              },
              {
                'pageName': 'ReportTBP',
                'allowAcces': false
              },
              {
                'pageName': 'ReportTicketAnalysis',
                'allowAcces': false
              },
              {
                'pageName': 'ReportVisitTypeOverview',
                'allowAcces': false
              },
              {
                'pageName': 'ReportWriterDelete',
                'allowAcces': false
              },
              {
                'pageName': 'ReportWriterEdit',
                'allowAcces': false
              },
              {
                'pageName': 'ReportWriterList',
                'allowAcces': false
              },
              {
                'pageName': 'SalesChart',
                'allowAcces': false
              },
              {
                'pageName': 'TicketList',
                'allowAcces': false
              },
              {
                'pageName': 'TicketSales',
                'allowAcces': false
              },
              {
                'pageName': 'WorkerGoals',
                'allowAcces': false
              },
              {
                'pageName': 'WorkerTips',
                'allowAcces': false
              }
            ],
            'Marketing': [
              {
                'pageName': 'EmailActivity',
                'allowAcces': false
              },
              {
                'pageName': 'Marketing',
                'allowAcces': false
              },
              {
                'pageName': 'MarketingEmail',
                'allowAcces': false
              },
              {
                'pageName': 'MarketingReport',
                'allowAcces': false
              },
              {
                'pageName': 'MarketingReportDelete',
                'allowAcces': false
              },
              {
                'pageName': 'MarketingReportList',
                'allowAcces': false
              },
              {
                'pageName': 'MarketingSets',
                'allowAcces': false
              },
              {
                'pageName': 'Promotions',
                'allowAcces': false
              },
              {
                'pageName': 'Rewards',
                'allowAcces': false
              },
              {
                'pageName': 'SelectClientFilters',
                'allowAcces': false
              }
            ]
          };
        }
        if (!this.check(event.url)) {
          this.router.navigate(['/home']);
        }
      });
  }

  check(url) {
    if (url === '/giftbalances') {                             // Home start
      return this.permissions['Home'][0]['allowAcces'];
    } else if (url === '/membercheckin') {
      return this.permissions['Home'][1]['allowAcces'];
    } else if (url === '/setup') {
      return this.permissions['Home'][3]['allowAcces'];
    } else if (url === '/timeclock') {
      return this.permissions['Home'][4]['allowAcces'];
    } else if (this.router.url.match(/appointmentdetail\//)) {  // Appointments start
      return this.permissions['Appointments'][0]['allowAcces'];
    } else if (url === '/appointments') {
      return this.permissions['Appointments'][1]['allowAcces'];
    } else if (this.router.url.match(/appointment\/book\//)) {
      return this.permissions['Appointments'][2]['allowAcces'];
    } else if (this.router.url.match(/appointment\/bookstandingappt/g)) {
      return this.permissions['Appointments'][6]['allowAcces'];
    } else if (this.router.url.match(/modifyappt/g)) {
      return this.permissions['Appointments'][8]['allowAcces'];
    } else if (url === '/appointment/waitinglist') {
      return this.permissions['Appointments'][9]['allowAcces'];
    } else if (url === '/setup/workers') {                      // Setup Workers start
      return this.permissions['Setup Workers'][5]['allowAcces'];
    } else if (url === '/setup/workers/permissions') {
      return this.permissions['Setup Workers'][1]['allowAcces'];
    } else if (url === '/setup/workers/permissions') {
      return this.permissions['Setup Workers'][1]['allowAcces'];
    } else if (url === '/setup/workers/compensationmethods') {
      return this.permissions['Setup Workers'][2]['allowAcces'];
    } else if (url === '/setup/workers/compensationscales') {
      return this.permissions['Setup Workers'][3]['allowAcces'];
    } else if (url === '/setup/workers/goals') {
      return this.permissions['Setup Workers'][4]['allowAcces'];
    } else if (url === '/setup/workers/details') {
      return this.permissions['Setup Workers'][6]['allowAcces'];
    } else if (this.router.url.match(/client\/edit/g)) {          // clients start
      return this.permissions['Clients'][0]['allowAcces'];
    } else if (url === '/client/quick/add') {
      return this.permissions['Clients'][1]['allowAcces'];
    } else if (url === '/client') {
      return this.permissions['Clients'][3]['allowAcces'];
    } else if (this.router.url.match(/client\/createtoken/g)) {
      return this.permissions['Clients'][4]['allowAcces'];
    } else if (this.router.url.match(/client\/merge\//)) {
      return this.permissions['Clients'][5]['allowAcces'];
    } else if (this.router.url.match(/setup\/company\/hours\//g)) {  // Setup Company start
      return this.permissions['Setup Company'][0]['allowAcces'];
    } else if (url === '/setup/company/hours') {
      return this.permissions['Setup Company'][1]['allowAcces'];
    } else if (url === '/setup/company/info') {
      return this.permissions['Setup Company'][2]['allowAcces'];
    } else if (url === '/setup/company') {
      return this.permissions['Setup Company'][3]['allowAcces'];
    } else if (url === '/setup/company/paymenttypes') {
      return this.permissions['Setup Company'][4]['allowAcces'];
    } else if (url === '/setup/appointments') {                   // Setup Other start
      return this.permissions['Setup Other'][0]['allowAcces'];
    } else if (url === '/setup/clientpreference') {
      return this.permissions['Setup Other'][1]['allowAcces'];
    } else if (url === '/setup/memberships') {
      return this.permissions['Setup Other'][2]['allowAcces'];
    } else if (url === '/setup/ticketpreferences') {
      return this.permissions['Setup Other'][3]['allowAcces'];
    } else if (url === '/setup/services/classes') {              // Setup Service start
      return this.permissions['Setup Service'][0]['allowAcces'];
    } else if (url === '/setup/services/resources') {
      return this.permissions['Setup Service'][1]['allowAcces'];
    } else if (url === '/setup/services') {
      return this.permissions['Setup Service'][2]['allowAcces'];
    } else if (url === '/setup/services/groups') {
      return this.permissions['Setup Service'][3]['allowAcces'];
    } else if (url === '/setup/services/packages') {
      return this.permissions['Setup Service'][4]['allowAcces'];
    } else if (url === '/setup/services/details') {
      return this.permissions['Setup Service'][5]['allowAcces'];
    } else if (url === '/setup/inventory') {                     // Setup Inventory start
      return this.permissions['Setup Inventory'][0]['allowAcces'];
    } else if (url === '/setup/inventory/groups') {
      return this.permissions['Setup Inventory'][1]['allowAcces'];
    } else if (url === '/setup/inventory/productlines') {
      return this.permissions['Setup Inventory'][2]['allowAcces'];
    } else if (url === '/setup/inventory/products') {
      return this.permissions['Setup Inventory'][3]['allowAcces'];
    } else if (url === '/setup/inventory/suppliers') {
      return this.permissions['Setup Inventory'][4]['allowAcces'];
    } else if (url === '/inventory') {                              // Inventory start
      return this.permissions['Inventory'][3]['allowAcces'];
    } else if (url === '/inventory/usage') {
      return this.permissions['Inventory'][5]['allowAcces'];
    } else if (url === '/inventory/manage') {
      return this.permissions['Inventory'][7]['allowAcces'];
    } else if (url === '/inventory/purchaseorders') {
      return this.permissions['Inventory'][8]['allowAcces'];
    } else if (url === '/reports/inventorygift/adjustmentreportlist') {
      return this.permissions['Inventory'][2]['allowAcces'];
    } else if (url === '/reports/inventorygift/inventoryusagereport') {
      return this.permissions['Inventory'][6]['allowAcces'];
    } else if (url === '/cashinout') {                          // Tickets start
      return this.permissions['Tickets'][0]['allowAcces'];
    } else if (url === '/checkout') {
      return this.permissions['Tickets'][1]['allowAcces'];
    } else if (this.router.url.match(/completedticketdetailsview/g)) {
      return this.permissions['Tickets'][2]['allowAcces'];
    } else if (this.router.url.match(/membershipedit/g)) {
      return this.permissions['Tickets'][4]['allowAcces'];
    } else if (this.router.url.match(/refunddetails/g)) {
      return this.permissions['Tickets'][5]['allowAcces'];
    } else if (url === '/checkout/cashcounting') {
      return this.permissions['Tickets'][6]['allowAcces'];
    } else if (url === '/checkout/newticket') {
      return this.permissions['Tickets'][7]['allowAcces'];
    } else if (url === '/marketing/emailactivity') {            // Marketing start
      return this.permissions['Marketing'][0]['allowAcces'];
    } else if (url === '/marketing') {
      return this.permissions['Marketing'][1]['allowAcces'];
    } else if (url === '/marketing/email') {
      return this.permissions['Marketing'][2]['allowAcces'];
    } else if (url === '/marketing/reportedit') {
      return this.permissions['Marketing'][3]['allowAcces'];
    } else if (url === '/marketing/reportdelete') {
      return this.permissions['Marketing'][4]['allowAcces'];
    } else if (url === '/marketing/reports') {
      return this.permissions['Marketing'][5]['allowAcces'];
    } else if (url === '/marketing/sets') {
      return this.permissions['Marketing'][6]['allowAcces'];
    } else if (url === '/marketing/setuppromotions') {
      return this.permissions['Marketing'][7]['allowAcces'];
    } else if (url === '/marketing/setuprewards') {
      return this.permissions['Marketing'][8]['allowAcces'];
    } else if (this.router.url.match(/marketing\/client\/filters/g)) {
      return this.permissions['Marketing'][9]['allowAcces'];
    } else if (url === '/reports/businessanalysis/clientretention') {    // Reports start
      return this.permissions['Reports'][2]['allowAcces'];
    } else if (url === '/reports/sales/ticketsalesreport') {
      return this.permissions['Reports'][27]['allowAcces'];
    } else if (url === '/reports/inventorygift/onhandproduct') {
      return this.permissions['Reports'][4]['allowAcces'];
    } else if (url === '/reports/transaction/paymentdetails') {
      return this.permissions['Reports'][5]['allowAcces'];
    } else if (url === '/reports/compensation/processcompensation') {
      return this.permissions['Reports'][6]['allowAcces'];
    } else if (url === '/reports/sales/productsaleschart') {
      return this.permissions['Reports'][8]['allowAcces'];
    } else if (url === '/reports/sales/reportproductsales') {
      return this.permissions['Reports'][9]['allowAcces'];
    } else if (url === '/reports/sales/productsalesbyrank') {
      return this.permissions['Reports'][10]['allowAcces'];
    } else if (url === '/reports/businessanalysis/abcreport') {
      return this.permissions['Reports'][11]['allowAcces'];
    } else if (url === '/reports/businessanalysis/reportactivitycomparison') {
      return this.permissions['Reports'][12]['allowAcces'];
    } else if (url === '/reports/transaction/reportdailycashdrawer') {
      return this.permissions['Reports'][13]['allowAcces'];
    } else if (url === '/reports/transaction/totalsheets') {
      return this.permissions['Reports'][14]['allowAcces'];
    } else if (url === '/reports/inventorygift/reportgifts') {
      return this.permissions['Reports'][15]['allowAcces'];
    } else if (url === '/reports/businessanalysis/monthlybussinessanalysis') {
      return this.permissions['Reports'][16]['allowAcces'];
    } else if (url === '/reports') {
      return this.permissions['Reports'][17]['allowAcces'];
    } else if (url === '/reports/sales/reportservicesales') {
      return this.permissions['Reports'][18]['allowAcces'];
    } else if (url === '/reports/businessanalysis/tbpreport') {
      return this.permissions['Reports'][19]['allowAcces'];
    } else if (url === '/reports/businessanalysis/ticketanalysisreport') {
      return this.permissions['Reports'][20]['allowAcces'];
    } else if (url === '/reports/businessanalysis/reportvisittypeoverview') {
      return this.permissions['Reports'][21]['allowAcces'];
    } else if (url === '/reports/reportwriterlist') {
      return this.permissions['Reports'][24]['allowAcces'];
    } else if (url === '/reports/sales/ticketsaleschart') {
      return this.permissions['Reports'][25]['allowAcces'];
    } else if (url === '/reports/transaction/ticketlist') {
      return this.permissions['Reports'][26]['allowAcces'];
    } else if (url === '/reports/compensation/workergoals') {
      return this.permissions['Reports'][28]['allowAcces'];
    } else if (url === '/reports/compensation/workertips') {
      return this.permissions['Reports'][29]['allowAcces'];
    } else {
      return true;
    }
  }
}

/* tabs are not available
--------------------------*/
// Home -> OwnerDashboard,WorkerDashboard
// Appointments -> BookClass,BookOutAppointment,BookOutAppointmentDetail,ClassDetail,
// Clients -> ClientQuickEdit,
// Inventory -> InventoryAdjustmentReport,InventoryAdjustmentReportDelete,InventoryAdjustmentReportList,InventoryReports,InventoryUsageReport,
// Tickets -> CompletedTicketDetailViewPDF
// Reports -> BaseDetailReport,BaseReport,ProcessCompensationDetail,ReportWriterDelete,ReportWriterEdit,TicketSales,