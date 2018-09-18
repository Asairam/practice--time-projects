import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { SetupCompMethodService } from './setupcompmethod.service';
@Component({
    selector: 'app-setupcompmethod-popup',
    templateUrl: './setupcompmethod.html',
    styleUrls: ['./setupcompmethod.css'],
    providers: [SetupCompMethodService]
})
export class SetupCompMethodComponent implements OnInit {
    disableDiv = true;
    addDiv = false;
    hideTable = true;
    editDiv = false;
    name: any;
    active: any;
    action: any;
    error: any;
    operator: any;
    operand: any;
    value: any;
    methodObj: any = {};
    updateMethodObj: any = {};
    methodsData: any;
    methodsListing: any;
    rows = [];
    actionsStaticData: any;
    valuesStaticData: any;
    operandvalue: any = 0;
    rowsLength: any;
    updateName: any;
    updateActive: any;
    updateId: any;
    rowLength: any;
    showPlus = true;
    hidePlus: any;
    hideDelete: any;
    servicesList: any = [];
    optionalDiv: any;
    scalesData: any;
    toFix: any;
    toastermessage: any;
    StaticData: any;
    StaticData1: any;
    constructor(private toastr: ToastrService,
        private translateService: TranslateService,
        private setupCompMethodService: SetupCompMethodService,
        private router: Router,
        @Inject('defaultActive') public defaultActive: string,
        @Inject('defaultInActive') public defaultInActive: string) {
    }
    ngOnInit() {
        this.getCompansationMethods();
        this.getStaticValues();
        this.getStaticActions();
        this.getCompansationScales();
        this.getServiceGroupsStatic();
        this.getStaticDataofProductlineAndGrossretail();
        this.rowsLength = false;
        this.active = true;
        this.optionalDiv = -1;
        // this.optionalDiv = false;
    }
    getCompansationMethods() {
        this.setupCompMethodService.getMethods()
            .subscribe(data => {
                this.methodsListing = data['result'];
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
    getStaticValues() {
        this.setupCompMethodService.getValues()
            .subscribe(data => {
                this.valuesStaticData = data['compensationmethods'];
                this.value = this.valuesStaticData[0].value;
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
    getStaticActions() {
        this.setupCompMethodService.getActions()
            .subscribe(data => {
                this.actionsStaticData = data['actionmethods'];
                this.action = this.actionsStaticData[0].action;
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
    saveCompensationMethods() {
        if (this.name === '' || this.name === undefined || this.name === 'undefined') {
            this.error = 'VALIDATION_MSG.NAME_REQUIRED';
        } else {
            if (this.active === undefined || this.active === false) {
                this.active = this.defaultInActive;
            }
            if (this.active === true) {
                this.active = this.defaultActive;
            }
            this.updateSampleCalculation();
            this.methodObj = {
                'name': this.name,
                'isScale': 0,
                'active': this.active,
                'methodsJson': this.rows
            };
            this.setupCompMethodService.saveMethods(this.methodObj)
                .subscribe(data => {
                    this.methodsData = data['result'];
                    this.getCompansationMethods();
                    this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_CREATE_SUCCESS');
                    this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                    this.addDiv = false;
                    this.hideTable = true;
                    this.disableDiv = true;
                    this.editDiv = false;
                    this.rows = [];
                    this.name = '';
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
    updateSampleCalculation() {
        this.toFix = '.00';
        const DAYS_WORKED = 5;
        const HOURLY_WAGE = 10;
        const HOURS_WORKED = 40;
        const SALARY = 500;
        const TICKETS = 20;
        const CLASS_SALES = 250;
        const CLASSES_PERFORMED = 5;
        const SERVICES_PERFORMED = 30;
        const PRODUCTS_SOLD = 20;
        const GROSS_SERVICE = 1000;
        const GROSS_RETAIL = 200;
        const COST_OF_SERVICE_FEE = 17.50;
        for (let i = 0; i < this.rows.length; i++) {
            if (this.rows[i].operand.split(':')[0] === 'scale') {
                let Scalec = [];
                this.scalesData.forEach(element => {
                    if (element.Id === this.rows[i].operand.split(':')[1]) {
                        Scalec = JSON.parse(element.Scale__c);
                        Scalec.forEach(obj => {
                            if (Number(this.rows[i - 1].result) <= Number(obj.upTo)) {
                                if (Number(this.rows[i - 1].result) > Number(obj.over)) {
                                    this.rows[i]['numeral'] = obj.percent;
                                }
                            }
                        });
                    }
                });
            }
            if (this.rows[i].operand === 'Salary') {
                this.operandvalue = SALARY;
            } else if (this.rows[i].operand === 'Hourly Wage') {
                this.operandvalue = HOURLY_WAGE;
            } else if (this.rows[i].operand === 'Hours Worked') {
                this.operandvalue = HOURS_WORKED;
            } else if (this.rows[i].operand === 'Days Worked') {
                this.operandvalue = DAYS_WORKED;
            } else if (this.rows[i].operand === 'Services Performed') {
                this.operandvalue = SERVICES_PERFORMED;
            } else if (this.rows[i].operand === 'Products Sold') {
                this.operandvalue = PRODUCTS_SOLD;
            } else if (this.rows[i].operand === 'Classes Performed') {
                this.operandvalue = CLASSES_PERFORMED;
            } else if (this.rows[i].operand === 'Tickets') {
                this.operandvalue = TICKETS;
            } else if (this.rows[i].operand === 'Gross Service') {
                this.operandvalue = GROSS_SERVICE;
            } else if (this.rows[i].operand === 'Gross Retail') {
                this.operandvalue = GROSS_RETAIL;
            } else if (this.rows[i].operand === 'Class Sales') {
                this.operandvalue = CLASS_SALES;
            } else if (this.rows[i].operand === 'Cost of Service Fee') {
                this.operandvalue = COST_OF_SERVICE_FEE;
            } else if (this.rows[i].operand === 'Number') {
                this.operandvalue = parseInt(this.rows[i].numeral, 10);
            } else if (this.rows[i].operand === 'Percent') {
                this.operandvalue = this.rows[i].numeral / 100;
            } else if (this.rows[i].operand === 'Result of Step') {
                const stepVal = parseInt(this.rows[i].numeral, 10);
                this.operandvalue = this.rows[stepVal - 1].result;
            } else {
                this.operandvalue = 0;
            }
            switch (this.rows[i].operator) {
                case ('Start With'):
                    if (this.rows[i].operand === 'Percent') {
                        this.rows[i]['result'] = this.operandvalue;
                    } else {
                        this.rows[i]['result'] = this.operandvalue;
                    }
                    break;
                case ('Add'):
                    this.rows[i]['result'] = (parseInt(this.rows[i - 1].result, 10) + this.operandvalue);
                    break;
                case ('Subtract'):
                    this.rows[i]['result'] = (parseInt(this.rows[i - 1].result, 10) - this.operandvalue);
                    break;
                case ('Multiply By'):
                    this.rows[i]['result'] = (parseInt(this.rows[i - 1].result, 10) * this.operandvalue);
                    break;
                case ('Divide By'):
                    this.rows[i]['result'] = (parseInt(this.rows[i - 1].result, 10) / this.operandvalue);
                    break;
                case ('If Less Than'):
                    if (this.operandvalue < this.rows[i - 1].result) {
                        this.rows[i]['result'] = parseInt(this.operandvalue, 10);
                    } else {
                        this.rows[i]['result'] = this.rows[i - 1].result;
                    }
                    break;
                case ('If More Than'):
                    if (this.operandvalue > this.rows[i - 1].result) {
                        this.rows[i]['result'] = parseInt(this.operandvalue, 10);
                    } else {
                        this.rows[i]['result'] = this.rows[i - 1].result;
                    }
                    break;
                default:
                    this.rows[i]['result'] = 0.00;
            }
        }
    }
    showData(methods) {
        this.toFix = '.00';
        this.rows = [];
        this.editDiv = true;
        this.disableDiv = false;
        this.addDiv = false;
        this.hideTable = false;
        this.updateId = methods.Id;
        this.updateName = methods.Name;
        this.updateActive = methods.Active__c;
        this.rows = JSON.parse(methods.Steps__c);
        for (let j = 0; j < this.rows.length; j++) {
            if (this.rows[j].operand === 'Services Performed') {
                this.setupCompMethodService.getServices()
                    .subscribe(data => {
                        this.servicesList[j] = data['result']
                            .filter(filterList => !filterList.isSystem);
                        // this.rows[j]['operandSubOption'] = this.servicesList[j][0].serviceGroupName;
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
            } else if (this.rows[j].operand === 'Gross Retail' || this.rows[j].operand === 'Products Sold') {
                const invGrpData = [];
                this.setupCompMethodService.getProductLineDetails()
                    .subscribe(data => {
                        this.setupCompMethodService.getInventoryGroupData().subscribe(data1 => {
                            for (let k = 0; k < data1['result'].length; k++) {
                                invGrpData.push({ 'Name': data1['result'][k].inventoryGroupName });
                            }
                            this.servicesList[j] = data['result'].concat(invGrpData);
                            // this.rows[j]['operandSubOption'] = this.servicesList[j][0].Name;
                        }, error => {
                            const errStatus = JSON.parse(error['_body'])['status'];
                            if (errStatus === '2085' || errStatus === '2071') {
                                if (this.router.url !== '/') {
                                    localStorage.setItem('page', this.router.url);
                                    this.router.navigate(['/']).then(() => { });
                                }
                            }
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
            } else if (this.rows[j].operand === 'Gross Service') {
                this.setupCompMethodService.getServices()
                    .subscribe(data => {
                        this.servicesList[j] = data['result']
                            .filter(filterList => !filterList.isSystem);
                        // this.rows[j]['operandSubOption'] = this.servicesList[j][0].serviceGroupName;
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
        if (this.rows.length > 1) {
            this.hideDelete = true;
        }
    }
    editCompensationMethods() {
        if (this.updateName === '' || this.updateName === undefined || this.updateName === 'undefined') {
            this.error = 'VALIDATION_MSG.NAME_REQUIRED';
        } else {
            if (this.updateActive === undefined || this.updateActive === false) {
                this.updateActive = this.defaultInActive;
            }
            if (this.updateActive === true) {
                this.updateActive = this.defaultActive;
            }
            this.updateSampleCalculation();
            this.updateMethodObj = {
                'name': this.updateName,
                'isScale': 0,
                'active': this.updateActive,
                'methodsJson': this.rows
            };

            this.setupCompMethodService.editMethods(this.updateId, this.updateMethodObj)
                .subscribe(data => {
                    this.methodsData = data['result'];
                    this.getCompansationMethods();
                    this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_EDIT_SUCCESS');
                    this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                    this.addDiv = false;
                    this.hideTable = true;
                    this.disableDiv = true;
                    this.editDiv = false;
                    this.rows = [];
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
    getCompansationScales() {
        this.setupCompMethodService.getscales()
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
    change(value, i) {
        this.rows[i]['operandSubOption'] = value;
    }
    onValueChange(value, row, i) {
        if (value === 'Services Performed') {
            this.rowLength = i;
            this.setupCompMethodService.getServices()
                .subscribe(data => {
                    this.servicesList[i] = data['result']
                        .filter(filterList => !filterList.isSystem);
                    this.rows[i]['operandSubOption'] = 'All';
                    // this.rows[i]['operandSubOption'] = this.servicesList[i][0].serviceGroupName;
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
        } else if (value === 'Gross Service') {
            this.rowLength = i;
            this.setupCompMethodService.getServices()
                .subscribe(data => {
                    this.servicesList[i] = data['result']
                        .filter(filterList => !filterList.isSystem);
                    this.rows[i]['operandSubOption'] = 'All';
                    // this.rows[i]['operandSubOption'] = this.servicesList[i][0].serviceGroupName;
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
        } else if (value === 'Gross Retail' || value === 'Products Sold') {
            this.rowLength = i;
            const invGrpData = [];
            this.setupCompMethodService.getProductLineDetails()
                .subscribe(data => {
                    this.setupCompMethodService.getInventoryGroupData().subscribe(data1 => {
                        for (let k = 0; k < data1['result'].length; k++) {
                            invGrpData.push({ 'Name': data1['result'][k].inventoryGroupName });
                        }
                        this.servicesList[i] = data['result'].concat(invGrpData);
                        this.rows[i]['operandSubOption'] = 'All';
                    }, error => {
                        const errStatus = JSON.parse(error['_body'])['status'];
                        if (errStatus === '2085' || errStatus === '2071') {
                            if (this.router.url !== '/') {
                                localStorage.setItem('page', this.router.url);
                                this.router.navigate(['/']).then(() => { });
                            }
                        }
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
        } else {
            this.optionalDiv = -1;
            this.servicesList[i] = [];
        }
    }
    addRows() {
        this.optionalDiv = -1;
        this.rows.push({
            'step': this.rows.length + 1,
            'operator': this.action,
            'operandSubOption': '',
            'result': '',
            'operand': this.value,
            'numeral': '', 'description': ''
        });
        this.hidePlus = this.rows.length;
        if (this.hidePlus === 40) {
            this.showPlus = false;
        }
        if (this.hidePlus > 1) {
            this.hideDelete = true;
        }
    }
    deleteFieldValue(rows, index) {
        this.rows.splice(index, 1);
        for (let i = 0; i < this.rows.length; i++) {
            this.rows[i].step = i + 1;
        }
        this.hidePlus = this.rows.length;
        if (this.hidePlus <= 40) {
            this.showPlus = true;
        }
        if (this.hidePlus === 1) {
            this.hideDelete = false;
        }
        this.servicesList[index] = [];
    }
    addNewRecord() {
        this.addDiv = true;
        this.hideTable = false;
        this.disableDiv = false;
        this.editDiv = false;
        // this.rows = [];
        this.addRows();
    }
    cancel() {
        this.addDiv = false;
        this.hideTable = true;
        this.disableDiv = true;
        this.editDiv = false;
        this.error = '';
        this.rows = [];
        this.hideDelete = false;
        this.servicesList = [];
        this.clear();
    }
    clear() {
        this.name = '';
    }
    clearErrMsg() {
        this.error = '';
    }
    getServiceGroupsStatic() {
        this.setupCompMethodService.getStaticServiceGroups().subscribe(
            data => {
                this.StaticData = data['STATIC DATA OF SERVICE PERFORMED AND GROSSSERVICE'];
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
    getStaticDataofProductlineAndGrossretail() {
        this.setupCompMethodService.getStaticServiceGroups().subscribe(
            data => {
                this.StaticData1 = data['STATIC DATA OF PRODUCT SOLD AND GROSS RETAIL'];
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
