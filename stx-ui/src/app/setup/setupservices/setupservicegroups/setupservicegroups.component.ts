/*
* Setup service groups component used to store and to retrieve setup service groups information.
* ngonInit(): ngonInit method is used to load required methods on page load.
* createServiceGroups(): This method is used to create service groups.
* showData(servicelist): This method is used to show data when clicking on list in table.
* editServiceGroups(): Method used to update service groups data.
* getServiceGroups(): This method is used to get list of setup service groups.
* getInactive(value): This method is used to get inactives in th list.
* addNew(): This method is used to add new record into service groups.
* cancel(): This method is used to cancel if dont want to go further.
* clearErrMsg(): This method is used to clear message.
* clear(): This method is used to clear fields which required.
*/
import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { SetupServGroupService } from './setupservicegroups.service';
import { ToastrService } from 'ngx-toastr';
import { Console } from '@angular/core/src/console';
@Component({
    selector: 'app-setupservicegroups-popup',
    templateUrl: './setupservicegroups.html',
    styleUrls: ['./setupservicegroups.css'],
    providers: [SetupServGroupService]
})
export class SetupServGroupsComponent implements OnInit {
    serviceActive: any = false;
    serviceName: any;
    numberAvailable: any;
    updateId: any;
    editDiv = false;
    issystemdiv = false;
    inActive: any = false;
    private color = '#ffffff';
    sortOrder: any;
    onlineName: any = '';
    createServiceGroupsData: any = {};
    serviceGroupList = [];
    serviceId: any;
    editServiceGroupsData: any;
    getSetupServiceGroupData: any;
    updateSericeName: any;
    updateSortOrder: any;
    updateOnlineName: any;
    updateServiceColor: any;
    updateActive: any;
    issystem: any;
    error: any;
    active = [];
    oldServiceName: any;
    toastermessage: any;
    deletediv: any;
    statuscode: any;
    deleteButton: any = false;
    disableEnable: any;
    enableDisable: any = true;
    addDiv: any = true;
    error1: any;
    oldOnlineName: any;
    constructor(private setupServGroupsService: SetupServGroupService,
        private toastr: ToastrService,
        private translateService: TranslateService,
        private router: Router) {
    }
    /*--- On page load method ---*/
    ngOnInit() {
        this.getServiceGroups();
    }
    /*--- Method to create service groups ---*/
    createServiceGroups() {
        if (this.serviceName === undefined || this.serviceName === '' || this.serviceName === 'undefined') {
            this.error = 'SETUP_SERVICE_GROUPS.VALID_NOBLANK_SERVICE_NAME';
        } else {
            this.createServiceGroupsData = {
                createServiceGroupsData: {
                    'active': this.serviceActive,
                    'serviceGroupName': this.serviceName.trim().replace(/  +/g, ' '),
                    'serviceGroupColor': this.color,
                    'sortOrder': Number(this.sortOrder),
                    'clientFacingServiceGroupName': this.onlineName.trim().replace(/  +/g, ' '),
                    'isSystem': null
                }
            };
            this.setupServGroupsService.postSetupServicesData(this.createServiceGroupsData).subscribe(
                data => {
                    this.createServiceGroupsData = data['data'];
                    this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_CREATE_SUCCESS');
                    this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                    this.getServiceGroups();
                    this.cancel();
                    this.getInactiveServiceGroups(this.inActive);
                },
                error => {
                    const status = JSON.parse(error['status']);
                    const statuscode = JSON.parse(error['_body']).status;
                    switch (JSON.parse(error['_body']).status) {
                        case '2033':
                            this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                            break;
                        case '2034':
                            this.error1 = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
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
    /*--- Method to show data when clicking on list in table ---*/
    showData(servicelist) {
        this.enableDisable = false;
        this.disableEnable = true;
        this.editDiv = true;
        this.addDiv = false;
        this.updateId = servicelist._id;
        this.updateSericeName = servicelist.serviceGroupName;
        this.oldServiceName = servicelist.serviceGroupName;
        this.updateServiceColor = servicelist.serviceGroupColor;
        this.updateSortOrder = servicelist.sortOrder;
        this.oldOnlineName = servicelist.clientFacingServiceGroupName;
        this.updateOnlineName = servicelist.clientFacingServiceGroupName;
        this.updateActive = servicelist.active;
        this.issystem = servicelist.isSystem;
        this.setupServGroupsService.getSetupServiceGroupData(this.oldServiceName).subscribe(data => {
            this.statuscode = JSON.parse(data['status']);
        },
        error => {
            this.statuscode = JSON.parse(error['_body'])['status'];
            const errStatus = JSON.parse(error['_body'])['status'];
            if (errStatus === '2085' || errStatus === '2071') {
                if (this.router.url !== '/') {
                    localStorage.setItem('page', this.router.url);
                    this.router.navigate(['/']).then(() => { });
                }
            }
        });
        if (this.issystem) {
            this.issystemdiv = true;
            this.editDiv = false;
        }
    }
    /*--- Method used to update service groups data ---*/
    editServiceGroups() {
        if (this.updateSericeName === undefined || this.updateSericeName === '' || this.updateSericeName === 'undefined') {
            this.error = 'SETUP_SERVICE_GROUPS.VALID_NOBLANK_SERVICE_NAME';
        } else {
            this.editServiceGroupsData = {
                updateServiceGroupsData: {
                    'active': this.updateActive,
                    'serviceGroupName': this.updateSericeName.trim().replace(/  +/g, ' '),
                    'serviceGroupColor': this.updateServiceColor,
                    'sortOrder': this.updateSortOrder,
                    'clientFacingServiceGroupName': this.updateOnlineName.trim().replace(/  +/g, ' '),
                    'isSystem': this.issystem
                }
            };
            this.setupServGroupsService
                .editSetupServicesData(this.editServiceGroupsData, this.oldServiceName, this.oldOnlineName)
                .subscribe(data => {
                    this.createServiceGroupsData = data['data'];
                    this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_UPDATE_SUCCESS');
                    this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                    this.Editcancel();
                    this.getServiceGroups();
                    this.getInactiveServiceGroups(this.inActive);
                },
                    error => {
                        const status = JSON.parse(error['status']);
                        const statuscode = JSON.parse(error['_body']).status;
                        switch (JSON.parse(error['_body']).status) {
                            case '2033':
                                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                break;
                            case '2034':
                                this.error1 = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
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
    /*-- Method to delete product line --*/
    deleteServiceGroup() {
        this.setupServGroupsService.deleteServiceGroup(this.oldServiceName)
            .subscribe(data => {
                this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_DELETE_SUCCESS');
                this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                this.getServiceGroups();
                this.cancel();
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
    /*--- Method to get list of setup service groups ---*/
    getServiceGroups() {
        this.setupServGroupsService.getSetupServicesData('')
            .subscribe(serviceGroupResult => {
                this.serviceGroupList = [];
                this.serviceGroupList = serviceGroupResult['result'].filter(
                    filterList => filterList.active === true);
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
    /*--- Method to get inactives in th list ---*/
    getInactiveServiceGroups(value) {
        if (value === true || value === false) {
            this.inActive = value;
        } else {
            this.inActive = value.target.checked;
        }
        this.setupServGroupsService.getSetupServicesData('')
            .subscribe(serviceGroupResult => {
                this.serviceGroupList = [];
                if (this.inActive) {
                    this.serviceGroupList = serviceGroupResult['result'];
                } else {
                    this.serviceGroupList = serviceGroupResult['result'].filter(
                        filterList => filterList.active === true);
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
            });
    }
    /*--- Method used to get new div to create service groups ---*/
    addNew() {
        this.disableEnable = true;
        this.enableDisable = false;
        this.addDiv = true;
        this.editDiv = false;
        this.serviceActive = true;
        const maxSortRecord = Number(this.serviceGroupList[this.serviceGroupList.length - 1].sortOrder) + 1;
        this.sortOrder = maxSortRecord;
        if (this.inActive) {
            this.setupServGroupsService.getSetupServicesData('')
                .subscribe(serviceGroupResult => {
                    this.serviceGroupList = [];
                    this.serviceGroupList = serviceGroupResult['result'];
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
        } else {
            this.setupServGroupsService.getSetupServicesData('')
                .subscribe(serviceGroupResult => {
                    this.serviceGroupList = [];
                    this.serviceGroupList = serviceGroupResult['result'].filter(
                        filterList => filterList.active === true);
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
    /*--- Method used to cancel changes ---*/
    cancel() {
        this.disableEnable = false;
        this.enableDisable = true;
        this.editDiv = false;
        this.addDiv = true;
        this.issystemdiv = false;
        this.error = '';
        this.error1 = '';
        this.color = '#ffffff';
        this.serviceActive = '';
        this.serviceName = '';
        this.sortOrder = '';
        this.onlineName = '';
    }
    Editcancel() {
        this.editDiv = true;
        this.addDiv = false;
        this.disableEnable = false;
        this.enableDisable = true;
        this.issystemdiv = false;
        this.error = '';
        this.error1 = '';
        this.updateServiceColor = '#ffffff';
        this.updateActive = '';
        this.updateSericeName = '';
        this.updateSortOrder = '';
        this.updateOnlineName = '';
    }
    /*--- Methods to clear error messages ---*/
    clearErrMsg() {
        this.error = '';
    }
    clearErrMsgs() {
        this.error1 = '';
    }
}
