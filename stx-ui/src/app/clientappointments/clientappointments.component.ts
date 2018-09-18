import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import * as moment from 'moment/moment';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ClientappointmentsService } from './clientappointments.service';
import { ModalDirective } from 'ngx-bootstrap/modal';
import * as config from '../app.config';
import { parse } from 'querystring';
import { Conditional } from '@angular/compiler';
import { CommonService } from '../common/common.service';
import { isNullOrUndefined } from 'util';
@Component({
    selector: 'app-home-popup',
    templateUrl: './clientappointments.html',
    styleUrls: ['./clientappointments.component.css'],
    providers: [ClientappointmentsService, CommonService]
})
export class ClientappointmentsComponent implements OnInit {
    minDate: Date;
    public bsValue: any = new Date();
    visitTypesList: any;
    visitTypeValue: any = '';
    selectedServiceGroup: any;
    addServiceGroupName: any;
    serviceGroupList: any = [];
    packagesList: any;
    serviceDetailsList = [];
    rows = [];
    serviceId: any;
    serviceName: any;
    serviceDuration1: any;
    serviceDuration2: any;
    serviceDuration3: any;
    sumOfServiceDurations: any = 0;
    serviceGroupName: any;
    workerList = [];
    worker: any;
    apptSearchData: any;
    book = [];
    bookingDataList: any;
    bookingIntervalMinutes: any = 0;
    bookingIntervalMinutes1: any;
    maximumofAvailabilities: any;
    maximumofAvailabilities1 = 0;
    IntervalMinutes: any;
    workerName: any;
    calendarList: any;
    dt: any;
    dt1: any;
    booking: any;
    booking1: any;
    day: any;
    workerTimes: any;
    startTimeHour: any = [];
    startTimeMins: any = [];
    endTimeHour: any = [];
    endTimeMins: any = [];
    daleteArray: any = [];
    times = [];
    finalTimes = [];
    finalDate = [];
    error8: any;
    error9: any = '';
    error10: any;
    textBoldlist: any;
    selectedIndex = -1;
    apptDate: any;
    apptNotes: any;
    showScheduleButton = false;
    reScheduleButton = false;
    showWaitinglist = false;
    clientId: any;
    appointmentId: any;
    finalDate1: any;
    type: any;
    date1: any;
    error: any;
    apptmentId: any;
    serviceGroupColour: any;
    apptData: any;
    datePickerConfig: any;
    isRebooking: number;
    bookApptErr: any = '';
    clientData: any;
    showCliName: any;
    serviceDetailKeys = ['Duration_1__c', 'Duration_2__c', 'Duration_3__c',
        'Buffer_After__c', 'Guest_Charge__c', 'Net_Price__c'];
    serviceTax: any;
    @ViewChild('serviceNotesModal') public serviceNotesModal: ModalDirective;
    constructor(private clientappointmentsService: ClientappointmentsService,
        private route: ActivatedRoute,
        private toastr: ToastrService,
        private translateService: TranslateService,
        private router: Router,
        private commonService: CommonService,
        private sanitizer: DomSanitizer) {
        this.minDate = new Date();
        this.datePickerConfig = Object.assign({},
            {
                showWeekNumbers: false,
                containerClass: 'theme-blue',
            });
        this.route.queryParamMap.subscribe(params => {
            if (params.has('bookingType')) {
                if (params.get('bookingType') === 'rebook') {
                    this.isRebooking = 1;
                }
            } else {
                this.isRebooking = 0;
            }
        });
        this.route.paramMap.subscribe((params) => {
            this.clientId = params.get('clientId');
            this.appointmentId = params.get('appointmentId');
        });
    }

