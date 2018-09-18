import { Component, OnInit, Inject, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { SetupCompanyhrsService } from './setupcompanyhrs.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { componentFactoryName } from '@angular/compiler';
// import { BsDatepickerComponent } from 'ngx-bootstrap/datepicker/bs-datepicker.component';
import { validateConfig } from '@angular/router/src/config';
import { CommonService } from '../../../common/common.service';
import { JwtHelper } from 'angular2-jwt';

@Component({
    selector: 'app-setupcompanyhours-popup',
    templateUrl: './setupcompanyhours.html',
    styleUrls: ['./setupcompanyhours.component.css'],
    providers: [SetupCompanyhrsService, CommonService]
})
export class SetupCompanyHoursComponent implements OnInit {
    minDate: Date;
    dateFormat: any;
    dublicateError: any;
    description: any;
    timeZone: any;
    active: any = true;
    companyHourse: any = false;
    dataObject: any;
    toastermessage: any;
    times: any;
    disablediv: any;
    getCustomLists: any;
    getCustomList: any;
    getCompanyList: any;
    sun_start: any;
    mon_start: any;
    tue_start: any;
    wed_start: any;
    thur_start: any = '';
    fri_start: any = '';
    sat_start: any = '';
    sun_end: any = '';
    mon_end: any = '';
    tue_end: any = '';
    wed_end: any = '';
    thur_end: any = '';
    fri_end: any = '';
    sat_end: any = '';
    newAdd: any;
    customInsert: any;
    eddData: any = false;
    compy1: any;
    companyId: any;
    active1: any;
    mask: any;
    getTimezones: any;
    customTable: any = false;
    listTable: any = true;
    errorDescriptions: any;
    addData: any = false;
    errorDescription: any;
    errorTimezone: any;
    errorRequirdactive: any;
    errorTime: any;
    errorCustomTime: any;
    editCustomInsert: any;
    errorCustomTimeformat: any;
    errorDate: any;
    errorCustomTimeHrs: any;
    errorCustomTimeHrs1: any;
    CustomErrorHrs: any;
    imageErrorTime: any;
    customAllDay1: any;
    bsValue: any;
    customEnd: any;
    customStart: any;
    customAllDay: any = false;
    customDate: any;
    customDescription: any;
    customId: any;
    customIds: any;
    datePickerConfig: any;
    paramsId: any;
    isDisableDefault = false;
    decodedToken: any;
    constructor(private SetupCompanyhrsServices: SetupCompanyhrsService,
        private cdRef: ChangeDetectorRef,
        @Inject('apiEndPoint') public apiEndPoint: string,
        @Inject('defaultCountry') public defaultCountry: string,
        private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService,
        private translateService: TranslateService,
        private sanitizer: DomSanitizer,
        private commonService: CommonService) {
        this.minDate = new Date();
        this.datePickerConfig = Object.assign({},
            {
                showWeekNumbers: false,
                containerClass: 'theme-blue',
            });
        this.route.queryParams.subscribe(params => {
            this.paramsId = route.snapshot.params['id'];
        });
    }
    ngOnInit() {
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
        this.getCustomList = false;
        this.customInsert = false;
        this.customTable = false;
        this.editCustomInsert = false;
        //  this.eddData = false;
        this.addData = false;
        this.showData();
        this.ListingTimeZones();
    }
    navigateToEdit() {
        if (this.router.url.match(/setup\/company\/hours\//g)) {
            this.eddData = true;
            this.listTable = false;
            this.getCompanyList.filter((obj) => {
                if (obj.Id === this.paramsId) {
                    this.editRecord(obj);
                }
            });
        } else {
            this.eddData = false;
            this.listTable = true;
        }
    }
    addCompanyHrs() {
        if (this.companyHourse === true) {
            this.compy1 = 1;
        } if (this.companyHourse === false) {
            this.compy1 = 0;
        }
        if (this.active === true) {
            this.active1 = 1;
        } if (this.active === false) {
            this.active1 = 0;
        }
        const TIME_REGEXP = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9][ ][AP][M]$/;
        if (this.description === undefined || this.description === '') {
            this.errorDescription = 'SETUP_COMPANY_HOURSE.VALID_NOBLANK_DESCRIPTION_FIELD';
        } else if (this.timeZone === undefined || this.timeZone === '') {
            this.errorTimezone = 'SETUP_COMPANY_HOURSE.VALID_NOBLANK_TIME_ZONE';
        } else if (this.companyHourse === true && this.active === false) {
            this.errorRequirdactive = 'SETUP_COMPANY_HOURSE.VALID_CHECKBOX_ACTIVE';
        } else if ((this.sun_start !== '' && this.sun_end === '') || (this.sun_end !== '' && this.sun_start === '')) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_SUNDAY_START_TIMES_END_TIMES_NOBLANK';
        } else if ((this.mon_start !== '' && this.mon_end === '') || (this.mon_end !== '' && this.mon_start === '')) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_MONDAY_START_TIMES_END_TIMES_NOBLANK';
        } else if ((this.tue_start !== '' && this.tue_end === '') || (this.tue_end !== '' && this.tue_start === '')) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_TUESDAY_START_TIMES_END_TIMES_NOBLANK';
        } else if ((this.wed_start !== '' && this.wed_end === '') || (this.wed_end !== '' && this.wed_start === '')) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_WEDNESDAY_START_TIMES_END_TIMES_NOBLANK';
        } else if ((this.thur_start !== '' && this.thur_end === '') || (this.thur_end !== '' && this.thur_start === '')) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_THURSDAY_START_TIMES_END_TIMES_NOBLANK';
        } else if ((this.fri_start !== '' && this.fri_end === '') || (this.fri_end !== '' && this.fri_start === '')) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_FRIDAY_START_TIMES_END_TIMES_NOBLANK';
        } else if ((this.sat_start !== '' && this.sat_end === '') || (this.sat_end !== '' && this.sat_start === '')) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_SATURDAY_START_TIMES_END_TIMES_NOBLANK';
        } else if (this.sun_start !== '' && !TIME_REGEXP.test(this.sun_start)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_SUNDAY_TIME_FORMAT';
        } else if (this.sun_end !== '' && !TIME_REGEXP.test(this.sun_end)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_SUNDAY_TIME_FORMAT';
        } else if (this.mon_start !== '' && !TIME_REGEXP.test(this.mon_start)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_MONDAY_TIME_FORMAT';
        } else if (this.mon_end !== '' && !TIME_REGEXP.test(this.mon_end)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_MONDAY_TIME_FORMAT';
        } else if (this.tue_start !== '' && !TIME_REGEXP.test(this.tue_start)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_TUESDAY_TIME_FORMAT';
        } else if (this.tue_end !== '' && !TIME_REGEXP.test(this.tue_end)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_TUESDAY_TIME_FORMAT';
        } else if (this.wed_start !== '' && !TIME_REGEXP.test(this.wed_start)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_WEDNESDAY_TIME_FORMAT';
        } else if (this.wed_end !== '' && !TIME_REGEXP.test(this.wed_end)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_WEDNESDAY_TIME_FORMAT';
        } else if (this.thur_start !== '' && !TIME_REGEXP.test(this.thur_start)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_THURSDAY_TIME_FORMAT';
        } else if (this.thur_end !== '' && !TIME_REGEXP.test(this.thur_end)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_THURSDAY_TIME_FORMAT';
        } else if (this.fri_start !== '' && !TIME_REGEXP.test(this.fri_start)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_FRIDAY_TIME_FORMAT';
        } else if (this.fri_end !== '' && !TIME_REGEXP.test(this.fri_end)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_FRIDAY_TIME_FORMAT';
        } else if (this.sat_start !== '' && !TIME_REGEXP.test(this.sat_start)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_SATURDAY_TIME_FORMAT';
        } else if (this.sat_end !== '' && !TIME_REGEXP.test(this.sat_end)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_SATURDAY_TIME_FORMAT';
        } else {
            this.dataObject = {
                'description': this.description,
                'timeZone': this.timeZone,
                'active': this.active1,
                'companyHourse': this.compy1,
                'times': this.times,

                'sun_start': this.sun_start.toUpperCase(),
                'sun_end': this.sun_end.toUpperCase(),

                'mon_start': this.mon_start.toUpperCase(),
                'mon_end': this.mon_end.toUpperCase(),

                'tue_start': this.tue_start.toUpperCase(),
                'tue_end': this.tue_end.toUpperCase(),

                'wed_start': this.wed_start.toUpperCase(),
                'wed_end': this.wed_end.toUpperCase(),

                'thur_start': this.thur_start.toUpperCase(),
                'thur_end': this.thur_end.toUpperCase(),

                'fri_start': this.fri_start.toUpperCase(),
                'fri_end': this.fri_end.toUpperCase(),

                'sat_start': this.sat_start.toUpperCase(),
                'sat_end': this.sat_end.toUpperCase(),
            };
            this.SetupCompanyhrsServices.createSetupCompanyhrsData(this.dataObject)
                .subscribe(
                    data => {
                        this.router.navigate(['/setup/company/hours']).then(() => {
                            this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_SUCCESS');
                            this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                        });
                        this.listTable = true;
                        this.customInsert = false;
                        this.getCustomList = false;
                        this.customTable = false;
                        this.editCustomInsert = false;
                        this.eddData = false;
                        this.addData = false;
                        this.ngOnInit();
                    },
                    error => {
                        const status = JSON.parse(error['status']);
                        const statuscode = JSON.parse(error['_body']).status;
                        switch (JSON.parse(error['_body']).status) {
                            case '2062':
                                this.imageErrorTime = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                break;
                            case '2063':
                                this.imageErrorTime = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                break;
                            case '2064':
                                this.imageErrorTime = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                break;
                            case '2065':
                                this.imageErrorTime = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                break;
                            case '2066':
                                this.imageErrorTime = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                break;
                            case '2067':
                                this.imageErrorTime = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                break;
                            case '2068':
                                this.imageErrorTime = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                break;
                            case '2079':
                                this.dublicateError = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
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

    showData() {
        this.SetupCompanyhrsServices.getCompanyLists().subscribe(
            data => {
                this.getCompanyList = data['result'];
                this.navigateToEdit();
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
    newbutton() {
        this.listTable = false;
        this.customTable = false;
        this.addData = true;
        this.description = '';
        this.timeZone = '';
        this.sun_start = '9:00 AM';
        this.sun_end = '5:00 PM';
        this.mon_start = '9:00 AM';
        this.mon_end = '5:00 PM';
        this.tue_start = '9:00 AM';
        this.tue_end = '5:00 PM';
        this.wed_start = '9:00 AM';
        this.wed_end = '5:00 PM';
        this.thur_start = '9:00 AM';
        this.thur_end = '5:00 PM';
        this.fri_start = '9:00 AM';
        this.fri_end = '5:00 PM';
        this.sat_start = '9:00 AM';
        this.sat_end = '5:00 PM';
    }
    editRecord(Id) {
        this.eddData = true;
        this.customTable = true;
        this.addData = false;
        this.listTable = false;
        this.getCustomList = false;
        this.customInsert = false;
        this.editCustomInsert = false;
        this.companyId = Id.Id;
        this.description = Id.Name;
        this.timeZone = Id.TimeZoneSidKey__c;
        if (Id.isActive__c === 1 && Id.isDefault__c === 1) {
            this.isDisableDefault = true;
        }
        this.active = Id.isActive__c === 1 ? true : false;
        this.companyHourse = Id.isDefault__c === 1 ? true : false;

        this.sun_start = Id.SundayStartTime__c;
        this.sun_end = Id.SundayEndTime__c;

        this.mon_start = Id.MondayStartTime__c,
            this.mon_end = Id.MondayEndTime__c,

            this.tue_start = Id.TuesdayStartTime__c;
        this.tue_end = Id.TuesdayEndTime__c;

        this.wed_start = Id.WednesdayStartTime__c;
        this.wed_end = Id.WednesdayEndTime__c;

        this.thur_start = Id.ThursdayStartTime__c;
        this.thur_end = Id.ThursdayEndTime__c;

        this.fri_start = Id.FridayStartTime__c;
        this.fri_end = Id.FridayEndTime__c,

            this.sat_start = Id.SaturdayStartTime__c;
        this.sat_end = Id.SaturdayEndTime__c;
        this.router.navigate(['setup/company/hours/' + Id.Id]);
        this.SetupCompanyhrsServices.getCompanyCustomhours(this.companyId).subscribe(
            data => {
                this.getCustomLists = data['result'];
                // const displayName = document.getElementById('displayNameId');
                // displayName.innerHTML = 'Setup company Hours' ;
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
    editCompanyHrs() {
        if (this.companyHourse === true) {
            this.compy1 = 1;
        } if (this.companyHourse === false) {
            this.compy1 = 0;
        }
        if (this.active === true) {
            this.active1 = 1;
        } if (this.active === false) {
            this.active1 = 0;
        }

        const TIME_REGEXP = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9][ ][AP][M]$/;
        if (this.description === undefined || this.description === '') {
            this.errorDescription = 'SETUP_COMPANY_HOURSE.VALID_NOBLANK_DESCRIPTION_FIELD';
        } else if (this.timeZone === undefined || this.timeZone === '') {
            this.errorTimezone = 'SETUP_COMPANY_HOURSE.VALID_NOBLANK_TIME_ZONE';
        } else if (this.companyHourse === true && this.active === false) {
            this.errorRequirdactive = 'SETUP_COMPANY_HOURSE.VALID_CHECKBOX_ACTIVE';
        } else if ((this.sun_start !== '' && this.sun_end === '') || (this.sun_end !== '' && this.sun_start === '')) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_SUNDAY_START_TIMES_END_TIMES_NOBLANK';
        } else if ((this.mon_start !== '' && this.mon_end === '') || (this.mon_end !== '' && this.mon_start === '')) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_MONDAY_START_TIMES_END_TIMES_NOBLANK';
        } else if ((this.tue_start !== '' && this.tue_end === '') || (this.tue_end !== '' && this.tue_start === '')) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_TUESDAY_START_TIMES_END_TIMES_NOBLANK';
        } else if ((this.wed_start !== '' && this.wed_end === '') || (this.wed_end !== '' && this.wed_start === '')) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_WEDNESDAY_START_TIMES_END_TIMES_NOBLANK';
        } else if ((this.thur_start !== '' && this.thur_end === '') || (this.thur_end !== '' && this.thur_start === '')) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_THURSDAY_START_TIMES_END_TIMES_NOBLANK';
        } else if ((this.fri_start !== '' && this.fri_end === '') || (this.fri_end !== '' && this.fri_start === '')) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_FRIDAY_START_TIMES_END_TIMES_NOBLANK';
        } else if ((this.sat_start !== '' && this.sat_end === '') || (this.sat_end !== '' && this.sat_start === '')) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_SATURDAY_START_TIMES_END_TIMES_NOBLANK';
        } else if (this.sun_start !== '' && !TIME_REGEXP.test(this.sun_start)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_SUNDAY_TIME_FORMAT';
        } else if (this.sun_end !== '' && !TIME_REGEXP.test(this.sun_end)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_SUNDAY_TIME_FORMAT';
        } else if (this.mon_start !== '' && !TIME_REGEXP.test(this.mon_start)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_MONDAY_TIME_FORMAT';
        } else if (this.mon_end !== '' && !TIME_REGEXP.test(this.mon_end)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_MONDAY_TIME_FORMAT';
        } else if (this.tue_start !== '' && !TIME_REGEXP.test(this.tue_start)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_TUESDAY_TIME_FORMAT';
        } else if (this.tue_end !== '' && !TIME_REGEXP.test(this.tue_end)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_TUESDAY_TIME_FORMAT';
        } else if (this.wed_start !== '' && !TIME_REGEXP.test(this.wed_start)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_WEDNESDAY_TIME_FORMAT';
        } else if (this.wed_end !== '' && !TIME_REGEXP.test(this.wed_end)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_WEDNESDAY_TIME_FORMAT';
        } else if (this.thur_start !== '' && !TIME_REGEXP.test(this.thur_start)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_THURSDAY_TIME_FORMAT';
        } else if (this.thur_end !== '' && !TIME_REGEXP.test(this.thur_end)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_THURSDAY_TIME_FORMAT';
        } else if (this.fri_start !== '' && !TIME_REGEXP.test(this.fri_start)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_FRIDAY_TIME_FORMAT';
        } else if (this.fri_end !== '' && !TIME_REGEXP.test(this.fri_end)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_FRIDAY_TIME_FORMAT';
        } else if (this.sat_start !== '' && !TIME_REGEXP.test(this.sat_start)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_SATURDAY_TIME_FORMAT';
        } else if (this.sat_end !== '' && !TIME_REGEXP.test(this.sat_end)) {
            this.errorTime = 'SETUP_COMPANY_HOURSE.VALID_SATURDAY_TIME_FORMAT';
        } else {
            const dataObjects = {
                'id': this.companyId,
                'description': this.description,
                'timeZone': this.timeZone,
                'active': this.active1,
                'companyHourse': this.compy1,
                'times': this.times,

                'sun_start': this.sun_start,
                'sun_end': this.sun_end,

                'mon_start': this.mon_start,
                'mon_end': this.mon_end,

                'tue_start': this.tue_start,
                'tue_end': this.tue_end,

                'wed_start': this.wed_start,
                'wed_end': this.wed_end,

                'thur_start': this.thur_start,
                'thur_end': this.thur_end,

                'fri_start': this.fri_start,
                'fri_end': this.fri_end,

                'sat_start': this.sat_start,
                'sat_end': this.sat_end,
            };
            this.SetupCompanyhrsServices.editCompany(this.companyId, dataObjects)
                .subscribe(
                    data => {
                        this.router.navigate(['/setup/company/hours']).then(() => {
                            this.toastr.success('Record updated Successfully', null, { timeOut: 1500 });
                            window.scrollTo(0, 0);
                        });
                        this.listTable = true;
                        this.customInsert = false;
                        this.getCustomList = false;
                        this.customTable = false;
                        this.editCustomInsert = false;
                        this.eddData = false;
                        this.addData = false;
                        this.ngOnInit();
                    },
                    error => {
                        const status = JSON.parse(error['status']);
                        const statuscode = JSON.parse(error['_body']).status;
                        switch (JSON.parse(error['_body']).status) {
                            case '2062':
                                this.imageErrorTime = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                break;
                            case '2063':
                                this.imageErrorTime = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                break;
                            case '2064':
                                this.imageErrorTime = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                break;
                            case '2065':
                                this.imageErrorTime = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                break;
                            case '2066':
                                this.imageErrorTime = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                break;
                            case '2067':
                                this.imageErrorTime = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                break;
                            case '2068':
                                this.imageErrorTime = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                break;
                            case '2079':
                                this.dublicateError = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
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
    ListingTimeZones() {
        this.SetupCompanyhrsServices.timeZones().subscribe(
            data => {
                this.getTimezones = data['result'];
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
    cancel() {
        this.listTable = true;
        this.getCustomList = false;
        this.customInsert = false;
        this.customTable = false;
        this.editCustomInsert = false;
        this.eddData = false;
        this.addData = false;
        this.ngOnInit();
        this.clearDescName();
    }
    cancelCust() {
        this.editCustomInsert = false;
        this.customInsert = false;
    }
    cancelList() {
        this.ngOnInit();
    }
    clearErrMsgTime() {
        this.errorTime = '';
        this.imageErrorTime = '';
        this.dublicateError = '';
    }
    clearTimezone() {
        this.errorTimezone = '';
    }
    clearDescName() {
        this.errorDescription = '';
    }
    clearDublicateError() {
        this.dublicateError = '';
    }

    customAddNew() {
        this.listTable = false;
        this.addData = false;
        this.eddData = true;
        this.customTable = true;
        this.customInsert = true;
        this.editCustomInsert = false;
        this.getCustomList = false;
        this.customDescription = '';
        this.customDate = '';
        this.customAllDay = '';
        this.customEnd = '5:00 PM';
        this.customStart = '9:00 AM';
        this.errorDescriptions = '';
        this.errorDate = '';
        this.errorTime = '';
        this.errorCustomTime = '';
        this.errorCustomTimeHrs = '';
        this.errorCustomTimeHrs1 = '';
        this.errorCustomTimeformat = '';
    }
    customerCheck() {
        this.errorDescriptions = '';
        this.errorDate = '';
        this.errorTime = '';
        this.errorCustomTime = '';
        this.errorCustomTimeHrs = '';
        this.errorCustomTimeHrs1 = '';
        this.errorCustomTimeformat = '';
        this.CustomErrorHrs = '';
    }
    duplicateDate(date) {
        let result = false;
        this.getCustomLists.forEach(element => {
            if (element.Date__c === this.commonService.getDBDatTmStr(date).split(' ')[0]) {
                this.errorDate = 'Custom hour exist in same date';
                result = true;
            }
        });
        return result;
    }
    EditduplicateDate(date) {
        let result = false;
        if (date.toString() !== new Date(this.customDate).toString()) {
            this.getCustomLists.forEach(element => {
                if (this.bsValue !== date) {
                    if (element.Date__c === this.commonService.getDBDatTmStr(new Date(date)).split(' ')[0]) {
                        this.errorDate = 'Custom hour exist in same date';
                        result = true;
                    }
                }
            });
        }
        return result;
    }
    saveCustomhourse() {
        const TIME_REGEXP = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9][ ][AP][M]$/;
        if (this.customDescription === '' || this.customDescription === undefined) {
            this.errorDescriptions = 'SETUP_COMPANY_HOURSE.VALID_NOBLANK_DESCRIPTION_FIELD';
        } else if (isNaN(this.customDate) === true) {
            this.customDate = '';
            this.errorDate = 'SETUP_COMPANY_HOURSE.VALID_NOBLANK_DATE_FIELD';
        } else if (this.customDate === '' || this.customDate === undefined || this.customDate === null) {
            this.errorDate = 'SETUP_COMPANY_HOURSE.VALID_NOBLANK_DATE_FIELD';
        } else if (this.duplicateDate(this.customDate)) {
            this.duplicateDate(this.customDate);
        } else if ((this.customStart !== undefined && this.customStart !== '') && (!TIME_REGEXP.test(this.customStart))) {
            this.errorCustomTimeformat = 'SETUP_COMPANY_HOURSE.VALID_START_TIME_FORMAT';
        } else if ((this.customEnd !== undefined && this.customEnd !== '') && (!TIME_REGEXP.test(this.customEnd))) {
            this.errorCustomTimeformat = 'SETUP_COMPANY_HOURSE.VALID_END_TIME_FORMAT';
        } else if ((this.customStart !== '' && this.customEnd === '') && (this.customStart === '' && this.customEnd !== '')) {
            this.errorCustomTimeformat = 'SETUP_COMPANY_HOURSE.VALID_START_TIMES_END_TIMES_NOBLANK';
        } else if ((this.customAllDay === false || this.customAllDay === '') && (this.customStart === '' || this.customEnd === '')) {
            this.errorCustomTimeHrs = 'SETUP_COMPANY_HOURSE.VALID_TIME_REQUIRED';
        } else if (this.customAllDay === true && (this.customStart !== '' && this.customEnd !== '')) {
            this.errorCustomTimeHrs1 = 'SETUP_COMPANY_HOURSE.EITHER_ALLDAY_OFF_OR_CUSTOMHOURS';
        } else {
            if (this.customAllDay === true) {
                this.customAllDay1 = 1;
            } if (this.customAllDay === false) {
                this.customAllDay1 = 0;
            }
            this.dataObject = {
                'companyHrsId': this.companyId,
                'description': this.customDescription,
                'customDate': this.commonService.getDBDatTmStr(this.customDate),
                'customAllDay': this.customAllDay1,
                'customEnd': this.customAllDay1 === 1 ? '' : this.customEnd,
                'customStart': this.customAllDay1 === 1 ? '' : this.customStart
            };
            this.SetupCompanyhrsServices.postCustomHours(this.dataObject)
                .subscribe(
                    data => {
                        this.router.navigate(['setup/company/hours']).then(() => {
                            this.toastr.success('Record Inserted Successfully', null, { timeOut: 1500 });
                        });
                        this.listTable = false;
                        this.customInsert = false;
                        this.getCustomList = false;
                        this.customTable = true;
                        this.editCustomInsert = false;
                        this.eddData = true;
                        this.addData = false;
                        this.SetupCompanyhrsServices.getCompanyCustomhours(this.companyId).subscribe(
                            data1 => {
                                this.getCustomLists = data1['result'];
                            },
                            error1 => {
                            }
                        );

                        //   this.ngOnInit();
                        //   this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.CUSTOM_HOURS_SUCCESSFULLY_SAVED');
                        //   this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                        window.scrollTo(0, 0);
                    },
                    error => {
                        const status = JSON.parse(error['status']);
                        const statuscode = JSON.parse(error['_body']).status;
                        switch (JSON.parse(error['_body']).status) {
                            case '2069':
                                this.CustomErrorHrs = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
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
    /*list edit custom hrs */
    CustomEdit(list) {
        this.customerCheck();
        this.addData = false;
        this.eddData = true;
        this.customTable = true;
        this.customInsert = false;
        this.editCustomInsert = true;
        this.customIds = list.Id;
        this.customDescription = list.Name;
        this.customDate = list.Date__c;
        this.bsValue = this.commonService.getDateFrmDBDateStr(this.customDate);
        if (list.All_Day_Off__c === 1) {
            this.customAllDay = true;
        } else {
            this.customAllDay = false;
        }

        this.customEnd = list.EndTime__c;
        this.customStart = list.StartTime__c;

    }
    /* edit custom   */
    customeEditRecord() {
        const TIME_REGEXP = /^([0-9]|0[0-9]|1[0-9]|2[0-3]):[0-5][0-9][ ][AP][M]$/;
        if (this.customDescription === '' || this.customDescription === undefined) {
            this.errorDescriptions = 'SETUP_COMPANY_HOURSE.VALID_NOBLANK_DESCRIPTION_FIELD';
            window.scrollTo(0, 0);
        } else if (this.bsValue === null || this.bsValue === '') {
            this.errorDate = 'SETUP_COMPANY_HOURSE.VALID_NOBLANK_DATE_FIELD';
            this.bsValue = '';
        } else if (this.EditduplicateDate(this.bsValue)) {
            this.EditduplicateDate(this.bsValue);
        } else if ((this.customStart !== undefined && this.customStart !== '') && (!TIME_REGEXP.test(this.customStart))) {
            this.errorCustomTimeformat = 'SETUP_COMPANY_HOURSE.VALID_START_TIME_FORMAT';
        } else if ((this.customEnd !== undefined && this.customEnd !== '') && (!TIME_REGEXP.test(this.customEnd))) {
            this.errorCustomTimeformat = 'SETUP_COMPANY_HOURSE.VALID_END_TIME_FORMAT';
        } else if ((this.customStart !== '' && this.customEnd === '') && (this.customStart === '' && this.customEnd !== '')) {
            this.errorCustomTimeformat = 'SETUP_COMPANY_HOURSE.VALID_START_TIMES_END_TIMES_NOBLANK';
        } else if (this.customAllDay === false && (this.customStart === '' || this.customEnd === '')) {
            this.errorCustomTimeHrs = 'SETUP_COMPANY_HOURSE.VALID_TIME_REQUIRED';
        } else if (this.customAllDay === true && (this.customStart !== '' && this.customEnd !== '')) {
            this.errorCustomTimeHrs1 = 'SETUP_COMPANY_HOURSE.EITHER_ALLDAY_OFF_OR_CUSTOMHOURS';
        } else {
            if (this.customAllDay === true) {
                this.customAllDay1 = 1;
            } if (this.customAllDay === false) {
                this.customAllDay1 = 0;
            }
            this.dataObject = {
                'companyHrsId': this.companyId,
                'customHrsId': this.customIds,
                'description': this.customDescription,
                'customDate': this.commonService.getDBDatTmStr(this.bsValue),
                'customAllDay': this.customAllDay1,
                'customEnd': this.customAllDay1 === 1 ? '' : this.customEnd,
                'customStart': this.customAllDay1 === 1 ? '' : this.customStart
            };
            this.SetupCompanyhrsServices.putCustomHours(this.dataObject)
                .subscribe(
                    data => {
                        this.router.navigate(['setup/company/hours']).then(() => {
                            this.toastr.success('Record updated Successfully', null, { timeOut: 1500 });
                        });
                        this.listTable = false;
                        this.customInsert = false;
                        this.getCustomList = false;
                        this.customTable = true;
                        this.editCustomInsert = false;
                        this.eddData = false;
                        this.addData = true;

                        this.SetupCompanyhrsServices.getCompanyCustomhours(this.companyId).subscribe(
                            data1 => {
                                this.getCustomLists = data1['result'];
                            },
                            error1 => {
                            }
                        );
                        //  this.ngOnInit();
                        //    this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.CUSTOM_HOURS_SUCCESSFULLY_SAVED');
                        //     this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                        window.scrollTo(0, 0);
                        this.customerCheck();
                    },
                    error => {
                        const status = JSON.parse(error['status']);
                        const statuscode = JSON.parse(error['_body']).status;
                        switch (JSON.parse(error['_body']).status) {
                            case '2069':
                                this.CustomErrorHrs = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
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

    /* delete custom hrs */
    CustomDelete(Id) {
        this.customId = Id;
        this.SetupCompanyhrsServices.deleteCustomHours(this.customId).subscribe(
            data => {
                this.router.navigate(['setup/company/hours']).then(() => {
                    this.toastr.error('Record deleted successfully', null, { timeOut: 1500 });
                });
                this.listTable = false;
                this.customInsert = false;
                this.getCustomList = false;
                this.customTable = true;
                this.editCustomInsert = false;
                this.eddData = false;
                this.addData = true;

                this.SetupCompanyhrsServices.getCompanyCustomhours(this.companyId).subscribe(
                    data1 => {
                        this.getCustomLists = data1['result'];
                    },
                    error1 => {
                        const errStatus = JSON.parse(error1['_body'])['status'];
                        if (errStatus === '2085' || errStatus === '2071') {
                            if (this.router.url !== '/') {
                                localStorage.setItem('page', this.router.url);
                                this.router.navigate(['/']).then(() => { });
                            }
                        }
                    }
                );
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
}
