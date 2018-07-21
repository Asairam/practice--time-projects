/*
ngOnInit() : Method to loading athe page..
searchClients() : Method for searching clients
showData() : Method for loading All clients Data.
clearmessage() : Method for Clearing  error messages.
*/
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ApptDetailService } from './appointmentdetail.service';
import { ToastrService } from 'ngx-toastr';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CommonService } from '../../common/common.service';
import { AppointmentsService } from '../main/appointments.service';
import { isNullOrUndefined } from 'util';
import { DatePipe } from '@angular/common';
import * as moment from 'moment/moment';
@Component({
    selector: 'app-appointments-popup',
    templateUrl: './appointmentdetail.html',
    styleUrls: ['./appointmentdetail.css'],
    providers: [ApptDetailService, CommonService, AppointmentsService]
})
export class ApptDetailComponent implements OnInit {
    apptid: any;
    clientid: any;
    pkgbooking: any = false;
    rebooked: any = false;
    newClient: any = false;
    stdingAppointment: any = false;
    apptStatus = [];
    currentdate: Date = new Date();
    isTodayAppt: boolean;
    isOpenAppt: boolean;
    clientPic = '';
    // apptStatusValue: any;
    visitTypesList: any;
    updateNotes: any = '';
    remEmailButtonValue = '';
    remTextButtonValue = '';
    aptDate = Date;
    bookingDataList: any;
    statusColor = { 'background-color': '' };
    rows: any = [];
    ticketserviceId: any;
    serviceNotes: any = '';
    indexTemp: any = 0;
    subSeaquentAppointment = '';
    subSeaquentAppointmentDate: any;
    nextservicename: any;
    packagesList = [];
    // visitTypeValue: any;
    apptData = {
        apstatus: '',
        apdate: '',
        mbphone: '',
        cltemail: '',
        Booked_Package__c: '',
        cltphone: '',
        notes: '',
        clientName: '',
        srvcname: '',
        netprice: '',
        duration: '',
        workerName: '',
        resource: '',
        visttype: null,
        rebook: 0,
        rebooked: 0,
        newclient: 0,
        clientpic: '',
        apptId: '',
        clientId: '',
        TicketServieId: '',
        pkgbooking: 0,
        standingappt: 0,
        creadate: '',
        lastmofdate: '',
        serviceNotes: '',
        No_Email__c: 0,
        isTicket__c: 0,
        Mobile_Carrier__c: '',
        Appt_Date_Time__c: '',
        Rebooked__c: 0,
        CreatedBy: '',
        LastModifiedBy: '',
        Current_Balance__c: ''
    };
    error = '';
    isModifyAllowed: boolean;
    isRebookAllowed: boolean;
    isRemainderEmailAllowed: boolean;
    isSaveAllowed: boolean;
    isCheckedInAllowed: boolean;
    isBookApptAllowed: boolean;
    actionMethod: any;
    @ViewChild('serviceNotesModal') public serviceNotesModal: ModalDirective;
    constructor(
        private activatedRoute: ActivatedRoute,
        private apptDetailService: ApptDetailService,
        private toastr: ToastrService,
        private commonService: CommonService,
        private appointmentsService: AppointmentsService,
        @Inject('apiEndPoint') private apiEndPoint: string,
        private router: Router) {
        this.activatedRoute.queryParams.subscribe(params => {
            this.apptid = activatedRoute.snapshot.params['apptid'];
            this.clientid = activatedRoute.snapshot.params['clientId'];
            this.actionMethod = params['actionMethod'];
        });
    }
    /*Method for page Load */
    ngOnInit() {
        this.listVisitTypes();
        // this.getApptDetails(this.apptid);
        this.getApptServiceDetails(this.clientid, this.apptid);
        this.getpackagesListing();
        // this.setStatusList();
    }
    setStatusList(apptStatus) {
        this.apptStatus = [];
        if (!apptStatus && apptStatus !== '') {
            this.apptStatus.push({ 'status': apptStatus });
        }
        if (apptStatus !== 'Called') {
            this.apptStatus.push({ 'status': 'Called' });
        }
        if (apptStatus !== 'Canceled') {
            this.apptStatus.push({ 'status': 'Canceled' });
        }
        if (apptStatus !== 'Conflicting') {
            this.apptStatus.push({ 'status': 'Conflicting' });
        }
        if (apptStatus !== 'Confirmed') {
            this.apptStatus.push({ 'status': 'Confirmed' });
        }
        if (apptStatus !== 'Booked') {
            this.apptStatus.push({ 'status': 'Booked' });
        }
        if (apptStatus !== 'Reminder Sent') {
            this.apptStatus.push({ 'status': 'Reminder Sent' });
        }
        if (apptStatus !== 'No Show') {
            this.apptStatus.push({ 'status': 'No Show' });
        }
        this.setStatusColor(apptStatus);
    }