    ngOnInit() {
        this.getClientData(this.clientId);
        this.listVisitTypes();
        // this.getServiceGroupsList();

        // this.addServices(0);
        this.getAllActivePackages();
        if (this.appointmentId) {
            this.getApptServiceDetails(this.clientId, this.appointmentId);
        } else {
            this.getServiceGroups(this.appointmentId);
        }
        this.getServRetTaxs();
    }
    /**
* Method to get service tax  and retail tax calculation
*/
    getServRetTaxs() {
        this.clientappointmentsService.getServProdTax().subscribe(
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

    updateBookedRecords() {
        if (this.serviceGroupList.length > 0 && this.rows.length > 0) {
            if (this.rows && this.rows.length > 0) {
                for (let i = 0; i < this.rows.length; i++) {
                    this.rows[i]['IsPackage'] = 0;
                    this.rows[i]['Booked_Package__c'] = '';
                    if (this.isRebooking === 1) {
                        this.rows[i]['Rebooked__c'] = this.isRebooking;
                    }
                    this.serviceDetailsList[i] = this.rows[i].servList;
                    this.workerList[i] = this.rows[i].workerList;
                    this.assaignServiceDurations(this.workerList[i], this.rows[i].workerName, i);
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
    getApptServiceDetails(clientId, apptId) {
        const reqDate = this.commonService.getDBDatStr(new Date());
        this.clientappointmentsService.getApptServices(clientId, apptId, reqDate).subscribe(data => {
            const resData = data['result'];
            this.rows = resData.srvcresult;
            const serviceList = [];
            const workerList = [];
            // 30-7-2018
            this.serviceGroupList = resData.srvgResult;
            this.serviceGroupName = this.serviceGroupList.length > 0 ? this.serviceGroupList[0].serviceGroupName + '$' + this.serviceGroupList[0].serviceGroupColor : undefined;
            // 30-7-2018
            this.updateBookedRecords();
            // for (let j = 0; j < serviceList.length; j++) {
            //     // this.serviceDetailsList[j] = serviceList[j];
            //     // this.workerList[j] = workerList[j];
            //     this.rows[j]['Name'] = this.rows[j]['Id'] + this.rows[j]['Duration_1__c'] + this.rows[j]['Duration_2__c'] + this.rows[j]['Duration_3__c']
            //         + this.rows[j]['Buffer_After__c'] + this.rows[j]['Guest_Charge__c'];
            //     this.rows[j]['serviceGroupName'] = resData.srvcresult[j]['serviceGroupName'] + resData.srvcresult[j]['serviceGroupColour'];
            // }

            if (this.rows.length <= 0) {
                // this.addServices(0);
            } else {
                const appData = resData.apptrst[0];
                // this.bsValue = new Date(appData.Appt_Date_Time__c);
                if (appData.Client_Type__c && appData.Client_Type__c !== 'null' && appData.Client_Type__c !== 'undefined') {
                    this.visitTypeValue = appData.Client_Type__c;
                } else {
                    this.visitTypeValue = '';
                }
                this.apptNotes = appData.Notes__c === 'null' || appData.Notes__c === 'undefined' ? null : appData.Notes__c;
                // this.sumOfServiceDurations = appData.Duration__c;

            }
        },
            error => {
                // this.rows = [{}];
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
    getClientData(clientId) {
        this.clientappointmentsService.getClient(clientId)
            .subscribe(data => {
                this.clientData = data['result'].results[0];
                this.showCliName = data['result'].results[0].FirstName + ' ' + data['result'].results[0].LastName;
                // document.getElementById('displayNameId').innerHTML = 'Appointments: Booking - ' + this.clientData.FirstName + ' ' + this.clientData.LastName;
                // document.getElementById('displayNameId').innerHTML = '- ' + this.clientData.FirstName + ' ' + this.clientData.LastName;
                if (!this.appointmentId) {
                    if (this.clientData.Booking_Restriction_Type__c === 'Do Not Book' || this.clientData.Booking_Restriction_Type__c === 'Alert Only') {
                        this.serviceNotesModal.show();
                    }
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
    listVisitTypes() {
        this.clientappointmentsService.getVisitTypes().subscribe(
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
                        if (statuscode === '2085' || statuscode === '2071') {
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
    onVisitTypeChange(value) {
        if (value !== '') {
            this.visitTypeValue = value;
        }

    }
    bookAnyWay() {
        this.serviceNotesModal.hide();
    }
    getServiceGroups(apptId) {
        const reqDate = this.commonService.getDBDatStr(this.bsValue);
        this.clientappointmentsService.getServiceGroups('Service', reqDate).subscribe(data => {
            this.serviceGroupList = [];
            this.serviceGroupList = data['result']
                .filter(filterList => filterList.active && !filterList.isSystem);
            this.serviceGroupName = this.serviceGroupList[0].serviceGroupName + '$' + this.serviceGroupList[0].serviceGroupColor;
            if (!apptId) {
                this.addServices(0);
                this.categoryOfService(this.serviceGroupName, 0);
            } else {
                this.updateBookedRecords();
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
    categoryOfService(value, i) {
        this.finalTimes = [];
        if (value.indexOf('scale') === 0) {
            this.type = 'Package';
        } else {
            this.type = 'ApptService';
        }
        const serviceGroupName = value.split('$')[0];

        // this.rows[i].serviceGroupColour = value.split('$')[1];
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
        this.clientappointmentsService.getServices(serviceGroupName, this.type, this.commonService.getDBDatStr(this.bsValue)).subscribe(data => {
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
    calculateServiceDurations(i) {
        if (this.rows && this.rows.length > 0) {
            this.sumOfServiceDurations = 0;
            for (let j = 0; j < this.rows.length; j++) {
                let totalDuration = 0;
                if (!isNullOrUndefined(this.rows[j]['workerName']) && this.rows[j]['workerName'] !== '') {
                    totalDuration += +this.rows[j]['Duration_1__c'];
                    totalDuration += +this.rows[j]['Duration_2__c'];
                    totalDuration += +this.rows[j]['Duration_3__c'];
                    totalDuration += +this.rows[j]['Buffer_After__c'];
                    this.rows[j].Duration__c = totalDuration;
                    this.sumOfServiceDurations = this.sumOfServiceDurations + totalDuration;
                }

            }
        }
    }

    getWorkersFromDate() {
        this.clear();
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
            this.clientappointmentsService.getUsers(bookingdata).subscribe(data => {
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
    servicesListOnChange(serviceId, i) {
        /*  below  description is used to show the service description for the service*/
        let temp = [];
        temp = this.serviceDetailsList[i].filter((obj) => obj.Id === serviceId);
        if (temp && temp.length > 0) {
            this.rows[i]['desc'] = temp[0]['Description__c'];
        }
        /* end of service description */
        this.finalTimes = [];
        this.workerList[i] = [];
        this.rows[i].workerName = '';
        this.rows[i].Id = serviceId;
        this.removeServiceDetails(i);
        this.calculateServiceDurations(i);
        const bookingdata = {
            bookingdate: this.commonService.getDBDatStr(this.bsValue),
            serviceIds: [this.rows[i].Id]
        };
        this.clientappointmentsService.getUsers(bookingdata).subscribe(data => {
            this.workerList[i] = data['result'];
            if (data['result'] && data['result'].length > 0) {
                this.rows[i].workerName = this.workerList[i][0].workername;
                this.workerListOnChange(this.rows[i].workerName, i);
                this.showWaitinglist = true;
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
        this.finalTimes = [];
        this.workerName = value;
        this.assaignServiceDurations(this.workerList[i], this.workerName, i);
        this.calculateServiceDurations(i);
        // this.clientdata = JSON.parse(localStorage.getItem('bookstanding'));
    }

    assaignServiceDurations(workers: Array<any>, workerId: string, index: number) {
        const selectedWorker = workers.filter((worker) => worker.workername === workerId).map((worker) => {
            Object.assign(this.rows[index], this.commonService.getServiceDurations(worker));
        });
        if (selectedWorker.length === 0) {
            const serviceDetails = this.rows[index].serviceName.split('$');
            this.rows[index]['Duration_1__c'] = +serviceDetails[1];
            this.rows[index]['Duration_2__c'] = +serviceDetails[2];
            this.rows[index]['Duration_3__c'] = +serviceDetails[3];
            this.rows[index]['Buffer_After__c'] = +serviceDetails[4];
            this.rows[index]['Guest_Charge__c'] = +serviceDetails[5];
            this.rows[index]['Net_Price__c'] = +serviceDetails[6];
            this.rows[index]['Duration_1_Available_for_Other_Work__c'] = this.rows[index]['sDuration1Available'];
            this.rows[index]['Duration_2_Available_for_Other_Work__c'] = this.rows[index]['sDuration2Available'];
            this.rows[index]['Duration_3_Available_for_Other_Work__c'] = this.rows[index]['sDuration3Available'];
            this.workerList[index].push({ workername: workerId, name: '(' + this.rows[index].name + ')' });
        }
    }

    removeServiceDetails(index) {
        this.serviceDetailKeys.map((key) => {
            delete this.rows[index][key];
        });
    }
    clearErrMsg() {
        this.error8 = '';
        this.error9 = '';
        this.error10 = '';
        this.finalTimes = [];
        this.bookApptErr = '';
    }
    getBookingData() {

        // for (let i = 0; i < this.rows.length; i++) {
        //     if (this.rows[i].serviceName === undefined || this.rows[i].serviceName === 'undefined'
        //         || this.rows[i].serviceName === '') {
        //         this.error9 = 'A service must be selected for each line(s)';
        //     }
        // }
        if (this.error9 !== '') {
            this.error9 = 'A service must be selected for each line(s)';
        } else {
            this.clientappointmentsService.getBookingData().subscribe(
                data => {
                    this.bookingDataList = data['result'];
                    this.bookingIntervalMinutes = this.bookingDataList.bookingIntervalMinutes;
                    this.maximumofAvailabilities = this.bookingDataList.maximumAvailableToShow;
                    this.IntervalMinutes = this.bookingDataList.bookingIntervalMinutes;
                    this.activeMemberCalendar();
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
    activeMemberCalendar() {

        let serviceIds = '';
        let workerIds = '';
        for (let i = 0; i < this.rows.length; i++) {
            workerIds += '\'' + this.rows[i].workerName + '\',';
            serviceIds += '\'' + this.rows[i].Id + '\',';
        }
        workerIds = '(' + workerIds.slice(0, -1) + ')';
        serviceIds = '(' + serviceIds.slice(0, -1) + ')';
        const dataObj = {
            'serviceIds': serviceIds,
            'workerIds': workerIds,
            'clientId': this.clientId,
            'searchDay': moment(this.bsValue).format('dddd')
        };
        this.clientappointmentsService.fetchingActiveMembers(dataObj).subscribe(
            data => {
                this.workerTimes = data['result'];
                for (let i = 0; i < this.workerTimes.length; i++) {
                    if (this.workerTimes[i].starttime.split(' ')[1] === 'AM') {
                        this.startTimeHour[i] = this.workerTimes[i].starttime.split(' ')[0].split(':')[0];
                        this.startTimeMins[i] = this.workerTimes[i].starttime.split(' ')[0].split(':')[1];
                    } else if (this.workerTimes[i].starttime.split(' ')[1] === 'PM') {
                        this.startTimeHour[i] = this.workerTimes[i].starttime.split(' ')[0].split(':')[0];
                        this.startTimeHour[i] = parseInt(this.startTimeHour, 10) + 12;
                        this.startTimeMins[i] = this.workerTimes[i].starttime.split(' ')[0].split(':')[1];
                    }
                    if (this.workerTimes[i].endtime.split(' ')[1] === 'AM') {
                        this.endTimeHour[i] = this.workerTimes[i].endtime.split(' ')[0].split(':')[0];
                        this.endTimeMins[i] = this.workerTimes[i].endtime.split(' ')[0].split(':')[1];
                    } else if (this.workerTimes[i].endtime.split(' ')[1] === 'PM') {
                        this.endTimeHour[i] = this.workerTimes[i].endtime.split(' ')[0].split(':')[0];
                        if (parseInt(this.endTimeHour[i], 10) === 12) {
                            this.endTimeHour[i] = parseInt(this.endTimeHour[i], 10);
                        } else {
                            this.endTimeHour[i] = parseInt(this.endTimeHour[i], 10) + 12;
                        }
                        this.endTimeMins[i] = this.workerTimes[i].endtime.split(' ')[0].split(':')[1];
                    }
                }
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
    searchForAppointment() {
        if (this.checkForServices(this.rows, 'serviceGroup', 'serviceName', 'workerName')) {
            this.bookApptErr = 'BOOKSTANDING_APPT.VALID_NO_BLANK_SERVICE_FIELD';
            window.scrollTo(0, 0);
        } else {
            this.selectedIndex = undefined;
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
            this.clientappointmentsService.searchForAppts(dataObj)
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

    clear() {
        this.apptSearchData = [];
        this.showScheduleButton = false;
        this.reScheduleButton = false;
        this.showWaitinglist = false;
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
    // searchForAppointment() {
    //     this.finalTimes = [];
    //     this.finalDate = [];
    //     // const clientdata = JSON.parse(localStorage.getItem('clientData'));
    //     const dataObj = {
    //         'date': this.bsValue,
    //         // 'worker': this.rows[0].workerName,
    //         // 'visitType': this.visitTypeValue,
    //         // 'clientId': this.clientId,
    //         'workerData': this.rows
    //     };
    //     this.clientappointmentsService.searchAppt(dataObj).subscribe(data => {
    //         this.apptSearchData = data['result'];
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
    method() {
        for (let j = 0; j < this.startTimeMins.length; j++) {
            for (let i = 0; i < this.maximumofAvailabilities; i++) {
                let startSlot;
                let endSlot;
                if (this.apptSearchData.length > 0) {
                    startSlot = new Date(this.apptSearchData[j].Appt_Date_Time__c);
                    endSlot = new Date(startSlot.getTime() + this.apptSearchData[j].Duration__c * 60000);
                }
                const year = this.bsValue.getFullYear();
                const month = this.bsValue.getMonth();
                const day = this.bsValue.getDate();
                const date = [];
                const date1 = [];
                date[i] = new Date(year, month, day, this.startTimeHour[j], (parseInt(this.startTimeMins[j], 10) + (i * parseInt(this.bookingIntervalMinutes, 10))), 0, 0);
                date1[i] = new Date(year, month, day, this.endTimeHour[j], parseInt(this.endTimeMins[j], 10), 0, 0);
                const finalDate = moment(date[i]).format('MM/DD/YYYY hh:mm A');
                this.finalDate1 = moment(date1[i]).format('MM/DD/YYYY hh:mm A');
                if (startSlot && endSlot) {
                    if ((date[i] <= date1[i]) && this.maximumofAvailabilities >= this.finalTimes.length + 1) {
                        if (!((date[i] >= startSlot && date[i] <= endSlot) || (date1[i] >= startSlot && date1[i] <= endSlot))) {
                            this.finalTimes.push(finalDate);
                            this.finalDate.push(date[i]);
                        }
                    }
                } else if (this.maximumofAvailabilities >= this.finalTimes.length + 1) {
                    this.finalTimes.push(finalDate);
                    this.finalDate.push(date[i]);
                }
            }
        }
        const currentDate = new Date();
        if (currentDate > this.date1) {
            this.finalTimes = [];
            this.finalDate = [];
            this.error10 = 'The Company Hours for this record is in past';
        }
    }
    scheduleButtonShow(searchData, i) {
        this.apptDate = searchData;
        this.showScheduleButton = true;
        if (this.clientId !== '' && this.appointmentId) {
            this.showScheduleButton = false;
            this.reScheduleButton = true;
        } else {
            this.showScheduleButton = true;
            this.reScheduleButton = false;
        }
        this.textBoldlist = true;
        this.selectedIndex = i;
    }
    getAllActivePackages() {
        this.clientappointmentsService.getAllActivePackages()
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
    bookAppointment() {
        // if (this.visitTypeValue === '' || this.visitTypeValue === undefined) {
        //     this.error8 = 'Visit Type is required';
        // } else {
        if (this.rows[0].apptId === undefined) {
            this.apptmentId = '';
        } else {
            this.apptmentId = this.rows[0].apptId;
        }

        const appointmentDate = this.commonService.getDBDatTmStr2(this.apptDate, 'MM/DD/YYYY hh:mm:ss a');
        // const clientdata = JSON.parse(localStorage.getItem('clientData'));
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
        const appointBookingData = {
            'Client_Type__c': this.visitTypeValue,
            'Client__c': this.clientId,
            // 'Worker__c': this.rows[0].workerName,
            'Duration__c': this.sumOfServiceDurations,
            'Appt_Date_Time__c': appointmentDate,
            'servicesData': serviceTaxResult.bookingData,
            'apptId': this.isRebooking ? '' : this.apptmentId,
            'Notes__c': this.apptNotes ? this.apptNotes : null,
            'serviceGroupColour': this.serviceGroupColour,
            'daleteArray': this.daleteArray,
            //   'Rebooked__c': this.isRebooking,
            'IsPackage': IsPackage ? 1 : 0,
            'Service_Tax__c': serviceTaxResult.serviceTax,
            'Service_Sales__c': serviceTaxResult.sales,
            'apptCreatedDate': this.commonService.getDBDatTmStr(new Date()),
            'bookingType': 'findappt'
        };
        this.clientappointmentsService.appointmentBooking(appointBookingData).subscribe(data => {
            const apptId = data['result']['apptId'];
            this.router.navigate(['/appointments'], { queryParams: { date: appointmentDate.split(' ')[0] } }).then(() => {
                const toastermessage: any = this.translateService.get('LOGIN.APPT_SUCESSFULLY_CREATED');
                this.toastr.success(toastermessage.value, null, { timeOut: 2000 });
            });
            this.clientappointmentsService.sendApptNotifs([apptId]).subscribe(data2 => { }, error => { });
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
        // }
    }
    addServices(i) {
        this.finalTimes = [];
        this.rows.push({
            serviceGroup: this.serviceGroupName, Name: '', Net_Price__c: 0,
            Id: '', serviceGroupColour: '', serviceName: '', IsPackage: 0, Booked_Package__c: '', Rebooked__c: 0
        });
        const index = this.rows.length - 1;
        this.workerList[i] = [];
        this.serviceDetailsList[i] = [];
        if (index !== 0) {
            this.categoryOfService(this.serviceGroupName, index);
        }

    }
    removeServices(row, index) {
        if (this.rows[index].tsId) {
            this.rows[index]['delete'] = true;
        }
        // this.rows[index].push(this.rows[index]);
        this.daleteArray.push(this.rows[index]);
        this.rows.splice(index, 1);
        this.workerList.splice(index, 1);
        this.serviceDetailsList.splice(index, 1);
        this.calculateServiceDurations(index);
        this.finalTimes = [];
    }
    // getTodayDate() {
    //     this.bsValue = new Date();
    // }
    // calculationForOneWeek() {
    //     this.bsValue = new Date(this.bsValue.setDate(this.bsValue.getDate() + 7));
    // }
    // calculationForTwoWeeks() {
    //     this.bsValue = new Date(this.bsValue.setDate(this.bsValue.getDate() + 14));
    // }
    // calculationForThreeWeeks() {
    //     this.bsValue = new Date(this.bsValue.setDate(this.bsValue.getDate() + 21));
    // }
    // calculationForFourWeeks() {
    //     this.bsValue = new Date(this.bsValue.setDate(this.bsValue.getDate() + 28));
    // }
    // calculationForFiveWeeks() {
    //     this.bsValue = new Date(this.bsValue.setDate(this.bsValue.getDate() + 35));
    // }
    // calculationForSixWeeks() {
    //     this.bsValue = new Date(this.bsValue.setDate(this.bsValue.getDate() + 42));
    // }
    // calculationForSevenWeeks() {
    //     this.bsValue = new Date(this.bsValue.setDate(this.bsValue.getDate() + 49));
    // }
    // calculationForEightWeeks() {
    //     this.bsValue = new Date(this.bsValue.setDate(this.bsValue.getDate() + 56));
    // }
    updateDatepicker(wkNum: number) {
        this.clear();
        if (wkNum === 0) {
            this.bsValue = new Date();
        } else {
            this.bsValue = new Date(this.bsValue.setDate(this.bsValue.getDate() + 7 * wkNum));
        }
    }
}
