/*
    Setup Product Line component has the following methods.
    * ngOnInit(): This method is used to load methods on page load
    * getProductLine(): This method is used to get product lines
    * getInventoryGroups(): This method is used to get inventory groups
    * getInactiveProductLine(value): This method is used to get inactive or active inventory product lines
    * createProductLine(): This method is used to create product line
    * showData(productlinelist): This method is used to show data
    * editInventoryProductLines(): This method is used to edit inventory product line
    * addNew(): This method is used to add new inventory product line
    * deleteProductLine(): This method is used to delete product line
    * cancel(): This method is used to cancel changes
    * clear(); This method is used to clear data
    * clearmessage(): This method is used to clear error message
*/
import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { SetupcompansationscalesService } from './setupcompansationscales.service';
@Component({
    selector: 'app-setupcompansationscales-popup',
    templateUrl: './setupcompansationscales.html',
    styleUrls: ['./setupcompensationscales.css'],
    providers: [SetupcompansationscalesService]
})
export class SetupcompansationscalesComponent implements OnInit {
    hideDelete: any;
    disableDiv = true;
    addDiv = false;
    hideTable = true;
    editDiv = false;
    name: any;
    active: any;
    upTo: any;
    scalesObj: any;
    scalesData: any;
    basisValue: any;
    scales = [];
    staticArray: any = {};
    basisData: any;
    scalesDetails: any;
    scalesEditDetails: any;
    error: any;
    error1: any;
    error2: any;
    over: any;
    scaleId: any;
    updateName: any;
    updateActive: any;
    updateScales = [];
    updateBasis: any;
    scalesUpdateObj: any = {};
    showPlus = true;
    hidePlus: any;
    uptoValidation: any;
    lineNumber: any;
    percentValidation: any;
    toastermessage: any;
    duplcateErr: any;
    constructor(private toastr: ToastrService,
        private setupcompansationscalesService: SetupcompansationscalesService,
        private router: Router,
        private translateService: TranslateService,
        @Inject('defaultColor') public defaultColor: string,
        @Inject('defaultType') public defaultType: string) {
    }
    ngOnInit() {
        this.getCompansationScales();
        this.getBasisOfScales();
        this.staticArray = { 'over': 0, 'upTo': '', 'percent': '' };
        this.scales.push(this.staticArray);
        this.updateScales.push(this.staticArray);
    }
    getCompansationScales() {
        this.setupcompansationscalesService.getscales()
            .subscribe(data => {
                this.scalesData = data['result'];
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
    getBasisOfScales() {
        this.setupcompansationscalesService.getBasis()
            .subscribe(data => {
                this.basisData = data['basis'];
                this.basisValue = this.basisData[0].NAME;
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
    basisDataList(value) {
        this.basisValue = value;
    }
    saveCompansationScales() {
        for (let i = 0; i < this.scales.length; i++) {
            if (this.scales.length > i + 1) {
                if (this.scales[i].upTo !== '') {
                    this.scales[i + 1].over = parseInt(this.scales[i].upTo, 10);
                } else {
                    this.scales[i + 1].over = 0;
                }
            }
        }
        // this.checkIfDuplicateScaleExists(this.scales);
        if (this.name === '' || this.name === undefined || this.name === 'undefined') {
            this.error = 'VALIDATION_MSG.NAME_REQUIRED';
        }
        if (this.scales.length > 0) {
            for (let i = 0; i < this.scales.length; i++) {
                if (this.scales[i].upTo < 0 || this.scales[i].upTo > 999999.99) {
                    this.uptoValidation = this.translateService.get('VALIDATION_MSG.UPTO_LIMIT');
                    // this.lineNumber = i + 1;
                    // this.error1 = 'Line  ' + this.lineNumber + ':' + this.uptoValidation.value;
                    this.error1 = this.uptoValidation.value;
                }
            }
            for (let i = 0; i < this.scales.length; i++) {
                if (this.scales[i].percent < 0 || this.scales[i].percent > 100) {
                    this.percentValidation = this.translateService.get('VALIDATION_MSG.PERCENT_LIMIT');
                    // this.lineNumber = i + 1;
                    this.error2 = this.percentValidation.value;
                    // this.error2 = 'Line  ' + this.lineNumber + ':' + this.percentValidation.value;
                }
            }
        }
        if (this.error1 === '' && this.error2 === '' && this.error === '' && this.duplcateErr === '') {
            if (this.active === undefined || this.active === false) {
                this.active = 0;
            } else if (this.active === true) {
                this.active = 1;
            }
            this.scalesObj = {
                'name': this.name,
                'active': this.active,
                'scales': this.scales,
                'basisValue': this.basisValue
            };
            this.setupcompansationscalesService.createScales(this.scalesObj)
                .subscribe(
                    data => {
                        this.scalesDetails = data['data'];
                        this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_CREATE_SUCCESS');
                        this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                        this.disableDiv = true;
                        this.hideTable = true;
                        this.addDiv = false;
                        this.editDiv = false;
                        this.clear();
                        this.getCompansationScales();
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
    showData(scalesdata) {
        this.hideTable = false;
        this.addDiv = false;
        this.editDiv = true;
        this.disableDiv = false;
        this.scaleId = scalesdata.Id;
        this.updateName = scalesdata.Name;
        this.updateActive = scalesdata.Active__c;
        this.updateScales = JSON.parse(scalesdata.Scale__c);
        this.updateBasis = scalesdata.Basis__c;
        const test = this.updateScales;
        this.hidePlus = this.updateScales.length;
        if (this.hidePlus > 1) {
            this.hideDelete = true;
        }
    }
    editCompansationScales() {
        for (let i = 0; i < this.updateScales.length; i++) {
            if (this.updateScales.length > i + 1) {
                if (this.updateScales[i].upTo !== '') {
                    this.updateScales[i + 1].over = parseInt(this.updateScales[i].upTo, 10);
                } else {
                    this.updateScales[i + 1].over = 0;
                }
            }
        }
        this.error1 = '';
        this.error2 = '';
        // this.checkIfDuplcateUpdateScaleExists(this.updateScales);
        if (this.updateName === '' || this.updateName === undefined || this.updateName === 'undefined') {
            this.error = 'VALIDATION_MSG.NAME_REQUIRED';
        } else {
            if (this.updateScales.length > 0) {
                for (let i = 0; i < this.updateScales.length; i++) {
                    if (this.updateScales[i].upTo < 0 || this.updateScales[i].upTo > 999999.99) {
                        this.uptoValidation = this.translateService.get('VALIDATION_MSG.UPTO_LIMIT');
                        // this.lineNumber = i + 1;
                        // this.error1 = 'Line  ' + this.lineNumber + ':' + this.uptoValidation.value;
                        this.error1 = this.uptoValidation.value;
                    }
                }
                for (let i = 0; i < this.updateScales.length; i++) {
                    if (this.updateScales[i].percent < 0 || this.updateScales[i].percent > 100) {
                        this.percentValidation = this.translateService.get('VALIDATION_MSG.PERCENT_LIMIT');
                        // this.lineNumber = i + 1;
                        this.error2 = this.percentValidation.value;
                        // this.error2 = 'Line  ' + this.lineNumber + ':' + this.percentValidation.value;
                    }
                }
            }
            if (this.error1 === '' && this.error2 === '' && this.duplcateErr === '') {
                if (this.updateActive === undefined || this.updateActive === false) {
                    this.updateActive = 0;
                } else if (this.updateActive === true) {
                    this.updateActive = 1;
                }
                this.scalesUpdateObj = {
                    'updateName': this.updateName,
                    'updateActive': this.updateActive,
                    'updateScales': this.updateScales,
                    'updateBasis': this.updateBasis
                };
                this.setupcompansationscalesService.editScales(this.scalesUpdateObj, this.scaleId)
                    .subscribe(
                        data => {
                            this.scalesEditDetails = data['data'];
                            this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_EDIT_SUCCESS');
                            this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                            this.disableDiv = true;
                            this.hideTable = true;
                            this.addDiv = false;
                            this.editDiv = false;
                            this.clear();
                            this.getCompansationScales();
                        },
                        error => {
                            const status = JSON.parse(error['status']);
                            const statuscode = JSON.parse(error['_body']).status;
                            switch (JSON.parse(error['_body']).status) {
                                case '2033':
                                    this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                                    break;
                                case '2044':
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
    }
    deleteFieldValue(scales, index) {
        this.scales.splice(index, 1);
        this.hidePlus = this.scales.length;
        if (this.hidePlus <= 20) {
            this.showPlus = true;
        }
        if (this.hidePlus === 1) {
            this.hideDelete = false;
        }
        this.duplcateErr = '';
    }
    addNew(upto, ind) {
        if (this.scales[ind].upTo !== '') {
            this.scales = this.scales.slice(0, ind + 1).concat({ 'over': upto, 'upTo': '', 'percent': '' }).concat(this.scales.slice(ind + 1));
        } else {
            this.scales = this.scales.slice(0, ind + 1).concat({ 'over': 0, 'upTo': '', 'percent': '' }).concat(this.scales.slice(ind + 1));
        }
        if (this.scales[ind].upTo === '') {
            this.scales[ind]['upTo'] = 0;
        }
        if (this.scales[ind].percent === '') {
            this.scales[ind]['percent'] = 0;
        }
        this.hidePlus = this.scales.length;
        if (this.hidePlus === 20) {
            this.showPlus = false;
        }
        if (this.hidePlus > 1) {
            this.hideDelete = true;
        }
    }
    editAddNew(upto, ind) {
        const test = this.updateScales;
        this.hidePlus = this.updateScales.length;
        if (this.hidePlus === 20) {
            this.showPlus = false;
        }
        if (this.hidePlus > 1) {
            this.hideDelete = true;
        }
        if (this.updateScales[ind].upTo !== '') {
            this.updateScales = this.updateScales.slice(0, ind + 1).concat({ 'over': upto, 'upTo': '', 'percent': '' }).concat(this.updateScales.slice(ind + 1));
        } else {
            this.updateScales = this.updateScales.slice(0, ind + 1).concat({ 'over': 0, 'upTo': '', 'percent': '' }).concat(this.updateScales.slice(ind + 1));
        }
        if (this.updateScales[ind].upTo === '') {
            this.updateScales[ind]['upTo'] = 0;
        }
        if (this.updateScales[ind].percent === '') {
            this.updateScales[ind]['percent'] = 0;
        }
        // for (let i = 0; i < this.updateScales.length; i++) {
        //     if (this.updateScales.length > i + 1) {
        //         if (this.updateScales[i].upTo !== '') {
        //             this.updateScales[i + 1].over = parseInt(this.updateScales[i].upTo, 10);
        //         } else {
        //             this.updateScales[i + 1].over = 0;
        //         }
        //     }
        // }
    }
    editDeleteFieldValue(scales, index) {
        this.updateScales.splice(index, 1);
        this.hidePlus = this.updateScales.length;
        if (this.hidePlus <= 20) {
            this.showPlus = true;
        }
        if (this.hidePlus === 1) {
            this.hideDelete = false;
        }
        this.duplcateErr = '';
    }
    createNewRecord() {
        this.scales = [];
        this.scales.push(this.staticArray);
        this.addDiv = true;
        this.hideTable = false;
        this.editDiv = false;
        this.disableDiv = false;
        this.active = true;
    }
    cancel() {
        this.addDiv = false;
        this.hideTable = true;
        this.editDiv = false;
        this.disableDiv = true;
        this.error = '';
        this.scales = [];
        this.duplcateErr = '';
        this.clear();
    }
    clear() {
        this.name = '',
            this.active = '',
            this.scales = [],
            this.staticArray = { 'over': 0, 'upTo': '', 'percent': '' };
        this.scales.push(this.staticArray);
        this.hideDelete = false;
        this.basisValue = '',
            this.over = '';
        this.error = '';
        this.duplcateErr = '';

    }
    clearErrMsg() {
        this.error = '';
        this.error1 = '';
        this.error2 = '';
        this.duplcateErr = '';
        this.uptoValidation = '';
    }
    clearErrMsg1() {
        this.error = '';
    }
}
