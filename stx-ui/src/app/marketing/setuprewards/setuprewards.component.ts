import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { SetupRewardsService } from './setuprewards.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { FormBuilder, FormControl, FormGroup, FormArray } from '@angular/forms';
import { CommonService } from '../../common/common.service';
@Component({
  selector: 'app-setuprewards-app',
  templateUrl: './setuprewards.html',
  styleUrls: ['./setuprewards.css'],
  providers: [SetupRewardsService, CommonService],
})
export class SetupRewardsComponent implements OnInit {
  datePickerConfig: any;
  constructor(private route: ActivatedRoute,
    private router: Router, private builder: FormBuilder,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private setupPromotionsService: SetupRewardsService,
    private commonService: CommonService) {
    this.datePickerConfig = Object.assign({},
      {
        showWeekNumbers: false,
        containerClass: 'theme-blue',
      });

  }
  rewardForm: FormGroup = this.builder.group({
    active_c: new FormControl(''),
    name: new FormControl(''),
    award_rules__c: new FormControl(''),
    createdbyid: new FormControl(''),
    createddate: new FormControl(''),
    id: new FormControl(''),
    isDeleted: new FormControl(''),
    lastmodifiedById: new FormControl(''),
    lastModifiedDate: new FormControl(''),
    ownerId: new FormControl(''),
    redeem_rules__c: new FormControl(''),
    systemmodstamp: new FormControl(''),
    awardpoint: new FormControl('')
  });
  rewardDataList: any;
  bsValue = new Date();
  addDiv = false;
  awardArrayData = [];
  rewardData = [];
  AwardRulesLineerror = [];
  AwardRulesitemerror = [];
  datebeginitemerror = [];
  redeemArrayData = [];
  itemerror = [];
  isDuplicate: any;
  reedemnameerror = '';
  idx = 0;
  dateBeginError = [];
  redeemNameError = [];
  saverewardname = '';
  editView: any = false;
  disableEnable: any = false;
  rewardnameerror: any;
  awardpointerror = [];
  toastermessage: any;
  disableView = true;
  tableDis = true;
  forevery = [{ value: 'Amount Spent On', name: 'Amount Spent On' }, { value: 'Individual', name: 'Individual' }, { value: 'Completed Ticket', name: 'Completed Ticket' },
  { value: 'Referred Client', name: 'Referred Client' }];
  awardrulesitem = [{ value: 'Services', name: 'Services' }, { value: 'Products', name: 'Products' }, { value: 'Gifts', name: 'Gifts' }];
  discountList = [{ value: 'Amount', name: 'Amount' }, { value: 'Percent', name: 'Percent' }];
  OnOneItemList = [{ value: 'Services', name: 'Service' }, { value: 'Products', name: 'Product' }];
  ngOnInit() {
    this.getRewardData();
  }

