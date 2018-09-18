/*
* Modify Component having following methods:
ngOnInit() : Method to loading athe page..
getApptDetails(apptid): Method to get appointment details.
getTimeFromDate(dateObj: Date): Method to get time from date.
getApptServiceDetails(clientId, apptId): Method to get services details.
addServices(): Method to add service rows.
removeServices(row, index): Method to remove rows.
getServiceGroups(): Method to get service groups.
categoryOfService(value, i): Method to get service names.
updatedurations(i): Method to update durations.
calculateServiceDurations(i): Method for calculation of services durations.
servicesListOnChange(value, i): Method to change service list.
workerListOnChange(value, i): Method to change worker.
getAllActivePackages(): Method to get packages.
getBookingData(): Method to get booking time hours data.
activeMemberCalendar(): Method to get active membercalendar and to fetch active members.
scheduleButtonShow(searchData, index): Method to get on select time and date.
searchForAppointment1(): Method to search for appointments.
searchForAppointment(): Method to search for appointments.
method(): Method to get timeHours.
method1(): Method for appointment date.
saveModifyAppointment(): Method to save modified appointment.
clearMsg() : Method for Clearing  error messages.
*/
import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl } from '@angular/platform-browser';
import { ModifyApptService } from './modifyappt.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { CommonService } from '../../common/common.service';
import { DatePipe } from '@angular/common';
import { isNullOrUndefined } from 'util';
@Component({
    selector: 'app-appointments-popup',
    templateUrl: './modifyappt.html',
    styleUrls: ['./modifyappt.css'],
    providers: [ModifyApptService, CommonService]
})
export class ModifyApptComponent implements OnInit {
    clientId: any;
    showDurations = false;
    apptid: any;
    rows = [];
    addServiceGroupName: any;
    serviceGroupName: any;
    serviceName: any;
    serviceDetailsList = [];
    serviceGroupList: any = [];
    serviceId: any;
    workerList = [];
    sumOfServiceDurations: any = 0;
    finalTimes = [];
    totalDuration: any;
    workerName: any;
    worker: any;
    type: any;
    packagesList: any;
    minDate: Date;
    bookAnyWayButtonValue: any = false;
    showDateTime: any = false;
    TimeData: any = [];
    bookingIntervalMinutes: any = 0;
    bookingDataList: any;
    public bsValue: any = new Date();
    modifyTime: any;
    modifyDate: any;
    showRows = [];
    apptSearchData: any = [];
    startTimeMins: any = [];
    maximumofAvailabilities: any;
    IntervalMinutes: any;
    workerTimes: any = [];
    startTimeHour: any = [];
    endTimeHour: any = [];
    endTimeMins: any = [];
    finalDate1: any;
    date1: any;
    selectedIndex = -1;
    serviceGroup: any;
    service: any;
    serviceNameError: any = '';
    daleteArray: any = [];
    apptmentId: any;
    dateAndTimeError: any = '';
    duration1Error: any = '';
    datePickerConfig: any;
    apptNotes: any;
    workersWithServiceDuration: any = [];
    workerHours = [];
    serviceDetailKeys = ['Duration_1__c', 'Duration_2__c', 'Duration_3__c',
        'Buffer_After__c', 'Guest_Charge__c', 'Net_Price__c'];
    appData: any;
    serviceHitCount = 0;
    IsBookingInitiated: any = false;
    bookingInterValError: any = '';
    checkBookingInterval = true;
    totalPrice = 0;
    showOptions = false;
    activeSelect = true;
    duplicateBookedRecords = [];
    serviceTax: any;
    constructor(
        private activatedRoute: ActivatedRoute,
        private modifyApptService: ModifyApptService,
        private translateService: TranslateService,
        @Inject('apiEndPoint') private apiEndPoint: string,
        @Inject('defaultActive') public defaultActive: string,
        @Inject('defaultInActive') public defaultInActive: string,
        private toastr: ToastrService,
        private commonService: CommonService,
        private router: Router) {
        this.minDate = new Date();
        this.datePickerConfig = Object.assign({},
            {
                showWeekNumbers: false,
                containerClass: 'theme-blue',
            });
        this.activatedRoute.queryParams.subscribe(params => {
            this.apptid = activatedRoute.snapshot.params['apptid'];
            this.clientId = activatedRoute.snapshot.params['clientId'];
            if (isNullOrUndefined(this.apptid)) {
                this.apptid = '';
            }
        });
    }
    /*Method for page Load */
    ngOnInit() {
        this.modifyApptService.getBookingData().subscribe(
            data => {
                this.bookingDataList = data['result'];
                this.bookingIntervalMinutes = this.bookingDataList.bookingIntervalMinutes;
                this.maximumofAvailabilities = this.bookingDataList.maximumAvailableToShow;
                this.IntervalMinutes = this.bookingDataList.bookingIntervalMinutes;
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
        this.getApptServiceDetails(this.clientId, this.apptid);
        //  this.getServiceGroups();   // 30-7-2018
        this.getAllActivePackages();
        this.getServRetTaxs();
    }
    /**
 * Method to get service tax  and retail tax calculation
 */
    getServRetTaxs() {
        this.modifyApptService.getServProdTax().subscribe(
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
    /* method to getTimeFromDate  */
    getTimeFromDate(dateObj: Date) {
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
        return elem;
    }
    updateBookedRecords() {
        if (this.serviceGroupList.length > 0 && this.rows.length > 0) {
            if (this.rows && this.rows.length > 0) {
                for (let i = 0; i < this.rows.length; i++) {
                    this.rows[i]['IsPackage'] = 0;
                    this.rows[i]['Booked_Package__c'] = '';
                    this.serviceDetailsList[i] = this.rows[i].servList;
                    console.log(this.serviceDetailsList[i])
                    this.workerList[i] = this.rows[i].workerList;
                    this.assaignServiceDurations(this.workerList[i], this.rows[i].workerName, i, true);
                    this.rows[i]['serviceName'] = this.rows[i]['Id'];
                    const pckgId = this.rows[i]['pckgId'];
                    if (!isNullOrUndefined(pckgId) && pckgId !== '') {
                        this.rows[i]['serviceGroup'] = pckgId;
                        this.rows[i]['IsPackage'] = 1;
                        this.rows[i]['Booked_Package__c'] = pckgId.split(':')[1];
                    } else {
                        const serviceGroup = this.rows[i]['serviceGroupName'];
                        this.serviceGroupList.filter((service) => service.serviceGroupName === serviceGroup).map((service) => {
                            this.rows[i]['serviceGroup'] = service.serviceGroupName + '$' + service.serviceGroupColor;
                        });
                    }
                    this.calculateServiceDurations(i);
                }
            }
        }
    }
    getWorkersFromDate() {
        const serviceIds = [];
        const selectedIds = [];
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
            this.modifyApptService.getUsers(bookingdata).subscribe(data => {
                const workerservices = data['result'];
                serviceIds.forEach((id, i) => {
                    if (id !== '' && !isNullOrUndefined(id)) {
                        this.workerList[i] = workerservices.filter((worker) => worker.sId === id);
                        const isExsists = this.workerList[i].findIndex((worker) => worker.workername === this.rows[i]['workerName']) !== -1 ? true : false;
                        if (!isExsists) {
                            this.rows[i]['workerName'] = this.workerList[i].length > 0 ? this.workerList[i][0]['workername'] : '';
                            this.assaignServiceDurations(this.workerList[i], this.rows[i]['workerName'], i);
                            this.calculateServiceDurations(i);
                        }
                    }
                });
                this.searchForAppointment1();
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
    IsNumeric(e) {
        let ret: boolean;
        const code = e.keyCode === 0 ? e.charCode : e.keyCode;
        const commonCondition: boolean = (code >= 48 && code <= 57) || (code === 8) || code >= 37 && code <= 40;
        if (commonCondition) { // check digits
            ret = true;
        } else {
            ret = false;
        }
        return ret;
    }
    workerListOnChange(value, i) {
        this.finalTimes = [];
        this.workerName = value;
        this.IsBookingInitiated = false;
        this.bookingInterValError = '';
        this.duration1Error = '';
        this.assaignServiceDurations(this.workerList[i], this.workerName, i);
        this.calculateServiceDurations(i);
        this.searchForAppointment1();
        // this.clientdata = JSON.parse(localStorage.getItem('bookstanding'));
    }

    assaignServiceDurations(workers: Array<any>, workerId: string, index: number, onLoading?: boolean) {
        const selectedWorker = workers.filter((worker) => worker.workername === workerId).map((worker) => {
            if (!onLoading) {
                Object.assign(this.rows[index], this.commonService.getServiceDurations(worker));
            }
        });
        if (selectedWorker.length === 0) {
            const serviceIndex = this.serviceDetailsList[index].findIndex((service) => service.Id === this.rows[index]['Id']);
            this.workerList[index].push(
                {
                    workername: workerId,
                    name: '(' + this.rows[index].name + ')',
                    sduration1: this.serviceDetailsList[index][serviceIndex]['Duration_1__c'],
                    sduration2: this.serviceDetailsList[index][serviceIndex]['Duration_2__c'],
                    sduration3: this.serviceDetailsList[index][serviceIndex]['Duration_3__c'],
                    sbuffer: this.serviceDetailsList[index][serviceIndex]['Buffer_After__c'],
                    sDuration_1_Available_for_Other_Work__c: this.serviceDetailsList[index][serviceIndex]['Duration_1_Available_for_Other_Work__c'],
                    sDuration_2_Available_for_Other_Work__c: this.serviceDetailsList[index][serviceIndex]['Duration_2_Available_for_Other_Work__c'],
                    sDuration_3_Available_for_Other_Work__c: this.serviceDetailsList[index][serviceIndex]['Duration_3_Available_for_Other_Work__c'],
                    Net_Price__c: this.serviceDetailsList[index][serviceIndex]['Net_Price__c'],
                    Guest_Charge__c: this.serviceDetailsList[index][serviceIndex]['Guest_Charge__c'],
                    Taxable__c: this.serviceDetailsList[index][serviceIndex]['Taxable__c']
                });
            // const serviceDetails = this.rows[index].serviceName.split('$');
            // this.rows[index]['Duration_1__c'] = +serviceDetails[1];
            // this.rows[index]['Duration_2__c'] = +serviceDetails[2];
            // this.rows[index]['Duration_3__c'] = +serviceDetails[3];
            // this.rows[index]['Buffer_After__c'] = +serviceDetails[4];
            // this.rows[index]['Guest_Charge__c'] = +serviceDetails[5];
            // this.rows[index]['Net_Price__c'] = +serviceDetails[6];
            // this.rows[index]['Duration_1_Available_for_Other_Work__c'] = this.rows[index]['sDuration1Available'];
            // this.rows[index]['Duration_2_Available_for_Other_Work__c'] = this.rows[index]['sDuration2Available'];
            // this.rows[index]['Duration_3_Available_for_Other_Work__c'] = this.rows[index]['sDuration3Available'];
            // this.workerList[index].push({ workername: workerId, name: '(' + this.rows[index].name + ')' });
        }
    }
    removeServiceDetails(index) {
        this.serviceDetailKeys.map((key) => {
            delete this.rows[index][key];
        });
    }
    /* Method to get service details */
    getApptServiceDetails(clientId, apptId) {
        const reqDate = this.commonService.getDBDatStr(new Date());
        this.modifyApptService.getApptServices(clientId, apptId, reqDate).subscribe(data => {
            const resData = data['result'];
            this.rows = resData.srvcresult;
            this.duplicateBookedRecords.push(resData.srvcresult);
            this.appData = resData.apptrst[0];
            this.apptNotes = this.appData.notes === 'null' || this.appData.notes === 'undefined' ? null : this.appData.notes;
            // 30-7-2018
            this.serviceGroupList = resData.srvgResult;
            this.serviceGroupName = this.serviceGroupList.length > 0 ? this.serviceGroupList[0].serviceGroupName + '$' + this.serviceGroupList[0].serviceGroupColor : undefined;
            // 30-7-2018
            this.updateBookedRecords();
            this.bsValue = this.commonService.getDateTmFrmDBDateStr(this.appData.Appt_Date_Time__c);
            this.modifyTime = new DatePipe('en-Us').transform(this.bsValue, 'hh:mm a');
            this.checkForTime();
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
    /*method to add rows */
    addServices(i) {
        this.rows.push({
            workerName: '', Id: '', serviceGroup: this.serviceGroupName, IsPackage: 0, Booked_Package__c: '',
            Duration_1__c: '', Duration_2__c: '', Duration_3__c: '', Buffer_After__c: '', Rebooked__c: 0, apptId: ''
        });
        const index = this.rows.length - 1;
        this.workerList[i] = [];
        this.serviceDetailsList[i] = [];
        if (index !== 0) {
            this.categoryOfService(this.serviceGroupName, index);
        }
    }
    /*method to remove rows */
    removeServices(row, index) {
        if (this.rows[index].tsId) {
            this.rows[index]['delete'] = true;
            this.daleteArray.push(this.rows[index]);
        }
        this.rows.splice(index, 1);
        this.workerList.splice(index, 1);
        this.serviceDetailsList.splice(index, 1);
        this.calculateServiceDurations(index);
        this.bookAnyWayButtonValue = false;
        this.clearMsg();
        this.searchForAppointment1();
    }
    /*method to get service groups */
    getServiceGroups() {
        const reqDate = this.commonService.getDBDatStr(this.bsValue);
        this.modifyApptService.getServiceGroups('Service', reqDate).subscribe(data => {
            this.serviceGroupList = [];
            this.serviceGroupList = data['result']
                .filter(filterList => filterList.active && !filterList.isSystem);
            this.serviceGroupName = this.serviceGroupList[0].serviceGroupName + '$' + this.serviceGroupList[0].serviceGroupColor;
            this.updateBookedRecords();
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

    /*method to get servcie names */
    categoryOfService(value, i) {
        if (value.indexOf('scale') === 0) {
            this.type = 'Package';
        } else {
            this.type = 'ApptService';
        }
        const serviceGroupName = value.split('$')[0];
        //    this.rows[i].serviceGroupColour = value.split('$')[1];
        this.serviceDetailsList[i] = [];
        // if (this.workerList[i]) {
        //     delete this.workerList[i];
        // }
        this.workerList[i] = [];
        this.rows[i].Id = '';
        this.rows[i].serviceName = '';
        this.rows[i].workerName = '';
        this.removeServiceDetails(i);
        this.calculateServiceDurations(i);
        this.modifyApptService.getServices(serviceGroupName, this.type, this.commonService.getDBDatStr(this.bsValue)).subscribe(data => {
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
                let updateRow;
                if (this.rows[i]) {
                    if (this.rows[i].tsId) {
                        updateRow = this.rows[i];
                    }
                    this.rows.splice(i, 1);
                }
                const length = this.rows.length;
                services.filter((service, index) => {
                    this.rows.push({ Id: '', serviceGroup: DupserviceGroupName, Rebooked__c: 0, apptId: '' });

                    this.rows[length + 0] = updateRow ? updateRow : this.rows[length + 0];
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
                    this.rows[length + index]['serviceGroup'] = this.rows[length]['serviceGroup'];
                    this.rows[length + index]['workerName'] = workers.length > 0 ? workers[0].workername : '';
                    this.rows[length + index]['serviceName'] = service.Id;
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


    calculateServiceDurations(i) {
        this.bookingInterValError = '';
        this.checkBookingInterval = false;
        if (this.rows && this.rows.length > 0) {
            this.sumOfServiceDurations = 0;
            this.totalPrice = 0;
            let isDurationEmpty = 0;
            for (let j = 0; j < this.rows.length; j++) {
                let totalDuration = 0;
                if (!isNullOrUndefined(this.rows[j]['workerName']) && this.rows[j]['workerName'] !== '') {
                    totalDuration += +this.rows[j]['Duration_1__c'];
                    totalDuration += +this.rows[j]['Duration_2__c'];
                    totalDuration += +this.rows[j]['Duration_3__c'];
                    totalDuration += +this.rows[j]['Buffer_After__c'];
                    this.totalPrice += +this.rows[j]['Net_Price__c'];
                    if (+this.rows[j]['Duration_1__c'] === 0 || this.rows[j]['Duration_1__c'] === '') {
                        isDurationEmpty++;
                        this.duration1Error = 'Duration 1 is required and should be grater than 0';
                    }
                    this.rows[j].Duration__c = totalDuration;
                    this.sumOfServiceDurations = this.sumOfServiceDurations + totalDuration;
                    if (totalDuration % this.bookingIntervalMinutes !== 0 || this.sumOfServiceDurations % this.bookingIntervalMinutes !== 0) {
                        this.bookingInterValError = `The service total duration must be a multiple of the appointment booking ${this.bookingIntervalMinutes} minute interval`;
                    }
                }
            }
            this.duration1Error = isDurationEmpty > 0 ? this.duration1Error : '';
        }
        // this.searchForAppointment1();
    }
    servicesListOnChange(serviceId, i) {
        this.finalTimes = [];
        this.rows[i].Id = serviceId;
        this.rows[i].serviceName = serviceId;
        this.workerList[i] = [];
        this.rows[i].workerName = '';
        this.calculateServiceDurations(i);
        this.removeServiceDetails(i);
        const bookingdata = {
            bookingdate: this.commonService.getDBDatStr(this.bsValue),
            serviceIds: [this.rows[i].Id]
        };
        this.modifyApptService.getUsers(bookingdata).subscribe(data => {
            this.workerList[i] = data['result'];
            if (data['result']) {
                if (this.workerList[i].length > 0) {
                    this.rows[i].workerName = this.workerList[i][0].workername;
                    this.rows[i].name = this.workerList[i][0].name;
                    this.workerListOnChange(this.rows[i].workerName, i);
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
            });
    }



    /*Method to get packages */
    getAllActivePackages() {
        this.modifyApptService.getAllActivePackages()
            .subscribe(data => {
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
                });
    }

    setWorkerServiceDuration() {
        let serviceStartDate: Date = this.commonService.timeConversionToDate(this.modifyTime, this.bsValue);
        this.workersWithServiceDuration = [];
        let apptDuration: { 'startTime': Date, 'endTime': Date };
        this.rows.forEach((obj, i) => {
            if (obj['workerName']) {
                const duration = obj['Duration__c'];
                const apptStartDate: Date = serviceStartDate;
                const apptEndDate: Date = this.setEndTime(apptStartDate, duration);
                apptDuration = {
                    'startTime': apptStartDate,
                    'endTime': apptEndDate
                };
                serviceStartDate = apptEndDate;
                this.workersWithServiceDuration.push(apptDuration);
            } else {
                this.workersWithServiceDuration.push({
                    'startTime': '',
                    'endTime': ''
                });
            }
        });
    }

    setEndTime(date: Date, time): Date {
        const selectedDate = new Date(date.getTime());
        selectedDate.setTime(date.getTime() + (time * 60 * 1000));
        return selectedDate;
    }



    /* Method to get on select time and date */
    scheduleButtonShow(searchData, index) {
        const selectedTime = new DatePipe('en-Us').transform(searchData, 'hh:mm a');
        this.modifyTime = selectedTime;
        this.bsValue = new Date(searchData);
        // this.modifyTime = searchData.split(' ')[1] + ' ' + searchData.split(' ')[2];
        this.selectedIndex = index;
    }




    searchForAppointment1(isSaving?: boolean) {
        this.activeSelect = false;
        if (this.bookingInterValError !== '' && this.duration1Error !== '') {
            this.checkBookingInterval = false;
            window.scrollTo(0, 0);
        }
        this.workerHours = [];
        this.setWorkerServiceDuration();
        this.dateAndTimeError = '';
        const ids = [];
        let workerIds = '';
        for (let j = 0; j < this.rows.length; j++) {
            workerIds += "'" + this.rows[j].workerName + "',";
            ids.push(this.rows[j].workerName);
            this.workersWithServiceDuration[j]['workerId'] = this.rows[j].workerName;
        }
        workerIds = workerIds.slice(0, -1);
        const startdate = this.workersWithServiceDuration[0].startTime;
        const endDate = this.workersWithServiceDuration[this.rows.length - 1].endTime;

        const searchObj = {
            'Worker__c': workerIds,
            'Appt_Start': this.commonService.getDBDatTmStr(startdate).split(' ')[0],
            'Appt_End': this.commonService.getDBDatTmStr(endDate).split(' ')[0],
            // 'serviceId': this.serviceId,
            'page': 'modify',
            'apptId': this.apptid
        };
        this.finalTimes = [];
        this.modifyApptService.searchAppt(searchObj).subscribe(data => {
            this.activeSelect = true;
            this.workerHours = data['result']['companyhours'];
            const apptList = data['result']['result'];
            for (let i = 0; i < this.rows.length; i++) {
                const workerTime = this.workersWithServiceDuration[i];
                if (this.rows[i]['workerName']) {
                    if (this.commonService.checkWorkerServiceStatus(workerTime.startTime, workerTime.endTime, workerTime.workerId, this.workerHours)) {
                        this.dateAndTimeError = 'MODIFY_APPT.APPOINTMENT_DATEANDTIME_ERROR_MSG';
                    } else {
                        if (apptList.length > 0) {
                            for (let j = 0; j < apptList.length; j++) {
                                if (this.rows[i]['workerName'] === apptList[j]['workerId'] && this.rows[i]['apptId'] !== apptList[j]['Id']) {
                                    const apptDuration = data['result']['result'][j]['Service_Duration'];
                                    const apptStartTime = this.commonService.getDateTmFrmDBDateStr(data['result']['result'][j]['Booking_Date_Time']);
                                    const apptEndDate = new Date(apptStartTime.getTime() + parseInt(apptDuration, 10) * 60000);
                                    if (this.commonService.compareDatesForAppointment(apptStartTime, apptEndDate, workerTime.startTime, workerTime.endTime)) {
                                        this.dateAndTimeError = 'MODIFY_APPT.APPOINTMENT_DATEANDTIME_ERROR_MSG';
                                        break;
                                    }
                                }
                            }
                        }
                    }
                }
            }
            if (isSaving) {
                if (!this.dateAndTimeError) {
                    this.modifyAppt();
                } else {
                    window.scrollTo(0, 0);
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
            });
    }
    /* Method to get timeHours */
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
        this.checkForTime();
    }

    checkForTime() {
        if (this.rows.length > 0 && this.TimeData.length > 0) {
            this.showOptions = this.TimeData.filter((time) => time === this.modifyTime).length === 0 ? true : false;
        }
    }
    /* Method to save modified appointment */
    saveModifyAppointment() {
        if (this.checkForServices(this.rows, 'serviceGroup', 'Id', 'workerName')) {
            this.serviceNameError = 'BOOKSTANDING_APPT.VALID_NO_BLANK_SERVICE_FIELD';
            window.scrollTo(0, 0);
        } else if (this.bookingInterValError !== '' || this.duration1Error !== '') {
            this.IsBookingInitiated = true;
            this.checkBookingInterval = true;
            window.scrollTo(0, 0);
        } else {
            if (this.dateAndTimeError) {
                this.modifyAppt();
            } else {
                this.searchForAppointment1(true);
            }
        }
    }

    modifyAppt() {
        // const otherDetails = ['Duration_1_Available_for_Other_Work__c', 'Duration_2_Available_for_Other_Work__c',
        //     'Duration_3_Available_for_Other_Work__c'];
        // otherDetails.map((key) => {
        //     this.rows.map((data) => {
        //         data[key] = data[key] ? this.defaultActive : this.defaultInActive;
        //         return data;
        //     });
        // });
        let startTimeHour: any = 0;
        let startTimeMins = 0;
        if (this.modifyTime.split(' ')[1] === 'AM') {
            startTimeHour = this.modifyTime.split(' ')[0].split(':')[0];
            startTimeMins = this.modifyTime.split(' ')[0].split(':')[1];
        } else if (this.modifyTime.split(' ')[1] === 'PM') {
            startTimeHour = this.modifyTime.split(' ')[0].split(':')[0];
            if (parseInt(startTimeHour, 10) !== 12) {
                startTimeHour = parseInt(startTimeHour, 10) + 12;
            }
            startTimeMins = this.modifyTime.split(' ')[0].split(':')[1];
        }
        // new Date(this.bsValue.getFullYear(), this.bsValue.getMonth(),
        //    this.bsValue.getDate(), startTimeHour, startTimeMins),
        const apptDate = this.commonService.getDBDatTmStr(new Date(this.bsValue.getFullYear(), this.bsValue.getMonth(),
            this.bsValue.getDate(), startTimeHour, startTimeMins));
        const IsPackage = this.rows.filter((obj) => obj['IsPackage'] === 1).length > 0 ? true : false;
        const serviceTaxResult = this.commonService.calculateServiceTax(+this.serviceTax, this.rows, IsPackage);
        const servicesData = serviceTaxResult.bookingData;
            for (let i = 0; i < servicesData.length; i++) {
                for (let j = 0; j < this.serviceDetailsList[i].length; j++) {
                    if (this.serviceDetailsList[i][j]['Id'] === servicesData[i]['Id']) {
                        servicesData[i]['Resources__c'] = this.serviceDetailsList[i][j]['Resources__c'];
                    }
                }
            }
        const modifyBookingData = {
            'Client_Type__c': this.appData.visttype,
            'Client__c': this.clientId,
            'Duration__c': this.sumOfServiceDurations,
            'Appt_Date_Time__c': apptDate,
            'servicesData': serviceTaxResult.bookingData,
            'apptId': this.apptid,
            'daleteArray': this.daleteArray,
            'Rebooked__c': 0,
            'IsPackage': IsPackage ? 1 : 0,
            'Notes__c': this.apptNotes,
            'Service_Tax__c': serviceTaxResult.serviceTax,
            'Service_Sales__c': serviceTaxResult.sales,
            'Status__c': this.appData.apstatus,
            'bookingType': 'modify'
        };
        this.modifyApptService.modifyAppointment(modifyBookingData).subscribe(data => {
            this.router.navigate(['/appointments'], { queryParams: { date: apptDate.split(' ')[0] } }).then(() => {
                const toastermessage: any = this.translateService.get('MODIFY_APPT.MODIFIED_SUCCESS');
                this.toastr.success(toastermessage.value, null, { timeOut: 2000 });
            });
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
    checkForServices(services: Array<any>, property1, property2, property3): boolean {
        const properties = [property1, property2, property3];
        if (properties.map((property) => this.checkForServiceObject(services, property)).indexOf(false) !== -1) {
            return true;
        }
        return false;
    }
    searchForAppointment() {
        if (this.checkForServices(this.rows, 'serviceGroup', 'Id', 'workerName')) {
            this.serviceNameError = 'BOOKSTANDING_APPT.VALID_NO_BLANK_SERVICE_FIELD';
            window.scrollTo(0, 0);
        } else {
            const searchDate = this.bsValue.getFullYear()
                + '-' + ('0' + (this.bsValue.getMonth() + 1)).slice(-2)
                + '-' + ('0' + this.bsValue.getDate()).slice(-2);
            const workerIds = [];
            const durations = [];
            for (let i = 0; i < this.rows.length; i++) {
                workerIds.push(this.rows[i].workerName);
                durations.push(this.rows[i].Duration__c);
            }

            const dataObj = {
                'date': searchDate,
                'id': workerIds,
                'dateformat': 'MM/DD/YYYY hh:mm:ss a',
                'durations': durations,
                'mindate': this.commonService.getDBDatTmStr(new Date())
            };
            this.modifyApptService.searchForAppts(dataObj)
                .subscribe(data => {
                    this.apptSearchData = data['result'];
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
    clearReports() {
        this.selectedIndex = undefined;
        this.apptSearchData = [];
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
    /* Method to clear error messages */
    clearMsg() {
        this.serviceNameError = '';
        this.duration1Error = '';
    }
}
