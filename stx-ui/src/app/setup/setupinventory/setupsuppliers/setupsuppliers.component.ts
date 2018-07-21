/*
* Setup service groups component used to store and to retrieve setup service groups information.
* ngonInit(): ngonInit method is used to load required methods on page load.
* createSuppliers(): This method is used to create service groups.
* showData(suppliersData): This method is used to show data when clicking on list in table.
* editSuppliers(): Method used to update service groups data.
* getSuppliers(): This method is used to get list of setup service groups.
* getInactive(value): This method is used to get inactives in th list.
* addNew(): This method is used to add new record into service groups.
* cancel(): This method is used to cancel if dont want to go further.
* clearErrMsg(): This method is used to clear message.
* clear(): This method is used to clear fields which required.
*/
import { Component, OnInit, Inject } from '@angular/core';
import { TranslateService } from 'ng2-translate';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { SetupSuppliersService } from './setupsuppliers.service';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-setupsuppliers-popup',
    templateUrl: './setupsuppliers.html',
    styleUrls: ['./setupsuppliers.css'],
    providers: [SetupSuppliersService]
})
export class SetupSuppliersComponent implements OnInit {
    toastermessage: any;
    active: any = false;
    name: any;
    updateId: any;
    addDiv = true;
    editDiv = false;
    hideTable = true;
    inActive: any;
    disableDiv = true;
    disableEnable: any;
    enableDisable: any = true;
    accountNumber: any;
    salesConsultant: any;
    phone: any;
    email: any;
    createSuppliersData: any = {};
    suppliersList: any;
    serviceId: any;
    editSuppliersData: any;
    updateSupplierName: any;
    updatePhone: any;
    updateEmail: any;
    updateAccountNumber: any;
    updateSalesConsultant: any;
    updateActive: any;
    error: any;
    statuscode: any;
    emailError: any;
    constructor(private setupSuppliersService: SetupSuppliersService,
        private toastr: ToastrService,
        private translateService: TranslateService,
        private router: Router,
        @Inject('defaultActive') public defaultActive: string,
        @Inject('defaultInActive') public defaultInActive: string,
        @Inject('defaultType') public defaultType: string,
    ) {
    }
    /*--- On page load method ---*/
    ngOnInit() {
        this.getSuppliers();
    }
    /*--- Method to create service groups ---*/
    createSuppliers() {
        const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
       // this.active = '';
        if (this.name === undefined || this.name === '' || this.name === 'undefined') {
            this.error = 'SETUP_SERVICE_GROUPS.VALID_NOBLANK_SERVICE_NAME';
        } else if (this.email !== 'undefined' && this.email !== undefined && this.email !== '' && !EMAIL_REGEXP.test(this.email)) {
            this.emailError = 'COMMON.VALID_EMAIL_ID_FORMAT';
        } else {
            if (this.active === true || this.active === this.defaultActive) {
                this.active = this.defaultActive;
            } else {
                this.active = this.defaultInActive;
            }
            this.createSuppliersData = {
                suppliersData: {
                    'active': this.active,
                    'name': this.name,
                    'accountNumber': this.accountNumber,
                    'phone': this.phone,
                    'email': this.email,
                    'salesConsultant': this.salesConsultant
                }
            };
            this.setupSuppliersService.setupSuppliers(this.createSuppliersData).subscribe(
                data => {
                    this.createSuppliersData = data['data'];
                    this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_CREATE_SUCCESS');
                    this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                    this.enableDisable = true;
                    this.disableEnable = false;
                    this.getSuppliers();
                    this.clear();
                },
                error => {
                    const status = JSON.parse(error['status']);
                    const statuscode = JSON.parse(error['_body']).status;
                    switch (JSON.parse(error['_body']).status) {
                        case '2033':
                            this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                            break;
                        case '2034':
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
    /*--- Method to show data when clicking on list in table ---*/
    showData(suppliersData) {
        const type = this.defaultType;
        this.enableDisable = false;
        this.disableEnable = true;
        this.editDiv = true;
        this.addDiv = false;
        this.updateId = suppliersData.Id;
        this.updateSupplierName = suppliersData.Name;
        this.updateAccountNumber = suppliersData.Account_Number__c;
        this.setupSuppliersService.getDeleteResponse(this.updateId, type, this.updateSupplierName).subscribe(data => {
            this.statuscode = JSON.parse(data['status']);
        }, error => {
            const status = JSON.parse(error['status']);
            this.statuscode = JSON.parse(error['_body']).status;
            if (this.statuscode === '2085' || this.statuscode === '2071') {
                if (this.router.url !== '/') {
                    localStorage.setItem('page', this.router.url);
                    this.router.navigate(['/']).then(() => { });
                }
              }
        });
        if (this.updateAccountNumber === undefined || this.updateAccountNumber === null) {
            this.updateAccountNumber = '';
        }
        this.updatePhone = suppliersData.Phone__c;
        if (this.updatePhone === undefined || this.updatePhone === null) {
            this.updatePhone = '';
        }
        this.updateEmail = suppliersData.Email__c;
        if (this.updateEmail === undefined || this.updateEmail === null) {
            this.updateEmail = '';
        }
        if (Number(suppliersData.Active__c) === 1) {
            this.updateActive = true;
        } else {
            this.updateActive = false;
        }
        this.salesConsultant = suppliersData.Sales_Consultant_1__c;
        if (this.salesConsultant === undefined || this.salesConsultant === null) {
            this.salesConsultant = '';
        }
    }

    /*--- Method used to update service groups data ---*/
    editSuppliers() {
        const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        if (this.updateSupplierName === undefined || this.updateSupplierName === '' || this.updateSupplierName === 'undefined') {
            this.error = 'SETUP_SERVICE_GROUPS.VALID_NOBLANK_SERVICE_NAME';
             } else if (this.updateEmail !== 'undefined' && this.updateEmail !== undefined && this.updateEmail !== '' && !EMAIL_REGEXP.test(this.updateEmail)) {
            this.emailError = 'COMMON.VALID_EMAIL_ID_FORMAT';
        } else {
            if (this.updateActive === true) {
                this.updateActive = this.defaultActive;
            } else {
                this.updateActive = this.defaultInActive;
            }
            this.editSuppliersData = {
                editSuppliersData: {
                    'active': this.updateActive,
                    'name': this.updateSupplierName,
                    'accountNumber': this.updateAccountNumber,
                    'phone': this.updatePhone,
                    'email': this.updateEmail,
                    'salesConsultant': this.salesConsultant
                }
            };
            this.setupSuppliersService.editSetupSuppliersData(this.editSuppliersData, this.updateId).subscribe(
                data => {
                    this.createSuppliersData = data['data'];
                    this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_EDIT_SUCCESS');
                    this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                    this.getSuppliers();
                    this.Editcancel();
                },
                error => {
                    const status = JSON.parse(error['status']);
                    const statuscode = JSON.parse(error['_body']).status;
                    switch (JSON.parse(error['_body']).status) {
                        case '2033':
                            this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                            break;
                        case '2034':
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
    deleteSupplier() {
        this.setupSuppliersService.deleteSupplier(this.updateId, this.updateSupplierName)
            .subscribe(data => {
                this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_DELETE_SUCCESS');
                this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                this.enableDisable = true;
                this.disableEnable = false;
                this.getSuppliers();
                this.Editcancel();
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
    /*--- Method to get list of setup service groups ---*/
    getSuppliers() {
        if (this.inActive === undefined) {
            this.inActive = 1;
        }
        this.setupSuppliersService.getSetupSuppliersData(this.inActive)
            .subscribe(statesValues => {
                this.suppliersList = statesValues['result'];
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
    /*--- Method to get inactives in this list ---*/
    getInactive(value) {
        this.inActive = value.target.checked;
        if (this.inActive === true) {
            this.inActive = 0;
        } else {
            this.inActive = 1;
        }
        this.setupSuppliersService.getSetupSuppliersData(this.inActive)
            .subscribe(suppliersData => {
                this.suppliersList = [];
                if (this.inActive === 0) {
                    this.suppliersList = suppliersData['result'];
                } else {
                    this.suppliersList = suppliersData['result'].filter(
                        filterList => filterList.Active__c === 1);
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
        this.active = true;
        this.addDiv = true;
        this.disableEnable = true;
        this.enableDisable = false;
        this.editDiv = false;
    }
    /*--- Method used to cancel changes ---*/
    cancel() {
        this.disableEnable = false;
        this.enableDisable = true;
        this.editDiv = false;
        this.addDiv = true;
        this.salesConsultant = '';
        this.error = '';
        this.clear();
    }
    Editcancel() {
        this.editDiv = true;
        this.addDiv = false;
        this.disableEnable = false;
        this.enableDisable = true;
        this.error = '';
        this.updateActive = '';
        this.updateSupplierName = '';
        this.updateAccountNumber = '';
        this.updatePhone = '';
        this.updateEmail = '';
        this.salesConsultant = '';
    }
    /*--- Method used to clear data after insertion ---*/
    clear() {
        this.active = '';
        this.name = '';
        this.accountNumber = '';
        this.email = '';
        this.salesConsultant = '';
        this.phone = '';

    }
    /*--- Method to clear error message ---*/
    clearErrMsg() {
        this.error = '';
        this.emailError = '';
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
}
