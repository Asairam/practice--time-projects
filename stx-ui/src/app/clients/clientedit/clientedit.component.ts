/*
ngOnInit() : Method to loading athe page..
searchClients() : Method for searching clients
showData() : Method for loading All clients Data.
clearmessage() : Method for Clearing  error messages.
*/
import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ClientEditService } from './clientedit.service';
import { ToastrService } from 'ngx-toastr';
import { TabsetComponent } from 'ngx-bootstrap';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { TranslateService } from 'ng2-translate';
import * as config from '../../app.config';
@Component({
    selector: 'app-clientedit-popup',
    templateUrl: './clientedit.html',
    providers: [ClientEditService],
    styleUrls: ['./clientedit.css']
})
export class ClientEditComponent implements OnInit {
    public Next_Bill_Date__c: any = new Date();
    referedOnDate: any = new Date();
    saveAndBookAction: any = false;
    activeTab2 = [false, false, false, false, false, false, false, false, false];
    activeTabClass = ['active', '', '', '', '', '', '', '', ''];
    isClassVisible: any = false;
    activeTab: any;
    // client info
    statuscode: any;
    clientInfoActive: any;
    clientInfoFullName: any;
    clientInfofullName: any;
    clientInfoPrimaryPhone: any;
    clientInfoMobilePhone: any;
    clientInfoEmail: any;
    clientInfoFirstName: any;
    clientInfoMiddleName: any;
    clientInfoLastName: any;
    mailingCountriesList: any;
    clientInfoMailingStreet: any;
    clientInfoPostalCode: any;
    clientInfoMailingCity: any;
    clientInfoSecondaryEmail: any;
    clientInfoEmergName: any;
    clientInfoEmergPrimaryPhone: any;
    clientInfoEmergSecondaryPhone: any;
    ResponsibleParty: any;
    clientId: any;
    country: any = 'United States';
    state: any;
    statesList: any;
    errorMessage: any;
    noEmail: any = false;
    clientInfoSearchKey: any;
    clientInfoDataObj: any;
    clientObj: any;
    clientInfoError: any = '';
    clientInfoError1: any = '';
    clientInfoError2: any = '';
    clientInfoError3: any = '';
    clientInfoError4: any = '';
    clientInfoError5: any = '';
    clientInfoError6: any = '';
    clientInfoError7: any = '';
    clientInfoError8: any = '';
    deleteError: any;
    rowsPerPage = 10;
    infoClientName: any;
    toastermessage: any;
    serviceDate: any;
    @ViewChild('lookupModal') public lookupModal: ModalDirective;
    // client profile
    occupationData: any;
    occupationvalue: any;
    clientFlags: any;
    monthsArray: any;
    birthMonth: any;
    birthDay: any;
    daysArray: any;
    years = [];
    startYear: any;
    genderData: any;
    clientFlagValues: any;
    searchKey: any;
    error1: any;
    error: any = '';
    DataObj; any;
    clientName: any;
    genderValue: any;
    birthYear: any;
    notes: any;
    clientPicture: any;
    ReferedAFriendProspect: any = false;
    referClientId: any;
    clientData: any;
    clientPictureFile: File;
    clientPictureFileView: SafeUrl = '';
    selectedFlags: any;
    referredClientData: any = [];
    referralsLength: any = 0;
    // preferences
    marketingOptOut: any = false;
    marketingMobilePhone: any = false;
    marketingPrimaryEmail: any = false;
    marketingSecondaryEmail: any = false;
    notificationMobilePhone: any = false;
    notificationOptOut: any = false;
    notificationPrimaryEmail: any = false;
    notificationSecondaryEmail: any = false;
    reminderOptOut: any = false;
    reminderMobilePhone: any = false;
    reminderPrimaryEmail: any = false;
    reminderSecondaryEmail: any = false;
    mobileCarrierData: any;
    mobileCarrierName: any = '';
    // appointments
    noEmailAppt: any = false;
    accoutChargeBalance: any = false;
    depositRequired: any = false;
    persistanceNoShow: any = false;
    other: any = false;
    otherReason: any;
    apptNotes: any;
    bookingFrequency: any = 0;
    allowOnlineBooking: any = false;
    hasStandingAppt: any;
    pin: any;
    add: any;
    apptViewsData: any;
    BRTypesData: any;
    BRTypeValue: any;
    apptViewValue: any;
    clientappoinmentData: any;
    clientServicesData: any;
    resultAppointments = [];
    AllApptsValue: any = false;
    // email or textlog
    emailTextLogList: any;
    // product log
    productLogList: any;
    // service log
    serviceLogList: any;
    indexTemp = 0;
    saveNotes: any;
    updateNotes: any;
    serviceId: any;
    serviceLogLength: any;
    // class log
    classLogList: any;
    classLogLength: any;
    @ViewChild('serviceNotesModal') public serviceNotesModal: ModalDirective;
    isNewClient: any;
    // Accounts
    rewardData: any;
    activeRewards: any = false;
    clientMemberShipsData: any = [];
    clientPackagesData: any;
    clientMemberShipId: any;
    ClientServiceData: any;
    totalUnUsedValue: any = 0;
    clientAccountsData: any;
    startingBalance: any = 0;
    paymentType: any;
    paymentTypeGateWay = config.ANYWHERECOMMERCE_PAYMENT_TYPE_GATEWAY;
    tokenExpDate: any;
    tokenPresentValaue: any;
    cardNumber: any;
    datePickerConfig: any;
    fileName = 'No file chosen';
    isNavigatedFromBookStanding: boolean;
    // mergeClient
    @ViewChild('mergeClientModal') public mergeClientModal: ModalDirective;
    @ViewChild('staticTabs') staticTabs: TabsetComponent;
    @ViewChild('profileModal') public profileModal: ModalDirective;
    selectTab(tab_id: number) {
        this.staticTabs.tabs[tab_id].active = true;
    }
    disableEnable() {
        this.staticTabs.tabs[0].disabled = !this.staticTabs.tabs[0].disabled;
        this.staticTabs.tabs[0].active = true;
    }
    constructor(
        private activatedRoute: ActivatedRoute,
        private clientEditService: ClientEditService,
        private translateService: TranslateService,
        private toastr: ToastrService,
        @Inject('apiEndPoint') private apiEndPoint: string,
        @Inject('defaultType') public defaultType: string,
        private sanitizer: DomSanitizer,
        private router: Router) {
        this.datePickerConfig = Object.assign({},
            {
                showWeekNumbers: false,
                containerClass: 'theme-blue',
            });
        this.isNavigatedFromBookStanding = this.router.url.split('/').indexOf('bookstanding') !== -1;
        this.activatedRoute.queryParams.subscribe(params => {
            this.clientId = activatedRoute.snapshot.params['Id'];
            this.isNewClient = activatedRoute.snapshot.params['isNewClient'];
            if (this.isNewClient === 'new') {
                this.isNewClient = true;
            } else {
                this.isNewClient = false;
            }
        });
    }
    /*Method for page Load */
    ngOnInit() {
        this.mailingCountriesList = [{ 'NAME': 'Canada' }, { 'NAME': 'United States' }];
        this.listOccupation();
        // client info
        // this.getCountries();
        // this.getClientData();
        // client profile
        this.listClientFlags();
        this.birthDateAndDays();
        this.genderTypes();
        // client preferences
        this.getMobileCarriersData();
        // Appointments
        this.ApptViews();
        this.BRTypes();
        // this.getClientAppointmemts();
        // Accounts
        if (this.clientId) {
            this.getClientRewards();
            this.getClientMemberships();
            this.getClientPackages();
            this.getClientAccounts();
            // email or textlog
            this.getEmailOrTextLog();
            // product log
            this.getProductLog();
            // service log
            this.getServiceLog();
            this.getClientData(this.clientId);
            // class log
            this.getClassLog();
            this.updateTabs(0);
        }
    }
    /**
     * Common methods starts
     */
    getClientData(clientId) {
        this.clientEditService.getClient(clientId)
            .subscribe(data => {
                this.clientData = data['result'].results[0];
                for (const key in this.clientData) {
                    if (this.clientData[key] === 'null' || this.clientData[key] === null || this.clientData[key] === 'undefined'
                        || this.clientData[key] === undefined || this.clientData[key] === 'null-null-null') {
                        this.clientData[key] = '';
                    }
                }
                const referrals = this.clientData.refName;
                /**
                     *  start of code for Client Name For header
                     */
                const displayName = document.getElementById('displayNameId');
                displayName.innerHTML = 'Client Edit - ' + this.clientData.FirstName + ' ' + this.clientData.LastName;
                /**
                    *  End of code for Client Name For header
                    */
                if (referrals) {
                    this.referredClientData = referrals.split(',');
                    this.referralsLength = this.referredClientData.length;
                }
                this.loadUserData();
                this.birthDateAndDays();
            }, error => {
                const status = JSON.parse(error['status']);
                const statuscode = JSON.parse(error['_body']).status;
                switch (JSON.parse(error['_body']).status) {
                    case '2033':
                        this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                        window.scrollTo(0, 0);
                        break;
                }
                if (statuscode === '2085' || statuscode === '2071') {
                    if (this.router.url !== '/') {
                        localStorage.setItem('page', this.router.url);
                        this.router.navigate(['/']).then(() => { });
                    }
                }
            });
    }
    searchClients() {
        if (this.searchKey === '' || this.searchKey === undefined || (this.searchKey.trim()).length <= 1) {
            this.error1 = 'CLIENTS.VALID_NOBLANK_SEARCH_FIELD';
        } else {
            this.clientEditService.getData(this.searchKey)
                .subscribe(data => {
                    this.DataObj = data['result'];
                }, error => {
                    const status = JSON.parse(error['status']);
                    const statuscode = JSON.parse(error['_body']).status;
                    switch (JSON.parse(error['_body']).status) {
                        case '2033':
                            this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                            window.scrollTo(0, 0);
                            break;
                    }
                    if (statuscode === '2085' || statuscode === '2071') {
                        if (this.router.url !== '/') {
                            localStorage.setItem('page', this.router.url);
                            this.router.navigate(['/']).then(() => { });
                        }
                    }
                });
        }
    }
    cancel() {
        if (this.isNavigatedFromBookStanding) {
            this.router.navigate(['/appointments']);
        } else {
            this.router.navigate(['/client']);
        }
    }
    clearmessage() {
        this.clientInfoError1 = '';
        this.clientInfoError2 = '';
        this.clientInfoError3 = '';
        this.clientInfoError4 = '';
        this.clientInfoError5 = '';
        this.clientInfoError6 = '';
        this.clientInfoError7 = '';
        this.clientInfoError8 = '';
        this.clientInfoError8 = '';
    }
    saveAndBook() {
        this.saveAndBookAction = true;
        this.commonSave();
        this.router.navigate(['/appointment/book/' + this.clientId]).then(() => {
        });
    }
    /**
     * Common methods ends
     */
    /**
     * Client info methods starts
     */
    // getCountries() {
    //     this.clientEditService.getLookupsList('COUNTRIES').subscribe(
    //         data => {
    //             this.mailingCountriesList = data['result'];
    //         },
    //         error => {
    //             const status = JSON.parse(error['status']);
    //             const statuscode = JSON.parse(error['_body']).status;
    //             switch (status) {
    //                 case 500:
    //                     break;
    //                 case 400:
    //                     if (statuscode === '9961') {
    //                     } break;
    //             }
    //         }
    //     );
    // }
    getCountry(countryName) {
        this.country = countryName;
        this.state = '';
        this.clientEditService.getStates(this.country)
            .subscribe(statesValues => {
                this.statesList = statesValues['result'];
            },
            error => {
                this.errorMessage = <any>error;
                const errStatus = JSON.parse(error['_body'])['status'];
                if (errStatus === '2085' || errStatus === '2071') {
                    if (this.router.url !== '/') {
                        localStorage.setItem('page', this.router.url);
                        this.router.navigate(['/']).then(() => { });
                    }
                }
            });
    }
    getStates(state) {
        this.state = state;
    }
    getLookupPopup() {
        this.lookupModal.show();
    }
    lookupCloseModal() {
        this.lookupModal.hide();
    }
    getfullname(clientName) {
        this.infoClientName = clientName.FullName;
        this.lookupModal.hide();
    }
    clearinfoClientName() {
        this.infoClientName = '';
    }
    hyphen_generate_mobile(value) {
        if (value === undefined) {
            value = '';
        }
        if (value.length === 0) {
            (<HTMLInputElement>document.getElementById('mobile_id')).value = value.concat('(');
        }
        if (value.length === 4) {
            (<HTMLInputElement>document.getElementById('mobile_id')).value = value.concat(')');
        } if (value.length === 8) {
            (<HTMLInputElement>document.getElementById('mobile_id')).value = value.concat('-');
        }
    }
    hyphen_generate_mobile1(value) {
        if (value === undefined || value === null) {
            value = '';
        }
        if (value.length === 0) {
            (<HTMLInputElement>document.getElementById('mobile_id1')).value = value.concat('(');
        }
        if (value.length === 4) {
            (<HTMLInputElement>document.getElementById('mobile_id1')).value = value.concat(')');
        } if (value.length === 8) {
            (<HTMLInputElement>document.getElementById('mobile_id1')).value = value.concat('-');
        }
    }
    deleteClient() {
        this.clientEditService.deleteClient(this.clientId)
            .subscribe(data => {
                this.router.navigate(['/client']).then(() => {
                    this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_DELETE_SUCCESS');
                    this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                });
            },
                error => {
                    const status = JSON.parse(error['status']);
                    const statuscode = JSON.parse(error['_body']).status;
                    switch (status) {
                        case 500:
                            break;
                        case 400:
                            if (statuscode === '2040') {
                                this.deleteError = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                window.scrollTo(0, 0);
                            } else if (statuscode === '2085' || statuscode === '2071') {
                                if (this.router.url !== '/') {
                                    localStorage.setItem('page', this.router.url);
                                    this.router.navigate(['/']).then(() => { });
                                }
                            } break;
                    }
                });
    }
    /**
     * Client profile method starts
     */
    loadUserData() {
        const newObj = JSON.parse(localStorage.getItem('isNewClient'));
        // if (newObj === true) {
        //     this.isNewClient = true;
        // } else {
        // this.clientData = JSON.parse(localStorage.getItem('clientData'));
        // client profile
        this.genderValue = this.clientData.Gender__c;
        // this.birthDay = this.clientData.Birthdate;
        this.birthYear = this.clientData.BirthYearNumber__c;
        this.birthDay = this.clientData.BirthDateNumber__c;
        this.birthMonth = this.clientData.BirthMonthNumber__c;
        this.notes = this.clientData.Notes__c;
        if (this.notes === 'null' || this.notes === null) {
            this.notes = '';
        }
        this.clientName = this.clientData.ReferredClient;
        this.occupationvalue = this.clientData.Title;
        if (this.clientData.Client_Flag__c) {
            this.selectedFlags = this.clientData.Client_Flag__c.split(';');
        } else {
            this.selectedFlags = [];
        }
        this.ReferedAFriendProspect = this.clientData.Refer_A_Friend_Prospect__c;
        // this.clientPictureFile = this.clientData.Client_Pic__c;
        this.clientPictureFileView = this.apiEndPoint + '/' + this.clientData.Client_Pic__c;
        this.clientId = this.clientData.Id;
        // preferences
        this.marketingOptOut = this.clientData.Marketing_Opt_Out__c;
        this.marketingMobilePhone = this.clientData.Marketing_Mobile_Phone__c;
        this.marketingPrimaryEmail = this.clientData.Marketing_Primary_Email__c;
        this.marketingSecondaryEmail = this.clientData.Marketing_Secondary_Email__c;
        this.notificationMobilePhone = this.clientData.Notification_Mobile_Phone__c;
        this.notificationOptOut = this.clientData.Notification_Opt_Out__c;
        this.notificationPrimaryEmail = this.clientData.Notification_Primary_Email__c;
        this.notificationSecondaryEmail = this.clientData.Notification_Secondary_Email__c;
        this.reminderOptOut = this.clientData.Reminder_Opt_Out__c;
        this.reminderMobilePhone = this.clientData.Reminder_Mobile_Phone__c;
        this.reminderPrimaryEmail = this.clientData.Reminder_Primary_Email__c;
        this.reminderSecondaryEmail = this.clientData.Reminder_Secondary_Email__c;
        this.mobileCarrierName = this.clientData.Mobile_Carrier__c;
        this.referedOnDate = this.clientData.Referred_On_Date__c;
        // client info
        this.clientInfoActive = this.clientData.Active__c;
        this.clientInfoFullName = this.clientData.FullName;
        this.clientInfoFirstName = this.clientData.FirstName;
        this.clientInfoLastName = this.clientData.LastName;
        this.clientInfoMiddleName = this.clientData.MiddleName;
        this.noEmail = this.clientData.No_Email__c;
        if (this.clientInfoMiddleName === 'null' || this.clientInfoMiddleName === null) {
            this.clientInfoMiddleName = '';
        }
        this.clientInfoMailingStreet = this.clientData.MailingStreet;
        if (this.clientInfoMailingStreet === 'null' || this.clientInfoMailingStreet === null) {
            this.clientInfoMailingStreet = '';
        }
        this.country = this.clientData.MailingCountry;
        if (this.country && this.country !== null && this.country !== '') {
            this.getCountry(this.country);
        }
        this.clientInfoPostalCode = this.clientData.MailingPostalCode;
        if (this.clientInfoPostalCode === 'null' || this.clientInfoPostalCode === null) {
            this.clientInfoPostalCode = '';
        }
        this.clientInfoMailingCity = this.clientData.MailingCity;
        if (this.clientInfoMailingCity === 'null' || this.clientInfoMailingCity === null) {
            this.clientInfoMailingCity = '';
        }
        this.state = this.clientData.MailingState;
        this.clientInfoPrimaryPhone = this.clientData.Phone;
        if (this.clientInfoPrimaryPhone === 'null' || this.clientInfoPrimaryPhone === null) {
            this.clientInfoPrimaryPhone = '';
        }
        this.clientInfoMobilePhone = this.clientData.MobilePhone;
        this.clientInfoEmail = this.clientData.Email;
        this.clientInfoEmergName = this.clientData.Emergency_Name__c;
        if (this.clientInfoEmergName === 'null' || this.clientInfoEmergName === null) {
            this.clientInfoEmergName = '';
        }
        this.clientInfoEmergPrimaryPhone = this.clientData.Emergency_Primary_Phone__c;
        if (this.clientInfoEmergPrimaryPhone === 'null' || this.clientInfoEmergPrimaryPhone === null) {
            this.clientInfoEmergPrimaryPhone = '';
        }
        this.clientInfoEmergSecondaryPhone = this.clientData.Emergency_Secondary_Phone__c;
        if (this.clientInfoEmergSecondaryPhone === 'null' || this.clientInfoEmergSecondaryPhone === null) {
            this.clientInfoEmergSecondaryPhone = '';
        }
        this.clientInfoSecondaryEmail = this.clientData.Secondary_Email__c;
        if (this.clientInfoSecondaryEmail === 'null' || this.clientInfoSecondaryEmail === null) {
            this.clientInfoSecondaryEmail = '';
        }
        this.clientId = this.clientData.Id;
        this.infoClientName = this.clientData.Responsible_Party__c;
        if (this.infoClientName === 'null' || this.infoClientName === null) {
            this.infoClientName = '';
        }
        // Appointments
        this.noEmailAppt = this.clientData.BR_Reason_No_Email__c;
        this.accoutChargeBalance = this.clientData.BR_Reason_Account_Charge_Balance__c;
        this.depositRequired = this.clientData.BR_Reason_Deposit_Required__c;
        this.persistanceNoShow = this.clientData.BR_Reason_No_Show__c;
        this.other = this.clientData.BR_Reason_Other__c;
        this.otherReason = this.clientData.Booking_Restriction_Note__c;
        if (this.otherReason === 'null' || this.otherReason === null) {
            this.otherReason = '';
        }
        this.apptNotes = this.clientData.BR_Reason_Other_Note__c;
        if (this.apptNotes === 'null' || this.apptNotes === null) {
            this.apptNotes = '';
        }
        this.bookingFrequency = this.clientData.Booking_Frequency__c;
        this.allowOnlineBooking = this.clientData.Allow_Online_Booking__c;
        this.hasStandingAppt = this.clientData.Has_Standing_Appts__c;
        this.pin = this.clientData.Pin__c;
        this.BRTypeValue = this.clientData.Booking_Restriction_Type__c;
        // Accounts
        this.activeRewards = this.clientData.Active_Rewards__c;
        this.clientMemberShipId = this.clientData.Membership_ID__c;
        if (this.clientMemberShipId === 'null' || this.clientMemberShipId == null) {
            this.clientMemberShipId = '';
        }
        this.startingBalance = this.clientData.Starting_Balance__c;
        this.paymentType = this.clientData.Payment_Type_Token__c;
        // this.paymentTypeGateWay = this.clientData.Token_Payment_Gateway_Name__c;
        this.tokenExpDate = this.clientData.Token_Expiration_Date__c;
        this.tokenPresentValaue = this.clientData.Token_Present__c;
        this.cardNumber = this.clientData.Credit_Card_Token__c;
        const type = this.defaultType;
        this.clientEditService.deleteClientResponse(type, this.clientId).subscribe(data => {
            this.statuscode = data['result'].statusCode;
        }, error => {
            const status = JSON.parse(error['status']);
            this.statuscode = JSON.parse(error['_body']).status;
            if (this.statuscode === '2085' || this.statuscode === '2071') {
                if (this.router.url !== '/') {
                    localStorage.setItem('page', this.router.url);
                    this.router.navigate(['/']).then(() => { });
                }
            }
        });
        // }
    }
    listOccupation() {
        this.clientEditService.getOccupations().subscribe(
            data => {
                this.occupationData = data['result'].filter(
                    filterList => filterList.active === true);
                this.occupationvalue = this.occupationData[0].occupationName;
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
    listClientFlags() {
        this.clientEditService.getClientFlags().subscribe(
            data => {
                this.clientFlags = data['result'].filter(
                    filterList => filterList.active === true);
            },
            error => {
                const status = JSON.parse(error['status']);
                const statuscode = JSON.parse(error['_body']).status;
                switch (status) {
                    case 500:
                        break;
                    case 400:
                    if (this.statuscode === '2085' || this.statuscode === '2071') {
                        if (this.router.url !== '/') {
                            localStorage.setItem('page', this.router.url);
                            this.router.navigate(['/']).then(() => { });
                        }
                    }
                        break;
                }
            }
        );
    }
    onChangeOccupations(value) {
        this.occupationvalue = value;
    }
    genderTypes() {
        this.clientEditService.getGenders().subscribe(
            data => {
                this.genderData = data['genders'];
                this.genderValue = this.genderData[0].type;
            },
            error => {
                const status = JSON.parse(error['status']);
                const statuscode = JSON.parse(error['_body']).status;
                switch (status) {
                    case 500:
                        break;
                    case 400:
                    if (this.statuscode === '2085' || this.statuscode === '2071') {
                        if (this.router.url !== '/') {
                            localStorage.setItem('page', this.router.url);
                            this.router.navigate(['/']).then(() => { });
                        }
                    }
                        break;
                }
            }
        );
    }
    showProfileModal() {
        this.profileModal.show();
    }
    closeModal() {
        this.profileModal.hide();
    }
    cancelModal() {
        this.profileModal.hide();
        this.mergeClientModal.hide();
    }
    selectClient(clientData) {
        this.clientName = clientData.FullName;
        this.referClientId = clientData.Id;
        this.profileModal.hide();
    }
    clearClientName() {
        this.clientName = '';
    }
    changeMonths(value) {
        this.birthMonth = value;
        this.birthDateAndDays();
    }
    birthDateAndDays() {
        const d = new Date();
        const n = d.getFullYear();
        const days = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11', '12', '13', '14', '15',
            '16', '17', '18', '19', '20', '21', '22', '23', '24', '25', '26', '27', '28', '29', '30', '31'];
        this.monthsArray = [{ month: 'January', value: 1 }, { month: 'February', value: 2 }, { month: 'March', value: 3 },
        { month: 'April', value: 4 }, { month: 'May', value: 5 }, { month: 'June', value: 6 }, { month: 'July', value: 7 },
        { month: 'August', value: 8 }, { month: 'September', value: 9 }, { month: 'October', value: 10 },
        { month: 'November', value: 11 }, { month: 'December', value: 12 }];
        // this.birthDay = '1';
        if (parseInt(this.birthMonth, 10) === undefined) {
            this.birthMonth = this.monthsArray[0];
            this.daysArray = days;
        } else if (n % 4 === 0 && parseInt(this.birthMonth, 10) === this.monthsArray[1].value) {
            this.daysArray = days.slice(0, days.length - 2);
        } else if (parseInt(this.birthMonth, 10) === this.monthsArray[0].value || parseInt(this.birthMonth, 10) === this.monthsArray[2].value ||
            parseInt(this.birthMonth, 10) === this.monthsArray[4].value || parseInt(this.birthMonth, 10) === this.monthsArray[6].value ||
            parseInt(this.birthMonth, 10) === this.monthsArray[7].value || parseInt(this.birthMonth, 10) === this.monthsArray[9].value ||
            parseInt(this.birthMonth, 10) === this.monthsArray[11].value) {
            this.daysArray = days;
        } else if (parseInt(this.birthMonth, 10) === this.monthsArray[3].value || parseInt(this.birthMonth, 10) === this.monthsArray[5].value ||
            parseInt(this.birthMonth, 10) === this.monthsArray[8].value || parseInt(this.birthMonth, 10) === this.monthsArray[10].value) {
            this.daysArray = days.slice(0, days.length - 1);
        } else if (parseInt(this.birthMonth, 10) === this.monthsArray[1].value) {
            this.daysArray = days.slice(0, days.length - 3);
        }
    }
    onChangeMobileCarrier(value) {
        this.mobileCarrierName = value;
    }
    /**
     * Client profile methods ends
     */
    /**
     * Preferences methods starts
     */
    getMobileCarriersData() {
        this.clientEditService.getMobileData().subscribe(
            data => {
                this.mobileCarrierData = data['result']
                    .filter(filterList => filterList.active);
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
    /**
     * Preferences methods ends
     */

    /**
     * Appointments starts
     */
    getClientAppointmemts() {
        const client = {
            'clientId': this.clientId,
            'apptViewValue': this.apptViewValue
        };
        this.clientEditService.getClientAppointmentsData(client).subscribe(
            data => {
                this.resultAppointments = [];
                const apptData = data['result'];
                this.clientappoinmentData = apptData.Appointments;
                this.clientServicesData = apptData.AppointmenServices;
                for (let i = 0; i < this.clientappoinmentData.length; i++) {
                    this.clientappoinmentData[i].Time = '';
                    this.clientappoinmentData[i].PrefDur = false;
                    this.clientappoinmentData[i].Duration__c = undefined;
                    this.resultAppointments.push(this.clientappoinmentData[i]);
                    for (let j = 0; j < this.clientServicesData.length; j++) {
                        if (this.clientappoinmentData[i].Id === this.clientServicesData[j].Appt_Ticket__c) {
                            // this.clientServicesData[j]['type'] = 'Service';
                            this.clientServicesData[j].Time = this.clientappoinmentData[i].Appt_Date_Time__c;
                            this.clientServicesData[j].PrefDur = true;
                            this.resultAppointments.push(this.clientServicesData[j]);

                        }
                    }
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
    getAllClientAppointments(value) {
        if (value.target.checked === true) {
            this.apptViewValue = 'All';
            this.getClientAppointmemts();
        } else if (value.target.checked === false) {
            this.apptViewValue = 'Future';
            this.getClientAppointmemts();
        }
    }
    getCancelledClientAppointments(value) {
        if (value.target.checked === true) {
            this.apptViewValue = 'Cancelled';
            this.getClientAppointmemts();
        } else if (value.target.checked === false) {
            this.apptViewValue = 'Future';
            this.getClientAppointmemts();
        }
    }
    /**
     * Appointments Ends
     */
    /**
   * Email or Textlog methods starts
   */
    getEmailOrTextLog() {
        this.clientEditService.getEmailOrTextLog(this.clientId).subscribe(
            data => {
                this.emailTextLogList = data['result'];
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
    /**
     * Email or Textlog methods ends
     */
    /**
     *Productlog methods starts
     */
    getProductLog() {
        this.clientEditService.getProductLog(this.clientId).subscribe(
            data => {
                this.productLogList = data['result'];
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
    /**
     * Productlog methods ends
     */
    /**
     * Servicelog methods starts
     */
    showNotesModal(index, serviceloglist) {
        this.serviceId = serviceloglist.Id;
        const notesTestarea = <HTMLTextAreaElement>document.getElementById('notesTestareaId');
        notesTestarea.value = this.serviceLogList[index].Notes__c;
        this.indexTemp = index;
        this.serviceNotesModal.show();
    }
    closeServiceNotesModal() {
        const notesTestarea = <HTMLTextAreaElement>document.getElementById('notesTestareaId');
        this.serviceLogList[this.indexTemp].Notes__c = notesTestarea.value;
        this.serviceNotesModal.hide();
    }
    getServiceLog() {
        this.clientEditService.getServiceLog(this.clientId).subscribe(
            data => {
                this.serviceLogList = data['result'];
                this.serviceLogLength = this.serviceLogList.length;
                this.updateNotes = this.serviceLogList.Notes__c;
                if (this.updateNotes === 'null' || this.updateNotes === null) {
                    this.updateNotes = '';
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
    saveNote() {
        this.clientEditService.saveNotes(this.serviceId, this.clientId, this.updateNotes).subscribe(data => {
            this.saveNotes = data['result'];
            this.getServiceLog();
            this.toastr.success('Notes saved Successfully');
            this.serviceNotesModal.hide();
        },
        error => {
            const errStatus = JSON.parse(error['_body'])['status'];
            if (errStatus === '2085' || errStatus === '2071') {
                if (this.router.url !== '/') {
                    localStorage.setItem('page', this.router.url);
                    this.router.navigate(['/']).then(() => { });
                }
            }
        });
    }
    /**
     * Servicelog methods ends
     */
    getClassLog() {
        this.clientEditService.getClassLog(this.clientId).subscribe(
            data => {
                this.classLogList = data['result'];
                this.classLogLength = this.classLogList.length;
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
    commonSave() {
        for (let y = 0; y < this.clientMemberShipsData.length; y++) {
            if (this.clientMemberShipsData[y].Auto_Bill__c === true) {
                this.clientMemberShipsData[y].Auto_Bill__c = 1;
            } else if (this.clientMemberShipsData[y].Auto_Bill__c === false) {
                this.clientMemberShipsData[y].Auto_Bill__c = 0;
            }
        }
        const copyRecordForRewards = [];
        this.rewardData.filter((obj) => {
            const rewardObj = Object.assign({}, obj);
            copyRecordForRewards.push(rewardObj);
        });
        if (this.rewardData && this.rewardData.length > 0) {
            for (let i = 0; i < this.rewardData.length; i++) {
                if (this.rewardData[i].hasOwnProperty('adjustPoints')) {
                    let points = copyRecordForRewards[i].Points_c;
                    if ((/^-?\d+$/).test(this.rewardData[i].adjustPoints)) {
                        if (+this.rewardData[i].adjustPoints > 999999) {
                            this.error = 'Adjust Points must be less than 1000000';
                        } else {
                            points = points + (+this.rewardData[i].adjustPoints);
                            if (points < 0) {
                                this.error = 'Rewards Adjust Points cannot adjust the point balance below zero';
                            } else {
                                copyRecordForRewards[i].adjustPoints = points;
                            }
                        }
                    } else {
                        this.error = 'Only a whole number may be entered';
                    }
                }
            }
        }
        if (!(/^[\d]{1,10}(\.[\d]{1,2})?$/).test(this.startingBalance.toString())) {
            this.error = 'Starting Balance must be less than 9999999999.99';
        }
        const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (this.clientInfoFirstName === 'undefined' || this.clientInfoFirstName === undefined ||
            this.clientInfoFirstName === '') {
            this.clientInfoError1 = 'Client info first name cannot be blank';
            window.scrollTo(0, 0);
        } else if (this.clientInfoLastName === 'undefined' || this.clientInfoLastName === undefined ||
            this.clientInfoLastName === '') {
            this.clientInfoError2 = 'Client info last name cannot be blank';
            window.scrollTo(0, 0);
        } else if (this.clientInfoMobilePhone === 'undefined' || this.clientInfoMobilePhone === undefined ||
            this.clientInfoMobilePhone === '' || this.clientInfoMobilePhone === null || this.clientInfoMobilePhone === 'null') {
            this.clientInfoError3 = 'Client info mobile phone cannot be blank';
            window.scrollTo(0, 0);
        } else if (this.clientInfoEmail === 'undefined' || this.clientInfoEmail === undefined ||
            this.clientInfoEmail === '') {
            this.clientInfoError4 = 'Client info primary email cannot be blank';
            window.scrollTo(0, 0);
        } else if (this.clientInfoEmail !== '' && !EMAIL_REGEXP.test(this.clientInfoEmail)) {
            this.clientInfoError5 = 'Enter valid primary email in client info';
            window.scrollTo(0, 0);
        } else if ((this.reminderSecondaryEmail === 1 || this.reminderSecondaryEmail === '1')
            && (this.clientInfoSecondaryEmail === undefined || this.clientInfoSecondaryEmail === 'undefined' ||
                this.clientInfoSecondaryEmail === '')) {
            this.clientInfoError6 = 'Secondary Email is required when used as a Preference';
            window.scrollTo(0, 0);
        } else if ((this.clientMemberShipsData && this.clientMemberShipsData.length > 0)
            && (this.clientMemberShipId === '' || this.clientMemberShipId === undefined || this.clientMemberShipId === 'undefinded')) {
            this.clientInfoError7 = 'Membership ID is required';
            window.scrollTo(0, 0);
        } else if (((this.marketingMobilePhone === true || this.marketingMobilePhone === 1) ||
            (this.notificationMobilePhone === true || this.notificationMobilePhone === 1) ||
            (this.reminderMobilePhone === true || this.reminderMobilePhone === 1)) && (this.mobileCarrierName === '')) {
            this.clientInfoError8 = 'Mobile Carrier is required when Mobile Phone is used as a Preference';
            window.scrollTo(0, 0);
        } else if (this.error !== '') {
            window.scrollTo(0, 0);
        } else if (this.clientInfoError1 === '' || this.clientInfoError2 === '' || this.clientInfoError3 === '' ||
            this.clientInfoError4 === '' || this.clientInfoError5 === '' || this.clientInfoError6 === '' || this.clientInfoError7 === '') {
            if (this.ReferedAFriendProspect === true || this.ReferedAFriendProspect === 1) {
                this.ReferedAFriendProspect = 1;
            } else {
                this.ReferedAFriendProspect = 0;
            }
            if (this.marketingOptOut === true || this.marketingOptOut === 1) {
                this.marketingOptOut = 1;
            } else {
                this.marketingOptOut = 0;
            }
            if (this.marketingMobilePhone === true || this.marketingMobilePhone === 1) {
                this.marketingMobilePhone = 1;
            } else {
                this.marketingMobilePhone = 0;
            } if (this.marketingPrimaryEmail === true || this.marketingPrimaryEmail === 1) {
                this.marketingPrimaryEmail = 1;
            } else {
                this.marketingPrimaryEmail = 0;
            } if (this.marketingSecondaryEmail === true || this.marketingSecondaryEmail === 1) {
                this.marketingSecondaryEmail = 1;
            } else {
                this.marketingSecondaryEmail = 0;
            } if (this.notificationMobilePhone === true || this.notificationMobilePhone === 1) {
                this.notificationMobilePhone = 1;
            } else {
                this.notificationMobilePhone = 0;
            } if (this.notificationOptOut === true || this.notificationOptOut === 1) {
                this.notificationOptOut = 1;
            } else {
                this.notificationOptOut = 0;
            } if (this.notificationPrimaryEmail === true || this.notificationPrimaryEmail === 1) {
                this.notificationPrimaryEmail = 1;
            } else {
                this.notificationPrimaryEmail = 0;
            } if (this.notificationSecondaryEmail === true || this.notificationSecondaryEmail === 1) {
                this.notificationSecondaryEmail = 1;
            } else {
                this.notificationSecondaryEmail = 0;
            } if (this.reminderOptOut === true || this.reminderOptOut === 1) {
                this.reminderOptOut = 1;
            } else {
                this.reminderOptOut = 0;
            } if (this.reminderMobilePhone === true || this.reminderMobilePhone === 1) {
                this.reminderMobilePhone = 1;
            } else {
                this.reminderMobilePhone = 0;
            } if (this.reminderPrimaryEmail === true || this.reminderPrimaryEmail === 1) {
                this.reminderPrimaryEmail = 1;
            } else {
                this.reminderPrimaryEmail = 0;
            } if (this.reminderSecondaryEmail === true || this.reminderSecondaryEmail === 1) {
                this.reminderSecondaryEmail = 1;
            } else {
                this.reminderSecondaryEmail = 0;
            } if (this.noEmailAppt === true || this.noEmailAppt === 1) {
                this.noEmailAppt = 1;
            } else {
                this.noEmailAppt = 0;
            } if (this.accoutChargeBalance === true || this.accoutChargeBalance === 1) {
                this.accoutChargeBalance = 1;
            } else {
                this.accoutChargeBalance = 0;
            } if (this.depositRequired === true || this.depositRequired === 1) {
                this.depositRequired = 1;
            } else {
                this.depositRequired = 0;
            } if (this.persistanceNoShow === true || this.persistanceNoShow === 1) {
                this.persistanceNoShow = 1;
            } else {
                this.persistanceNoShow = 0;
            } if (this.other === true || this.other === 1) {
                this.other = 1;
            } else {
                this.other = 0;
            } if (this.allowOnlineBooking === true || this.allowOnlineBooking === 1) {
                this.allowOnlineBooking = 1;
            } else {
                this.allowOnlineBooking = 0;
            } if (this.hasStandingAppt === true || this.hasStandingAppt === 1) {
                this.hasStandingAppt = 1;
            } else {
                this.hasStandingAppt = 0;
            } if (this.activeRewards === true || this.activeRewards === 1) {
                this.activeRewards = 1;
            } else {
                this.activeRewards = 0;
            }
            if (this.noEmail === true || this.noEmail === 1) {
                this.noEmail = 1;
            } else {
                this.noEmail = 0;
            }
            if (this.clientInfoActive === true || this.clientInfoActive === 1) {
                this.clientInfoActive = 1;
            } else {
                this.clientInfoActive = 0;
            }
            // alert(this.selectedFlags);
            if (this.selectedFlags) {
                this.selectedFlags = this.selectedFlags.join(';');
            } if (this.referClientId) {
                this.referedOnDate = new Date();
            }
            this.clientObj = {
                'clientInfoActive': this.clientInfoActive,
                'clientInfoFirstName': this.clientInfoFirstName,
                'clientInfoMiddleName': this.clientInfoMiddleName,
                'clientInfoLastName': this.clientInfoLastName,
                'clientInfoMailingStreet': this.clientInfoMailingStreet,
                'clientInfoMailingCountry': this.country,
                'clientInfoPostalCode': this.clientInfoPostalCode,
                'clientInfoMailingCity': this.clientInfoMailingCity,
                'clientInfoMailingState': this.state,
                'clientInfoPrimaryPhone': this.clientInfoPrimaryPhone,
                'clientInfoMobilePhone': this.clientInfoMobilePhone,
                'clientInfoPrimaryMail': this.clientInfoEmail,
                'clientInfoSecondaryEmail': this.clientInfoSecondaryEmail,
                'clientInfoEmergName': this.clientInfoEmergName,
                'clientInfoEmergPrimaryPhone': this.clientInfoEmergPrimaryPhone,
                'clientInfoEmergSecondaryPhone': this.clientInfoEmergSecondaryPhone,
                'clientInfoNoEmail': this.noEmail,
                'responsibleParty': this.infoClientName,
                // profile
                'gender': this.genderValue,
                'birthDay': this.birthDay,
                'birthMonth': this.birthMonth,
                'occupationvalue': this.occupationvalue,
                'birthYear': this.birthYear,
                'selectedFlags': this.selectedFlags,
                'notes': this.notes,
                'referredBy': this.referClientId,
                'clientPicture': this.clientPicture,
                'ReferedAFriendProspect': this.ReferedAFriendProspect,
                'referedOnDate': this.referedOnDate,
                // preferences
                'marketingOptOut': this.marketingOptOut,
                'marketingMobilePhone': this.marketingMobilePhone,
                'marketingPrimaryEmail': this.marketingPrimaryEmail,
                'marketingSecondaryEmail': this.marketingSecondaryEmail,
                'notificationMobilePhone': this.notificationMobilePhone,
                'notificationOptOut': this.notificationOptOut,
                'notificationPrimaryEmail': this.notificationPrimaryEmail,
                'notificationSecondaryEmail': this.notificationSecondaryEmail,
                'reminderOptOut': this.reminderOptOut,
                'reminderMobilePhone': this.reminderMobilePhone,
                'reminderPrimaryEmail': this.reminderPrimaryEmail,
                'reminderSecondaryEmail': this.reminderSecondaryEmail,
                'mobileCarrierName': this.mobileCarrierName,
                // appointments
                'noEmailAppt': this.noEmailAppt,
                'accoutChargeBalance': this.accoutChargeBalance,
                'depositRequired': this.depositRequired,
                'persistanceNoShow': this.persistanceNoShow,
                'other': this.other,
                'otherReason': this.otherReason,
                'apptNotes': this.apptNotes,
                'bookingFrequency': this.bookingFrequency,
                'allowOnlineBooking': this.allowOnlineBooking,
                'hasStandingAppt': this.hasStandingAppt,
                'pin': this.pin,
                'restrictionType': this.BRTypeValue,
                // Accounts
                'activeRewards': this.activeRewards,
                'isNewClient': this.isNewClient,
                'startingBalance': this.startingBalance,
                'clientMemberShipId': this.clientMemberShipId,
                'clientRewardsData': copyRecordForRewards,
                'creditCardToken': this.clientData.Credit_Card_Token__c,
                'tokenExpirationDate': this.clientData.Token_Expiration_Date__c,
                'PaymentType': this.clientData.Payment_Type_Token__c,
                'tokenPresent': this.clientData.Token_Present__c,
                'clientMemberShipsData': this.clientMemberShipsData
            };
            this.clientEditService.saveClient(this.clientId, this.clientObj, this.clientPictureFile).subscribe(
                data => {
                    const clientInfoDetails = data['result'];
                    this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_EDIT_SUCCESS');
                    this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                    if (this.saveAndBookAction === false) {
                        if (this.isNavigatedFromBookStanding) {
                            this.router.navigate(['/appointment/bookstandingappt/' + this.clientId]).then(() => { });
                        } else {
                            this.router.navigate(['/client']).then(() => { });
                        }
                    }
                }, error => {
                    const status = JSON.parse(error['status']);
                    const statuscode = JSON.parse(error['_body']).status;
                    switch (JSON.parse(error['_body']).status) {
                        case '2083':
                            this.clientInfoError7 = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                            window.scrollTo(0, 0);
                            break;
                    }
                    if (statuscode === '2085' || statuscode === '2071') {
                        if (this.router.url !== '/') {
                            localStorage.setItem('page', this.router.url);
                            this.router.navigate(['/']).then(() => { });
                        }
                    }
                });
        }
    }
    selectFile(fileEvent) {
        this.clientPictureFile = fileEvent.target.files[0];
        this.fileName = this.clientPictureFile.name;
        this.clientPictureFileView = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.clientPictureFile));
    }
    /**
     * Appointments starts
     */
    BRTypes() {
        this.clientEditService.getBRTypes().subscribe(
            data => {
                this.BRTypesData = data['apptBRTypes'];
                this.BRTypeValue = this.BRTypesData[0];
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

    ApptViews() {
        this.clientEditService.getApptViews().subscribe(
            data => {
                this.apptViewsData = data['apptViewsBy'];
                this.apptViewValue = this.apptViewsData[0];
                if (this.clientId) {
                    this.getClientAppointmemts();
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
    onChangeBRTypes(value) {
        this.BRTypeValue = value;
    }
    onChangeViews(value) {
        this.apptViewValue = value;
        if (this.clientId) {
            this.getClientAppointmemts();
        }
    }

    /**
     * Apointments ends
     */
    /**
    * Accounts tabs methods starts
    *
    */

    getClientRewards() {
        this.clientEditService.getClientRewardsData(this.clientId).subscribe(
            data => {
                this.rewardData = data['result'];
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
    getClientMemberships() {
        this.clientEditService.getClientMembershipsData(this.clientId).subscribe(
            data => {
                this.clientMemberShipsData = data['result'];
                for (let t = 0; t < this.clientMemberShipsData.length; t++) {
                    this.clientMemberShipsData[t].Next_Bill_Date__c = new Date(this.clientMemberShipsData[t].Next_Bill_Date__c);
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

    getClientAccounts() {
        this.clientEditService.getClientAccountsData(this.clientId).subscribe(
            data => {
                this.clientAccountsData = data['result'];
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
    getClientPackages() {
        this.clientEditService.getClientPackagesData(this.clientId).subscribe(
            data => {
                const cpData = data['result'];
                this.clientPackagesData = cpData.ClientPackageData;
                this.ClientServiceData = cpData.ServiceData;
                if (this.clientPackagesData) {
                    for (let j = 0; j < this.clientPackagesData.length; j++) {
                        const packageDetails = JSON.parse(this.clientPackagesData[j].Package_Details__c);
                        this.clientPackagesData[j]['serviceName'] = this.ClientServiceData[j]['ServiceName'];
                        for (let i = 0; i < packageDetails.length; i++) {
                            if (packageDetails[i].used == null) {
                                packageDetails[i].used = 0;
                            }
                            if (packageDetails[i].reps == null) {
                                packageDetails[i].reps = 0;
                            }
                            if (packageDetails[i].discountPriceEach == null) {
                                packageDetails[i].discountPriceEach = 0;
                            }
                            const unused1: any = packageDetails[i].reps - packageDetails[i].used;
                            const unused = unused1 + ' of ' + packageDetails[i].reps;
                            this.clientPackagesData[j]['unused'] = unused;
                            this.clientPackagesData[j]['unusedValue'] = parseInt(unused1, 10) * parseInt(packageDetails[i]['discountPriceEach'], 10);
                        }
                        this.totalUnUsedValue += this.clientPackagesData[j]['unusedValue'];
                    }
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
    showMergeClietPopUpModal() {
        this.mergeClientModal.show();
    }
    /**
     * Accounts tab methods ends
     */
    updateTabs(order: number) {
        for (let i = 0; i < this.activeTab2.length; i++) {
            if (i === order) {
                this.activeTab2[i] = true;
                this.activeTabClass[i] = 'active';
            } else {
                this.activeTab2[i] = false;
                this.activeTabClass[i] = '';
            }
        }
    }

    removeToken() {
        this.clientObj = {
            'clientInfoActive': this.clientData.Active__c,
            'clientInfoFirstName': this.clientData.FirstName,
            'clientInfoMiddleName': this.clientData.MiddleName,
            'clientInfoLastName': this.clientData.LastName,
            'clientInfoMailingStreet': this.clientData.MailingStreet,
            'clientInfoMailingCountry': this.clientData.MailingCountry,
            'clientInfoPostalCode': this.clientData.MailingPostalCode,
            'clientInfoMailingCity': this.clientData.MailingCity,
            'clientInfoMailingState': this.clientData.MailingState,
            'clientInfoPrimaryPhone': this.clientData.Phone,
            'clientInfoMobilePhone': this.clientData.MobilePhone,
            'clientInfoPrimaryMail': this.clientData.Email,
            'clientInfoSecondaryEmail': this.clientData.Secondary_Email__c,
            'clientInfoEmergName': this.clientData.Emergency_Name__c,
            'clientInfoEmergPrimaryPhone': this.clientData.Emergency_Primary_Phone__c,
            'clientInfoEmergSecondaryPhone': this.clientData.Emergency_Secondary_Phone__c,
            'clientInfoNoEmail': this.clientData.No_Email__c,
            'responsibleParty': this.clientData.Responsible_Party__c,
            // profile
            'gender': this.clientData.Gender__c,
            'birthDay': this.clientData.BirthDateNumber__c,
            'birthMonth': this.clientData.BirthMonthNumber__c,
            'occupationvalue': this.clientData.Title,
            'birthYear': this.clientData.BirthYearNumber__c,
            'selectedFlags': this.clientData.Client_Flag__c,
            'notes': this.clientData.Notes__c,
            'referredBy': this.referClientId,
            'clientPicture': this.clientPicture,
            'ReferedAFriendProspect': this.clientData.Refer_A_Friend_Prospect__c,
            'referedOnDate': this.clientData.Referred_On_Date__c,
            // preferences
            'marketingOptOut': this.clientData.Marketing_Opt_Out__c,
            'marketingMobilePhone': this.clientData.Marketing_Mobile_Phone__c,
            'marketingPrimaryEmail': this.clientData.Marketing_Primary_Email__c,
            'marketingSecondaryEmail': this.clientData.Marketing_Secondary_Email__c,
            'notificationMobilePhone': this.clientData.Notification_Mobile_Phone__c,
            'notificationOptOut': this.clientData.Notification_Opt_Out__c,
            'notificationPrimaryEmail': this.clientData.Notification_Primary_Email__c,
            'notificationSecondaryEmail': this.clientData.Notification_Secondary_Email__c,
            'reminderOptOut': this.clientData.Reminder_Opt_Out__c,
            'reminderMobilePhone': this.clientData.Reminder_Mobile_Phone__c,
            'reminderPrimaryEmail': this.clientData.Reminder_Primary_Email__c,
            'reminderSecondaryEmail': this.clientData.Reminder_Secondary_Email__c,
            'mobileCarrierName': this.clientData.Mobile_Carrier__c,
            // appointments
            'noEmailAppt': this.clientData.BR_Reason_No_Email__c,
            'accoutChargeBalance': this.clientData.BR_Reason_Account_Charge_Balance__c,
            'depositRequired': this.clientData.BR_Reason_Deposit_Required__c,
            'persistanceNoShow': this.clientData.BR_Reason_No_Show__c,
            'other': this.clientData.BR_Reason_Other__c,
            'otherReason': this.clientData.Booking_Restriction_Note__c,
            'apptNotes': this.clientData.BR_Reason_Other_Note__c,
            'bookingFrequency': this.clientData.Booking_Frequency__c,
            'allowOnlineBooking': this.clientData.Allow_Online_Booking__c,
            'hasStandingAppt': this.clientData.Has_Standing_Appts__c,
            'pin': this.clientData.Pin__c,
            'restrictionType': this.clientData.Booking_Restriction_Type__c,
            // Accounts
            'activeRewards': this.clientData.Active_Rewards__c,
            'isNewClient': this.isNewClient,
            'startingBalance': this.clientData.Starting_Balance__c,
            'clientMemberShipId': this.clientData.Membership_ID__c,
            'clientRewardsData': this.rewardData,
            'creditCardToken': 'token deleted',
            'tokenExpirationDate': '',
            'PaymentType': '',
            'tokenPresent': 0
        };
        this.clientEditService.saveClient(this.clientId, this.clientObj, this.clientPictureFile).subscribe(
            data => {
                const clientInfoDetails = data['result'];
                this.getClientData(this.clientId);
            },
            error => {
                const errStatus = JSON.parse(error['_body'])['status'];
                if (errStatus === '2085' || errStatus === '2071') {
                    if (this.router.url !== '/') {
                        localStorage.setItem('page', this.router.url);
                        this.router.navigate(['/']).then(() => { });
                    }
                }
            });

    }

    imageErrorHandler(event) {
        event.target.src = '/assets/images/no-preview.png';
    }

    IsAlphaNumeric(e, feildName: string) {

        const value = e.target.value;
        let ret: boolean;

        const code = e.keyCode === 0 ? e.charCode : e.keyCode;
        let commonCondition: boolean = (code >= 48 && code <= 57) || (code === 8) || code >= 37 && code <= 40;
        if (feildName === 'startingbalance') {
            commonCondition = code === 46 || commonCondition;
        }
        if (commonCondition) { // check digits
            ret = true;
        } else {
            ret = false;
        }
        this.clearmessage();
        return ret;
    }

    clearErrForRewards() {
        this.error = '';
    }
}
