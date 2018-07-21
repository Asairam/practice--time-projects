/*---
    Setup inventorygroups component having following methods:
    * ngOnInit(): This method is used for on page load
    * saveGroups(): This method is used to save inventory groups
    * getInvetoryGroups(): This method is used to get inventory groups
    * showData(groupData): This method is used to show data
    * editInventorygroupData(): This method is used to update inventory groups
    * addNew(): This method is used to add new inventory group
    * cancel(): This method is used to cancel all previous changes
    * clear(): This method is used to clear fields
    * clearErrMsg(): This method is used to clear error messages
---*/
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { SetupInventGroupsService } from './setupinventgroups.service';
@Component({
    selector: 'app-setupinventgroups-popup',
    templateUrl: './setupinventgroups.html',
    styleUrls: ['./setupinventorygroups.css'],
    providers: [SetupInventGroupsService]
})
export class SetupInventGroupsComponent implements OnInit {
    addDiv = false;
    editDiv = false;
    hideTable = true;
    disableDiv = true;
    groupList: any;
    inventoryGroupName: any;
    taxable: any;
    sortOrder: any;
    groupObj: any = {};
    error: any;
    groupDetails: any;
    inventoryGroups: any;
    updateInventoryGroupName: any;
    updateTaxable: any;
    updateSortOrder: any;
    productGroupEditData: any = {};
    groupEditStatus: any;
    oldInventoryGroupName: any;
    toastermessage: any;
    button = false;
    constructor(private toastr: ToastrService,
        private translateService: TranslateService,
        private setupInventGroupsService: SetupInventGroupsService,
        private router: Router) {
    }
    /*--- Method for on page load ---*/
    ngOnInit() {
        this.getInvetoryGroups();
    }
    /*--- Method to save inventory groups ---*/
    // else if (this.sortOrder < 0 || this.sortOrder === '' ||  this.sortOrder === undefined) {
    //     this.error = 'Sort Order must be a positive Integer';
    // }
    saveGroups() {
        if (this.inventoryGroupName === '' || this.inventoryGroupName === undefined || this.inventoryGroupName === 'undefined') {
            this.error = 'COMMON.VALID_NOBLANK_NAME';
        } else {
            this.groupObj.inventoryGroupName = this.inventoryGroupName;
            this.groupObj.taxable = this.taxable;
            this.groupObj.sortOrder = this.sortOrder;
            this.setupInventGroupsService.saveInventoryGroupData(this.groupObj)
                .subscribe(
                    data => {
                        this.groupDetails = data['data'];
                        this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_CREATE_SUCCESS');
                        this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                        this.disableDiv = true;
                        this.hideTable = true;
                        this.addDiv = false;
                        this.editDiv = false;
                        this.clear();
                        this.getInvetoryGroups();
                    },
                    error => {
                        const status = JSON.parse(error['status']);
                        const statuscode = JSON.parse(error['_body']).status;
                        switch (JSON.parse(error['_body']).status) {
                            case '2036':
                                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                break;
                            case '2038':
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
    /*--- Method to get inventory groups ---*/
    getInvetoryGroups() {
        this.setupInventGroupsService.getInventoryGroupData()
            .subscribe(data => {
                this.inventoryGroups = data['result'];
                this.groupList = this.inventoryGroups;
                for (let i = 0; i < this.groupList.length; i++) {
                    if (this.groupList[i].sortOrder === '' || this.groupList[i].sortOrder === null) {
                        this.groupList[i].sortOrder = 0;
                    }
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
    /*--- Method to show data ---*/
    showData(groupData) {
        this.addDiv = false;
        this.editDiv = true;
        this.disableDiv = false;
        this.hideTable = false;
        this.updateInventoryGroupName = groupData.inventoryGroupName;
        this.updateTaxable = groupData.taxable;
        if (groupData.sortOrder === '' || groupData.sortOrder === null) {
            this.updateSortOrder = 0;
        } else {
            this.updateSortOrder = groupData.sortOrder;
        }
        this.oldInventoryGroupName = groupData.inventoryGroupName;

        this.setupInventGroupsService.getInventoryGroupDependencyData(this.updateInventoryGroupName)
            .subscribe(data => {
                const invGrpData = data['result'];
                if (invGrpData && invGrpData.length > 0) {
                    this.button = false;
                } else {

                    this.button = true;
                }
            }, error => {
                const status = JSON.parse(error['status']);
                const statuscode = JSON.parse(error['_body']).status;
                if (statuscode === '2085' || statuscode === '2071') {
                    if (this.router.url !== '/') {
                        localStorage.setItem('page', this.router.url);
                        this.router.navigate(['/']).then(() => { });
                    }
                }
            });
    }
    /*--- Method to delete inventory group ---*/
    deleteInvGroup() {
        this.setupInventGroupsService.deleteInvGrp(this.updateInventoryGroupName)
            .subscribe(data => {
                const invGrpData = data['result'];
                this.groupEditStatus = data['data'];
                this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_DELETE_SUCCESS');
                this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                this.disableDiv = true;
                this.hideTable = true;
                this.addDiv = false;
                this.editDiv = false;
                this.getInvetoryGroups();
                this.clear();
            }, error => {
                const status = JSON.parse(error['status']);
                const statuscode = JSON.parse(error['_body']).status;
                if (statuscode === '2085' || statuscode === '2071') {
                    if (this.router.url !== '/') {
                        localStorage.setItem('page', this.router.url);
                        this.router.navigate(['/']).then(() => { });
                    }
                }
            });
    }
    /*--- Method to update inventory groups ---*/
    editInventorygroupData() {
        // else if (this.updateSortOrder < 0 || this.updateSortOrder === '' || this.updateSortOrder === undefined) {
        //     this.error = 'Sort Order must be a positive Integer';
        //     }
        if (this.updateInventoryGroupName === '' || this.updateInventoryGroupName === undefined ||
            this.updateInventoryGroupName === 'undefined') {
            this.error = 'COMMON.VALID_NOBLANK_NAME';
        } else {
            this.productGroupEditData.inventoryGroupName = this.updateInventoryGroupName;
            this.productGroupEditData.taxable = this.updateTaxable;
            this.productGroupEditData.sortOrder = this.updateSortOrder;
            this.setupInventGroupsService.editProductGroupData(this.oldInventoryGroupName,
                this.updateInventoryGroupName, this.productGroupEditData)
                .subscribe(
                    data => {
                        this.groupEditStatus = data['data'];
                        this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_EDIT_SUCCESS');
                        this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                        this.disableDiv = true;
                        this.hideTable = true;
                        this.addDiv = false;
                        this.editDiv = false;
                        this.getInvetoryGroups();
                        this.clear();
                    },
                    error => {
                        const status = JSON.parse(error['status']);
                        const statuscode = JSON.parse(error['_body']).status;
                        switch (JSON.parse(error['_body']).status) {
                            case '2036':
                                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                break;
                            case '2038':
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
    /*--- Method to add new inventory group ---*/
    addNew() {
        this.clear();
        this.hideTable = false;
        this.addDiv = true;
        this.disableDiv = false;
    }
    /*--- Method to cancel previous changes ---*/
    cancel() {
        this.clear();
        this.addDiv = false;
        this.editDiv = false;
        this.hideTable = true;
        this.disableDiv = true;
    }
    /*--- Method to clear fields ---*/
    clear() {
        this.inventoryGroupName = '';
        this.taxable = '';
        this.sortOrder = '';
        this.error = '';
    }
    /*--- Method to clear error message ---*/
    clearErrMsg() {
        this.error = '';
    }
}