  getRewardData() {
    this.setupPromotionsService.rewardData().subscribe(
      data => {
        this.rewardDataList = data['result'];
        this.rewardDataList.forEach((element, index) => {
          element.Award_Rules__c = JSON.parse(this.rewardDataList[index].Award_Rules__c);
        });
        this.rewardDataList.forEach((element, index) => {
          element.Redeem_Rules__c = JSON.parse(this.rewardDataList[index].Redeem_Rules__c);
        });
        for (let i = 0; i < this.rewardDataList.length; i++) {
          for (let j = 0; j < this.rewardDataList[i].Award_Rules__c.length; j++) {
            this.rewardDataList[i].Award_Rules__c[j].startDate = this.commonService.getDateFrmDBDateStr(this.rewardDataList[i].Award_Rules__c[j].startDate);
            this.rewardDataList[i].Award_Rules__c[j].endDate = this.commonService.getDateFrmDBDateStr(this.rewardDataList[i].Award_Rules__c[j].endDate);
          }
          for (let j = 0; j < this.rewardDataList[i].Redeem_Rules__c.length; j++) {
            this.rewardDataList[i].Redeem_Rules__c[j].startDate = this.commonService.getDateFrmDBDateStr(this.rewardDataList[i].Redeem_Rules__c[j].startDate);
            this.rewardDataList[i].Redeem_Rules__c[j].endDate = this.commonService.getDateFrmDBDateStr(this.rewardDataList[i].Redeem_Rules__c[j].endDate);
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

  addNew() {
    this.editView = true;
    this.disableView = false;
    this.rewardForm.reset();
    this.addDiv = true;
    this.disableEnable = true;
    this.awardArrayData.push({
      'awardPoints': '', 'item': '', 'startDate': '', 'endDate': '', 'forEvery': 'Amount Spent On', 'awardConditionLines': '', 'conditionFilter': '', 'conditionType': '', 'lineNumber': ''
    });
    this.redeemArrayData.push({
      'conditionFilter': '', 'discount': '', 'startDate': '', 'endDate': '', 'discountType': 'Amount', 'onOneItem': 'Services', 'conditionType': '',
      'lineNumber': '', 'redeemConditionLines': '', 'redeemName': '', 'redeemPoints': ''
    });
    this.rewardForm.patchValue({
      active_c: 1
    });
  }

  cancel() {
    this.editView = false;
    this.disableView = true;
    this.rewardForm.reset();
    this.disableEnable = false;
    this.awardArrayData = [];
    this.redeemArrayData = [];
    this.addDiv = false;
    this.rewardnameerror = '';
    this.awardpointerror = [];
    this.AwardRulesLineerror = [];
    this.datebeginitemerror = [];
    this.itemerror = [];
    this.redeemNameError = [];
    this.dateBeginError = [];
    this.reedemnameerror = '';
  }

  clearErrMsg() {
    this.rewardnameerror = '';
    this.reedemnameerror = '';
  }

  rewardfullview(data) {
    this.getRewardData();
    this.disableEnable = true;
    this.addDiv = false;
    this.saverewardname = data.Name;
    data.Award_Rules__c.forEach(element => {
      this.awardArrayData.push(element);
    });
    data.Redeem_Rules__c.forEach(element => {
      this.redeemArrayData.push(element);
    });
    for (let i = 0; i < this.awardArrayData.length; i++) {
      if (isNaN(this.awardArrayData[i].startDate) === true) {
        this.awardArrayData[i].startDate = '';
      }
      if (isNaN(this.awardArrayData[i].endDate) === true) {
        this.awardArrayData[i].endDate = '';
      }
    }
    for (let i = 0; i < this.redeemArrayData.length; i++) {
      if (isNaN(this.redeemArrayData[i].startDate) === true) {
        this.redeemArrayData[i].startDate = '';
      }
      if (isNaN(this.redeemArrayData[i].endDate) === true) {
        this.redeemArrayData[i].endDate = '';
      }
    }
    this.rewardForm.patchValue({
      active_c: data.Active__c,
      award_rules__c: this.awardArrayData,
      createdbyid: data.CreatedById,
      createddate: data.CreatedDate,
      id: data.Id,
      isDeleted: data.IsDeleted,
      lastModifiedDate: data.LastModifiedDate,
      lastmodifiedById: data.LastModifiedById,
      name: data.Name,
      ownerId: data.OwnerId,
      redeem_rules__c: this.redeemArrayData,
      systemmodstamp: data.SystemModstamp
    });
    this.disableView = false;
    this.editView = true;
  }

  removeDuplicatesError(originalArray, prop) {
    const newArray = [];
    const lookupObject = {};
    for (let i = 0; i < originalArray.length; i++) {
      lookupObject[originalArray[i][prop]] = originalArray[i];
    }
    for (const field of Object.keys(lookupObject)) {
      newArray.push(lookupObject[field]);
    }
    return newArray;
  }

  insertDuplicateData(name) {
    let res = false;
    this.rewardDataList.forEach(element => {
      if (element.Name.trim() === name.trim()) {
        res = true;
      }
    });
    return res;
  }
  checkIfNameExists(values) {
    let rownum;
    const valueArr = values.map(function (item) {
      return item.col;
    });
    this.isDuplicate = valueArr.some(function (item, idx) {
      rownum = idx;
      return valueArr.indexOf(item) !== idx;
    });
    this.idx = rownum;
  }
  rewardformsave() {
    this.AwardRulesLineerror = [];
    this.AwardRulesitemerror = [];
    this.datebeginitemerror = [];
    this.itemerror = [];
    this.dateBeginError = [];
    this.redeemNameError = [];
    this.awardpointerror = [];
    let awardpointBollean = false;

    for (let i = 0; i < this.awardArrayData.length; i++) {
      if (![this.awardArrayData[i].awardPoints].every(Boolean) || !this.awardArrayData[i].awardPoints === null) {
        this.awardArrayData[i].awardPoints = 0;
        awardpointBollean = true;
        this.AwardRulesLineerror.push({ error: 'Award Rules-Line ' + (i + 1) + ': Award Points: Only a positive, whole number may be entered', errorBoll: awardpointBollean });
        this.awardpointerror = this.removeDuplicatesError(this.AwardRulesLineerror, 'error');
      } else if (![this.awardArrayData[i].item].every(Boolean) || this.awardArrayData[i].item === null) {
        this.AwardRulesitemerror.push({ error: 'Award Rules-Line ' + (i + 1) + ': Item is required' });
        this.itemerror = this.removeDuplicatesError(this.AwardRulesitemerror, 'error');
        awardpointBollean = true;
      } else {
        if ((this.awardArrayData[i].startDate !== '' && this.awardArrayData[i].startDate !== null && this.awardArrayData[i].endDate !== ''
          && this.awardArrayData[i].endDate !== null) && (this.awardArrayData[i].startDate > this.awardArrayData[i].endDate)) {
          this.datebeginitemerror.push({ error: 'Award Rules-Line ' + (i + 1) + ': The Begin Date is after the End Date' });
          this.dateBeginError = this.removeDuplicatesError(this.datebeginitemerror, 'error');
          awardpointBollean = true;
        }
        if (this.awardArrayData[i].startDate === '' || this.awardArrayData[i].startDate === null) {
          this.awardArrayData[i].startDate = '';
        }
        if (this.awardArrayData[i].endDate === '' || this.awardArrayData[i].endDate === null) {
          this.awardArrayData[i].endDate = '';
        }
      }
    }

    if (awardpointBollean === false) {
      for (let i = 0; i < this.redeemArrayData.length; i++) {
        if (![this.redeemArrayData[i].redeemName].every(Boolean) || this.redeemArrayData[i].redeemName === null) {
          this.AwardRulesitemerror.push({ error: 'Redeem Rules-Line ' + (i + 1) + ': Name is required' });
          this.redeemNameError = this.removeDuplicatesError(this.AwardRulesitemerror, 'error');
          awardpointBollean = true;
        } else {
          if (![this.redeemArrayData[i].redeemPoints].every(Boolean) || this.redeemArrayData[i].redeemPoints === null) {
            this.redeemArrayData[i].redeemPoints = 0;
            this.AwardRulesitemerror.push({ error: 'Redeem Rules-Line ' + (i + 1) + ': Redeem Points: Only a positive, whole number may be entered' });
            this.redeemNameError = this.removeDuplicatesError(this.AwardRulesitemerror, 'error');
            awardpointBollean = true;
          } else if (![this.redeemArrayData[i].discount].every(Boolean) || this.redeemArrayData[i].discount === null) {
            this.redeemArrayData[i].discount = 0;
            this.AwardRulesitemerror.push({ error: 'Redeem Rules-Line ' + (i + 1) + ': Discount: Only a positive number is allowed' });
            this.redeemNameError = this.removeDuplicatesError(this.AwardRulesitemerror, 'error');
            awardpointBollean = true;
          } else {
            if ((this.redeemArrayData[i].startDate !== '' && this.redeemArrayData[i].startDate !== null && this.redeemArrayData[i].endDate !== ''
              && this.redeemArrayData[i].endDate !== null) && (this.redeemArrayData[i].startDate > this.redeemArrayData[i].endDate)) {
              this.AwardRulesitemerror.push({ error: 'Redeem Rules-Line ' + (i + 1) + ': The Begin Date is after the End Date' });
              this.redeemNameError = this.removeDuplicatesError(this.AwardRulesitemerror, 'error');
              awardpointBollean = true;
            }
            if (this.redeemArrayData[i].startDate === '' || this.redeemArrayData[i].startDate === null) {
              this.redeemArrayData[i].startDate = '';
            }
            if (this.redeemArrayData[i].endDate === '' || this.redeemArrayData[i].endDate === null) {
              this.redeemArrayData[i].endDate = '';
            }
          }
        }
      }
    }
    this.rewardForm.patchValue({
      award_rules__c: this.awardArrayData,
      redeem_rules__c: this.redeemArrayData,
      active_c: this.rewardForm.value.active_c === null || this.rewardForm.value.active_c === undefined ? 0 : this.rewardForm.value.active_c
    });
    const row = [];
    for (let r = 0; r < this.redeemArrayData.length; r++) {
      row.push({ 'col': this.redeemArrayData[r].redeemName, 'ind': r });
      this.checkIfNameExists(row);
    }
    if (this.rewardForm.value.name === '' || this.rewardForm.value.name === null || this.rewardForm.value.name === undefined) {
      this.rewardnameerror = 'VALIDATION_MSG.NAME_REQUIRED';
      window.scrollTo(0, 0);
    } else if (awardpointBollean) {
      awardpointBollean = true;
    } else if (this.isDuplicate) {
      this.reedemnameerror = 'Redeem Rules-Line ' + (this.idx + 1) + ': Duplicate Name found. All Names must be unique.';
    } else {
      if (this.addDiv === true) {
        if (this.insertDuplicateData(this.rewardForm.value.name.trim())) {
          this.rewardnameerror = 'SETUP_REWARDS.DUPLICATE_REWARD';
          window.scrollTo(0, 0);
        } else {
          this.disableView = true;
          this.editView = false;
          this.rewardDateFormatChange();
          this.setupPromotionsService.postRewardsData(this.rewardForm.value)
            .subscribe(
              data => {
                this.rewardData = data;
                this.disableEnable = false;
                this.rewardForm.reset();
                this.awardArrayData = [];
                this.redeemArrayData = [];
                this.getRewardData();
                this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_REWARS_SUCCESS');
                this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
                window.scrollTo(0, 0);
              },
              error => {
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
      } else if (this.addDiv === false) {
        const rewardname = this.rewardForm.value.name.trim();
        if (this.saverewardname !== rewardname) {
          if (this.insertDuplicateData(this.rewardForm.value.name)) {
            this.rewardnameerror = 'SETUP_REWARDS.DUPLICATE_REWARD';
            window.scrollTo(0, 0);
          } else {
            this.updaterecord();
          }
        } else {
          this.updaterecord();
        }
      }
    }
  }
  rewardDateFormatChange() {
    this.rewardForm.value['award_rules__c'].forEach(element => {
      if (element.startDate) {
        element.startDate = this.commonService.getDBDatStr(element.startDate);
      }
      if (element.endDate) {
        element.endDate = this.commonService.getDBDatStr(element.endDate);
      }
    });
    this.rewardForm.value['redeem_rules__c'].forEach(element => {
      if (element.startDate) {
        element.startDate = this.commonService.getDBDatStr(element.startDate);
      }
      if (element.endDate) {
        element.endDate = this.commonService.getDBDatStr(element.endDate);
      }
    });
  }
  updaterecord() {
    this.disableView = true;
    this.editView = false;
    this.rewardDateFormatChange();
    this.setupPromotionsService.updateRewardsData(this.rewardForm.value)
      .subscribe(
        data => {
          this.rewardData = data;
          this.getRewardData();
          this.disableEnable = false;
          this.rewardForm.reset();
          this.awardArrayData = [];
          this.redeemArrayData = [];
          this.reedemnameerror = '';
          this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_REWARS_SUCCESS');
          this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
          window.scrollTo(0, 0);
        },
        error => {
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
  addInput() {
    this.awardArrayData.push({
      'awardPoints': '', 'item': '', 'startDate': '', 'endDate': '', 'forEvery': 'Amount Spent On', 'awardConditionLines': '', 'conditionFilter': '', 'conditionType': '', 'lineNumber': ''
    });
  }
  addRedeemInput() {
    this.redeemArrayData.push({
      'conditionFilter': '', 'discount': '', 'startDate': '', 'endDate': '', 'discountType': 'Amount', 'onOneItem': 'Services',
      'conditionType': '', 'lineNumber': '', 'redeemConditionLines': '', 'redeemName': '', 'redeemPoints': ''
    });
  }
  deleteFieldValue(i) {
    this.awardArrayData.splice(i, 1);
  }
  deleteRedeemField(i) {
    this.redeemArrayData.splice(i, 1);
  }

}
