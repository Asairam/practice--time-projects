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
import { ClientQuickEditService } from './clientquickedit.service';
import { ToastrService } from 'ngx-toastr';
import { CommonService } from '../../common/common.service';
@Component({
    selector: 'app-clients-popup',
    templateUrl: './clientquickedit.html',
    providers: [ClientQuickEditService, CommonService]
})
export class ClientQuickEditComponent implements OnInit {
    firstName: any;
    middleName: any;
    lastName: any;
    fullName: any;
    primaryPhone: any;
    mobilePhone: any;
    email: any;
    clientBalances: any;
    clientRewardData: any;
    clientId: any;
    lastVisit: any;
    isNewClient: any = false;
    quickaddErr: any;
    quickaddErr1: any;
    quickaddErr2: any;
    quickaddErr3: any;
    quickaddErr4: any;
    quickaddErr5: any;
    action = '';
    error: any;
    lastVists: any;
    serviceName: any;
    nextapptDate: any;
    nextServiceName: any;
    constructor(
        private activatedRoute: ActivatedRoute,
        private clientsQuickEditService: ClientQuickEditService,
        private toastr: ToastrService,
        private commonService: CommonService,
        private router: Router) {
        this.activatedRoute.queryParams.subscribe(params => {
            this.action = activatedRoute.snapshot.params['action'];
            this.clientId = activatedRoute.snapshot.params['Id'];
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
    /*Method for page Load */
    ngOnInit() {
        this.getClientData(this.clientId);
        this.getClientRewards();
    }
    getClientData(clientId) {
        this.clientsQuickEditService.getClient(clientId)
            .subscribe(data => {
                const obj = data['result'];
                if (data['result'].results1.length > 0) {

                this.lastVists = data['result'].results1[0].Service_Date_Time__c;
                this.serviceName = data['result'].results1[0].Name;
                }
                if (data['result'].results2.length > 0) {

                this.nextapptDate = data['result'].results2[0].Service_Date_Time__c;
                this.nextServiceName = data['result'].results2[0].Name;
                }
                /**
                 *  start of code for Client Name For header
                 */
                if (this.action === 'edit') {
                    const displayName = document.getElementById('displayNameId');
                    displayName.innerHTML = 'Client Quick Card - ' + obj.results[0].FirstName + ' ' + obj.results[0].LastName;
                }
                /**
                    *  End of code for Client Name For header
                    */
                this.loadUserData(obj);
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


    loadUserData(obj) {
        if (this.action === 'edit') {
            // const obj = JSON.parse(localStorage.getItem('clientData'));
            this.fullName = obj.results[0].FullName;
            this.firstName = obj.results[0].FirstName;
            this.lastName = obj.results[0].LastName;
            this.primaryPhone = obj.results[0].Phone;
            this.mobilePhone = obj.results[0].MobilePhone;
            this.email = obj.results[0].Email;
            this.clientId = obj.results[0].Id;
            this.isNewClient = false;
            this.lastVisit = obj.LastModifiedDate;
            this.clientBalances = obj.results[0].Current_Balance__c;
        } else {
            this.isNewClient = true;
        }
    }
    editClientData() {
        const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let editObj: any = {};
        if (this.firstName === '' || this.firstName === undefined) {
            this.quickaddErr = 'firstName cannot be blank';
        } else if (this.lastName === '' || this.lastName === undefined) {
            this.quickaddErr1 = 'lastName cannot be blank';
        } else if (this.primaryPhone === '' || this.primaryPhone === undefined) {
            this.quickaddErr2 = 'primaryphone cannot be blank';
        } else if (this.mobilePhone === '' || this.mobilePhone === undefined) {
            this.quickaddErr3 = 'mobile phone cannot be blank';
        } else if (this.email === '' || this.email === undefined) {
            this.quickaddErr4 = 'Email cannot be blank';
        } else if (this.email !== 'undefined' && this.email !== undefined && this.email !== '' && !EMAIL_REGEXP.test(this.email)) {
            this.quickaddErr5 = 'Primary Email: Invalid Email Address';
        } else if (this.quickaddErr === '' || this.quickaddErr === undefined || this.quickaddErr === 'undefined') {
            if (this.isNewClient === true) {
                editObj = {
                    'firstname': this.firstName,
                    'middlename': this.middleName,
                    'lastname': this.lastName,
                    'fullName': this.fullName,
                    'primaryPhone': this.primaryPhone,
                    'mobilePhone': this.mobilePhone,
                    'email': this.email,
                    'isNewClient': this.isNewClient
                };
            } else {
                editObj = {
                    'fullName': this.fullName,
                    'primaryPhone': this.primaryPhone,
                    'mobilePhone': this.mobilePhone,
                    'email': this.email,
                    'isNewClient': this.isNewClient
                };
            }
            this.clientsQuickEditService.clientQuickEdit(this.clientId, editObj).subscribe(data => {
                const editStatus = data['result'];
                // this.clientId = editStatus[0].Id;
                this.router.navigate(['/client']).then(() => {
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
    hyphen_generate_mobile(value) {
        if (value === undefined) {
            value = '';
        }
        if (value.length === 0) {
            (<HTMLInputElement>document.getElementById('mobile_id')).value = value.concat('(');
        }
        if (value.length === 4) {
            (<HTMLInputElement>document.getElementById('mobile_id')).value = value.concat(')');
        } if (value.length === 8) {
            (<HTMLInputElement>document.getElementById('mobile_id')).value = value.concat('-');
        }
    }
    hyphen_generate_phone(value) {
        if (value === undefined) {
            value = '';
        }
        if (value.length === 0) {
            (<HTMLInputElement>document.getElementById('phone_id')).value = value.concat('(');
        }
        if (value.length === 4) {
            (<HTMLInputElement>document.getElementById('phone_id')).value = value.concat(')');
        } if (value.length === 8) {
            (<HTMLInputElement>document.getElementById('phone_id')).value = value.concat('-');
        }
    }
    getClientRewards() {
        this.clientsQuickEditService.getClientRewardsData(this.clientId).subscribe(
            data => {
                this.clientRewardData = data['result'];
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
    bookAppointment() {
        this.router.navigate(['/appointment/book/' + this.clientId]).then(() => {
        });
    }
    cancel() {
        this.router.navigate(['/client']).then(() => {
        });
    }
    saveAndBook() {
        const editObj = {
            'fullName': this.fullName,
            'primaryPhone': this.primaryPhone,
            'mobilePhone': this.mobilePhone,
            'email': this.email,
        };
        this.clientsQuickEditService.clientQuickEdit(this.clientId, editObj).subscribe(data => {
            const editStatus = data['result'];
            this.router.navigate(['/appointment/book/' + this.clientId]).then(() => {
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
    clearQuickAddErrMsg() {
        this.quickaddErr = '';
        this.quickaddErr1 = '';
        this.quickaddErr2 = '';
        this.quickaddErr3 = '';
        this.quickaddErr4 = '';
        this.quickaddErr5 = '';
    }
}
