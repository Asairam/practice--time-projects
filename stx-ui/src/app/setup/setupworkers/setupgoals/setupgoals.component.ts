
/*---
    Setup Goals Component displays following methods:
    * ngOnInit(): This method is used for on page load
    * saveCompensationGoals(): This method is used to save compensation goals
    * showData(goalslist): This method is used to show data
    * getStaticValues(): This method is used to get static values
    * getStaticActions(): This method is used to get static actions
    * getGoals(): This method is used to get goals
    * editCompensationGoals(): This method is used to edit compensation goals
    * updateSampleCalculation(): This method is used to update sample calculations
    * addRows(): This method is used to add rows
    * deleteFieldValue(rows, index): This method is used to delete all fields individually
    * addNew(): This method is used to add new record
    * cancel(): This method is used to cancel previous changes
    * clear(): This method is used to clear fields
    * clearErrMsg(): This method is used to clear error message
---*/
import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ToastrService } from 'ngx-toastr';
import { SetupGoalsService } from './setupgoals.service';
import { TranslateService } from 'ng2-translate';
@Component({
    selector: 'app-setupgoals-popup',
    templateUrl: './setupgoals.html',
    styleUrls: ['./setupgoals.css'],
    providers: [SetupGoalsService]
})
export class SetupGoalsComponent implements OnInit {
    disableDiv = true;
    addDiv = false;
    hideTable = false;
    editDiv = false;
    value: any;
    action: any;
    rows = [];
    toFix: any;
    name: any;
    active: any;
    error: any;
    actionsStaticData: any;
    operandvalue: any;
    valuesStaticData: any;
    goalsList: any;
    rowLength: any;
    rowLengthInc: any;
    goalsObj: any = {};
    updateGoalsObj: any = {};
    methodsData: any;
    updateId: any;
    updateName: any;
    updateActive: any;
    methodsUpdateData: any;
    test: any;
    toastermessage: any;
    constructor(private toastr: ToastrService,
        private setupGoalsService: SetupGoalsService,
        private router: Router,
        private translateService: TranslateService,
        @Inject('defaultActive') public defaultActive: string,
        @Inject('defaultInActive') public defaultInActive: string) {
    }
    /*--- Method used for on page load ---*/
    ngOnInit() {
        this.getGoals();
        this.getStaticValues();
        this.getStaticActions();
        this.active = true;
    }
    /*--- Method to save compensation goals ---*/
    saveCompensationGoals() {
        if (this.name === '' || this.name === undefined || this.name === 'undefined') {
            this.error = 'name required';
        } else {
            if (this.active === undefined || this.active === false) {
                this.active = this.defaultInActive;
            }
            if (this.active === true) {
                this.active = this.defaultActive;
            }
            this.updateSampleCalculation();
            this.goalsObj = {
                'name': this.name,
                'active': this.active,
                'methodsJson': this.rows
            };
            this.setupGoalsService.saveGoals(this.goalsObj)
                .subscribe(data => {
                    this.methodsData = data['result'];
                    this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_CREATE_SUCCESS');
                    this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                    this.getGoals();
                    this.disableDiv = true;
                    this.addDiv = false;
                    this.hideTable = false;
                    this.editDiv = false;
                    this.clear();
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
    /*--- Method to show data ---*/
    showData(goalslist) {
        this.rows = [];
        this.editDiv = true;
        this.disableDiv = false;
        this.addDiv = false;
        this.hideTable = true;
        this.updateId = goalslist.Id;
        this.updateName = goalslist.Name;
        this.updateActive = goalslist.Active__c;
        this.rows = JSON.parse(goalslist.Steps__c);
        if (this.rows.length === 1) {
            this.rowLength = this.rows.length;
        } else {
            this.rowLengthInc = this.rows.length + 1;
        }
    }
    /*--- Method to get static values ---*/
    getStaticValues() {
        this.setupGoalsService.getValues()
            .subscribe(data => {
                this.valuesStaticData = data['goalsvalue'];
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
    /*--- Method to get static actions ---*/
    getStaticActions() {
        this.setupGoalsService.getActions()
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
    /*--- Method to get goals ---*/
    getGoals() {
        this.setupGoalsService.getGoals()
            .subscribe(data => {
                this.goalsList = data['result'];
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
    /*--- Method to edit compensation goals ---*/
    editCompensationGoals() {
        if (this.updateName === '' || this.updateName === undefined || this.updateName === 'undefined') {
            this.error = 'name required';
        } else {
            if (this.updateActive === undefined || this.updateActive === false) {
                this.updateActive = this.defaultInActive;
            }
            if (this.updateActive === true) {
                this.updateActive = this.defaultActive;
            }
            this.updateSampleCalculation();
            this.updateGoalsObj = {
                'name': this.updateName,
                'active': this.updateActive,
                'methodsJson': this.rows
            };
            this.setupGoalsService.editGoals(this.updateId, this.updateGoalsObj)
                .subscribe(data => {
                    this.methodsUpdateData = data['result'];
                    this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_EDIT_SUCCESS');
                    this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                    this.getGoals();
                    this.disableDiv = true;
                    this.addDiv = false;
                    this.hideTable = false;
                    this.editDiv = false;
                    this.clear();
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
    /*--- Method to update sample calculations ---*/
    updateSampleCalculation() {
        this.toFix = '.00';
        const grossService = 1000;
        const grossRetail = 200;
        const servicesPerformed = 25;
        const productsSold = 20;
        const rebookedAppointments = 5;
        const tickets = 20;
        const Number = 20;
        const Percent = 20;
        const Result_of_Step = 20;
        for (let i = 0; i < this.rows.length; i++) {
            if (this.rows[i].operand === 'Gross Service') {
                this.operandvalue = grossService;
            } else if (this.rows[i].operand === 'Gross Retail') {
                this.operandvalue = grossRetail;
            } else if (this.rows[i].operand === 'Services Performed') {
                this.operandvalue = servicesPerformed;
            } else if (this.rows[i].operand === 'Products Sold') {
                this.operandvalue = productsSold;
            } else if (this.rows[i].operand === 'Rebooked Appointments') {
                this.operandvalue = rebookedAppointments;
            } else if (this.rows[i].operand === 'Tickets') {
                this.operandvalue = tickets;
            } else if (this.rows[i].operand === 'Number') {
                this.operandvalue = parseInt(this.rows[i].numeral, 10);
            } else if (this.rows[i].operand === 'Percent') {
                this.operandvalue =  this.rows[i].numeral / 100;
            }  else if (this.rows[i].operand === 'Result of Step') {
                const stepVal = parseInt(this.rows[i].numeral , 10);
                this.operandvalue =  this.rows[stepVal - 1].result;
            }
            switch (this.rows[i].operator) {
                case ('Start With'):
                    this.rows[i]['result'] = this.operandvalue;
                    break;
                case ('Add'):
                    this.rows[i]['result'] = (this.rows[i - 1].result + this.operandvalue);
                    break;
                case ('Subtract'):
                    this.rows[i]['result'] = (this.rows[i - 1].result - this.operandvalue);
                    break;
                case ('Multiply By'):
                    this.rows[i]['result'] = (this.rows[i - 1].result * this.operandvalue);
                    break;
                case ('Divide By'):
                    this.rows[i]['result'] = (this.rows[i - 1].result / this.operandvalue);
                    break;
                case ('If Less Than'):
                    if (this.operandvalue < this.rows[i - 1].result) {
                        this.rows[i]['result'] = this.operandvalue;
                    } else {
                        this.rows[i]['result'] = this.rows[i - 1].result;
                    }
                    break;
                case ('If More Than'):
                    if (this.operandvalue > this.rows[i - 1].result) {
                        this.rows[i]['result'] = this.operandvalue;
                    } else {
                        this.rows[i]['result'] = this.rows[i - 1].result;
                    }
                    break;
                default:
                    this.rows[i]['result'] = 0.00;
            }
        }
    }
    /*--- Method to add rows ---*/
    addRows() {
        this.rows.push({
                'step': this.rows.length + 1, 'operator': this.action, 'operandSubOption': '', 'result': '', 'operand': this.value,
                'numeral': 0, 'description': ''
            });
            if (this.rows.length === 1) {
                 this.rowLength = this.rows.length;
             } else {
                 this.rowLengthInc = this.rows.length + 1;
             }
          }
    /*--- Method to delete fields ---*/
    deleteFieldValue(rows, index) {
            this.rows.splice(index, 1);
            for (let i = 0; i < this.rows.length; i++) {
              this.rows[i].step = i + 1;
            }
            if (this.rows.length <= 1) {
               this.rowLengthInc = this.rowLength;
            } else {
                this.rowLengthInc = this.rows.length + 1;
            }
          }
    /*--- Method to add new record ---*/
    addNew() {
        this.disableDiv = false;
        this.addDiv = true;
        this.hideTable = true;
        this.editDiv = false;
        this.addRows();
        if (this.rows.length === 1) {
            this.rowLength = this.rows.length;
        } else {
            this.rowLengthInc = this.rowLength + 1;
        }
        }
    /*--- Method to cancel previous changes ---*/
    cancel() {
        this.disableDiv = true;
        this.addDiv = false;
        this.hideTable = false;
        this.editDiv = false;
        this.error = '';
        this.clear();
    }
    /*--- Method to clear fields ---*/
    clear() {
        this.name = '';
        this.active = '';
        this.updateName = '';
        this.updateActive = '';
        this.rows = [];
    }
    /*--- Method to clear error message ---*/
    clearErrMsg() {
        this.error = '';
    }
}
