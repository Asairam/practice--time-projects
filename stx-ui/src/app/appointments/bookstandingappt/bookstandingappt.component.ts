/*
ngOnInit() : Method to loading athe page..
addServices(): Method to add new service
removeServices(index): Method to remove current service
getbookEvery(): Method to get every data
getBookingData():Method to get time intervals
getServiceGroups(): Method to get service groups
categoryOfService(value, i): Method to change service group name
servicesListOnChange(value, i) : Method to change service names
workerListOnChange(): Method to change worker
calculateServiceDurations(): Method to get service durations
getpackagesListing(): Method to get service packages data
method(): Method to get time Hours
getNumberofBookOuts(): Method to get number of appointments
listVisitTypes(): Mehtod to get visit types data
onVisitTypeChange(): Method to change visit types
clearErrorMsg(): Mehtod to clear error messages
searchAppointmentData(): Method to validate search appointment results
*/
import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { BookStandingApptService } from './bookstandingappt.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { ModalDirective } from 'ngx-bootstrap/modal';
import { CommonService } from '../../common/common.service';
import { isNullOrUndefined } from 'util';

@Component({
    selector: 'app-appointments-popup',
    templateUrl: './bookstandingappt.html',
    styleUrls: ['./bookstandingappt.component.css'],
    providers: [BookStandingApptService, CommonService]
})
export class BookStandingApptComponent implements OnInit {
    public bsValue: Date = new Date();
    rows = [];
    addServiceGroupName: any;
    serviceGroupName: any;
    serviceName: any;
    serviceDetailsList = [];
    serviceGroupList: any;
    serviceId: any;
    workerList = [];
    sumOfServiceDurations: any = 0;
    bookStandingVisitType: any = '';
    visitTypesList: any;
    visitTypeValue: any;
    bookStandingText: any = '';
    bookStandingTime: any;
    numberOfBooks: any;
    numberOfBookStandings: any;
    bookEveryData: any = [];
    bookEvery: any;
    bookEvery1: any;
    everyData: any = [];
    packagesList: any;
    bookStandErr: any;
    appointmentData: any = [];
    TimeData: any;
    bookingDataList: any;
    bookingIntervalMinutes: number;
    workerName: any;
    apptBookStandingData: any;
    scheduleAvailableButton: any = false;
    apptBookoutData: any = [];
    minDate: Date;
    clientId: any;
    type: any;
    packageGroupList: any;
    error: any;
    serviceGroupColour: any;
    startDateWithTime: any;
    workerHours: any = [];
    workersWithServiceDuration = [];
    selectedStartDates: any = [];
    datePickerConfig: any;
    clientData: any;
    checkConflictError: any = '';
    showCliName: any;
    passdate: any;
    serviceTax: any = 0;
    serviceDetailKeys = ['Duration_1__c', 'Duration_2__c', 'Duration_3__c',
        'Buffer_After__c', 'Guest_Charge__c', 'Net_Price__c'];
    apptEndDate: Date;
    // clientInfo: any;
    @ViewChild('serviceNotesModal') public serviceNotesModal: ModalDirective;
    constructor(
        private bookStandingApptService: BookStandingApptService,
        private toastr: ToastrService,
        private translateService: TranslateService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private sanitizer: DomSanitizer,
        private commonService: CommonService) {
        this.minDate = new Date();
        this.datePickerConfig = Object.assign({},
            {
                showWeekNumbers: false,
                containerClass: 'theme-blue',
            });
        this.activatedRoute.queryParams.subscribe(params => {
            this.clientId = activatedRoute.snapshot.params['Id'];
        });
    }
    /*Method for page Load */
    ngOnInit() {
        this.apptEndDate = this.bsValue;
        this.getClientData(this.clientId);
        this.addServices(0);
        this.getServiceGroups();
        this.listVisitTypes();
        this.getbookEvery();
        this.getpackagesListing();
        this.getEvery();
        this.getBookingData();
        this.getNumberofBookOuts();
        this.getClientInfo();
        this.getAllActivePackages();
        this.getServRetTaxs();
        // this.getWorkerListHours();
    }
    /**
* Method to get service tax  and retail tax calculation
*/
    getServRetTaxs() {
        this.bookStandingApptService.getServProdTax().subscribe(
            data => {
                const taxData = JSON.parse(data['result'][3].JSON__c);
                this.serviceTax = taxData.serviceTax;
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
    * Common methods starts
    */
    getClientData(clientId) {
        this.bookStandingApptService.getClient(clientId)
            .subscribe(data => {
                this.clientData = data['result'].results[0];
                this.showCliName = data['result'].results[0].FirstName + ' ' + data['result'].results[0].LastName;
                if (this.clientData.Booking_Restriction_Type__c === 'Do Not Book' || this.clientData.Booking_Restriction_Type__c === 'Alert Only') {
                    this.serviceNotesModal.show();
                }
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
    getClientInfo() {
        this.bookStandingApptService.getClient(this.clientId).subscribe(
            data => {
                // const displayName = document.getElementById('displayNameId');
                // displayName.innerHTML = 'Appointments: Book Standing - ' + data.result.results[0].FirstName + ' ' + data.result.results[0].LastName;
                // displayName.innerHTML = '- ' + data.result.results[0].FirstName + ' ' + data.result.results[0].LastName;
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
    // add new service dynamically
    addServices(i) {
        this.rows.push({ Id: '', serviceGroupName: this.serviceGroupName });
        this.workerList[i] = [];
        this.serviceDetailsList[i] = [];
        const index = this.rows.length - 1;
        if (index !== 0) {
            this.categoryOfService(this.serviceGroupName, index);
        }
    }

    bookAnyWay() {
        this.serviceNotesModal.hide();
    }
    // Remove current service dynamically
    removeServices(index) {
        this.rows.splice(index, 1);
        this.workerList.splice(index, 1);
        this.serviceDetailsList.splice(index, 1);
        this.calculateServiceDurations(index);
    }
    // Method to get book every data
    getbookEvery() {
        this.bookStandingApptService.getbookEveryTypes().subscribe(
            data => {
                this.bookEveryData = data['bookstandingevery'];
                this.bookEvery = this.bookEveryData[0].value;
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
    getEvery() {
        this.bookStandingApptService.getEveryTypes().subscribe(
            data => {
                this.everyData = data['bookstandingEvery'];
                this.bookEvery1 = this.everyData[0].type;
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
    // Method to get booking time hours data
    getBookingData() {
        this.bookStandingApptService.getBookingData().subscribe(
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
    // Method for service groups
    getServiceGroups() {
        const reqDate = this.commonService.getDBDatStr(this.bsValue);
        this.bookStandingApptService.getServiceGroups('Service', reqDate).subscribe(data => {
            this.serviceGroupList = data['result']
                .filter(filterList => filterList.active && !filterList.isSystem);
            if (this.serviceGroupList.length > 0) {
                this.serviceGroupName = this.serviceGroupList[0].serviceGroupName;
                this.serviceGroupName = this.serviceGroupName + '$' + this.serviceGroupList[0].serviceGroupColor;
                this.rows[0].serviceGroupName = this.serviceGroupName;
                this.categoryOfService(this.serviceGroupName, 0);
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
    // Method to get package groups
    getAllActivePackages() {
        this.bookStandingApptService.getPackageGroups()
            .subscribe(data => {
                this.packageGroupList = data['result'];
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


    categoryOfService(value, i) {
        if (value.indexOf('scale') === 0) {
            this.type = 'Package';
        } else {
            this.type = 'ApptService';
        }
        this.appointmentData = [];
        const serviceGroupName = value.split('$')[0];
        this.rows[i].Id = '';
        this.serviceDetailsList[i] = [];
        this.workerList[i] = [];
        this.rows[i].serviceName = '';
        this.rows[i].workerName = '';
        this.removeServiceDetails(i);
        this.calculateServiceDurations(i);
        this.bookStandingApptService.getServices(serviceGroupName, this.type, this.commonService.getDBDatStr(this.bsValue)).subscribe(data => {
            if (this.type === 'Package') {
                const services: Array<any> = data['result']['serviceresultJson'];
                const serviceRelatedWorkers: Array<any> = data['result']['results'];
                const DupserviceGroupName = serviceGroupName;
                const packageId = serviceGroupName.split(':')[1];
                if (this.serviceDetailsList[i]) {
                    this.serviceDetailsList.splice(i, 1);
                }
                if (this.workerList[i]) {
                    this.workerList.splice(i, 1);
                }
                if (this.rows[i]) {
                    this.rows.splice(i, 1);
                }
                const length = this.rows.length;
                services.filter((service, index) => {
                    this.rows.push({ Id: '', serviceGroupName: DupserviceGroupName });
                    this.serviceDetailsList[length + index] = services;
                    const workers = [];
                    serviceRelatedWorkers.filter((worker) => {

                        if (worker.sId === service.Id) {
                            workers.push(worker);
                        }
                    });

                    this.workerList[length + index] = workers;
                    this.rows[length + index]['IsPackage'] = 1;
                    this.rows[length + index]['Booked_Package__c'] = packageId;
                    this.rows[length + index]['serviceGroupName'] = this.rows[length]['serviceGroupName'];
                    this.rows[length + index]['workerName'] = workers.length > 0 ? workers[0].workername : '';
                    this.rows[length + index]['Id'] = service.Id;
                    // this.serviceDetailKeys.map((key) => {
                    //     this.rows[length + index][key] = workers[0][key] ? +workers[0][key] : 0;
                    // });
                    if (this.rows[length + index]['workerName']) {
                        Object.assign(this.rows[length + index], this.commonService.getServiceDurations(workers[0]));
                    }
                    this.rows[length + index].serviceGroupColour = '';
                    this.calculateServiceDurations(length + index);
                });
                if (this.rows) {
                    this.rows = this.rows.filter((obj) => obj.workerName !== '');
                }
            } else {
                this.serviceDetailsList[i] = data['result'];
                this.rows[i]['IsPackage'] = 0;
                this.rows[i]['Booked_Package__c'] = '';
                this.rows[i].serviceGroupColour = value.split('$')[1];
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
    // Method to chane service list

    servicesListOnChange(serviceId, i) {
          /*  below  description is used to show the service description for the service*/
          let temp = [];
          temp = this.serviceDetailsList[i].filter((obj) => obj.Id === serviceId);
          if (temp && temp.length > 0) {
              this.rows[i]['desc'] = temp[0]['Description__c'];
          }
          /* end of service description */
        this.appointmentData = [];
        this.workerList[i] = [];
        this.rows[i].workerName = '';
        this.removeServiceDetails(i);
        this.calculateServiceDurations(i);
        this.rows[i]['serviceName'] = serviceId;
        const bookingdata = {
            bookingdate: this.commonService.getDBDatStr(this.bsValue),
            serviceIds: [this.rows[i].Id]
        };
        this.bookStandingApptService.getUsers(bookingdata).subscribe(data => {
            this.workerList[i] = data['result'];
            if (data['result'] && data['result'].length > 0) {
                this.rows[i].workerName = this.workerList[i][0].workername;
                this.workerListOnChange(this.rows[i].workerName, i);
                // this.rows[i].name = this.workerList[i][0].name;
                //     this.showWaitinglist = true;
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
    // Method to chane worker

    workerListOnChange(value, i) {
        this.appointmentData = [];
        this.workerName = value;
        this.workerList[i].filter((worker) => worker.workername === this.workerName).map((worker) => {
            Object.assign(this.rows[i], this.commonService.getServiceDurations(worker));
        });
        this.calculateServiceDurations(i);
        // this.clientdata = JSON.parse(localStorage.getItem('bookstanding'));
    }

    removeServiceDetails(index) {
        this.serviceDetailKeys.map((key) => {
            delete this.rows[index][key];
        });
    }
    // Method to calculate the service durations
    calculateServiceDurations(i) {
        this.appointmentData = [];
        if (this.rows && this.rows.length > 0) {
            this.sumOfServiceDurations = 0;
            for (let j = 0; j < this.rows.length; j++) {
                let totalDuration = 0;
                if (!isNullOrUndefined(this.rows[j]['workerName']) && this.rows[j]['workerName'] !== '') {
                    totalDuration += this.rows[j]['Duration_1__c'];
                    totalDuration += this.rows[j]['Duration_2__c'];
                    totalDuration += this.rows[j]['Duration_3__c'];
                    totalDuration += this.rows[j]['Buffer_After__c'];
                    this.rows[j].Duration__c = totalDuration;
                    this.sumOfServiceDurations = this.sumOfServiceDurations + totalDuration;
                }

            }
        }
    }
    // Method to get packagelisting
    getpackagesListing() {
        this.bookStandingApptService.getAllServiceDetails().subscribe(data => {
            this.packagesList = data['result'];
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
    // Method to get number of appointments
    getNumberofBookOuts() {
        this.bookStandingApptService.getBookOutTimeHour().subscribe(
            data => {
                this.numberOfBooks = data['numberofBookOuts'];
                this.numberOfBookStandings = this.numberOfBooks[0].availability;
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


    // Method to get visit types
    listVisitTypes() {
        this.bookStandingApptService.getVisitTypes().subscribe(
            data => {
                this.visitTypesList = data['result'];
                this.visitTypeValue = this.visitTypesList[0].visitType;
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
    // Method to chane visit types
    onVisitTypeChange(value) {
        this.visitTypeValue = value;
    }
    // Method to clear error messages
    clearErrorMsg() {
        this.bookStandErr = '';
        this.checkConflictError = '';
    }

    // To calculate End Date
    calculateEndDate() {
        const serviceStartDate: any = {};
        serviceStartDate['startTime'] = this.bsValue;
        if (this.numberOfBookStandings === 1) {
            this.apptEndDate = serviceStartDate['startTime'];
        } else {
            const enddate = this.setApptDates(serviceStartDate, this.bookEvery1, +this.numberOfBookStandings - 1);
            this.apptEndDate = enddate['startTime'];
        }
    }
    // Method validating for search appointment results
    searchAppointmentData() {
        if (this.checkForServices(this.rows, 'serviceGroupName', 'Id', 'workerName')) {
            this.bookStandErr = 'BOOKSTANDING_APPT.VALID_NO_BLANK_SERVICE_FIELD';
            window.scrollTo(0, 0);
        } else if (this.bsValue < new Date()) {
            this.bookStandErr = 'BOOKSTANDING_APPT.VALID_SELECT_START_DATE';
            window.scrollTo(0, 0);
        } else if (this.bookStandingTime === '' || this.bookStandingTime === undefined || this.bookStandingTime === '--none--') {
            this.bookStandErr = 'BOOKSTANDING_APPT.VALID_SELECT_START_TIME';
            window.scrollTo(0, 0);
        } else {
            this.bookStandErr = '';
            let serviceStartDate: Date = this.commonService.timeConversionToDate(this.bookStandingTime, this.bsValue);
            this.workersWithServiceDuration = [[]];
            this.rows.forEach((obj, i) => {
                let apptDuration: { 'startTime': Date, 'endTime': Date };
                const duration = obj['Duration__c'];
                const apptStartDate: Date = serviceStartDate;
                const apptEndDate: Date = this.setEndTime(apptStartDate, duration);
                apptDuration = {
                    'startTime': apptStartDate,
                    'endTime': apptEndDate
                };
                serviceStartDate = apptEndDate;
                this.workersWithServiceDuration[0].push(apptDuration);
            });
            let workerIds = '';
            // if (this.rows  && this.rows .length > 0) {
            for (let j = 0; j < this.rows.length; j++) {

                workerIds += "'" + this.rows[j].workerName.split('$')[0] + "',";
                // }
            }
            workerIds = workerIds.slice(0, -1);
            if (this.numberOfBookStandings && parseInt(this.numberOfBookStandings, 10) > 0) {
                for (let i = 1; i < parseInt(this.numberOfBookStandings, 10); i++) {
                    this.workersWithServiceDuration.push([]);
                    this.rows.forEach((obj, j) => {
                        const apptTime = this.workersWithServiceDuration[0][j];
                        this.workersWithServiceDuration[i].push(this.setApptDates(apptTime, this.bookEvery1, i));
                    });
                }
            }
            const ids = this.rows.map((obj) => obj.workerName);
            this.workersWithServiceDuration.forEach((obj) => {
                obj.map((obj1, i) => Object.assign(obj1, { workerId: ids[i] }));
            });
            const startdate = this.workersWithServiceDuration[0][0].startTime;
            // const workerIds: any = this.rows.map((obj) => obj.workerName.split('$')[0]);
            const endDate = this.workersWithServiceDuration[+this.numberOfBookStandings - 1][this.rows.length - 1].endTime;
            const servicesData = this.rows;
            for (let i = 0; i < servicesData.length; i++) {
                for (let j = 0; j < this.serviceDetailsList[i].length; j++) {
                    if (this.serviceDetailsList[i][j]['Id'] === servicesData[i]['Id']) {
                        servicesData[i]['Resources__c'] = this.serviceDetailsList[i][j]['Resources__c'];
                    }
                }
            }
            const appointmentBookingData = {
                'clientId': this.clientId,
                'Worker__c': workerIds,
                'Appt_Date_Time__c': this.bsValue,
                'Appt_Start': this.commonService.getDBDatTmStr(startdate).split(' ')[0],
                'Appt_End': this.commonService.getDBDatTmStr(endDate).split(' ')[0],
                // 'serviceId': this.serviceId,
                'starttime': this.bookStandingTime,
                'numberOfBooks': this.numberOfBookStandings,
                'bookEvery': this.bookEvery,
                'bookEvery1': this.bookEvery1,
                'services': this.rows,
                'page': 'bookStanding'

            };
            this.bookStandingApptService.searchForAppointmentAction(appointmentBookingData).subscribe(data => {
                let length = 0;
                this.apptBookoutData = [];
                this.appointmentData = [];
                if (data['result']) {
                    this.workerHours = data['result']['companyhours'];
                    const datesArray = [];
                    const apptData = [];
                    if (data['result']['result'].length > 0) {
                        for (let i = 0; i < data['result']['result'].length; i++) {
                            const modifiedDate: any = {};
                            const apptDuration = data['result']['result'][i]['Service_Duration'];
                            modifiedDate.startDate = this.commonService.getDateTmFrmDBDateStr(data['result']['result'][i]['Booking_Date_Time']);
                            modifiedDate.endDate = new Date(modifiedDate.startDate.getTime() + parseInt(apptDuration, 10) * 60000);
                            datesArray.push(modifiedDate);
                        }
                        length = data['result']['result'].length;
                    } else {
                        length = 1;
                    }
                    for (let j = 0; j < length; j++) {
                        for (let i = 0; i < parseInt(this.numberOfBookStandings, 10); i++) {
                            if (j === 0) {
                                apptData.push([]);
                            }
                            for (let k = 0; k < this.workersWithServiceDuration[i].length; k++) {
                                let status = 'Booked';
                                let FullName = this.setName(this.rows[k].workerName, k, this.workerList);
                                const workerTime: any = this.workersWithServiceDuration[i][k];
                                const workerId = this.workersWithServiceDuration[i][k].workerId;
                                if (j === 0) {
                                    if (this.commonService.checkWorkerServiceStatus(workerTime.startTime, workerTime.endTime, workerId, this.workerHours)) {
                                        status = 'Closed';
                                    }
                                }
                                if (data['result']['result'].length > 0) {
                                    if (j === 0) {
                                        if (status !== 'Closed') {
                                            if (data['result']['result'][j]['workerId'] === this.workersWithServiceDuration[i][k].workerId) {
                                                if (this.commonService.compareDatesForAppointment(datesArray[j].startDate, datesArray[j].endDate, workerTime.startTime, workerTime.endTime)) {
                                                    status = 'Conflicting';
                                                    FullName = data['result']['result'][j].FullName;
                                                }
                                            }
                                        }
                                    } else {
                                        if (apptData[i][k].Status__c === 'Booked') {
                                            if (data['result']['result'][j]['workerId'] === this.workersWithServiceDuration[i][k].workerId) {
                                                if (this.commonService.compareDatesForAppointment(datesArray[j].startDate, datesArray[j].endDate, workerTime.startTime, workerTime.endTime)) {
                                                    apptData[i][k].Status__c = 'Conflicting';
                                                    apptData[i][k].FullName = data['result']['result'][j].FullName;
                                                }
                                            }
                                        }
                                    }
                                }
                                if (j === 0) {
                                    // const workerObj = this.modifyObject(this.rows, k);
                                    // const workerObj = this.rows[k];
                                    apptData[i].push(Object.assign({}, this.rows[k], {
                                        'bsValue': this.commonService.getDBDatTmStr(this.workersWithServiceDuration[i][k].startTime),
                                        'Status__c': status,
                                        'bookOutStartTime': this.bookStandingTime,
                                        'FullName': FullName
                                    }));
                                } else {
                                    // apptData[i][k].bsValue = this.commonService.getDBDatTmStr(workerTime.startTime);
                                }
                            }
                        }

                    }
                    this.appointmentData = apptData;
                    apptData.forEach((obj, i) => {
                        obj.forEach((obj1) => {
                            this.apptBookoutData.push(obj1);
                        });
                    });
                    const availableLength = this.apptBookoutData.filter((obj) => obj['Status__c'].toLowerCase() === 'booked').length;
                    if (availableLength === this.apptBookoutData.length) {
                        this.scheduleAvailableButton = true;
                    } else {
                        this.scheduleAvailableButton = false;
                    }
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
                }
            );
        } // else end
    }// validations end

    // Method to schedule appoitnment
    scheduleAvailable(apptType) {
        // if (this.bookStandingVisitType === '' || this.bookStandingVisitType === 'undefined' || this.bookStandingVisitType === undefined) {
        //     this.bookStandErr = 'Select a Visit Type';
        //     window.scrollTo(0, 0);
        // } else {
        const year = this.bsValue.getFullYear();
        const month = this.bsValue.getMonth();
        const day = this.bsValue.getDate();
        const workerIds = this.rows.map((obj) => obj.workerName.split('$')[0]);
        this.startDateWithTime = new Date(year, month, day,
            this.timeConversion(this.bookStandingTime),
            parseInt(this.bookStandingTime.split(' ')[0].split(':')[1], 10), 0, 0);
        const apptDates: any = [];
        let isConflicting: any = false;
        const ApptServiceTax = [];
        const ApptNetPrice = [];
        if (apptType === 'scheduleAvailable') {
            let i = 0;
            this.appointmentData.filter((obj1: Array<any>) => {
                let totalServiceTax = 0;
                let netPrice = 0;
                if (obj1.length > 0) {

                    const filterStatusList = obj1.filter((obj) => obj['Status__c'].toLowerCase() === 'booked');
                    const IsPackageLength = filterStatusList.filter((obj) => obj['IsPackage'] === 1).length;
                    const length = filterStatusList.length;
                    if (length > 0) {
                        apptDates.push([]);
                        const filterOBj = filterStatusList.filter((obj) => {
                            if (IsPackageLength > 0) {
                                obj['IsPackage'] = 1;
                            }

                            const changedObj = Object.assign({ 'Appt_Status__c': 'Booked' }, obj);
                            changedObj['Service_Tax__c'] = this.calculateServiceTax(changedObj);
                            totalServiceTax += changedObj['Service_Tax__c'];
                            netPrice += changedObj['Net_Price__c'];
                            apptDates[i].push(changedObj);
                        });
                        i++;
                    }
                }
                ApptServiceTax.push(totalServiceTax);
                ApptNetPrice.push(netPrice);
            });
        } else {
            let i = 0;
            this.appointmentData.filter((obj1: Array<any>) => {
                let totalServiceTax = 0;
                let netPrice = 0;
                if (obj1.length > 0) {
                    const IsPackageLength = obj1.filter((obj) => obj['IsPackage'] === 1).length;
                    const length = obj1.filter((obj) => obj['Status__c'].toLowerCase() !== 'booked').length;
                    apptDates.push([]);
                    const filterOBj = obj1.filter((obj) => {
                        if (IsPackageLength > 0) {
                            obj['IsPackage'] = 1;
                        }
                        const changedObj = Object.assign({ 'Appt_Status__c': 'Booked' }, obj);
                        if (obj['Status__c'].toLowerCase() === 'closed') {
                            changedObj['Status__c'] = 'Booked';
                        }
                        if (length > 0) {
                            changedObj['Appt_Status__c'] = 'Conflicting';
                            isConflicting = true;
                        }
                        changedObj['Service_Tax__c'] = this.calculateServiceTax(changedObj);
                        totalServiceTax += changedObj['Service_Tax__c'];
                        netPrice += changedObj['Net_Price__c'];
                        apptDates[i].push(changedObj);
                    });
                    i++;
                }
                ApptServiceTax.push(totalServiceTax);
                ApptNetPrice.push(netPrice);
            });
        }
        const dates = {
            'Client__c': this.clientId,
            'serviceId': this.serviceId,
            'AppDates': JSON.stringify(apptDates),
            // 'workerId': workerIds,
            'apptime': this.bookStandingTime,
            'Client_Type__c': this.bookStandingVisitType,
            'apptBookDate': this.startDateWithTime,
            'apptNote': this.bookStandingText,
            'serviceGroupColour': this.serviceGroupColour,
            // 'serviceData': workersInfo,
            'Duration__c': this.sumOfServiceDurations,
            'apptId': '',
            'ApptTax': ApptServiceTax,
            'NetPrice': ApptNetPrice,
            'apptCreatedDate': this.commonService.getDBDatTmStr(new Date())
        };
        if (isConflicting) {
            if (confirm('There are conflicts with booking the standing appointment, which will directly affect the booking calendar. Schedule anyway?')) {
                this.scheduleAppointments(dates);
            } else {
                this.bookStandErr = 'New appointment conflicts were found';
                this.checkConflictError = 'New appointment conflicts were found';
                window.scrollTo(0, 0);
                this.appointmentData = [];
                return;
            }
        } else {
            this.scheduleAppointments(dates);
        }
        // }
    }
    calculateServiceTax(taxableObj): number {
        return this.commonService.calculatePercentage(this.serviceTax, taxableObj['Net_Price__c'], taxableObj['Taxable__c']);
    }
    scheduleAppointments(apptData) {
        this.passdate = apptData.apptBookDate.getFullYear() + '-' + (apptData.apptBookDate.getMonth() + 1) + '-' + apptData.apptBookDate.getDate();
        this.bookStandingApptService.scheduleAvailable(apptData).subscribe(data => {
            this.bookStandingApptService.sendApptNotifs(data['result']['apptIds']).subscribe(data2 => { }, error => { });
            this.workerList = [];
            // this.workerList = data['result'];
            this.router.navigate(['/appointments'], { queryParams: { date: this.passdate } }).then(() => {
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
                } else if (statuscode === '2091') {
                    const bookingError = JSON.parse(error['_body']).message;
                    // Warning Don't Delete This alert Code//
                    alert(bookingError)
                }
            });
    }
    //   checkForServices() and checkForServiceObject() are written to check whether the services added contains
    //   service name ,service worker and (package  or service) if not it returns true to show validation
    //   written by Ravi Kanth
    checkForServices(services: Array<any>, property1, property2, property3): boolean {
        const properties = [property1, property2, property3];
        if (properties.map((property) => this.checkForServiceObject(services, property)).indexOf(false) !== -1) {
            return true;
        }
        return false;
    }

    checkForServiceObject(services: Array<any>, propertyName: string): boolean {
        const isProperty = services.map((obj) => obj.hasOwnProperty(propertyName)).indexOf(false) !== -1 ? false : true;
        if (isProperty) {
            if (services.filter((obj) => obj[propertyName] === '').length !== 0) {
                return false;
            } else {
                return true;
            }

        } else {
            return false;
        }

    }

    timeConversion(time: string): number {
        let hours: any;
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
        return hours;
    }
    setEndTime(date: Date, time): Date {
        const selectedDate = new Date(date.getTime());
        selectedDate.setTime(date.getTime() + (time * 60 * 1000));
        return selectedDate;
    }

    // UTCstringToUserDate(utcstring: string): Date {
    //     return new Date(this.commonService.UTCStrToUsrTmzStr(utcstring));
    // }

    // comparing the dates whether they are in booked appointment list.written  by ravi

    setApptDates(apptDate: { 'startTime': Date, 'endTime': Date }, dateType: string, setDatebyNumber: number): { 'startTime': Date, 'endTime': Date } {
        const apptTimings: any = {};
        for (const key in apptDate) {
            if (apptDate.hasOwnProperty(key)) {
                let appDate = new Date(apptDate[key].getTime());
                if (dateType.toLocaleLowerCase() === 'days') {
                    appDate.setDate(apptDate[key].getDate() + setDatebyNumber * this.bookEvery);
                } else if (dateType.toLocaleLowerCase() === 'weeks') {
                    appDate.setDate(apptDate[key].getDate() + setDatebyNumber * 7 * this.bookEvery);
                } else {
                    appDate = this.addMonths(appDate, setDatebyNumber * this.bookEvery);
                }
                apptTimings[key] = appDate;
            }
        }

        return apptTimings;
    }



    modifyObject(listToModify: Array<any>, index) {
        const workersInfo = listToModify.map((obj) => {
            return {
                Duration_1__c: obj.Duration_1__c,
                Duration_2__c: obj.Duration_2__c,
                Duration_3__c: obj.Duration_3__c,
                Buffer_After__c: obj.Buffer_After__c,
                Duration__c: obj.Duration__c,
                Guest_Charge__c: obj.Guest_Charge__c,
                Id: obj.Id,
                // Name: obj.Name,   serviceName
                Net_Price__c: obj.Net_Price__c,
                //  name: obj.name,   workerName
                serviceGroupColour: obj.serviceGroupColour,
                //  serviceGroupName: obj.serviceGroupName.split('$')[0],
                serviceName: obj.Id,
                workerName: obj.workerName.split('$')[0],
                IsPackage: obj.IsPackage,
                Booked_Package__c: obj.Booked_Package__c
            };
        });
        return workersInfo[index];
    }

    setName(id, index, workerList): string {
        const name = workerList[index].filter((obj) => obj.workername === id)[0].name;
        return name;
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
    clearAppts() {
        this.appointmentData = [];
        this.clearErrorMsg();
    }
    getWorkersFromDate() {
        const serviceIds = [];
        const selectedIds = [];
        this.calculateEndDate();
        this.rows.filter((data) => {
            if (data['Id'] !== '' || !isNullOrUndefined(data['Id'])) {
                serviceIds.push(data['Id']);
                selectedIds.push(data['Id']);
            } else {
                serviceIds.push(data['']);
            }
        });
        if (selectedIds.length > 0) {
            const bookingdata = {
                bookingdate: this.commonService.getDBDatStr(this.bsValue),
                serviceIds: selectedIds
            };
            this.bookStandingApptService.getUsers(bookingdata).subscribe(data => {
                const workerservices = data['result'];
                serviceIds.forEach((id, i) => {
                    if (id !== '' && !isNullOrUndefined(id)) {
                        this.workerList[i] = workerservices.filter((worker) => worker.sId === id);
                        const isExsists = this.workerList[i].findIndex((worker) => worker.workername === this.rows[i]['workerName']) !== -1 ? true : false;
                        if (!isExsists) {
                            this.rows[i]['workerName'] = this.workerList[i].length > 0 ? this.workerList[i][0]['workername'] : '';
                            this.workerList[i].filter((worker) => worker.workername === this.workerName).map((worker) => {
                                Object.assign(this.rows[i], this.commonService.getServiceDurations(worker));
                            });
                            this.calculateServiceDurations(i);
                        }
                    }
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

    }
} // main Method end here
