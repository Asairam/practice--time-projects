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
import { BookClassService } from './bookclass.service';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-appointments-popup',
    templateUrl: './bookclass.html',
    styleUrls: ['./bookclass.css'],
    providers: [BookClassService]
})
export class BookClassComponent implements OnInit {
    classData: any;
    error: any;
    workerData: any;
    classDur: any;
    minDate: Date;
    bookingIntervalMinutes: number;
    bookingDataList: any;
    TimeData: any;
    timeValue: any;
    bsValue = new Date();
    datePickerConfig: any;
    constructor(
        private bookClassService: BookClassService,
        private toastr: ToastrService,
        private sanitizer: DomSanitizer,
        private router: Router) {
            this.minDate = new Date();
            this.datePickerConfig = Object.assign({},
                {
                  showWeekNumbers: false,
                  containerClass: 'theme-blue',
                });
    }
    /*Method for page Load */
    ngOnInit() {
        this.getClassesData();
        this.getBookingData();
    }
    getClassesData() {
        this.bookClassService.getClasses()
            .subscribe(data => {
                this.classData = data['result'];
                this.classDur = this.classData[0].Duration_1__c;
                // this.getWorkerDataByClass(this.classData[0].Id);
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
    onChangeClass(value) {
        this.getWorkerDataByClass(value);
        this.workerData = '';
    }
    getWorkerDataByClass(classId) {
        this.bookClassService.getWorker(classId)
            .subscribe(data => {
                this.workerData = data['result'];
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
      // Method to get booking time hours data
      getBookingData() {
        this.bookClassService.getBookingData().subscribe(
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
    onChangeTimes(value) {
        this.timeValue = value;
    }
}

