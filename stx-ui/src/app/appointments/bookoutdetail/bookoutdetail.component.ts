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
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { BookOutDetailService } from './bookoutdetail.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../common/common.service';
@Component({
    selector: 'app-appointments-popup',
    templateUrl: './bookoutdetail.html',
    styleUrls: ['./bookoutdetail.css'],
    providers: [BookOutDetailService, CommonService]
})
export class BookOutDetailComponent implements OnInit {
    bsValue: any = new Date();
    bookingDataList: any;
    bookingIntervalMinutes: number;
    TimeData: any;
    workerList: any = [];
    workerName: any;
    apptData: any = {};
    apptid: any;
    notes: any;
    apptStatus = [];
    startTime: any;
    endTime: any;
    statusColor = { 'background-color': '' };
    error: any = '';
    createdDate = ['', ''];
    modifiedDate = ['', ''];
    appointmentDate = ['', ''];
    datePickerConfig: any;
    constructor(
        private activatedRoute: ActivatedRoute,
        private bookOutDetailService: BookOutDetailService,
        private toastr: ToastrService,
        private router: Router,
        private commonService: CommonService) {
        this.datePickerConfig = Object.assign({},
            {
                showWeekNumbers: false,
                containerClass: 'theme-blue',
            });
        this.activatedRoute.queryParams.subscribe(params => {
            this.apptid = activatedRoute.snapshot.params['apptid'];
        });
    }
    /*Method for page Load */
    ngOnInit() {
        //  this.getBookingData();
        this.getWorkerList();
        this.getApptDetails(this.apptid);
    }
    getStartTime(dateObj: Date) {
        let elem = '';
        if (dateObj.getHours() < 12) {
            if (dateObj.getHours() === 0) {
                elem = '12:' + ('0' + dateObj.getMinutes()).slice(-2) + ' AM';
            } else {
                elem = ('0' + dateObj.getHours()).slice(-2) + ':' + ('0' + dateObj.getMinutes()).slice(-2) + ' AM';
            }
        } else {
            if ((dateObj.getHours() - 12) === 0) {
                elem = '12:' + ('0' + dateObj.getMinutes()).slice(-2) + ' PM';
            } else {
                elem = ('0' + (dateObj.getHours() - 12)).slice(-2) + ':' + ('0' + dateObj.getMinutes()).slice(-2) + ' PM';
            }
        }
        this.startTime = elem;
    }
    getEndTime(dateObj: Date) {
        let elem = '';
        if (dateObj.getHours() < 12) {
            if (dateObj.getHours() === 0) {
                elem = '12:' + ('0' + dateObj.getMinutes()).slice(-2) + ' AM';
            } else {
                elem = ('0' + dateObj.getHours()).slice(-2) + ':' + ('0' + dateObj.getMinutes()).slice(-2) + ' AM';
            }
        } else {
            if ((dateObj.getHours() - 12) === 0) {
                elem = '12:' + ('0' + dateObj.getMinutes()).slice(-2) + ' PM';
            } else {
                elem = ('0' + (dateObj.getHours() - 12)).slice(-2) + ':' + ('0' + dateObj.getMinutes()).slice(-2) + ' PM';
            }
        }
        this.endTime = elem;
    }
    /**
     * Method to get AppointMent Details
     */
    getApptDetails(apptid) {
        this.bookOutDetailService.getApptDetails(apptid).subscribe(data => {
            this.apptData = data['result'][0];
            this.appointmentDate = this.commonService.getUsrDtStrFrmDBStr(this.apptData.apdate);
            this.createdDate = this.commonService.getUsrDtStrFrmDBStr(this.apptData.creadate);
            this.modifiedDate = this.commonService.getUsrDtStrFrmDBStr(this.apptData.lastmofdate);
            const crtDate = new Date();
            const timeDiff = crtDate.getTimezoneOffset();
            const apptDate = new Date(data.result[0].apdate);
            this.getBookingData();
            this.workerName = this.apptData.workerId;
            this.bsValue = apptDate;
            this.getStartTime(apptDate);
            const date1 = apptDate;
            const date2 = data.result[0].duration;
            const time1 = new Date(date1).getTime() + parseInt(this.apptData.aptDuration, 10) * 60000;
            const time = new Date(apptDate).getTime();
            this.apptData.endTime = new Date(time1);
            this.getEndTime(new Date(time1));
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
    // Method to get booking time hours data
    getBookingData() {
        this.bookOutDetailService.getBookingData().subscribe(
            data => {
                this.bookingDataList = data['result'];
                this.setStatusList(this.apptData.apstatus);
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
    // Method to get timeHours
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
    /**
     * Method to get worker List
    */
    getWorkerList() {
        this.bookOutDetailService.getWorkerList().subscribe(data => {
            this.workerList = [];
            this.workerList = data['result'].filter(filterList => filterList.IsActive);
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
    /**
     * Method to change Worker List
    */
    workerListOnChange(value) {
        this.workerName = value;
    }
    clearErrorMsg() {
    }
    setStatusList(apptStatus) {
        // if (!apptStatus && apptStatus !== '') {
        //     this.apptStatus.push({ 'status': apptStatus });
        // }
        // if (apptStatus !== 'Called') {
        //     this.apptStatus.push({ 'status': 'Called' });
        // }
        if (apptStatus !== 'Canceled') {
            this.apptStatus.push({ 'status': 'Canceled' });
        }
        // if (apptStatus !== 'Conflicting') {
        //     this.apptStatus.push({ 'status': 'Conflicting' });
        // }
        // if (apptStatus !== 'Confirmed') {
        //     this.apptStatus.push({ 'status': 'Confirmed' });
        // }
        if (apptStatus !== 'Booked') {
            this.apptStatus.push({ 'status': 'Booked' });
        }
        this.setStatusColor(apptStatus);
    }

    setStatusColor(apptStatus) {
        // if (apptStatus === 'Called') {
        //     this.statusColor = { 'background-color': this.bookingDataList.calledStatusColor };
        // }
        if (apptStatus === 'Canceled') {
            this.statusColor = { 'background-color': this.bookingDataList.canceledStatusColor };
        }
        // if (apptStatus === 'Conflicting') {
        //     this.statusColor = { 'background-color': this.bookingDataList.conflictingStatusColor };
        // }
        // if (apptStatus === 'Confirmed') {
        //     this.statusColor = { 'background-color': this.bookingDataList.confirmedStatusColor };
        // }
        if (apptStatus === 'Booked') {
            this.statusColor = { 'background-color': this.bookingDataList.bookedStatusColor };
        }
        // if (apptStatus === 'Checked In') {
        //     this.statusColor = { 'background-color': this.bookingDataList.checkedInStatusColor };
        // }
        // if (apptStatus === 'Reminder Sent') {
        //     this.statusColor = { 'background-color': this.bookingDataList.reminderSentStatusColor };
        // }
    }
    clearErrMsg() {
        this.error = '';
    }
    /**
     * Method to send BookoutDetail data
    */
    bookOutDetail() {
        let startTimeHour: any = 0;
        let startTimeMins: any = 0;

        let endTimeHour: any = 0;
        let endTimeMins: any = 0;
        if (this.startTime.split(' ')[1] === 'AM') {
            startTimeHour = this.startTime.split(' ')[0].split(':')[0];
            startTimeMins = this.startTime.split(' ')[0].split(':')[1];
        } else if (this.startTime.split(' ')[1] === 'PM') {
            startTimeHour = this.startTime.split(' ')[0].split(':')[0];
            if (parseInt(startTimeHour, 10) !== 12) {
                startTimeHour = parseInt(startTimeHour, 10) + 12;
            }
            startTimeMins = this.startTime.split(' ')[0].split(':')[1];
        }
        const startDate = new Date(this.bsValue.getFullYear(), this.bsValue.getMonth(),
            this.bsValue.getDate(), startTimeHour, startTimeMins);

        if (this.endTime.split(' ')[1] === 'AM') {
            endTimeHour = this.endTime.split(' ')[0].split(':')[0];
            endTimeMins = this.endTime.split(' ')[0].split(':')[1];
        } else if (this.endTime.split(' ')[1] === 'PM') {
            endTimeHour = this.endTime.split(' ')[0].split(':')[0];
            if (parseInt(endTimeHour, 10) !== 12) {
                endTimeHour = parseInt(endTimeHour, 10) + 12;
            }
            endTimeMins = this.endTime.split(' ')[0].split(':')[1];
        }
        const endDate = new Date(this.bsValue.getFullYear(), this.bsValue.getMonth(),
            this.bsValue.getDate(), endTimeHour, endTimeMins);
        let c = 0;
        let c3 = 0;
        if (parseInt(endTimeHour, 10) > parseInt(startTimeHour, 10)) {
            c = parseInt(endTimeHour, 10) - parseInt(startTimeHour, 10);
        }
        if (parseInt(endTimeMins, 10) > parseInt(startTimeMins, 10)) {
            c3 = parseInt(endTimeMins, 10) - parseInt(startTimeMins, 10);
        }
        if (!(startDate.getTime() < endDate.getTime())) {
            this.error = 'Start Time must be prior to End Time';
        } const bookoutDuration = (endDate.getTime() - startDate.getTime()) / (1000 * 60);
        if (this.error === '') {
            const dataObj = {
                'status': this.apptData.apstatus,
                'notes': this.apptData.notes,
                'workerName': this.workerName,
                // 'startdate': this.bsValue,
                'starttime': this.commonService.getDBDatTmStr(startDate),
                // 'endtime': this.endTime,
                'Duration__c': bookoutDuration
            };
            this.bookOutDetailService.updateBookoutData(dataObj, this.apptid).subscribe(data => {
                const updateStatus = data['result'];
                this.router.navigate(['/appointments']);
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

    getUserTime(dateUtcString) {
        if (dateUtcString) {
            return new Date(this.commonService.UTCStrToUsrTmzStr(dateUtcString));
        }
    }

}
