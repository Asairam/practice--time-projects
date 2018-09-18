import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from 'ng2-translate';
import { ToastrService } from 'ngx-toastr';
import { SetupServiceDetailsService } from './setupservicedetails.service';
// import { environment } from '../../../environments/environment';
import * as config from '../../../app.config';
@Component({
  templateUrl: './setupservicedetails.html',
  styleUrls: ['./setupservicedetails.css'],
  providers: [SetupServiceDetailsService]
})
export class SetupServiceDetailsComponent implements OnInit {
  isInActiveService = true;
  isAdding: any = true;
  isEditing: any = false;
  listingEnableDisable: any;
  addEnableDisable: any = true;
  isClass: any;
  showInactive: any = false;
  active: any = true;
  selectedServiceGroup: any;
  priorityShowHide: any = false;
  serviceName: any;
  isToDelete = false;
  taxable: any = false;
  isUseMultiplePriceLevels: any = false;
  hideUseMultiplePriceLevels: any = false;
  guestChargeAmount: any;
  onlineName: any;
  description: any;
  depositRequired: any = false;
  depositAmount: any;
  depositPercent: any;
  getResourcesDropdown: any;
  multiplePriceLevelRows = [];
  serviceGroupsList: any;
  serviceGroup: any;
  resourcesTypeList: any;
  resourceList = [];
  resourceName: any;
  resourcesUsedRows = [];
  setupServicesObj: {};
  price: any = '0.00';
  bufferAfter: any;
  priority: any;
  numberOptionsList = [];
  resourcesFilter: any;
  resourceUsedShowHide = false;
  serviceDetailsList: any;
  servicesData: any;
  filter: any;
  addServiceGroupName: any;
  aptBookingData: any;
  bookingIntervalMinutes: any;
  editServiceDetailsList: any;
  editServiceResourcesList: any;
  servicesUpdateObj: any;
  serviceId: any;
  // error msgs
  nameRequiredErrMsg: any;
  serviceGroupRequiredErrMsg: any;
  guestAmountlength: any;
  durationRequiredErrMsg: any;
  nameUniqueErrMsg: any;
  depositRequiredErrMsg: any;
  onlineNameUniqueErrMsg: any;
  depositNotValidErrMsg: any;
  resourceRequiredErrMsg: any;
  resourceDuplicateErrMsg: any;
  priorityRequiredErrMsg: any;
  priorityDuplicateErrMsg: any;
  totalDurationValidErrMsg: any;
  depositAmountErrMsg: any;
  priceNotValidErrMsg: any;
  depositAmountNotValidErrMsg: any;
  depositPercentErrMsg: any;
  inActiveDependencyErrMsg: any;
  errMsg1: any;
  errMsg2: any;
  errMsg3: any;
  errMsg4: any;
  errMsg5: any;
  errMsg6: any;
  toastermessage: any;
  DECIMAL_SEPARATOR: any = '.';
  isAmountFormatValid: any;
  constructor(private setupServiceDetailsService: SetupServiceDetailsService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private router: Router) {
  }
  /**
   * This is a page onload function
   * Loading Service groups and services list
   */
  ngOnInit() {
    this.getServiceGroupsList();
    this.getResourceTypeStaticJSONData();
    this.getSetupResources();
    this.getResouDropdown();
    this.setupServiceDetailsService.getAppointmentBookingData()
      .subscribe(data => {
        this.aptBookingData = data['result'];
        this.bookingIntervalMinutes = this.aptBookingData.bookingIntervalMinutes;
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
    this.isClass = config.environment.booleanFalse;
  }
  /**
   * This function is to load setup services add page
   */


  addNew() {
    this.cancel();
    this.setupServicesObj = {};
    this.isAdding = true;
    this.isEditing = false;
    this.listingEnableDisable = true;
    this.addEnableDisable = false;
    this.populateMultiplePriceLevels();
    this.hideUseMultiplePriceLevels = false;
    this.active = true;
  }
  /**
   * This function is to setup a service record
   * @param value is boolean type true/false to handle save / save&new button
   */
  setupServiceDetails(value) {
    /** Validations */
    const priceLevelsLength = this.multiplePriceLevelRows.length;
    const resourcesLength = this.resourcesUsedRows.length;
    let mulPriceLevReq = false;
    let resourceRequired = false;
    let resourceDuplicate = false;
    let priorityRequired = false;
    let priorityDuplicate = false;
    let isTotalDurationValid = false;
    let durationLevel;
    let durationLevelReq;
    // let priceLevel;
    const priceNotValid = false;
    const currencyPattern = /^[0-9]+(\.[0-9]{1,2})?$/;
    if (!this.guestChargeAmount) {
      this.guestChargeAmount = '';
    }
    /** Multiple Price Level Duration 1 required validation */
    for (let i = 0; i < priceLevelsLength; i++) {
      // if (!currencyPattern.test(this.multiplePriceLevelRows[i].price)) {
      //   priceLevel = i + 1;
      //   priceNotValid = true;
      //   break;
      // } else {
      if (this.multiplePriceLevelRows[i].duration1 <= 0) {
        durationLevelReq = i + 1;
        mulPriceLevReq = true;
        break;
      } else {
        this.multiplePriceLevelRows[i].totalDuration = Number(this.multiplePriceLevelRows[i].duration1)
          + Number(this.multiplePriceLevelRows[i].duration2 === null ? 0 : this.multiplePriceLevelRows[i].duration2)
          + Number(this.multiplePriceLevelRows[i].duration3 === null ? 0 : this.multiplePriceLevelRows[i].duration3)
          + Number(this.multiplePriceLevelRows[i].bufferAfter === null ? 0 : this.multiplePriceLevelRows[i].bufferAfter);
        if (Number(this.multiplePriceLevelRows[i].totalDuration) % Number(this.bookingIntervalMinutes) !== 0) {
          durationLevel = i + 1;
          isTotalDurationValid = true;
          break;
        }
      }
    }
    // }
    for (let j = 0; j < resourcesLength; j++) {
      if (this.resourcesUsedRows[j].name === '') {
        resourceRequired = true;
      }
      if (Number((this.resourcesUsedRows[j].name).split('~')[1]) === 0) {
        resourceRequired = true;
        break;
      } else {
        for (let k = j + 1; k < resourcesLength; k++) {
          if ((this.resourcesUsedRows[k].name).split('~')[0] === (this.resourcesUsedRows[j].name).split('~')[0]) {
            resourceDuplicate = true;
            break;
          }
        }
      }
    }
    if (this.resourcesFilter) {
      if (this.resourcesFilter.toLowerCase() === 'any') {
        for (let j = 0; j < resourcesLength; j++) {
          if (this.resourcesUsedRows[j].priority === config.environment.valueNone) {
            priorityRequired = true;
            break;
          } else {
            for (let k = j + 1; k < resourcesLength; k++) {
              if (Number(this.resourcesUsedRows[k].priority) === Number(this.resourcesUsedRows[j].priority)) {
                priorityDuplicate = true;
                break;
              }
            }
          }
        }
      }
    }

    this.errMsg1 = this.translateService.get('VALIDATION_MSG.LEVEL');
    if (this.serviceName === undefined || this.serviceName === '' || this.serviceName === 'undefined') {
      this.nameRequiredErrMsg = 'VALIDATION_MSG.NAME_REQUIRED';
      window.scrollTo(0, 0);
    } else if (this.selectedServiceGroup === undefined || this.selectedServiceGroup === '' || this.selectedServiceGroup === 'undefined') {
      this.serviceGroupRequiredErrMsg = 'VALIDATION_MSG.SERVICE_GROUP_REQUIRED';
      window.scrollTo(0, 0);
    } else if (priceNotValid) {
      // this.errMsg4 = this.translateService.get('VALIDATION_MSG.LEVEL');
      this.errMsg5 = this.translateService.get('VALIDATION_MSG.PRICE_VALIDATION');
      this.priceNotValidErrMsg = this.errMsg1.value + ' ' + this.errMsg5.value;
      window.scrollTo(0, 0);
    } else if (mulPriceLevReq) {
      // this.errMsg4 = this.translateService.get('VALIDATION_MSG.LEVEL');
      this.errMsg6 = this.translateService.get('VALIDATION_MSG.DURATION1_REQUIRED');
      this.durationRequiredErrMsg = this.errMsg1.value + ' ' + durationLevelReq + ', ' + this.errMsg6.value;
      window.scrollTo(0, 0);
    } else if (isTotalDurationValid) {
      // this.errMsg1 = this.translateService.get('VALIDATION_MSG.DURATION_VALIDATION1');
      this.errMsg2 = this.translateService.get('VALIDATION_MSG.DURATION_VALIDATION2');
      this.errMsg3 = this.translateService.get('VALIDATION_MSG.DURATION_VALIDATION3');
      this.totalDurationValidErrMsg = this.errMsg1.value + ' ' + durationLevel + ' ' + this.errMsg2.value
        + ' ' + this.bookingIntervalMinutes + ' ' + this.errMsg3.value;
      window.scrollTo(0, 500);
    } else if (this.depositRequired &&
      ((this.depositAmount === undefined || this.depositAmount === '' || this.depositAmount === 'undefined') &&
        (this.depositPercent === undefined || this.depositPercent === '' || this.depositPercent === 'undefined'))) {
      this.depositRequiredErrMsg = 'VALIDATION_MSG.DEPOSITAMOUNT_DEPOSITPERCENT_REQUIRED';
    } else if (this.depositRequired &&
      !((this.depositAmount === undefined || this.depositAmount === '' || this.depositAmount === 'undefined') ||
        (this.depositPercent === undefined || this.depositPercent === '' || this.depositPercent === 'undefined'))) {
      this.depositNotValidErrMsg = 'VALIDATION_MSG.DEPOSITAMOUNT_DEPOSITPERCENT_NOTVALID';
    } else if (this.depositAmount !== undefined &&
      this.depositAmount !== '' && this.depositAmount !== 'undefined' && !currencyPattern.test(this.depositAmount)) {
      this.depositAmountNotValidErrMsg = 'VALIDATION_MSG.DEPOSIT_AMOUNT_FORMAT_VALIDATION';
    } else if (this.depositAmount !== undefined && this.depositAmount !== '' &&
      this.depositAmount !== 'undefined' && parseFloat(this.depositAmount) > parseFloat(this.multiplePriceLevelRows[0].price)) {
      this.depositAmountErrMsg = 'VALIDATION_MSG.DEPOSIT_AMOUNT_VALIDATION';
    } else if (this.depositPercent !== undefined && this.depositPercent !== ''
      && this.depositPercent !== 'undefined' && Number(this.depositPercent) < 1 || Number(this.depositPercent) > 100) {
      this.depositPercentErrMsg = 'VALIDATION_MSG.DEPOSIT_PERCENT_VALIDATION';
    } else if (resourceRequired) {
      this.resourceRequiredErrMsg = 'VALIDATION_MSG.RESOURCE_REQUIRED';
    } else if (resourceDuplicate) {
      this.resourceDuplicateErrMsg = 'VALIDATION_MSG.RESOURCE_DUPLICATE';
    } else if (priorityRequired) {
      this.priorityRequiredErrMsg = 'VALIDATION_MSG.PRIORITY_REQUIRED';
    } else if (priorityDuplicate) {
      this.priorityDuplicateErrMsg = 'VALIDATION_MSG.PRIORITY_DUPLICATE';
    } else if (this.guestChargeAmount !== '' && (this.guestChargeAmount.split('.')[0].length > 10 && this.guestChargeAmount.length > 10)) {
      this.guestAmountlength = 'VALIDATION_MSG.NUMBER_IS_TO_LARGE';
    } else if (this.guestChargeAmount !== undefined && this.guestChargeAmount !== '' &&
      this.guestChargeAmount !== 'undefined' && parseFloat(this.guestChargeAmount) > parseFloat(this.multiplePriceLevelRows[0].price)) {
      this.guestAmountlength = 'VALIDATION_MSG.INVALID_GUEST_CHARGE_AMOUNT';
    } else {
      this.setupServicesObj = {
        'active': this.active ? config.environment.booleanTrue : config.environment.booleanFalse,
        'serviceName': this.serviceName,
        'serviceGroup': this.addServiceGroupName,
        'taxable': this.taxable ? config.environment.booleanTrue : config.environment.booleanFalse,
        'priceLevels': this.multiplePriceLevelRows,
        'isUseMultiplePriceLevels': this.isUseMultiplePriceLevels,
        'guestChargeAmount': parseFloat(this.guestChargeAmount).toFixed(2),
        'onlineName': this.onlineName === '' ? null : this.onlineName,
        'description': this.description,
        'depositRequired': this.depositRequired ? config.environment.booleanTrue : config.environment.booleanFalse,
        'depositAmount': this.depositAmount,
        'depositPercent': this.depositPercent,
        'is_Class': this.isClass,
        'resourcesFilter': this.resourcesFilter,
        'resources': this.resourcesUsedRows,
      };
      this.setupServiceDetailsService.setupServiceDetails(this.setupServicesObj)
        .subscribe(
          data => {
            this.serviceDetailsList = [];
            this.servicesData = data['result'];
            this.setupServiceDetailsService.showInactiveServiceListByGroupName(this.showInactive ? 0 : 1, this.addServiceGroupName)
              .subscribe(data1 => {
                this.serviceDetailsList = data1['result'];
              },
                error1 => {
                  const errStatus = JSON.parse(error1['_body'])['status'];
                  if (errStatus === '2085' || errStatus === '2071') {
                    if (this.router.url !== '/') {
                      localStorage.setItem('page', this.router.url);
                      this.router.navigate(['/']).then(() => { });
                    }
                  }
                });
            this.selectedServiceGroup = this.addServiceGroupName;
            this.clear(value);
            this.clearErrorMsg();
            this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_CREATE_SUCCESS');
            this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
            window.scrollTo(0, 0);
          },
          error => {
            const status = JSON.parse(error['status']);
            const statuscode = JSON.parse(error['_body']).status;
            switch (JSON.parse(error['_body']).status) {
              case '2033':
                this.nameUniqueErrMsg = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                window.scrollTo(0, 0);
                break;
              case '2034':
                this.onlineNameUniqueErrMsg = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
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
  /**
   * This function is to populate the data when click on edit
   * @param editList is a service data object
   */
  editServiceDetails(editList) {
    this.isEditing = true;
    this.isAdding = false;
    this.listingEnableDisable = true;
    this.addEnableDisable = false;
    this.isUseMultiplePriceLevels = false;
    this.serviceId = editList.Id;
    this.setupServiceDetailsService.fetchServiceDetails(this.serviceId)
      .subscribe(data1 => {
        this.editServiceDetailsList = data1['result'][0];
        this.editServiceResourcesList = data1['result'][1];
        if (data1['result'][2] && data1['result'][2].length > 0) {
          this.isInActiveService = false;
        } else {
          this.isInActiveService = true;
        }
        if ((data1['result'][2] && data1['result'][2].length > 0) || (data1['result'][3] && data1['result'][3].length > 0)
          || (data1['result'][4] && data1['result'][4].length > 0)) {
          this.isToDelete = true;
        }
        this.active = this.editServiceDetailsList[0].Active__c;
        this.serviceName = this.editServiceDetailsList[0].Name;
        this.addServiceGroupName = this.editServiceDetailsList[0].Service_Group__c;
        this.taxable = this.editServiceDetailsList[0].Taxable__c;
        this.multiplePriceLevelRows = JSON.parse(this.editServiceDetailsList[0].Levels__c);
        if (this.multiplePriceLevelRows.length > 1) {
          this.isUseMultiplePriceLevels = true;
          this.hideUseMultiplePriceLevels = true;
        }
        this.guestChargeAmount = this.editServiceDetailsList[0].Guest_Charge__c.toFixed(2);
        this.onlineName = (this.editServiceDetailsList[0].Client_Facing_Name__c) === 'null'
          ? '' : this.editServiceDetailsList[0].Client_Facing_Name__c;
        this.description = this.editServiceDetailsList[0].Description__c;
        this.depositRequired = this.editServiceDetailsList[0].Deposit_Required__c;
        this.depositAmount = Number(this.editServiceDetailsList[0].Deposit_Amount__c) === 0 ?
          '' : parseFloat(this.editServiceDetailsList[0].Deposit_Amount__c);
        this.depositPercent = Number(this.editServiceDetailsList[0].Deposit_Percent__c) === 0 ?
          '' : this.editServiceDetailsList[0].Deposit_Percent__c;
        this.resourcesFilter = this.editServiceDetailsList[0].Resource_Filter__c;
        if (this.resourcesFilter === 'All') {
          this.resourceUsedShowHide = true;
          this.priorityShowHide = false;
          for (let i = 0; i < this.editServiceResourcesList.length; i++) {
            this.resourcesUsedRows[i] = {
              name: this.editServiceResourcesList[i].resourceId
            };
          }
        } else if (this.resourcesFilter === 'Any') {
          this.resourceUsedShowHide = true;
          this.priorityShowHide = true;
          for (let i = 0; i < this.editServiceResourcesList.length; i++) {
            this.resourcesUsedRows[i] = {
              name: this.editServiceResourcesList[i].resourceId,
              priority: this.editServiceResourcesList[i].Priority__c
            };
          }
        } else {
          this.resourceUsedShowHide = false;
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
  /**
   * This function is to update setup services data
   * @param value is true/false to handle save and save&new
   */
  updateServiceDetails(value) {
    /** Validations */
    const priceLevelsLength = this.multiplePriceLevelRows.length;
    const resourcesLength = this.resourcesUsedRows.length;
    let mulPriceLevReq = false;
    let resourceRequired = false;
    let resourceDuplicate = false;
    let priorityRequired = false;
    let priorityDuplicate = false;
    let isTotalDurationValid = false;
    let durationLevel;
    let durationLevelReq;
    // let priceLevel;
    const priceNotValid = false;
    const currencyPattern = /^[0-9]+(\.[0-9]{1,2})?$/;
    if (!this.guestChargeAmount) {
      this.guestChargeAmount = '';
    }
    /** Multiple Price Level Duration 1 required validation */
    for (let i = 0; i < priceLevelsLength; i++) {
      // if (!currencyPattern.test(this.multiplePriceLevelRows[i].price)) {
      //   priceLevel = i + 1;
      //   priceNotValid = true;
      //   break;
      // }
      if (this.multiplePriceLevelRows[i].duration1 <= 0) {
        durationLevelReq = i + 1;
        mulPriceLevReq = true;
        break;
      } else {
        this.multiplePriceLevelRows[i].totalDuration = Number(this.multiplePriceLevelRows[i].duration1)
          + Number(this.multiplePriceLevelRows[i].duration2 === null ? 0 : this.multiplePriceLevelRows[i].duration2)
          + Number(this.multiplePriceLevelRows[i].duration3 === null ? 0 : this.multiplePriceLevelRows[i].duration3)
          + Number(this.multiplePriceLevelRows[i].bufferAfter === null ? 0 : this.multiplePriceLevelRows[i].bufferAfter);
        if (Number(this.multiplePriceLevelRows[i].totalDuration) % Number(this.bookingIntervalMinutes) !== 0) {
          durationLevel = i + 1;
          isTotalDurationValid = true;
          break;
        }
      }
    }
    for (let j = 0; j < resourcesLength; j++) {
      if (this.resourcesUsedRows[j].name === '') {
        resourceRequired = true;
      }
      if (Number((this.resourcesUsedRows[j].name).split('~')[1]) === 0) {
        resourceRequired = true;
        break;
      } else {
        for (let k = j + 1; k < resourcesLength; k++) {
          if ((this.resourcesUsedRows[k].name).split('~')[0] === (this.resourcesUsedRows[j].name).split('~')[0]) {
            resourceDuplicate = true;
            break;
          }
        }
      }
    }

    if (this.resourcesFilter) {
      if (this.resourcesFilter.toLowerCase() === 'any') {
        for (let j = 0; j < resourcesLength; j++) {
          if (this.resourcesUsedRows[j].priority === config.environment.valueNone) {
            priorityRequired = true;
            break;
          } else {
            for (let k = j + 1; k < resourcesLength; k++) {
              if (Number(this.resourcesUsedRows[k].priority) === Number(this.resourcesUsedRows[j].priority)) {
                priorityDuplicate = true;
                break;
              }
            }
          }
        }
      }
    }


    this.errMsg1 = this.translateService.get('VALIDATION_MSG.LEVEL');
    if (this.isInActiveService === false && this.active === false) {
      this.inActiveDependencyErrMsg = 'Cannot InActivate this Service Due to Dependency';
      window.scrollTo(0, 0);
    } else if (this.serviceName === undefined || this.serviceName === '' || this.serviceName === 'undefined') {
      this.nameRequiredErrMsg = 'VALIDATION_MSG.NAME_REQUIRED';
      window.scrollTo(0, 0);
    } else if (this.selectedServiceGroup === undefined || this.selectedServiceGroup === '' || this.selectedServiceGroup === 'undefined') {
      this.serviceGroupRequiredErrMsg = 'VALIDATION_MSG.SERVICE_GROUP_REQUIRED';
      window.scrollTo(0, 0);
    } else if (priceNotValid) {
      // this.errMsg4 = this.translateService.get('VALIDATION_MSG.LEVEL');
      this.errMsg5 = this.translateService.get('VALIDATION_MSG.PRICE_VALIDATION');
      this.priceNotValidErrMsg = this.errMsg1.value + ' ' + this.errMsg5.value;
      window.scrollTo(0, 0);
    } else if (mulPriceLevReq) {
      // this.errMsg4 = this.translateService.get('VALIDATION_MSG.LEVEL');
      this.errMsg6 = this.translateService.get('VALIDATION_MSG.DURATION1_REQUIRED');
      this.durationRequiredErrMsg = this.errMsg1.value + ' ' + durationLevelReq + ', ' + this.errMsg6.value;
      window.scrollTo(0, 0);
    } else if (isTotalDurationValid) {
      this.errMsg2 = this.translateService.get('VALIDATION_MSG.DURATION_VALIDATION2');
      this.errMsg3 = this.translateService.get('VALIDATION_MSG.DURATION_VALIDATION3');
      this.totalDurationValidErrMsg = this.errMsg1.value + ' ' + durationLevel + ' ' + this.errMsg2.value
        + ' ' + this.bookingIntervalMinutes + ' ' + this.errMsg3.value;
      window.scrollTo(0, 500);
    } else if (this.depositRequired &&
      ((this.depositAmount === undefined || this.depositAmount === '' || this.depositAmount === 'undefined') &&
        (this.depositPercent === undefined || this.depositPercent === '' || this.depositPercent === 'undefined'))) {
      this.depositRequiredErrMsg = 'VALIDATION_MSG.DEPOSITAMOUNT_DEPOSITPERCENT_REQUIRED';
    } else if (this.depositRequired &&
      !((this.depositAmount === undefined || this.depositAmount === '' || this.depositAmount === 'undefined') ||
        (this.depositPercent === undefined || this.depositPercent === '' || this.depositPercent === 'undefined'))) {
      this.depositNotValidErrMsg = 'VALIDATION_MSG.DEPOSITAMOUNT_DEPOSITPERCENT_NOTVALID';
    } else if (this.depositAmount !== undefined &&
      this.depositAmount !== '' && this.depositAmount !== 'undefined' && !currencyPattern.test(this.depositAmount)) {
      this.depositAmountNotValidErrMsg = 'VALIDATION_MSG.DEPOSIT_AMOUNT_FORMAT_VALIDATION';
    } else if (this.depositAmount !== undefined && this.depositAmount !== '' &&
      this.depositAmount !== 'undefined' && parseFloat(this.depositAmount) > parseFloat(this.multiplePriceLevelRows[0].price)) {
      this.depositAmountErrMsg = 'VALIDATION_MSG.DEPOSIT_AMOUNT_VALIDATION';
    } else if (this.depositPercent !== undefined && this.depositPercent !== ''
      && this.depositPercent !== 'undefined' && Number(this.depositPercent) < 1 || Number(this.depositPercent) > 100) {
      this.depositPercentErrMsg = 'VALIDATION_MSG.DEPOSIT_PERCENT_VALIDATION';
    } else if (resourceRequired) {
      this.resourceRequiredErrMsg = 'VALIDATION_MSG.RESOURCE_REQUIRED';
    } else if (resourceDuplicate) {
      this.resourceDuplicateErrMsg = 'VALIDATION_MSG.RESOURCE_DUPLICATE';
    } else if (priorityRequired) {
      this.priorityRequiredErrMsg = 'VALIDATION_MSG.PRIORITY_REQUIRED';
    } else if (priorityDuplicate) {
      this.priorityDuplicateErrMsg = 'VALIDATION_MSG.PRIORITY_DUPLICATE';
    } else if ((this.guestChargeAmount !== '' && this.guestChargeAmount !== undefined) && (this.guestChargeAmount.split('.')[0].length > 10 && this.guestChargeAmount.length > 10)) {
      this.guestAmountlength = 'VALIDATION_MSG.NUMBER_IS_TO_LARGE';
    } else if (this.guestChargeAmount !== undefined && this.guestChargeAmount !== '' &&
      this.guestChargeAmount !== 'undefined' && parseFloat(this.guestChargeAmount) > parseFloat(this.multiplePriceLevelRows[0].price)) {
      this.guestAmountlength = 'VALIDATION_MSG.INVALID_GUEST_CHARGE_AMOUNT';
    } else {
      this.servicesUpdateObj = {
        'active': this.active ? config.environment.booleanTrue : config.environment.booleanFalse,
        'serviceName': this.serviceName,
        'serviceGroup': this.addServiceGroupName,
        'taxable': this.taxable ? config.environment.booleanTrue : config.environment.booleanFalse,
        'priceLevels': this.multiplePriceLevelRows,
        'isUseMultiplePriceLevels': this.isUseMultiplePriceLevels,
        'guestChargeAmount': parseFloat(this.guestChargeAmount).toFixed(2),
        'onlineName': this.onlineName === '' ? null : this.onlineName,
        'description': this.description,
        'depositRequired': this.depositRequired ? config.environment.booleanTrue : config.environment.booleanFalse,
        'depositAmount': this.depositAmount,
        'depositPercent': this.depositPercent,
        'is_Class': this.isClass,
        'resourcesFilter': this.resourcesFilter,
        'resources': this.resourcesUsedRows,
        'OwnerId': this.editServiceDetailsList[0].OwnerId,
        'CreatedById': this.editServiceDetailsList[0].CreatedById
      };
      this.setupServiceDetailsService.updateServiceDetails(this.serviceId, this.servicesUpdateObj)
        .subscribe(
          data => {
            this.serviceDetailsList = [];
            this.servicesData = data['result'];
            this.setupServiceDetailsService
              .showInactiveServiceListByGroupName(this.showInactive ? 0 : 1, this.addServiceGroupName)
              .subscribe(data1 => {
                this.serviceDetailsList = data1['result'];
              },
                error1 => {
                  const errStatus = JSON.parse(error1['_body'])['status'];
                  if (errStatus === '2085' || errStatus === '2071') {
                    if (this.router.url !== '/') {
                      localStorage.setItem('page', this.router.url);
                      this.router.navigate(['/']).then(() => { });
                    }
                  }
                });
            this.selectedServiceGroup = this.addServiceGroupName;
            this.clear(value);
            this.clearErrorMsg();
            this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_UPDATE_SUCCESS');
            this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
            window.scrollTo(0, 0);
          },
          error => {
            const status = JSON.parse(error['status']);
            const statuscode = JSON.parse(error['_body']).status;
            switch (JSON.parse(error['_body']).status) {
              case '2033':
                this.nameUniqueErrMsg = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                window.scrollTo(0, 0);
                break;
              case '2034':
                this.onlineNameUniqueErrMsg = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
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
  /**
   * This function is to delete service detail record
   * @param value boolean value to handle add show hide divs
   */
  deleteServiceDetail(value) {
    this.setupServiceDetailsService
      .deleteServiceDetail(this.serviceId, this.serviceName)
      .subscribe(data => {
        // this.serviceDetailsList = data['result'];
        this.serviceDetailsList = [];
        this.servicesData = data['result'];
        this.isToDelete = false;
        this.setupServiceDetailsService
          .showInactiveServiceListByGroupName(this.showInactive ? 0 : 1, this.addServiceGroupName)
          .subscribe(data1 => {
            this.serviceDetailsList = data1['result'];
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
        this.selectedServiceGroup = this.addServiceGroupName;
        this.clear(value);
        this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_DELETE_SUCCESS');
        this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
        window.scrollTo(0, 0);
      },
        error => {
          const status = JSON.parse(error['status']);
          const statuscode = JSON.parse(error['_body']).status;
          switch (JSON.parse(error['_body']).status) {
            case '2039':
              this.nameUniqueErrMsg = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
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
  /**
   * this function is to get active/inactive services list based on service group name
   * @param value is check box checked/unchecked boolen value
   */
  showInactiveList(value) {
    this.showInactive = value;
    this.getServiceGroupsList();
    this.setupServiceDetailsService
      .showInactiveServiceListByGroupName(this.showInactive ?
        config.environment.booleanFalse : config.environment.booleanTrue, this.selectedServiceGroup)
      .subscribe(data => {
        this.serviceDetailsList = data['result'];
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
   * Method to get services list on changing group serviceName
   * @param value is service group name on change seleced value
   */
  serviceGroupListOnChange(value) {
    this.selectedServiceGroup = value.split(': ')[1];
    this.setupServiceDetailsService
      .showInactiveServiceListByGroupName(this.showInactive ?
        config.environment.booleanFalse : config.environment.booleanTrue, this.selectedServiceGroup)
      .subscribe(data => { this.serviceDetailsList = data['result']; },
        error => {
          const errStatus = JSON.parse(error['_body'])['status'];
          if (errStatus === '2085' || errStatus === '2071') {
            if (this.router.url !== '/') {
              localStorage.setItem('page', this.router.url);
              this.router.navigate(['/']).then(() => { });
            }
          }
        });
    this.addServiceGroupName = value.split(': ')[1];
  }
  serviceGroupName(value) {
    this.addServiceGroupName = value.split(': ')[1];
  }
  /**
   * Method to get list of setup service groups
   */
  getServiceGroupsList() {
    this.setupServiceDetailsService.getSetupServiceGroupsList()
      .subscribe(serviceGroupResult => {
        this.serviceGroupsList = [];
        const tempActive = config.environment.booleanTrue; // default Active records
        if (this.showInactive) {
          this.serviceGroupsList = serviceGroupResult['result']
            .filter(filterList => !filterList.isSystem);
        } else {
          this.serviceGroupsList = serviceGroupResult['result']
            .filter(filterList => filterList.active && !filterList.isSystem);
        }
        this.selectedServiceGroup = this.serviceGroupsList[0].serviceGroupName;
        this.addServiceGroupName = this.serviceGroupsList[0].serviceGroupName;
        this.setupServiceDetailsService.showInactiveServiceListByGroupName(tempActive, this.selectedServiceGroup)
          .subscribe(data => {
            this.serviceDetailsList = data['result'];
          },
            error1 => {
              const errStatus = JSON.parse(error1['_body'])['status'];
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
  }
  /**
   * This function is to add multiple price level table rows
   * if, Use Multiple Price Levels check box is checked
   */
  populateMultiplePriceLevels() {
    if (!this.isUseMultiplePriceLevels) {
      this.hideUseMultiplePriceLevels = true;
      this.multiplePriceLevelRows.push({
        totalDuration: 0, price: '0.00',
        levelNumber: this.multiplePriceLevelRows.length + 1,
        duration3AvailableForOtherWork: false, duration3: null,
        duration2AvailableForOtherWork: false, duration2: null,
        duration1AvailableForOtherWork: false, duration1: 0, bufferAfter: null
      });
    } else {
      this.hideUseMultiplePriceLevels = false;
      this.multiplePriceLevelRows = [this.multiplePriceLevelRows[0]];
      // this.multiplePriceLevelRows.splice(-1, this.multiplePriceLevelRows.length-1);
      // this.multiplePriceLevelRows = [];
      // this.multiplePriceLevelRows.push({
      //   totalDuration: 0, price: '0.00',
      //   levelNumber: this.multiplePriceLevelRows.length + 1,
      //   duration3AvailableForOtherWork: false, duration3: null,
      //   duration2AvailableForOtherWork: false, duration2: null,
      //   duration1AvailableForOtherWork: false, duration1: 0, bufferAfter: null
      // });
    }
  }
  /**
   * This function is to add multiple price level table rows
   * if, user clicks on (+) button and max rows add limit is 10
   */
  populateMoreMultiplePriceLevels() {
    if (this.multiplePriceLevelRows.length < 10) {
      this.multiplePriceLevelRows.push({
        totalDuration: 0, price: '0.00',
        levelNumber: this.multiplePriceLevelRows.length + 1,
        duration3AvailableForOtherWork: false, duration3: null,
        duration2AvailableForOtherWork: false, duration2: null,
        duration1AvailableForOtherWork: false, duration1: 0, bufferAfter: null
      });
    }
  }
  /**
   * This function is to delete, multiple price level table rows
   * when user clicks on (-) button
   * @param index is multiplePriceLevelRows array index value
   */
  deleteMultiplePriceLevels(index) {
    this.multiplePriceLevelRows.splice(index, 1);
    for (let i = 0; i < this.multiplePriceLevelRows.length; i++) {
      this.multiplePriceLevelRows[i].levelNumber = i + 1;
    }
    if (this.multiplePriceLevelRows.length === 0) {
      this.isUseMultiplePriceLevels = false;
      this.hideUseMultiplePriceLevels = false;
    }
  }
  /**
   * This function gets Resource used type list from static JSON
   */
  getResourceTypeStaticJSONData() {
    this.setupServiceDetailsService.resourceUsedFilterList().subscribe(
      data => {
        this.resourcesTypeList = data['resourceUsedType'];
        this.resourcesFilter = this.resourcesTypeList[0].type;
        this.numberOptionsList[0] = config.environment.valueNone;
        const maxPriority = config.environment.maxPriority;
        for (let counter = 1; counter < maxPriority; counter++) {
          this.numberOptionsList[counter] = counter;
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
  /**
   * This function fetches Active and Inactive resources list from Resources table
   */
  getSetupResources() {
    this.setupServiceDetailsService.getResourcesNameList(config.environment.booleanFalse)
      .subscribe(data => {
        const length = data['result'].length;
        this.resourceList[0] = config.environment.selectResource + '~' + 0;
        for (let i = 1; i < length; i++) {
          this.resourceList[i] = data['result'][i].Name + '~' + data['result'][i].Id;
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
  /**
   * This function is to add multiple resources usedrows
   */
  addResourcesUsedRow() {
    if (this.filter === 'All') {
      this.resourcesUsedRows.push({ name: config.environment.selectResource + '~' + 0 });
    } else {
      this.resourcesUsedRows.push({ name: config.environment.selectResource + '~' + 0, priority: config.environment.valueNone });
    }
  }
  /**
   * This function delets Resources Used Rows by clicking (-) button
   * @param arrayIndex is reasourcesUsedRows array index value
   */
  deleteResourcesUsedRow(arrayIndex) {
    this.resourcesUsedRows.splice(arrayIndex, 1);
  }
  /**
   * Method to cancel Add / Edit
   */
  cancel() {
    this.isEditing = false;
    this.isAdding = true;
    this.listingEnableDisable = false;
    this.addEnableDisable = true;
    this.isUseMultiplePriceLevels = false;
    this.hideUseMultiplePriceLevels = false;
    this.multiplePriceLevelRows = [];
    this.resourcesUsedRows = [];
    this.resourceUsedShowHide = false;
    this.serviceName = '';
    this.taxable = config.environment.booleanFalse;
    this.isUseMultiplePriceLevels = false;
    this.guestChargeAmount = '';
    this.onlineName = '';
    this.depositRequired = '';
    this.depositAmount = '';
    this.depositPercent = '';
    this.description = '';
    this.resourcesFilter = config.environment.valueNone;
    this.isToDelete = false;
  }
  /**
   * Method to clear error messages
   */
  clearErrorMsg() {
    this.nameRequiredErrMsg = '';
    this.durationRequiredErrMsg = '';
    this.nameUniqueErrMsg = '';
    this.depositRequiredErrMsg = '';
    this.depositNotValidErrMsg = '';
    this.resourceRequiredErrMsg = '';
    this.resourceDuplicateErrMsg = '';
    this.priorityDuplicateErrMsg = '';
    this.priorityRequiredErrMsg = '';
    this.totalDurationValidErrMsg = '';
    this.depositAmountErrMsg = '';
    this.onlineNameUniqueErrMsg = '';
    this.serviceGroupRequiredErrMsg = '';
    this.priceNotValidErrMsg = '';
    this.depositAmountNotValidErrMsg = '';
    this.depositPercentErrMsg = '';
    this.inActiveDependencyErrMsg = '';
    this.guestAmountlength = '';
  }
  /**
   * Method to clear all fields
   * @param value is boolean true/false
   */
  clear(value) {
    this.isAdding = true;
    this.isEditing = false;
    this.isUseMultiplePriceLevels = false;
    this.hideUseMultiplePriceLevels = false;
    this.resourceUsedShowHide = false;
    this.serviceName = '';
    this.taxable = config.environment.booleanFalse;
    this.isUseMultiplePriceLevels = false;
    this.guestChargeAmount = '';
    this.onlineName = '';
    this.depositRequired = '';
    this.depositAmount = '';
    this.depositPercent = '';
    this.description = '';
    this.multiplePriceLevelRows = [];
    this.resourcesUsedRows = [];
    this.resourcesFilter = config.environment.valueNone;
    if (value) {
      this.listingEnableDisable = false;
      this.addEnableDisable = true;
    } else {
      this.listingEnableDisable = true;
      this.addEnableDisable = false;
      this.populateMoreMultiplePriceLevels();
    }
  }
  /**
   * Method to handle resource used dropdown
   * @param value is Resource Filter
   */
  resourceType(value) {
    this.filter = value.split(': ')[1];
    this.resourcesUsedRows = [];
    if (this.filter === 'Any') {
      this.resourceUsedShowHide = true;
      this.priorityShowHide = true;
      this.resourcesUsedRows.push({ name: '', priority: config.environment.valueNone });
    } else if (this.filter === 'All') {
      this.resourceUsedShowHide = true;
      this.priorityShowHide = false;
      this.resourcesUsedRows.push({ name: '' });
    } else {
      this.resourceUsedShowHide = false;
    }
  }
  /* run(field) {
    setTimeout(function() {
        const regex = /\d*\.?\d?/g;
        field.value = regex.exec(field.value);
    }, 0);
} */

  /*   amountFormatValidation(value) {
      let count = 0;
      for (let i = 0, l = value.length; i < value.length; i += 1) {
        if (value[0] !== '.') {
          if (value[i] === '.') {
            count += 1;
          }
          this.isAmountFormatValid = count > 1 ? false : true;
        }
      }
      return this.isAmountFormatValid;
    } */
  getResouDropdown() {
    this.setupServiceDetailsService.getResourceDropdown('RESOURCE_USE')
      .subscribe(data => {
        data['result'] = data['result'].filter(filterList => filterList.Active__c === 1);
        this.getResourcesDropdown = data['result'];
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
