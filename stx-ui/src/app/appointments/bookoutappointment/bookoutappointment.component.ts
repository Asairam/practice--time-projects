/*
ngOnInit() : Method to loading athe page..
searchClients() : Method for searching clients
showData() : Method for loading All clients Data.
clearmessage() : Method for Clearing  error messages.
*/
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { BookOutApptService } from './bookoutappointment.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../common/common.service';
import { isNullOrUndefined } from 'util';
@Component({
    selector: 'app-appointments-popup',
    templateUrl: './bookoutappointment.html',
    styleUrls: ['./bookoutappointment.css'],
    providers: [BookOutApptService, CommonService]
})
export class BookOutApptComponent implements OnInit {
    minDate: Date;
    public bsValue: any = new Date();
    rows = [];
    addServiceGroupName: any;
    serviceGroupName: any;
    serviceName: any;
    serviceDetailsList = [];
    serviceGroupList: any;
    serviceId: any;
    workerList = [];
    sumOfServiceDurations: any = 0;
    visitTypesList: any;
    visitTypeValue: any;
    public bookStandingTime: any;
    bookEveryData: any = [];
    bookEvery: any;
    TimeData: any;
    numberOfBooks; any;
    everyData: any = [];
    bookingDataList: any;
    bookingIntervalMinutes: number;
    workerName: any;
    bookOutStartTime: any = '';
    bookOutEndTime: any = '';
    numberOfBookOuts: any;
    bookOutEvery: any;
    bookEvery1: any;
    apptBookoutData: Array<any> = [];
    CurTime: any;
    error: any;
    error1: any;
    error2: any;
    error3: any;
    error4: any;
    selectedRepository: any;
    bookOutdur: any = 0;
    showScheduleAvailableButton = false;
    selectedStartDates: any = [];
    datePickerConfig: any;
    workerHours: any = [];
    weekDays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    workerFullName: any;
    constructor(
        private bookOutApptService: BookOutApptService,
        private toastr: ToastrService,
        private translateService: TranslateService,
        private router: Router,
        private sanitizer: DomSanitizer,
        private commonService: CommonService) {
        this.minDate = new Date();
        this.datePickerConfig = Object.assign({},
            {
                showWeekNumbers: false,
                containerClass: 'theme-blue',
            });

    }
    /*Method for page Load */
    ngOnInit() {
        this.getWorkerList();
        this.getBookOutEvery();
        this.getNumberofBookOuts();
        this.getbookEvery();
        this.getBookingData();

        const localTime = this.bsValue.toLocaleString('en-US', { hour: 'numeric', hour12: true });
        const splitLocalTime = localTime.split(' ');
        if (this.bsValue.getHours() < 9) {
            this.bookOutStartTime = '0' + splitLocalTime[0] + ':00 ' + splitLocalTime[1];
        } else {
            if (splitLocalTime[0] < 10) {
                this.bookOutStartTime = '0' + splitLocalTime[0] + ':00 ' + splitLocalTime[1];
            } else {
                this.bookOutStartTime = splitLocalTime[0] + ':00 ' + splitLocalTime[1];
            }
        }
        this.bookOutEndTime = this.bookOutStartTime;
    }

