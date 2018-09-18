import { Component, OnInit, Inject, Input, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import { SafeUrl } from '@angular/platform-browser';
import { HeaderService } from './header.service';
import { JwtHelper } from 'angular2-jwt';

@Component({
    selector: 'app-header',
    templateUrl: './header.html',
    styleUrls: ['./header.css'],
    providers: [HeaderService]
})
export class HeaderComponent implements OnInit {
    @Input('newMenu') newMenu: string;
    activeClass: any;
    activeClass1: any;
    marketingActiveClass: any;
    displayName: String;
    show = false;
    comapanyLogo = '';
    logo: SafeUrl = '';
    companyInfo: any;
    @Output('emitCompanyInfo')
    emitCompanyInfo: EventEmitter<any> = new EventEmitter<any>();
    // navPages = [{ 'displayName': 'Home', 'link': '/home' }];
    navPages = [];
    decodedToken: any;
    constructor(private router: Router,
        @Inject('apiEndPoint') private apiEndPoint: string,
        private headerService: HeaderService) {
    }
    ngOnInit() {
        // console.log(this.newMenu)
        // ---Start of code for Permissions Implementation--- //
        try {
            this.decodedToken = new JwtHelper().decodeToken(localStorage.getItem('rights'));
        } catch (error) {
            this.decodedToken = {};
        }
        if (this.decodedToken.data && this.decodedToken.data.permissions) {
            this.decodedToken = JSON.parse(this.decodedToken.data.permissions);
        } else {
            this.decodedToken = {};
        }
        // ---End of code for permissions Implementation--- //
        this.getCompanyInfo();
        // this.createTimezones(new Date());
        const navURL = window.location.href.replace(window.location.origin, '').substring(3);
        if (navURL === 'home') {
            this.displayName = 'Home';
        } else if (navURL === 'client') {
            this.displayName = 'Client Search';
            this.navPages.push(
                { 'displayName': 'Client Search', 'link': '/client' }
            );
        } else if (navURL.match(/client\/edit/g)) {
            this.displayName = 'Client Edit';
            this.navPages.push(
                { 'displayName': 'Client', 'link': '/client' },
                { 'displayName': 'Client Edit', 'link': '/client/edit' }
            );
        } else if (navURL.match(/client\/quick\/edit/g)) {
            this.displayName = 'Client Quick Card';
            this.navPages.push(
                { 'displayName': 'Client', 'link': '/client' },
                { 'displayName': 'Client Quick Card', 'link': '/client/quick/edit' }
            );
        } else if (navURL === 'client/quick/add') {
            this.displayName = 'Client Quick Add';
            this.navPages.push(
                { 'displayName': 'Clients', 'link': '/client' },
                { 'displayName': 'Client Quick Add', 'link': '/client/quick/add' }
            );
        } else if (navURL === 'setup') {
            this.displayName = 'Setup';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' }
            );
        } else if (navURL === 'setup/services') {
            this.displayName = 'Setup Service';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Service', 'link': '/setup/services' }
            );
        } else if (navURL === 'setup/services/groups') {
            this.displayName = 'Setup Service Groups';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Service', 'link': '/setup/services' },
                { 'displayName': 'Setup Service Groups', 'link': '/setup/services/groups' }
            );
        } else if (navURL === 'setup/services/resources') {
            this.displayName = 'Setup Resources';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Service', 'link': '/setup/services' },
                { 'displayName': 'Setup Resources', 'link': '/setup/services/resources' }
            );
        } else if (navURL === 'setup/services/details') {
            this.displayName = 'Setup Service';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Service', 'link': '/setup/services' },
                { 'displayName': 'Setup Service Details', 'link': '/setup/services/details' }
            );
        } else if (navURL === 'setup/services/classes') {
            this.displayName = 'Setup Class';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Service', 'link': '/setup/services' },
                { 'displayName': 'Setup Class', 'link': '/setup/services/classes' }
            );
        } else if (navURL === 'setup/services/packages') {
            this.displayName = 'Service Packages';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Service', 'link': '/setup/services' },
                { 'displayName': 'Service Packages', 'link': '/setup/services/packages' }
            );
        } else if (navURL === 'setup/inventory') {
            this.displayName = 'Setup Inventory';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Inventory', 'link': '/setup/inventory' }
            );
        } else if (navURL === 'setup/inventory/suppliers') {
            this.displayName = 'Setup Suppliers';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Inventory', 'link': '/setup/inventory' },
                { 'displayName': 'Setup Suppliers', 'link': '/setup/inventory/suppliers' }
            );
        } else if (navURL === 'setup/inventory/groups') {
            this.displayName = 'Setup Inventory Groups';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Inventory', 'link': '/setup/inventory' },
                { 'displayName': 'Setup Inventory Groups', 'link': '/setup/inventory/groups' }
            );
        } else if (navURL === 'setup/inventory/productlines') {
            this.displayName = 'Setup Product Lines';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Inventory', 'link': '/setup/inventory' },
                { 'displayName': 'Setup Product Lines', 'link': '/setup/inventory/productlines' }
            );
        } else if (navURL === 'setup/inventory/products') {
            this.displayName = 'Setup Products';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Inventory', 'link': '/setup/inventory' },
                { 'displayName': 'Setup Products', 'link': '/setup/inventory/products' }
            );
        } else if (navURL === 'setup/appointments') {
            this.displayName = 'Setup Appointments & Emails';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Appointments & Emails', 'link': '/setup/appointments/child/(nav:booking)' }
            );
        } else if (navURL === 'setup/clientpreference') {
            this.displayName = 'Setup Client Preferences';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Client Preferences', 'link': '/setup/clientpreference' }
            );
        } else if (navURL === 'setup/company') {
            this.displayName = 'Setup Company';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Company', 'link': '/setup/company' }
            );
        } else if (navURL === 'setup/company/info') {
            this.displayName = 'Setup Company Info';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Company', 'link': '/setup/company' },
                { 'displayName': 'Company Info', 'link': '/setup/company/info' }
            );
        } else if (navURL === 'setup/company/hours') {
            this.displayName = 'Company Hours List';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Company', 'link': '/setup/company' },
                { 'displayName': 'Company Hours List', 'link': '/setup/company/hours' }
            );
        } else if (navURL === 'setup/company/paymenttypes') {
            this.displayName = 'Setup Payment Types';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Company', 'link': '/setup/company' },
                { 'displayName': 'Setup Payments Types', 'link': '/setup/company/paymenttypes' }
            );
        } else if (navURL === 'setup/memberships') {
            this.displayName = 'Setup Memberships';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Memberships', 'link': '/setup/memberships' }
            );
        } else if (navURL === 'setup/workers') {
            this.displayName = 'Setup Workers';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Workers', 'link': '/setup/workers' }
            );
        } else if (navURL === 'setup/workers/permissions') {
            this.displayName = 'Setup Permissions';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Workers', 'link': '/setup/workers' },
                { 'displayName': 'Setup Permissions', 'link': '/setup/workers/permissions' }
            );
        } else if (navURL === 'setup/workers/compensationscales') {
            this.displayName = 'Setup Compensation Scales';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Workers', 'link': '/setup/workers' },
                { 'displayName': 'Setup Compensation Scales', 'link': '/setup/workers/compensationscales' }
            );
        } else if (navURL === 'setup/workers/compensationmethods') {
            this.displayName = 'Setup Compensation Methods';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Workers', 'link': '/setup/workers' },
                { 'displayName': 'Setup Compensation Methods', 'link': '/setup/workers/compensationmethods' }
            );
        } else if (navURL === 'setup/workers/goals') {
            this.displayName = 'Setup Goals';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Workers', 'link': '/setup/workers' },
                { 'displayName': 'Setup Goals', 'link': '/setup/workers/goals' }
            );
        } else if (navURL === 'setup/workers/details') {
            this.displayName = 'Worker Details';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Workers', 'link': '/setup/workers' },
                { 'displayName': 'Worker Details', 'link': '/setup/workers/details' }
            );
        } else if (navURL === 'setup/ticketpreferences') {
            this.displayName = 'Setup Ticket Preferences';
            this.navPages.push(
                { 'displayName': 'Setup', 'link': '/setup' },
                { 'displayName': 'Setup Ticket Preferences', 'link': '/setup/ticketpreferences' }
            );
        } else if (navURL === 'appointments') {
            this.displayName = 'Appointments';
            this.navPages.push(
                { 'displayName': 'Appointments', 'link': '/appointments' }
            );
        } else if (navURL === 'appointment/book') {
            this.displayName = 'Book Appointment';
            this.navPages.push(
                { 'displayName': 'Appointments', 'link': '/appointments' },
                { 'displayName': 'Book Appointment', 'link': '/appointment/book' }
            );

        } else if (navURL.match(/appointmentdetail/g)) {
            this.displayName = 'Appointment Detail';
            this.navPages.push(
                { 'displayName': 'Appointments', 'link': '/appointments' },
                { 'displayName': 'Appointment Detail', 'link': '/appointment/appointmentdetail' }
            );

        } else if (navURL.match(/modifyappt/g)) {
            this.displayName = 'Modify Appointment';
            this.navPages.push(
                { 'displayName': 'Appointments', 'link': '/appointments' },
                { 'displayName': 'Modify Appointment', 'link': 'appointment/modifyappt' },
            );
        } else if (navURL.match(/bookoutdetail/g)) {
            this.displayName = 'Book Out Time Detail';
            this.navPages.push(
                { 'displayName': 'Appointments', 'link': '/appointments' },
                { 'displayName': 'Book Out Time Detail', 'link': 'appointment/bookoutdetail' },
            );
        } else if (navURL.match(/appointment\/bookstandingappt/g)) {
            this.displayName = 'Book Standing';
            this.navPages.push(
                { 'displayName': 'Appointments', 'link': '/appointments' },
                { 'displayName': 'Book Standing', 'link': '/appointment/bookstandingappt' },
            );
        } else if (navURL === 'appointment/bookoutappointment') {
            this.displayName = 'Book Out Time Detail';
            this.navPages.push(
                { 'displayName': 'Appointments', 'link': '/appointments' },
                { 'displayName': 'Book Out Appointment', 'link': 'appointment/bookoutappointment' },
            );
        } else if (navURL === 'appointment/classdetail') {
            this.displayName = 'Class Detail';
            this.navPages.push(
                { 'displayName': 'Appointments', 'link': '/appointments' },
                { 'displayName': 'Class Detail', 'link': 'appointment/classdetail' },
            );
        } else if (navURL === 'appointment/bookclass') {
            this.displayName = 'Book Class';
            this.navPages.push(
                { 'displayName': 'Appointments', 'link': '/appointments' },
                { 'displayName': 'Book Class', 'link': '/appointment/bookclass' },
            );
        } else if (navURL === 'appointment/bookoutdetail') {
            this.displayName = 'Book Out Detail';
            this.navPages.push(
                { 'displayName': 'Appointments', 'link': '/appointments' },
                { 'displayName': 'Book Out Detail', 'link': '/appointment/bookoutdetail' },
            );
        } else if (navURL === 'appointment/waitinglist') {
            this.displayName = 'Waiting List';
            this.navPages.push(
                { 'displayName': 'Appointments', 'link': '/appointments' },
                { 'displayName': 'Waiting List', 'link': '/appointment/waitinglist' },
            );
        } else if (navURL === 'inventory') {
            this.displayName = 'Inventory';
            this.navPages.push(
                { 'displayName': 'Inventory', 'link': '/inventory' }
            );
        } else if (navURL === 'inventory/manage') {
            this.displayName = 'Inventory: Manage Inventory';
            this.navPages.push(
                { 'displayName': 'Inventory', 'link': '/inventory' },
                { 'displayName': 'Inventory: Manage Inventory', 'link': '/inventory/manage' }
            );
        } else if (navURL === 'inventory/purchaseorders') {
            this.displayName = 'Purchase Orders';
            this.navPages.push(
                { 'displayName': 'Inventory', 'link': '/inventory' },
                { 'displayName': 'Purchase Orders', 'link': '/inventory/purchaseorders' }
            );
        } else if (navURL === 'inventory/usage') {
            this.displayName = 'Inventory Usage';
            this.navPages.push(
                { 'displayName': 'Inventory', 'link': '/inventory' },
                { 'displayName': 'Inventory Usage', 'link': '/inventory/usage' }
            );
        } else if (navURL === 'marketing') {
            this.displayName = 'Marketing';
            this.navPages.push(
                { 'displayName': 'Marketing', 'link': '/marketing' }
            );
        } else if (navURL === 'marketing/setuppromotions') {
            this.displayName = 'Setup Promotions';
            this.navPages.push(
                { 'displayName': 'Marketing', 'link': '/marketing' },
                { 'displayName': 'Setup Promotions', 'link': '/marketing/setuppromotions' }
            );
        } else if (navURL === 'marketing/setuprewards') {
            this.displayName = 'Rewards';
            this.navPages.push(
                { 'displayName': 'Marketing', 'link': '/marketing' },
                { 'displayName': 'Rewards', 'link': '/marketing/setuprewards' }
            );
        } else if (navURL === 'marketing/email') {
            this.displayName = 'Marketing Email';
            this.navPages.push(
                { 'displayName': 'Marketing', 'link': '/marketing' },
                { 'displayName': 'Marketing Email', 'link': '/marketing/email' }
            );
        } else if (navURL === 'marketing/sets') {
            this.displayName = 'Sets';
            this.navPages.push(
                { 'displayName': 'Marketing', 'link': '/marketing' },
                { 'displayName': 'Sets', 'link': '/marketing/sets' }
            );
        } else if (navURL === 'marketing/reports') {
            this.displayName = 'Reports';
            this.navPages.push(
                { 'displayName': 'Marketing', 'link': '/marketing' },
                { 'displayName': 'Reports', 'link': '/marketing/reports' }
            );
        } else if (navURL === 'marketing/reportedit') {
            this.displayName = 'Marketing Report';
            this.navPages.push(
                { 'displayName': 'Marketing', 'link': '/marketing' },
                { 'displayName': 'Marketing Report', 'link': '/marketing/reportedit' }
            );
        } else if (navURL === 'marketing/reportdelete') {
            this.displayName = 'Marketing Report delete';
            this.navPages.push(
                { 'displayName': 'Marketing', 'link': '/marketing' },
                { 'displayName': 'Marketing Report delete', 'link': '/marketing/reportdelete' }
            );
        } else if (navURL === 'marketing/emailactivity') {
            this.displayName = 'Email Activity';
            this.navPages.push(
                { 'displayName': 'Marketing', 'link': '/marketing' },
                { 'displayName': 'Email Activity', 'link': '/marketing/emailactivity' }
            );
        } else if (navURL === 'giftbalances') {
            this.displayName = 'Gift Balances';
            this.navPages.push(
                { 'displayName': 'Gift Balances', 'link': '/giftbalances' }
            );
        } else if (navURL === 'timeclock') {
            this.displayName = 'Time Clock';
            this.navPages.push(
                { 'displayName': 'Time Clock', 'link': '/timeclock' }
            );
        } else if (navURL === 'reports') {
            this.displayName = 'Reports';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' }
            );
        } else if (navURL === 'reports/reportwriterlist') {
            this.displayName = 'Report Writer';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'Report Writer', 'link': '/reports/reportwriterlist' }
            );
        } else if (navURL === 'reports/inventorygift/reportgifts') {
            this.displayName = 'Gift List Report';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'Gift List Report', 'link': '/reports/inventorygift/reportgifts' }
            );
        } else if (navURL === 'reports/inventorygift/onhandproduct') {
            this.displayName = 'On Hand Product';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'On Hand Product', 'link': '/reports/inventorygift/reportgifts' }
            );
        } else if (navURL === 'reports/inventorygift/inventoryusagereport') {
            this.displayName = 'Inventory Usage Report';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'Inventory Usage Report', 'link': '/reports/inventorygift/inventoryusagereport' }
            );
        } else if (navURL === 'reports/inventorygift/adjustmentreportlist') {
            this.displayName = 'Adjustment Reports';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'Adjustment Reports', 'link': '/reports/inventorygift/adjustmentreportlist' }
            );
        } else if (navURL === 'reports/transaction/totalsheets') {
            this.displayName = 'Total Sheet';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'Total Sheet', 'link': '/reports/transaction/totalsheets' }
            );
        } else if (navURL === 'reports/transaction/reportdailycashdrawer') {
            this.displayName = 'Daily Cash Drawer';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'Daily Cash Drawer', 'link': '/reports/transaction/reportdailycashdrawer' }
            );
        } else if (navURL === 'reports/transaction/paymentdetails') {
            this.displayName = 'Electronic Payment Details';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'Electronic Payment Details', 'link': '/reports/transaction/paymentdetails' }
            );
        } else if (navURL === 'reports/transaction/ticketlist') {
            this.displayName = 'Ticket Details ';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'Ticket Details ', 'link': '/reports/transaction/ticketlist' }
            );
        } else if (navURL === 'reports/compensation/processcompensation') {
            this.displayName = 'Process Compensation';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'Process Compensation', 'link': '/reports/compensation/processcompensation' },
            );
        } else if (navURL === 'reports/sales/ticketsaleschart') {
            this.displayName = 'Ticket Sales Chart';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'Ticket Sales Chart ', 'link': '/reports/sales/ticketsaleschart' },
            );
        } else if (navURL === 'reports/sales/ticketsalesreport') {
            this.displayName = 'Ticket Sales';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'Ticket Sales', 'link': '/reports/sales/ticketsalesreport' },
            );
        } else if (navURL === 'reports/sales/reportservicesales') {
            this.displayName = 'Service Sales Report';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'Service Sales Report', 'link': '/reports/sales/reportservicesales' },
            );
        } else if (navURL === 'reports/sales/productsaleschart') {
            this.displayName = 'Product Sales Chart ';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'Product Sales Chart', 'link': '/reports/sales/productsaleschart' },
            );

        } else if (navURL === 'reports/sales/reportproductsales') {
            this.displayName = 'Product Sales Report ';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'Product Sales Report', 'link': '/reports/sales/reportproductsales' },
            );
        } else if (navURL === 'reports/sales/productsalesbyrank') {
            this.displayName = 'Product Sales by Rank ';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'Product Sales by Rank', 'link': '/reports/sales/productsalesbyrank' },
            );



        } else if (navURL === 'reports/compensation/workertips') {
            this.displayName = 'Worker Tips';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'Worker Tips ', 'link': 'reports/compensation/workertips' },
            );
        } else if (navURL === 'reports/compensation/workergoals') {
            this.displayName = 'Worker Goals';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'Worker Goals ', 'link': 'reports/compensation/workergoals' },
            );
        } else if (navURL === 'reports/businessanalysis/clientretention') {
            this.displayName = 'Client Retention';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'Client Retention ', 'link': 'reports/businessanalysis/clientretention' },
            );
        } else if (navURL === 'reports/businessanalysis/reportactivitycomparison') {
            this.displayName = 'Activity Comparison';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'Activity Comparison ', 'link': 'reports/businessanalysis/reportactivitycomparison' },
            );
        } else if (navURL === 'reports/businessanalysis/monthlybussinessanalysis') {
            this.displayName = 'Monthly Business Analysis';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'Monthly Business Analysis', 'link': 'reports/businessanalysis/monthlybussinessanalysis' },
            );
        } else if (navURL === 'reports/businessanalysis/ticketanalysisreport') {
            this.displayName = 'Ticket Analysis Report';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'Ticket Analysis Report', 'link': 'reports/businessanalysis/ticketanalysisreport' },
            );
        } else if (navURL === 'reports/businessanalysis/reportvisittypeoverview') {
            this.displayName = 'Visit Type Overview';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'Visit Type Overview', 'link': 'reports/businessanalysis/reportvisittypeoverview' },
            );
        } else if (navURL === 'reports/businessanalysis/tbpreport') {
            this.displayName = 'TBP Report';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'TBP Report', 'link': 'reports/businessanalysis/tbpreport' },
            );
        } else if (navURL === 'reports/businessanalysis/abcreport') {
            this.displayName = 'ABC Report';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'ABC Report', 'link': 'reports/businessanalysis/abcreport' },
            );

        } else if (navURL === 'checkout') {
            this.displayName = 'Check Out List';
            this.navPages.push(
                { 'displayName': 'Check Out List', 'link': '/checkout' },
            );
        } else if (navURL.match(/refunddetails/g)) {
            this.displayName = 'Check Out List';
            this.navPages.push(
                { 'displayName': 'Check Out List', 'link': '/checkout' },
                { 'displayName': 'Refund', 'link': '' }
            );
        } else if (navURL === 'checkout/refund/noclient') {
            this.displayName = 'Refund NO CLIENT';
            this.navPages.push(
                { 'displayName': 'Check Out List', 'link': '/checkout' },
                { 'displayName': 'Refund NO CLIENT', 'link': '/checkout/refund/noclient' }
            );
        } else if (navURL === 'checkout/newticket') {
            this.displayName = 'New Ticket';
            this.navPages.push(
                { 'displayName': 'Check Out List', 'link': '/checkout' },
                { 'displayName': 'New Ticket', 'link': '/checkout/newticket' },
            );
        } else if (navURL.match(/checkout\//g)) {
            this.displayName = 'Check Out List';
            this.navPages.push(
                { 'displayName': 'Check Out List', 'link': '/checkout' },
                { 'displayName': 'Check Out List', 'link': '' }
            );
        } else if (navURL.match(/client\/createtoken/g)) {
            this.displayName = 'Create Token';
            this.navPages.push(
                { 'displayName': 'Clients', 'link': '/client' },
                { 'displayName': 'Create Token', 'link': '/client/createtoken/clientId' },
            );
        } else if (navURL === 'favourites') {
            this.displayName = 'favourites';
            this.navPages.push(
                { 'displayName': 'favourites', 'link': '/favourites' }
            );
        } else if (navURL === 'dashboard') {
            this.displayName = 'dash board';
            this.navPages.push(
                { 'displayName': 'dashboard', 'link': '/dashboard' }
            );
        } else if (navURL === 'membercheckin') {
            this.displayName = 'member checkin';
            this.navPages.push(
                { 'displayName': 'member checkin', 'link': '/membercheckin' }
            );
        } else if (navURL.match(/membershipedit/g)) {
            this.displayName = 'checkout memberships';
            this.navPages.push(
                { 'displayName': 'Check Out List', 'link': '/checkout' },
                { 'displayName': 'Check Out Memberships', 'link': '' }
            );
        } else if (navURL === 'cashinout') {
            this.displayName = 'Cash In / Out';
            this.navPages.push(
                { 'displayName': 'Check Out List', 'link': '/checkout' },
                { 'displayName': 'Cash In / Out', 'link': '' }
            );
        } else if (navURL.match(/completedticketdetailsview/g)) {
            this.displayName = '';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': '', 'link': '' }
            );
        } else if (navURL === 'ticketlist') {
            this.displayName = 'Ticket Details ';
            this.navPages.push(
                { 'displayName': 'Reports', 'link': '/reports' },
                { 'displayName': 'Ticket Details ', 'link': '/ticketlist' }
            );
        }
    }
    /**
  * To get Company info Data
  */
    getCompanyInfo() {
        this.headerService.getCompanyData().subscribe(
            data => {
                const companyData = data['result'];
                if (companyData.cmpresult && companyData.cmpresult.length > 0) {
                    this.companyInfo = companyData.cmpresult[0];
                    this.emitCompanyInfo.emit(this.companyInfo);
                    this.comapanyLogo = this.apiEndPoint + '/' + companyData.cmpresult[0].Logo__c;
                }
            },
            error => {
                const errStatus = JSON.parse(error['_body'])['status'];
                if (errStatus === '2085' || errStatus === '2071') {
                    if (this.router.url !== '/') {
                        localStorage.setItem('page', this.router.url);
                        this.router.navigate(['/']).then(() => { });
                    }
                }
            }
        );
    }

    imageErrorHandler(event) {
        event.target.src = '/assets/images/logo.png';
    }

    openNav() {
        document.getElementById('mySidenav').style.width = '350px';
        document.getElementById('mySidenav').style.paddingLeft = '25px';
    }
    closeNav() {
        document.getElementById('mySidenav').style.width = '0';
        document.getElementById('mySidenav').style.paddingLeft = '0px';
    }
    admMenuShow() {
        this.activeClass = !this.activeClass;
    }
    admMenuShowForInventory() {
        this.activeClass1 = !this.activeClass1;
    }
    admMenuShowForMarketing() {
        this.marketingActiveClass = !this.marketingActiveClass;
    }

    logout() {
        localStorage.clear();
        this.router.navigate(['/']);
    }
}
