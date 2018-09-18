/*---
    Setup memberships component have following methods:
    * ngOnInit(): This method is used for on page load
    * getSetupMemberships(): This method is used to get all memberships
    * getInactiveSetupMemberships(): This  method is used to get active or inactive memberships
    * createMemberships(): This method is used to create memberships
    * editMemberships(): This method is used to update memberships
    * addNew(): This method is used to add new record
    * showData(membershiplist): This method is used to show data
    * clear(): This method is used to clear fields
    * clearmessage(): This method is used to clear error messages
    * cancel(): This method is used to cancel changes
---*/
import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { SetupMembershipsService } from './setupmemberships.service';
@Component({
    selector: 'app-setupmemberships-popup',
    templateUrl: './setupmemberships.html',
    styleUrls: ['./setupmemberships.css'],
    providers: [SetupMembershipsService]
})
export class SetupMembershipsComponent implements OnInit {
    hideTable = false;
    disableDiv = true;
    addDiv = false;
    editDiv = false;
    membershipsList: any;
    membershipsObj: any;
    Name: any;
    active: any = true;
    price: number;
    error: any;
    error1: any;
    membershipsData: any;
    toastermessage: any;
    updateId: any;
    updateName: any;
    updateActive: any;
    updatePrice: number;
    updateMembershipsObj: any;
    updateMemberships: any;
    inActive: any;
    constructor(private setupMembershipsService: SetupMembershipsService,
        @Inject('apiEndPoint') public apiEndPoint: string,
        @Inject('defaultActive') public defaultActive: string,
        @Inject('defaultInActive') public defaultInActive: string,
        private route: ActivatedRoute,
        private router: Router,
        private toastr: ToastrService,
        private translateService: TranslateService,
        private sanitizer: DomSanitizer) {
    }
    /*-- On page load method --*/
    ngOnInit() {
        this.getSetupMemberships();
    }
    /*-- Method to get all memberships --*/
    getSetupMemberships() {
        if (this.inActive === 'undefined' ||
            this.inActive === undefined ||
            this.inActive === this.defaultInActive || this.inActive === '0' || this.inActive === '') {
            this.inActive = this.defaultActive;
        }
        this.setupMembershipsService.getSetupMemberships(this.inActive)
            .subscribe(data => {
                this.membershipsList = data['result'];
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
    /*-- Method to get active or inactive memberships  --*/
    getInactiveSetupMemberships(value) {
        if (value.target.checked === true || value.target.checked === 'true') {
            this.inActive = this.defaultInActive;
        } else {
            this.inActive = this.defaultActive;
        }
        this.setupMembershipsService.getSetupMemberships(this.inActive)
            .subscribe(data => {
                this.membershipsList = data['result'];
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
    /*-- Method to create memberships --*/
    createMemberships() {
        if (this.Name === undefined || this.Name === 'undefined' || this.Name === '') {
            this.error = 'COMMON.VALID_NOBLANK_NAME';
        } else if (!(/^[\d]{1,6}(\.[\d]{1,2})?$/).test(this.price.toString()) && this.price) {
            this.error1 = 'SETUP_MEMBERSHIPS.VALID_PRICE';
        } else {
            if (this.active === true) {
                this.active = this.defaultActive;
            } else if (this.active === false || this.active === undefined) {
                this.active = this.defaultInActive;
            }
            if (this.price === undefined) {
                this.price = 0.00;
            }
            this.membershipsObj = {
                'Name': this.Name,
                'active': this.active,
                'price': this.price
            };
            this.setupMembershipsService.createMemberships(this.membershipsObj)
                .subscribe(data => {
                    this.membershipsData = data['result'];
                    this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_CREATE_SUCCESS');
                    this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                    this.getSetupMemberships();
                    this.hideTable = false;
                    this.disableDiv = true;
                    this.addDiv = false;
                    this.clearmessage();
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
    }
    /*-- Method to edit memberships --*/
    editMemberships() {
        if (this.updateName === undefined || this.updateName === '' || this.updateName === 'undefined') {
            this.error = 'COMMON.VALID_NOBLANK_NAME';
        } else if (!(/^[\d]{1,6}(\.[\d]{1,2})?$/).test(this.updatePrice.toString()) && this.updatePrice) {
            this.error1 = 'SETUP_MEMBERSHIPS.VALID_PRICE';
        } else {
            if (this.updateActive === true || this.updateActive === this.defaultActive) {
                this.updateActive = this.defaultActive;
            } else {
                this.updateActive = this.defaultInActive;
            }
            if (this.price === undefined) {
                this.price = 0.00;
            }
            this.updateMembershipsObj = {
                'updateName': this.updateName,
                'updateActive': this.updateActive,
                'updatePrice': this.updatePrice
            };
            this.setupMembershipsService.editMemberships(this.updateMembershipsObj, this.updateId)
                .subscribe(data => {
                    this.updateMemberships = data['result'];
                    this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.MEMBERSHIP_SAVED');
                    this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                    this.disableDiv = true;
                    this.hideTable = false;
                    this.addDiv = false;
                    this.editDiv = false;
                    this.clearmessage();
                    this.getSetupMemberships();
                    // this.clear();
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
    }
    /*-- Method to add div --*/
    addNew() {
        this.hideTable = true;
        this.disableDiv = false;
        this.addDiv = true;
        this.editDiv = false;
        this.getSetupMemberships();
        this.clear();
        this.active = this.defaultActive;
        if (this.inActive === this.defaultInActive) {
            this.inActive = this.defaultActive;
        } else if (this.inActive === this.defaultActive) {
            this.inActive = this.defaultInActive;
        }
        this.setupMembershipsService.getSetupMemberships(this.inActive)
        .subscribe(data => {
            this.membershipsList = data['result'];
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
    /*-- Method to show data --*/
    showData(membershiplist) {
        this.hideTable = true;
        this.addDiv = false;
        this.editDiv = true;
        this.disableDiv = false;
        this.getSetupMemberships();
        this.updateId = membershiplist.Id;
        this.updateName = membershiplist.Name;
        this.updateActive = membershiplist.Active__c;
        this.updatePrice = membershiplist.Price__c;
    }
    /*-- Method to clear fields --*/
    clear() {
        this.Name = '';
        this.active = '';
        this.price = 0.00;
        this.error = '';
        this.error1 = '';
    }
    /*-- Method to clear error message --*/
    clearmessage() {
        this.error = '';
        this.error1 = '';
    }
    /*-- Method to cancel changes --*/
    cancel() {
        this.hideTable = false;
        this.disableDiv = true;
        this.addDiv = false;
        this.editDiv = false;
        this.error = '';
        this.error1 = '';
        this.getSetupMemberships();
        this.clear();
    }
    IsAlphaNumeric(e) {
        const value = e.target.value;
        let ret: boolean;
        const code = e.keyCode === 0 ? e.charCode : e.keyCode;
        if ((code >= 48 && code <= 57) || code === 46 || (code === 8) || code >= 37 && code <= 40) { // check digits
            ret = true;
        } else {
            ret = false;
        }
        this.clearmessage();
        return ret;
    }
}