    getWorkerList() {
        this.bookOutApptService.getWorkerList().subscribe(data => {
            this.workerList = [];
            this.workerList = data['result']
                .filter(filterList => filterList.IsActive);
        },
            error => {
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
    scheduleAvailable() {
        const dates = {
            'AppDates': this.apptBookoutData.filter((obj) => obj.Status__c.toLowerCase() === 'booked'),
            'workerId': this.workerName,
            'apptime': this.bookOutStartTime,
            'apptBookDate': this.commonService.getDBDatTmStr(this.bsValue),
            'bookOutDuration': this.bookOutdur
        };
        const apptStartDate: string = this.commonService.getDBDatStr(this.bsValue).split(' ')[0];
        this.bookOutApptService.scheduleAvailable(dates).subscribe(data => {
            this.router.navigate(['/appointments'], { queryParams: { date: apptStartDate } }).then(() => {
                const toastermessage: any = this.translateService.get('LOGIN.APPT_SUCESSFULLY_CREATED');
                this.toastr.success(toastermessage.value, null, { timeOut: 2000 });
            });
        },
            error => {
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
    getBookOutEvery() {
        this.bookOutApptService.getBookOutTimeHour().subscribe(
            data => {
                this.bookEvery = data['bookoutevery'];
                this.bookOutEvery = this.bookEvery[0].value;
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
    getNumberofBookOuts() {
        this.bookOutApptService.getBookOutTimeHour().subscribe(
            data => {
                this.numberOfBooks = data['numberofBookOuts'];
                this.numberOfBookOuts = this.numberOfBooks[0].availability;
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
    getbookEvery() {
        this.bookOutApptService.getbookEveryTypes().subscribe(
            data => {
                this.bookEveryData = data['bookstandingEvery'];
                this.bookEvery1 = this.bookEveryData[0].type;
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
    getBookingData() {
        this.bookOutApptService.getBookingData().subscribe(
            data => {
                this.bookingDataList = data['result'];
                this.bookingIntervalMinutes = this.bookingDataList.bookingIntervalMinutes;
                this.method();
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
    method() {
        let datIndex = 0;
        const crDate = new Date();
        const startDate = new Date(0, 0, 0, 0, 0, 0, 0);
        const endDate = new Date(0, 0, 1, 0, 0, 0, 0);
        this.TimeData = [];
        do {
            let elem = '';

            if (startDate.getHours() < 12) {
                if (startDate.getHours() === 0) {
                    elem = '12:' + ('0' + startDate.getMinutes()).slice(-2) + ' AM';
                } else {
                    elem = ('0' + startDate.getHours()).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ' AM';
                }
            } else {
                if ((startDate.getHours() - 12) === 0) {
                    elem = '12:' + ('0' + startDate.getMinutes()).slice(-2) + ' PM';
                } else {
                    elem = ('0' + (startDate.getHours() - 12)).slice(-2) + ':' + ('0' + startDate.getMinutes()).slice(-2) + ' PM';
                }
            }
            this.TimeData.push(elem);

            if (crDate.getHours() < startDate.getHours()) {
                datIndex++;
            }
            startDate.setMinutes(startDate.getMinutes() + this.bookingIntervalMinutes);
        }
        while (startDate < endDate);
    }
    timeCheck(startTime, endTime) {
        if (startTime !== '' && endTime !== '' && startTime.split(' ')[1] === 'PM' && endTime.split(' ')[1] === 'AM') {
            return false;
        } else if (startTime !== '' && endTime !== ''
            && (startTime.split(' ')[1] === endTime.split(' ')[1])
            && (parseInt(startTime.split(' ')[0].split(':')[0], 10) > parseInt(endTime.split(' ')[0].split(':')[0], 10))) {
            return false;
        } else if (startTime !== '' && endTime !== ''
            && (startTime.split(' ')[1] === endTime.split(' ')[1])
            && (parseInt(startTime.split(' ')[0].split(':')[1], 10) > parseInt(endTime.split(' ')[0].split(':')[1], 10))) {
            return false;
        } else if (startTime !== '' && endTime !== ''
            && (startTime.split(' ')[1] === endTime.split(' ')[1])
            && (parseInt(startTime.split(' ')[0].split(':')[0], 10) === parseInt(endTime.split(' ')[0].split(':')[0], 10))
            && (parseInt(startTime.split(' ')[0].split(':')[1], 10) === parseInt(endTime.split(' ')[0].split(':')[1], 10))) {
            return false;
        } else {
            return true;
        }
    }
    workerListOnChange(value) {
        this.workerName = value;
        const selectedWorker = this.workerList.filter((worker) => worker.Id === value)[0];
        this.workerFullName = selectedWorker.FirstName + ' ' + selectedWorker.LastName.slice(0, 1);
    }
    searchForAppointmentAction() {
        const startDateArray = [];
        const endDateArray = [];
        let startTimeHour: any;
        let startTimeMins: any;
        let endTimeHour: any;
        let endTimeMins: any;

        if (this.bookOutStartTime.split(' ')[1] === 'AM') {
            startTimeHour = this.bookOutStartTime.split(' ')[0].split(':')[0];
            startTimeMins = this.bookOutStartTime.split(' ')[0].split(':')[1];
            if (+startTimeHour === 12) {
                startTimeHour = 0;
            }
        } else if (this.bookOutStartTime.split(' ')[1] === 'PM') {
            startTimeHour = this.bookOutStartTime.split(' ')[0].split(':')[0];
            if (parseInt(startTimeHour, 10) !== 12) {
                startTimeHour = parseInt(startTimeHour, 10) + 12;
            }
            startTimeMins = this.bookOutStartTime.split(' ')[0].split(':')[1];
        }
        if (this.bookOutEndTime.split(' ')[1] === 'AM') {
            endTimeHour = this.bookOutEndTime.split(' ')[0].split(':')[0];
            if (+endTimeHour === 12) {
                endTimeHour = 0;
            }
            endTimeMins = this.bookOutEndTime.split(' ')[0].split(':')[1];
        } else if (this.bookOutEndTime.split(' ')[1] === 'PM') {
            endTimeHour = this.bookOutEndTime.split(' ')[0].split(':')[0];
            if (parseInt(endTimeHour, 10) !== 12) {
                endTimeHour = parseInt(endTimeHour, 10) + 12;
            }
            endTimeMins = this.bookOutEndTime.split(' ')[0].split(':')[1];
        }


        let c = 0;
        let c3 = 0;
        if (parseInt(endTimeHour, 10) > parseInt(startTimeHour, 10)) {
            c = parseInt(endTimeHour, 10) - parseInt(startTimeHour, 10);
        }
        if (parseInt(endTimeMins, 10) > parseInt(startTimeMins, 10)) {
            c3 = parseInt(endTimeMins, 10) - parseInt(startTimeMins, 10);
        }
        this.bookOutdur = (endTimeHour * 60 + parseInt(endTimeMins, 10)) - (startTimeHour * 60 + parseInt(startTimeMins, 10));

        if (this.workerName === '' || this.workerName === undefined) {
            this.error = 'Worker is required';
        } else if (this.bsValue === '' || this.bsValue === undefined) {
            this.error1 = 'Start Date is required';
        } else if (this.bookOutStartTime === '' || this.bookOutStartTime === undefined) {
            this.error2 = 'Start Time is required';
        } else if (this.bookOutEndTime === '' || this.bookOutEndTime === undefined) {
            this.error3 = 'End Time is required';
        } else if (!(startTimeHour * 60 + parseInt(startTimeMins, 10) < endTimeHour * 60 + parseInt(endTimeMins, 10))) {
            this.error4 = 'Start Time must be prior to End Time';
        } else if (this.error !== '') {
            this.error4 = 'Start Time must be prior to End Time';
            window.scrollTo(0, 0);
        } else {
            // const startDateArray = [];
            // let endDateArray = [];
            // let startTimeHour: any;
            // let startTimeMins: any;
            // let endTimeHour: any;
            // let endTimeMins: any;

            if (this.numberOfBookOuts && parseInt(this.numberOfBookOuts, 10) > 0) {
                for (let i = 0; i < parseInt(this.numberOfBookOuts, 10); i++) {
                    if (this.bookEvery1 === 'Days') {
                        const newStDate = new Date(this.bsValue.getFullYear(), this.bsValue.getMonth(), this.bsValue.getDate()
                            + (this.bookOutEvery * i), startTimeHour, startTimeMins);
                        startDateArray.push(newStDate);
                        const newEndDate = new Date(this.bsValue.getFullYear(), this.bsValue.getMonth(), this.bsValue.getDate()
                            + (this.bookOutEvery * i), endTimeHour, endTimeMins);
                        endDateArray.push(newEndDate);
                    } else if (this.bookEvery1 === 'Weeks') {
                        const newStDate = new Date(this.bsValue.getFullYear(), this.bsValue.getMonth(), this.bsValue.getDate()
                            + (this.bookOutEvery * i * 7), startTimeHour, startTimeMins);
                        startDateArray.push(newStDate);
                        const newEndDate = new Date(this.bsValue.getFullYear(), this.bsValue.getMonth(), this.bsValue.getDate()
                            + (this.bookOutEvery * i * 7), endTimeHour, endTimeMins);
                        endDateArray.push(newEndDate);
                    } else {
                        const newStDate = this.addMonths(new Date(this.bsValue.getFullYear(), this.bsValue.getMonth(),
                            this.bsValue.getDate(), startTimeHour, startTimeMins), this.bookOutEvery * i);
                        startDateArray.push(newStDate);
                        const newEndDate = this.addMonths(new Date(this.bsValue.getFullYear(), this.bsValue.getMonth(),
                            this.bsValue.getDate(), endTimeHour, endTimeMins), this.bookOutEvery * i);
                        endDateArray.push(newEndDate);
                    }
                }
            }
            const appointBookingData = {
                'Worker__c': this.workerName,
                'Appt_Date_Time__c': this.commonService.getDBDatTmStr(this.bsValue).split(' ')[0],
                'Appt_Start': this.commonService.getDBDatTmStr(startDateArray[0]).split(' ')[0],
                'Appt_End': this.commonService.getDBDatTmStr(endDateArray[endDateArray.length - 1]).split(' ')[0],
                'numberOfBooks': this.numberOfBookOuts,
                'bookOutEvery': this.bookOutEvery,
                'bookEvery1': this.bookEvery1
            };
            this.bookOutApptService.searchForAppointmentAction(appointBookingData).subscribe(data => {
                this.apptBookoutData = [];
                this.selectedStartDates = startDateArray;
                let length = 0;
                if (data['result']) {
                    this.workerHours = data['result']['companyhours'];
                    const datesArray = [];
                    if (data['result']['result'].length > 0) {
                        for (let i = 0; i < data['result']['result'].length; i++) {
                            const modifiedDate: any = {};
                            const apptDuration = data['result']['result'][i]['Duration__c'];
                            modifiedDate.startDate = new Date(data['result']['result'][i]['Appt_Date_Time__c']);
                            modifiedDate.endDate = new Date(modifiedDate.startDate.getTime() + parseInt(apptDuration, 10) * 60000);
                            datesArray.push(modifiedDate);
                        }
                        length = data['result']['result'].length;
                    } else {
                        length = 1;
                    }

                    for (let j = 0; j < length; j++) {
                        for (let i = 0; i < parseInt(this.numberOfBookOuts, 10); i++) {
                            // const workerHours = this.getWorkerHours(startDateArray[i], this.workerName);
                            let status = 'Booked';
                            let FullName = this.workerFullName;
                            if (j === 0) {
                                if (this.checkWorkerServiceStatus(startDateArray[i], endDateArray[i], this.workerName)) {
                                    status = 'Closed';
                                }
                            }
                            if (data['result']['result'].length > 0) {
                                if (j === 0) {
                                    if (status !== 'Closed') {
                                        if (this.compareDatesForAppointment(datesArray[j].startDate, datesArray[j].endDate, startDateArray[i], endDateArray[i])) {
                                            status = 'Conflicting';
                                            FullName = data['result']['result'][j].FullName;
                                        }
                                    }
                                } else {
                                    if (this.apptBookoutData[i].Status__c === 'Booked') {
                                        if (this.compareDatesForAppointment(datesArray[j].startDate, datesArray[j].endDate, startDateArray[i], endDateArray[i])) {
                                            this.apptBookoutData[i].Status__c = 'Conflicting';
                                            this.apptBookoutData[i].FullName = data['result']['result'][j].FullName;
                                        }
                                    }
                                }
                            }
                            if (j === 0) {
                                this.apptBookoutData.push({
                                    'bsValue': this.commonService.getDBDatTmStr(startDateArray[i]),
                                    'Status__c': status,
                                    'bookOutStartTime': this.bookOutStartTime,
                                    'FullName': FullName
                                });
                            } else {
                                this.apptBookoutData[i].bsValue = this.commonService.getDBDatTmStr(startDateArray[i]);
                            }
                        }
                    }
                    this.showScheduleAvailableButton = true;
                }
            },
                error => {
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
    }
    clearErrorMsg() {
        this.error = '';
        this.error1 = '';
        this.error2 = '';
        this.error3 = '';
        this.error4 = '';
        this.clearData();
    }
    clearData() {
        this.apptBookoutData = [];
    }

    // UTCstringToUserDate(utcstring: string): Date {
    //     return new Date(this.commonService.UTCStrToUsrTmzStr(utcstring));
    // }

    // comparing the dates whether they are in booked appointment list.written  by ravi

    compareDatesForAppointment(apptStart: Date, apptEnd: Date, reqApptStart: Date, reqApptEnd: Date): boolean {
        if (reqApptStart.getTime() >= apptStart.getTime() && reqApptStart.getTime() <= apptEnd.getTime()) {
            return true;
        } else if (reqApptEnd.getTime() >= apptStart.getTime() && reqApptEnd.getTime() <= apptEnd.getTime()) {
            return true;
        } else if (reqApptStart.getTime() <= apptStart.getTime() && reqApptEnd.getTime() >= apptEnd.getTime()) {
            return true;
        } else {
            return false;
        }
    }



    timeConversion(time: string, bookingDate: Date): Date {
        let hours: any;
        let minutes: any = time.split(' ')[0].split(':')[1];
        if (time.split(' ')[1] === 'AM') {
            hours = time.split(' ')[0].split(':')[0];
            if (+hours === 12) {
                hours = 0;
            }
        } else if (time.split(' ')[1] === 'PM') {
            hours = time.split(' ')[0].split(':')[0];
            if (parseInt(hours, 10) !== 12) {
                hours = parseInt(hours, 10) + 12;
            }
        }
        minutes = parseInt(minutes, 10);
        return new Date(bookingDate.getFullYear(), bookingDate.getMonth(), bookingDate.getDate(), hours, minutes);
    }
    getWorkerHours(reqApptStart: Date, workerId: string): { 'startTime': string, 'endTime': string } {
        const selectedWorker = this.workerHours.filter((worker) => worker.Id === workerId)[0];
        const day = this.weekDays[reqApptStart.getDay()];
        const workerTimings: any = {};
        for (const key in selectedWorker) {
            if (key.toLowerCase() === day.toLowerCase() + 'starttime__c') {
                workerTimings.startTime = selectedWorker[key];
            } else if (key.toLowerCase() === day.toLowerCase() + 'endtime__c') {
                workerTimings.endTime = selectedWorker[key];
            }
        }
        return workerTimings;
    }

    checkWorkerServiceStatus(reqApptStart: Date, reqApptEnd: Date, workerId: string): boolean {
        const workerHours = this.getWorkerHours(reqApptStart, workerId);
        let isExsistInworkerHours: boolean;
        if ((workerHours.startTime !== '' && !isNullOrUndefined(workerHours.startTime)) || (workerHours.endTime !== '' && !isNullOrUndefined(workerHours.endTime))) {
            const startTime = this.timeConversion(workerHours.startTime, reqApptStart);
            const endTime = this.timeConversion(workerHours.endTime, reqApptStart);
            isExsistInworkerHours = this.compareWorkerTimings(startTime, endTime, reqApptStart, reqApptEnd);
        } else {
            isExsistInworkerHours = false;
        }

        return !isExsistInworkerHours;
    }
    compareWorkerTimings(workerStartDate: Date, workerEndDate: Date, reqApptStart: Date, reqApptEnd: Date): boolean {
        const isExsistInworkerHours = (reqApptStart.getTime() >= workerStartDate.getTime()) && (reqApptEnd.getTime() <= workerEndDate.getTime()) ? true : false;
        return isExsistInworkerHours;
    }

    addMonths(startDate: Date, addNoOfMonths): Date {

        const monthcal = (startDate.getMonth() + addNoOfMonths) % 12;
        const modifiedDate = new Date(startDate.getFullYear(), startDate.getMonth() + addNoOfMonths, startDate.getDate(), startDate.getHours(),
            startDate.getMinutes(), startDate.getSeconds());
        if (monthcal !== modifiedDate.getMonth()) {
            modifiedDate.setDate(0);
        }
        return modifiedDate;
    }
}// main end


