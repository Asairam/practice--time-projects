import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SetupPromotionsService } from './setuppromotions.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { CommonService } from '../../common/common.service';
@Component({
  selector: 'app-setuppromotions-app',
  templateUrl: './setuppromotions.html',
  styleUrls: ['./setuppromotions.css'],
  providers: [SetupPromotionsService, CommonService],
})
export class SetupPromotionsComponent implements OnInit {
  disableEnable: any;
  disableDiv = true;
  addDiv = false;
  editDiv = false;
  promotionsList: any;
  showInactiveData: any;
  showupdate: any = true;
  hideupdate: any = false;
  active: any = false;
  promotionData: any;
  promotionName: any;
  serviceDiscount: any = false;
  productDiscount: any = false;
  discountAmount: any;
  discountPercentage: any;
  promotionStartDate: any;
  promotionEndDate: any;
  updateServiceDiscount: any;
  updateProductDiscount: any;
  updateDiscountAmount: any;
  updateDiscountPercentage: any;
  updateSortOrder: any;
  updatePromotionStartDate: any;
  updatePromotionEndDate: any;
  sortOrder: any;
  updatePromotionName: any;
  updatePromotionId: any;
  updatePromotionObj: any;
  promotionDetails: any;
  updatePromotionDetails: any;
  toastermessage: any;
  promotionError: any;
  discountErr: any;
  promotionError1: any;
  promotionError2: any;
  promotionError3: any;
  error: any;
  updateActive: any;
  sort: any;
  showIn = false;
  datePickerConfig: any;
  isDuplicate: any;
  idx = 0;
  promotionError4: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService, private commonService: CommonService,
    private setupPromotionsService: SetupPromotionsService,
    @Inject('defaultActive') public defaultActive: string,
    @Inject('defaultInActive') public defaultInActive: string) {
    this.datePickerConfig = Object.assign({},
      {
        showWeekNumbers: false,
        containerClass: 'theme-blue',
      });

  }
  ngOnInit() {
    this.getPromotions();
  }
  addNew() {
    this.disableEnable = true;
    this.disableDiv = false;
    this.addDiv = true;
    this.editDiv = false;
    this.active = true;

  }
  clearMessages() {
    this.active = '';
    this.promotionName = '';
    this.serviceDiscount = '';
    this.productDiscount = '';
    this.discountAmount = '';
    this.promotionStartDate = '';
    this.promotionEndDate = '';
    this.discountPercentage = '';
    this.sortOrder = '';
    this.clear();
  }
  clear() {
    this.error = '';
    this.promotionError = '';
    this.promotionError1 = '';
    this.promotionError2 = '';
    this.discountErr = '';
    this.promotionError3 = '';
    this.promotionError4 = '';
  }
  showInActive() {
    this.showIn = false;
    this.showInactiveData = !this.showInactiveData;
    this.showupdate = !this.showupdate;
    this.hideupdate = !this.hideupdate;
  }
  checkIfOrderExists(values) {
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
  updateOrder() {
    this.showIn = true;
    this.showInactiveData = 'false';
    const row = [];
    for (let r = 0; r < this.promotionsList.length; r++) {
      row.push({ 'col': Number(this.promotionsList[r].Sort_Order__c), 'ind': r });
      this.checkIfOrderExists(row);
    }
    if (this.isDuplicate) {
      this.promotionError4 = 'SETUP_PROMOTIONS.NO_VALID_DUPLICATE_RECORD';
    } else {
      this.setupPromotionsService.getSortList(this.promotionsList).subscribe(
        data => {
          this.getPromotions();
          this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_UPDATE_SORT_ORDER_SUCCESS');
          this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
        },
        error => {
          const status = JSON.parse(error['status']);
          const statuscode = JSON.parse(error['_body']).status;
          switch (JSON.parse(error['_body']).status) {
            case '2061':
              this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
              window.scroll(0, 0);
              break;
          }
        });
    }
  }
  showData(promotionslist) {
    let newDate: any;
    let endDate: any;
    if (promotionslist.Start_Date__c) {
      newDate = this.commonService.getDateFrmDBDateStr(promotionslist.Start_Date__c);
    }
    if (promotionslist.End_Date__c) {
      endDate = this.commonService.getDateFrmDBDateStr(promotionslist.End_Date__c);
    }
    this.updatePromotionId = promotionslist.Id;
    this.updateActive = promotionslist.Active__c;
    this.updatePromotionName = promotionslist.Name;
    this.updateServiceDiscount = promotionslist.Service_Discount__c;
    this.updateProductDiscount = promotionslist.Product_Discount__c;
    if (promotionslist.Discount_Amount__c === 0) {
      this.updateDiscountAmount = '';
    } else {
      this.updateDiscountAmount = promotionslist.Discount_Amount__c;
    }
    if (promotionslist.Discount_Percentage__c === 0) {
      this.updateDiscountPercentage = '';
    } else {
      this.updateDiscountPercentage = promotionslist.Discount_Percentage__c;
    }
    this.updateSortOrder = promotionslist.Sort_Order__c;
    if (newDate) {
      this.updatePromotionStartDate = newDate;
    } else {
      this.updatePromotionStartDate = '';
    }
    if (endDate) {
      this.updatePromotionEndDate = endDate;
    } else {
      this.updatePromotionEndDate = '';
    }
    this.disableEnable = true;
    this.addDiv = false;
    this.disableDiv = false;
    this.editDiv = true;
  }
  cancel() {
    this.disableEnable = false;
    this.disableDiv = true;
    this.addDiv = false;
    this.editDiv = false;
    this.clear();
    this.clearMessages();
  }
  /* method to restrict specialcharecters  */
  numbersOnly(event: any) {
    const pattern = /[0-9]/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  getPromotions() {
    this.setupPromotionsService.getPromotions().subscribe(
      data => {
        this.promotionsList = data['result'];
        if (this.promotionsList.length > 0) {
          this.sort = this.promotionsList[this.promotionsList.length - 1]['Sort_Order__c'] + 1;
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
      }
    );
  }
  createPromotion() {
    if (this.promotionName === undefined || this.promotionName === 'undefined' ||
      this.promotionName === '') {
      this.promotionError = 'VALIDATION_MSG.NAME_REQUIRED';
    } else if ((this.serviceDiscount === false || this.serviceDiscount === '') && (this.productDiscount === false || this.productDiscount === '')) {
      this.discountErr = 'Select any one of Service Discount Or Product Discount';
    } else if (this.serviceDiscount &&
      ((this.discountAmount === undefined || this.discountAmount === '' || this.discountAmount === 'undefined') &&
        (this.discountPercentage === undefined || this.discountPercentage === '' || this.discountPercentage === 'undefined'))) {
      this.discountErr = 'Discount Amount OR Discount Percentage should not be blank';
    } else if (this.productDiscount &&
      ((this.discountAmount === undefined || this.discountAmount === '' || this.discountAmount === 'undefined') &&
        (this.discountPercentage === undefined || this.discountPercentage === '' || this.discountPercentage === 'undefined'))) {
      this.discountErr = 'Discount Amount OR Discount Percentage should not be blank';
    } else if (this.discountAmount !== '' && this.discountPercentage !== '' &&
      this.discountPercentage !== undefined && this.discountAmount !== undefined) {
      this.promotionError2 = 'SETUP_PROMOTIONS.INVALID_EITHER_DISCOUNT_AMOUNT_OR_DISCOUNT_PERCENTAGE';
    } else if (this.sort === undefined || this.sort === 'undefined' || this.sort === '') {
      this.promotionError1 = 'SETUP_PROMOTIONS.INVALID_SORT_ORDER_BLANK';
    } else if (this.discountAmount !== '' && this.discountPercentage !== '' &&
      this.discountPercentage !== undefined && this.discountAmount !== undefined) {
      this.promotionError2 = 'SETUP_PROMOTIONS.INVALID_EITHER_DISCOUNT_AMOUNT_OR_DISCOUNT_PERCENTAGE';
    } else if ((this.promotionStartDate === null || this.promotionStartDate === '') && (this.promotionEndDate !== null && this.promotionEndDate !== '')) {
      this.promotionError3 = 'Start Date is required';
    } else if ((this.promotionStartDate !== null && this.promotionStartDate !== '') && (this.promotionEndDate === null || this.promotionEndDate === '')) {
      this.promotionError3 = 'End Date is required';
    } else if (this.promotionStartDate > this.promotionEndDate) {
      this.promotionError3 = 'SETUP_PROMOTIONS.NOVALID_START_DATE_BEFORE_END_DATE';
    } else {
      if (this.active === false) {
        this.active = this.defaultInActive;
      } else if (this.active === true) {
        this.active = this.defaultActive;
      }
      if (this.serviceDiscount === false) {
        this.serviceDiscount = this.defaultInActive;
      } else if (this.serviceDiscount === true) {
        this.serviceDiscount = this.defaultActive;
      }
      if (this.productDiscount === false) {
        this.productDiscount = this.defaultInActive;
      } else if (this.productDiscount === true) {
        this.productDiscount = this.defaultActive;
      }
      this.promotionData = {
        'Active__c': this.active,
        'Name': this.promotionName.trim(),
        'Service_Discount__c': this.serviceDiscount,
        'Product_Discount__c': this.productDiscount,
        'Discount_Amount__c': this.discountAmount,
        'Discount_Percentage__c': this.discountPercentage,
        'Start_Date__c': this.promotionStartDate === null ? null : this.commonService.getDBDatStr(this.promotionStartDate),
        'End_Date__c': this.promotionEndDate === null ? null : this.commonService.getDBDatStr(this.promotionEndDate),
        'Sort_Order__c': this.sort,
      };
      this.setupPromotionsService.createPromotion(this.promotionData).subscribe(
        data => {
          this.promotionDetails = data['result'];
          this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_CREATE_SUCCESS');
          this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
          this.getPromotions();
          this.clearMessages();
          this.disableEnable = false;
          this.disableDiv = true;
          this.addDiv = false;
          this.editDiv = false;
        },
        error => {
          const status = JSON.parse(error['status']);
          const statuscode = JSON.parse(error['_body']).status;
          switch (JSON.parse(error['_body']).status) {
            case '2074':
              this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
              window.scrollTo(0, 0);
              break;
            case '2075':
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
        }
      );
    }
  }
  editPromotion() {
    if (this.updateProductDiscount === 0) {
      this.updateProductDiscount = false;
    } else if (this.updateProductDiscount === 1) {
      this.updateProductDiscount = true;
    }
    if (this.updateServiceDiscount === 0) {
      this.updateServiceDiscount = false;
    } else if (this.updateServiceDiscount === 1) {
      this.updateServiceDiscount = true;
    }
    if (this.updatePromotionName === undefined || this.updatePromotionName === 'undefined' ||
      this.updatePromotionName === '') {
      this.promotionError = 'VALIDATION_MSG.NAME_REQUIRED';
    } else if (this.updateServiceDiscount === false && this.updateProductDiscount === false) {
      this.discountErr = 'Select any one of Service Discount Or Product Discount';

    } else if (this.updateServiceDiscount === true  &&
      ((this.updateDiscountAmount === undefined || this.updateDiscountAmount === '' || this.updateDiscountAmount === 'undefined') &&
        (this.updateDiscountPercentage === undefined || this.updateDiscountPercentage === '' || this.updateDiscountPercentage === 'undefined'))) {
      this.discountErr = 'Discount Amount OR Discount Percentage should not be blank';
    } else if (this.updateProductDiscount  &&
      ((this.updateDiscountAmount === undefined || this.updateDiscountAmount === '' || this.updateDiscountAmount === 'undefined') &&
        (this.updateDiscountPercentage === undefined || this.updateDiscountPercentage === '' || this.updateDiscountPercentage === 'undefined'))) {
      this.discountErr = 'Discount Amount OR Discount Percentage should not be blank';

    } else if (this.updateDiscountAmount !== '' && this.updateDiscountPercentage !== ''
      && this.updateDiscountAmount !== null && this.updateDiscountPercentage !== null &&
      this.updateDiscountPercentage !== undefined && this.updateDiscountAmount !== undefined) {
      this.promotionError2 = 'SETUP_PROMOTIONS.INVALID_EITHER_DISCOUNT_AMOUNT_OR_DISCOUNT_PERCENTAGE';
    } else if ((this.updatePromotionStartDate === null || this.updatePromotionStartDate === '') && (this.updatePromotionEndDate !== null && this.updatePromotionEndDate !== '')) {
      this.promotionError3 = 'Start Date is required';
    } else if ((this.updatePromotionStartDate !== null && this.updatePromotionStartDate !== '') && (this.updatePromotionEndDate === null || this.updatePromotionEndDate === '')) {
      this.promotionError3 = 'End Date is required';
    } else if (this.updatePromotionStartDate > this.updatePromotionEndDate) {
      this.promotionError3 = 'SETUP_PROMOTIONS.NOVALID_START_DATE_BEFORE_END_DATE';
    } else if (this.updateSortOrder === undefined || this.updateSortOrder === 'undefined' ||
      this.updateSortOrder === '') {
      this.promotionError1 = 'SETUP_PROMOTIONS.INVALID_SORT_ORDER_BLANK';
    } else {
      if (this.updateActive === false) {
        this.updateActive = this.defaultInActive;
      } else if (this.updateActive === true) {
        this.updateActive = this.defaultActive;
      }
      if (this.updateServiceDiscount === false) {
        this.updateServiceDiscount = this.defaultInActive;
      } else if (this.updateServiceDiscount === true) {
        this.updateServiceDiscount = this.defaultActive;
      }
      if (this.updateProductDiscount === false) {
        this.updateProductDiscount = this.defaultInActive;
      } else if (this.updateProductDiscount === true) {
        this.updateProductDiscount = this.defaultActive;
      }
      this.updatePromotionObj = {
        'updateActive': this.updateActive,
        'updateName': this.updatePromotionName.trim(),
        'updateServiceDiscount': this.updateServiceDiscount,
        'updateProductDiscount': this.updateProductDiscount,
        'updateDiscountAmount': this.updateDiscountAmount,
        'updateDiscountPercentage': this.updateDiscountPercentage,
        'updatePromotionStartDate': this.updatePromotionStartDate === null ? null : this.commonService.getDBDatStr(this.updatePromotionStartDate),
        'updatePromotionEndDate': this.updatePromotionEndDate === null ? null : this.commonService.getDBDatStr(this.updatePromotionEndDate),
        'updateSortOrder': this.updateSortOrder,
      };
      this.setupPromotionsService.editPromotion(this.updatePromotionId, this.updatePromotionObj).subscribe(
        data => {
          this.updatePromotionDetails = data['result'];
          this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_UPDATE_SUCCESS');
          this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
          this.getPromotions();
          this.clearMessages();
          this.disableEnable = false;
          this.disableDiv = true;
          this.addDiv = false;
          this.editDiv = false;
        },
        error => {
          const status = JSON.parse(error['status']);
          const statuscode = JSON.parse(error['_body']).status;
          switch (JSON.parse(error['_body']).status) {
            case '2074':
              this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
              window.scrollTo(0, 0);
              break;
            case '2075':
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
        }
      );
    }
  }
}