    setStatusColor(apptStatus) {
        if (apptStatus === 'Called') {
            this.statusColor = { 'background-color': this.bookingDataList.calledStatusColor };
        } else if (apptStatus === 'Canceled') {
            this.statusColor = { 'background-color': this.bookingDataList.canceledStatusColor };
        } else if (apptStatus === 'Conflicting') {
            this.statusColor = { 'background-color': this.bookingDataList.conflictingStatusColor };
        } else if (apptStatus === 'Confirmed') {
            this.statusColor = { 'background-color': this.bookingDataList.confirmedStatusColor };
        } else if (apptStatus === 'Booked') {
            this.statusColor = { 'background-color': this.bookingDataList.bookedStatusColor };
        } else if (apptStatus === 'Checked In') {
            this.statusColor = { 'background-color': this.bookingDataList.checkedInStatusColor };
        } else if (apptStatus === 'Reminder Sent') {
            this.statusColor = { 'background-color': this.bookingDataList.reminderSentStatusColor };
        } else if (apptStatus === 'No Show') {
            this.statusColor = { 'background-color': this.bookingDataList.noShowStatusColor };
        } else if (apptStatus === 'Complete') {
            this.statusColor = { 'background-color': this.bookingDataList.completeStatusColor };
        }
    }
    sendReminder() {
        let serviceNames = '';
        for (let i = 0; i < this.rows.length; i++) {
            serviceNames += this.rows[i].Name + ', ';
        }
        const dataObj = {
            'clientFirstName': this.apptData.clientName.split(' ')[0],
            'clientLastName': this.apptData.clientName.split(' ')[1],
            'clientEmail': this.apptData.cltemail,
            'clientPhone' : this.apptData.cltphone,
            'aptDate': new DatePipe('en-Us').transform(this.apptData.Appt_Date_Time__c, 'MM/dd/yyyy hh:mm a'),
            'serviceNames': serviceNames.slice(0, -2),
            'status': 'Reminder Sent',
            'clientid': this.clientid,
            'apptid': this.apptid
        };
        this.apptDetailService.sendReminderToClient(dataObj, this.apptid).subscribe(
            data => {
                const dataStatus = data['result'];
                this.toastr.success('Send Reminder Email: Sent', null, { timeOut: 1500 });
                this.getApptServiceDetails(this.clientid, this.apptid);
            },
            error => {
                const status = JSON.parse(error['status']);
                const statuscode = JSON.parse(error['_body']).status;
                switch (status) {
                    case 500:
                        break;
                    case 400:
                        break;
                }
                if (statuscode === '2085' || statuscode === '2071') {
                    if (this.router.url !== '/') {
                        localStorage.setItem('page', this.router.url);
                        this.router.navigate(['/']).then(() => { });
                    }
                }
            }
        );
    }
    listVisitTypes() {
        this.apptDetailService.getVisitTypes().subscribe(
            data => {
                this.visitTypesList = data['result'];
                // this.visitTypeValue = this.visitTypesList[0].visitType;
            },
            error => {
                const status = JSON.parse(error['status']);
                const statuscode = JSON.parse(error['_body']).status;
                switch (status) {
                    case 500:
                        break;
                    case 400:
                        break;
                }
                if (statuscode === '2085' || statuscode === '2071') {
                    if (this.router.url !== '/') {
                        localStorage.setItem('page', this.router.url);
                        this.router.navigate(['/']).then(() => { });
                    }
                }
            }
        );
    }
    // getApptDetails(apptid) {
    //     this.apptDetailService.getApptDetails(apptid).subscribe(data => {
    //         this.apptData = data['result'][0];
    //         this.clientPic = this.apiEndPoint + '/' + this.apptData.clientpic;
    //         this.manageStatusButtons();
    //         // this.setStatusList(this.apptData.apstatus);
    //         this.getBookingData();
    //     },
    //         error => {
    //             const status = JSON.parse(error['status']);
    //             const statuscode = JSON.parse(error['_body']).status;
    //             switch (JSON.parse(error['_body']).status) {
    //                 case '2033':
    //                     break;
    //             }
    //         });
    // }
    getApptServiceDetails(clientid, apptid) {

        this.apptDetailService.getApptServices(clientid, apptid).subscribe(data => {
            const resData = data['result'];
            if (resData.nextapptresult.length > 0) {
                if (resData && resData.nextapptresult && resData.nextapptresult[0].serviceName !== null) {
                    //  this.subSeaquentAppointmentDate = resData.nextapptresult[0].Appt_Date_Time__c + '-' + resData.nextapptresult[0].serviceName.replace(/,/g, ' / ');
                    this.subSeaquentAppointmentDate = resData.nextapptresult[0].Appt_Date_Time__c;
                    this.nextservicename = resData.nextapptresult[0].serviceName.replace(/,/g, ' / ');
                } else {
                    this.subSeaquentAppointmentDate = '';
                    this.subSeaquentAppointment = 'None';
                }
            }

            if (resData.apptrst.length > 0) {
                // const displayName = document.getElementById('displayNameId');
                // if (!isNullOrUndefined(resData.apptrst[0].clientName)) {
                //     displayName.innerHTML = 'Appointment Detail - ' + resData.apptrst[0].clientName;
                // }
                this.apptData = resData.apptrst[0];
                if (this.apptData.notes === null || this.apptData.notes === 'null') {
                    this.apptData.notes = '';
                }
            }

            this.rows = resData.srvcresult;
            // for ( let i = 0; i < this.rows.length; i++) {
            //     this.rows[i].Service_Date_Time__c = this.commonService.UTCStrToUsrTmzStr(this.rows[i].Service_Date_Time__c);
            // }
            // this.apptData.Appt_Date_Time__c = this.commonService.UTCStrToUsrTmzStr(this.apptData.Appt_Date_Time__c);
            this.apptData.creadate = this.commonService.UTCStrToUsrTmzStr(this.apptData.creadate);
            this.apptData.lastmofdate = this.commonService.UTCStrToUsrTmzStr(this.apptData.lastmofdate);
            // if (this.clientPic !== '') {
            //     this.clientPic = this.apiEndPoint + '/' + this.apptData.clientpic;
            // } else {
            //     this.clientPic = this.apptData.clientpic;
            // }
            if (this.apptData.clientpic && this.apptData.clientpic !== '') {
                this.clientPic = this.apiEndPoint + '/' + this.apptData.clientpic;
            }
            this.manageStatusButtons();
            // this.setStatusList(this.apptData.apstatus);
            this.getBookingData();
        },
            error => {
                this.rows = [{}];
                const status = JSON.parse(error['status']);
                const statuscode = JSON.parse(error['_body']).status;
                switch (JSON.parse(error['_body']).status) {
                    case '2033':
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
    saveAppointmentDetails() {
        const dataObj = {
            'status': this.apptData.apstatus,
            'notes': this.apptData.notes,
            'visttype': this.apptData.visttype
        };
        this.apptDetailService.saveAppointmentDetails(this.apptid, dataObj).subscribe(
            data => {
                const saveAppointmentDetails = data['result'];
                if (this.actionMethod === 'AppointmentDetail') {
                    this.router.navigate(['/client/edit/' + this.clientid]);
                } else {
                    this.router.navigate(['/appointments']);
                }
            },
            error => {
                const status = JSON.parse(error['status']);
                const statuscode = JSON.parse(error['_body']).status;
                switch (status) {
                    case 500:
                        break;
                    case 400:
                        break;
                }
                if (statuscode === '2085' || statuscode === '2071') {
                    if (this.router.url !== '/') {
                        localStorage.setItem('page', this.router.url);
                        this.router.navigate(['/']).then(() => { });
                    }
                }
            }
        );
    }
    saveNote() {
        this.apptDetailService.saveNotes(this.ticketserviceId, this.serviceNotes).subscribe(
            data => {
                const saveNoteResult = data['result'];
                this.getApptServiceDetails(this.clientid, this.apptid);
                this.serviceNotesModal.hide();
            },
            error => {
                const status = JSON.parse(error['status']);
                const statuscode = JSON.parse(error['_body']).status;
                switch (status) {
                    case 500:
                        break;
                    case 400:
                        break;
                }
                if (statuscode === '2085' || statuscode === '2071') {
                    if (this.router.url !== '/') {
                        localStorage.setItem('page', this.router.url);
                        this.router.navigate(['/']).then(() => { });
                    }
                }
            }
        );
    }
    manageStatusButtons() {
        this.isRemainderEmailAllowed = false;
        this.isRebookAllowed = false;
        this.isModifyAllowed = false;
        this.isCheckedInAllowed = false;
        this.isSaveAllowed = false;
        this.isBookApptAllowed = false;
        const apptDateandTime = this.commonService.getDateTmFrmDBDateStr(this.apptData.Appt_Date_Time__c);
        if (isNullOrUndefined(this.apptData.No_Email__c)) {
            this.apptData.No_Email__c = 0;
        }
        const apptDate = this.commonService.getDateTmFrmDBDateStr(this.commonService.getDBDatStr(apptDateandTime));
        const todayDateandTime = new Date();
        const todayDate = this.commonService.getDateTmFrmDBDateStr(this.commonService.getDBDatStr(todayDateandTime));
        this.isTodayAppt = apptDate.getTime() === todayDate.getTime() ? true : false;
        /// previously isOpenAppt is with time consideration now considering only date
        this.isOpenAppt = apptDate.getTime() >= todayDate.getTime() ? true : false;
        if (this.isOpenAppt && this.apptData.apstatus !== 'Complete') {
            this.isSaveAllowed = true;
        }
        if (this.isOpenAppt && this.apptData.cltemail &&
            this.apptData.isTicket__c === 0 && this.apptData.No_Email__c !== 1 && this.apptData.apstatus !== 'Checked In' && this.apptData.apstatus !== 'Complete') {
            this.isRemainderEmailAllowed = true;
        }
        if ((apptDateandTime.getTime() > new Date().getTime()) && this.apptData.cltphone !== null && this.apptData.cltphone !== '' &&
            this.apptData.isTicket__c === 0 && this.apptData.Mobile_Carrier__c !== null && this.apptData.Mobile_Carrier__c !== ''
            && this.apptData.apstatus !== 'Checked In' && this.apptData.apstatus !== 'Complete') {
            this.remTextButtonValue = 'Reminder Text';
        }

        if (apptDate.getTime() >= todayDate.getTime() && this.apptData.apstatus !== 'Complete') {
            this.isModifyAllowed = true;
        }

        if (this.isTodayAppt && (this.apptData.apstatus === 'Checked In' || this.apptData.apstatus === 'Complete')) {
            this.isRebookAllowed = true;
        }
        this.isBookApptAllowed = !this.isRebookAllowed;
        this.isCheckedInAllowed = this.showCheckedIn(todayDate, apptDate, this.apptData.apstatus);
    }

    showCheckedIn(currentDate: Date, apptDate: Date, status: string): boolean {
        const statusName = status.toLowerCase();
        const YesterdayDate = new Date(currentDate);
        YesterdayDate.setDate(apptDate.getDate() - 1);
        if ((statusName === 'booked' || statusName === 'called' || statusName === 'confirmed' || statusName === 'pending deposit' ||
            statusName === 'reminder sent' || statusName === 'conflicting')
            && (apptDate.getTime() === YesterdayDate.getTime() || apptDate.getTime() === currentDate.getTime())) {
            return true;
        } else {
            return false;
        }
    }
    getpackagesListing() {
        const value = 'true';
        this.appointmentsService.getAllServicePackageDetails(value).subscribe(data => {
            this.packagesList = data['result'];
        },
            error => {
                const errStatus = JSON.parse(error['_body'])['status'];
                if (errStatus === '2085' || errStatus === '2071') {
                    this.router.navigate(['/']).then(() => { });
                }
            });
    }
    validateCheckInData() {
        let pckData = [];
        const pckArray = [];
        let sumOfDiscountedPrice = 0;
        let discountedPackageTotal = 0;
        let discountedPackage = 0;
        let rows = [];
        let pckgObj = {};
        let pckId = '';
        const ticketServiceData = [];
        if (this.apptData.Booked_Package__c && this.apptData.Booked_Package__c !== '' && this.apptData.Booked_Package__c !== ',' &&
            this.apptData.Booked_Package__c !== 'undefined' && this.apptData.apstatus !== 'Checked In') {
            this.apptDetailService.getApptServices(this.apptData.clientId, this.apptData.apptId).subscribe(data => {
                const resData = data['result'];
                rows = resData.srvcresult;
                const bookedPckgVal = this.apptData.Booked_Package__c.split(',');
                for (let i = 0; i < bookedPckgVal.length; i++) {
                    pckData = pckData.concat(this.packagesList.filter((obj) => obj.Id === bookedPckgVal[i]));
                    if (pckData && pckData[i] && pckData[i].Discounted_Package__c) {
                        pckId = pckData[i].Id;
                        discountedPackage += parseFloat(pckData[i].Discounted_Package__c);
                        discountedPackageTotal += parseFloat(pckData[i].Discounted_Package__c);
                        for (let j = 0; j < JSON.parse(pckData[i].JSON__c).length; j++) {
                            sumOfDiscountedPrice += parseFloat(JSON.parse(pckData[i].JSON__c)[j].discountPriceEach);
                            if ((rows[i].Id === JSON.parse(pckData[i].JSON__c)[j].serviceId) && (bookedPckgVal[i] === pckData[i].Id)) {
                                ticketServiceData.push({
                                    'pckId': pckId,
                                    'serviceId': rows[i].Id,
                                    'netPrice': JSON.parse(pckData[i].JSON__c)[j].discountPriceEach
                                });
                            }
                        }

                    }
                    pckArray.push({
                        'pckId': pckId,
                        'sumOfDiscountedPrice': sumOfDiscountedPrice,
                        'discountedPackage': discountedPackage,
                        // 'discountPriceEach':
                    });
                    sumOfDiscountedPrice = 0;
                    discountedPackage = 0;
                }
                pckgObj = {
                    'pckArray': pckArray,
                    'discountedPackageTotal': discountedPackageTotal,
                    // 'discountedPackage': discountedPackage
                    'ticketServiceData': ticketServiceData
                };
                this.apptData.apstatus = 'Checked In';
                const apptDataObj = {
                    'apstatus': 'Checked In',
                    'clientCurBal': this.apptData.Current_Balance__c,
                    'apptId': this.apptData.apptId,
                    'netprice': this.apptData.netprice
                };
                const dataObj = {
                    'apptDataObj': apptDataObj,
                    'pckgObj': pckgObj
                };
                return dataObj;
            },
                error => {
                    const errStatus = JSON.parse(error['_body'])['status'];
                    if (errStatus === '2085' || errStatus === '2071') {
                        this.router.navigate(['/']).then(() => { });
                    }
                });
        } else if (this.apptData.apstatus !== 'Checked In') {
            const apptDataObj = {
                'apstatus': 'Checked In',
                'clientCurBal': this.apptData.Current_Balance__c,
                'apptId': this.apptData.apptId,
                'netprice': this.apptData.netprice

            };
            const dataObj = {
                'apptDataObj': apptDataObj,
                'pckgObj': pckgObj
            };
            return dataObj;
        }
    }
    checkIn() {
        const dataObj = this.validateCheckInData();
        const dataObj1 = {
            'apptDataObj': dataObj.apptDataObj,
            'pckgObj': this.commonService.removeDuplicates(dataObj.pckgObj, 'pckId'),
        };
        this.apptDetailService.changeApptStatus(dataObj1.apptDataObj, dataObj1.pckgObj)
            .subscribe(data => {
                this.toastr.success('Appointment was successfullly checked in', null, { timeOut: 1500 });
                this.getApptServiceDetails(this.clientid, this.apptid);
            },
                error => {
                    const status = JSON.parse(error['status']);
                    const statuscode = JSON.parse(error['_body']).status;
                    switch (status) {
                        case 500:
                            break;
                        case 400:
                            if (statuscode === '2040') {
                                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                window.scrollTo(0, 0);
                            }
                            if (statuscode === '2085' || statuscode === '2071') {
                                if (this.router.url !== '/') {
                                    localStorage.setItem('page', this.router.url);
                                    this.router.navigate(['/']).then(() => { });
                                }
                            } break;
                    }
                });
    }
    getBookingData() {
        this.apptDetailService.getBookingData().subscribe(
            data => {
                this.bookingDataList = data['result'];
                this.setStatusList(this.apptData.apstatus);
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
    showNotesModal(Id, i) {
        this.serviceNotes = this.rows[i].Notes__c;
        this.ticketserviceId = Id;
        const notesTestarea = <HTMLTextAreaElement>document.getElementById('notesTestareaId');
        if (this.isSaveAllowed === true) {
            this.serviceNotesModal.show();
        }
        notesTestarea.value = this.rows[i].Notes__c;
        // this.indexTemp = i;
    }
    closeServiceNotesModal() {
        const notesTestarea = <HTMLTextAreaElement>document.getElementById('notesTestareaId');
        this.serviceNotesModal.hide();
    }
    cancelModel() {
        this.serviceNotesModal.hide();
    }
    cancelAppointmentDetails() {
        if (this.actionMethod !== 'AppointmentDetail') {
            this.router.navigate(['/appointments'], { queryParams: { date: moment(this.apptData.Appt_Date_Time__c).format('YYYY-MM-DD') } }).then(() => { });
        } else {
            this.router.navigate(['/client/edit/' + this.clientid]);
        }
    }
}// main end
