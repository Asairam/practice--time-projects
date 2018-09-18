import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { SetupPermissionsService } from './setuppermissions.service';

@Component({
    selector: 'app-setuppermissions-popup',
    templateUrl: './setuppermissions.html',
    styleUrls: ['./setuppermissions.css'],
    providers: [SetupPermissionsService]
})

export class SetupPermissionsComponent implements OnInit {
    permissionsList: any;
    permissionsStaticJsonList: any;
    objectKeys: any;
    sortData: any;
    Name: any;
    Category: any;
    dataObj: any;
    permissionsData: any;
    toastermessage: any;
    error: any;
    updateId: any;
    listTable: any = true;
    addDiv = false;
    EditDiv = false;
    disableDiv = true;

    constructor(private toastr: ToastrService,
        private translateService: TranslateService,
        private setupPermissionsService: SetupPermissionsService,
        private router: Router) { }
    ngOnInit() {
        this.listTable = true;
        this.addDiv = false;
        this.EditDiv = false;
        this.disableDiv = true;
        this.getPermissions();
    }
    getPermissions() {
        this.setupPermissionsService.getPermissionsData()
            .subscribe(data => {
                this.permissionsList = data['result'];
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
    getPermissionsStaticJson() {
        this.setupPermissionsService.getPermissionsStaticData()
            .subscribe(data => {
                this.permissionsStaticJsonList = data['permissions'];
                this.objectKeys = Object.keys(this.permissionsStaticJsonList);
                this.sortData = this.permissionsStaticJsonList['Home'];
                this.Category = this.objectKeys[0];

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
    showData(permissionData) {
        this.sortData = '';
        this.permissionsStaticJsonList = '';
        this.listTable = false;
        this.addDiv = false;
        this.disableDiv = false;
        this.EditDiv = true;
        this.updateId = permissionData.Id;
        this.Name = permissionData.Name;
        this.permissionsStaticJsonList = JSON.parse(permissionData.Authorized_Pages__c);
        this.objectKeys = Object.keys(this.permissionsStaticJsonList);
        this.Category = this.objectKeys[0];
        this.sortData = this.permissionsStaticJsonList['Home'];
    }
    addNew() {
        this.listTable = false;
        this.addDiv = true;
        this.disableDiv = false;
        this.EditDiv = false;
        this.Name = '';
        this.getPermissionsStaticJson();

    }
    cancel() {
        this.listTable = true;
        this.addDiv = false;
        this.EditDiv = false;
        this.disableDiv = true;
        this.Name = '';
        this.sortData = '';
        this.error = '';
    }
    onValueChange(value) {
        this.Category = value;
        if (value === 'Setup Company') {
            this.sortData = this.permissionsStaticJsonList['Setup Company'];
        } else if (value === 'Setup Other') {
            this.sortData = this.permissionsStaticJsonList['Setup Other'];
        } else if (value === 'Setup Service') {
            this.sortData = this.permissionsStaticJsonList['Setup Service'];
        } else if (value === 'Setup Inventory') {
            this.sortData = this.permissionsStaticJsonList['Setup Inventory'];
        } else if (value === 'Setup Workers') {
            this.sortData = this.permissionsStaticJsonList['Setup Workers'];
        } else if (value === 'Clients') {
            this.sortData = this.permissionsStaticJsonList['Clients'];
        } else if (value === 'Appointments') {
            this.sortData = this.permissionsStaticJsonList['Appointments'];
        } else if (value === 'Inventory') {
            this.sortData = this.permissionsStaticJsonList['Inventory'];
        } else if (value === 'Tickets') {
            this.sortData = this.permissionsStaticJsonList['Tickets'];
        } else if (value === 'Reports') {
            this.sortData = this.permissionsStaticJsonList['Reports'];
        } else if (value === 'Marketing') {
            this.sortData = this.permissionsStaticJsonList['Marketing'];
        } else if (value === 'Home') {
            this.sortData = this.permissionsStaticJsonList['Home'];
        }
    }
    selectAll() {
        for (let i = 0; i < this.sortData.length; i++) {
            this.sortData[i]['allowAcces'] = true;
        }
    }
    unSelectAll() {
        for (let i = 0; i < this.sortData.length; i++) {
            this.sortData[i]['allowAcces'] = false;
        }
    }
    savePermissionSet() {
        if (this.Name === '' || this.Name === undefined || this.Name === 'undefined') {
            this.error = 'VALIDATION_MSG.NAME_REQUIRED';
        } else {
            this.dataObj = {
                'Name': this.Name,
                // 'Category': this.Category,
                'Authorized_Pages__c': this.permissionsStaticJsonList
            };
            this.setupPermissionsService.savePermissionsData(this.dataObj)
                .subscribe(data => {
                    this.permissionsData = data['result'];
                    this.getPermissions();
                    this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_CREATE_SUCCESS');
                    this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                    this.listTable = true;
                    this.addDiv = false;
                    this.EditDiv = false;
                    this.disableDiv = true;
                    this.clearErrMsg();
                },
                    error => {
                        const status = JSON.parse(error['status']);
                        const statuscode = JSON.parse(error['_body']).status;

                        switch (JSON.parse(error['_body']).status) {
                            case '2033':
                                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                break;
                            case '2043':
                                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
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
    editPermissionSet() {
        if (this.Name === '' || this.Name === undefined || this.Name === 'undefined') {
            this.error = 'VALIDATION_MSG.NAME_REQUIRED';
        } else {
            this.dataObj = {
                'Name': this.Name,
                // 'Category': this.Category,
                'Authorized_Pages__c': this.permissionsStaticJsonList
            };
            this.setupPermissionsService.editPermissionsData(this.updateId, this.dataObj)
                .subscribe(data => {
                    if (data['result'] && data['result'].length > 0) {
                    localStorage.setItem('rights', data['result']);
                    }
                    this.permissionsData = data['result'];
                    this.getPermissions();
                    this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_EDIT_SUCCESS');
                    this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                    this.listTable = true;
                    this.addDiv = false;
                    this.EditDiv = false;
                    this.disableDiv = true;
                    this.clearErrMsg();
                },
                    error => {
                        const status = JSON.parse(error['status']);
                        const statuscode = JSON.parse(error['_body']).status;

                        switch (JSON.parse(error['_body']).status) {
                            case '2033':
                                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                break;
                            case '2043':
                                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
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
    clearErrMsg() {
        this.error = '';
    }

}
