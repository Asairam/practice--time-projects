import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { SetupPyamentTypeService } from './setuppaymenttypes.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-setuppaymenttypes-popup',
  templateUrl: './setuppaymenttypes.html',
  styleUrls: ['./setuppaymenttypes.component.css'],
  providers: [SetupPyamentTypeService]
})
export class SetupPaymentTypesComponent implements OnInit {
  addEnableDisable: any = true;
  addDisableEnable: any = false;
  showInactiveData: any;
  paymentName: any;
  abbreviation: any;
  updateId: any;
  sortOrder: any;
  sortIcon: any;
  sortFile: any;
  activeStatus: any = false;
  processElectronicallyInStore: any;
  processElectronicallyOnline: any;
  paymentList: any;
  paymentLogo: any;
  imageTypeError: any;
  paymentLogoAllowedSize: any;
  updatePaymentLogoAllowedSize: any;
  paymentListNew: any = {};
  updatePaymentListNew: any = {};
  deletePaymentListNew: any = {};
  setupPaymentData: any;
  setupPaymentUpdateData: any;
  paymentDataPost: any;
  error: any;
  error1: any;
  error2: any;
  error3: any;
  error4: any;
  error5: any;
  imageMinSize: any;
  imgStatus: any;
  imageMaxSize: any;
  imageError: any;
  isDesc: any;
  column: any;
  updateList: any = true;
  showupdate: any = true;
  hideupdate: any = false;
  editlist: any = true;
  savelistview: any = true;
  editlistview: any = false;
  iconDocumentName: SafeUrl = '';
  toastermessage: any;
  statuscode: any;
  resPaymentName: any;
  resPaymentAbbreviation: any;
  resPaymentSortorder: any;
  isEditable: any = false;
  sortPattern = '^$|^([0-9]|[1-9][0-9]|[1][0][0])?';
  fileName = 'No file chosen';

  constructor(private setupPyamentTypeService: SetupPyamentTypeService,
    @Inject('apiEndPoint') public apiEndPoint: string,
    @Inject('defaultActive') public defaultActive: string,
    @Inject('defaultInActive') public defaultInActive: string,
    @Inject('defaultType') public defaultType: string,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private sanitizer: DomSanitizer) {
  }
  ngOnInit() {
    this.getPaymentNames();
  }
  getPaymentNames() {
    this.setupPyamentTypeService.getpaymentList().subscribe(
      data => {
        this.paymentList = data.result.paymentResult.filter(filterList => filterList.Name !== 'Prepaid Package');
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
  showInActive() {
    this.showInactiveData = !this.showInactiveData;
    this.showupdate = !this.showupdate;
    this.hideupdate = !this.hideupdate;
  }
  cancelPaymentType() {
    this.clearmessage();
    this.addEnableDisable = true;
    this.addDisableEnable = false;
    this.savelistview = true;
    this.editlistview = false;
    this.editlist = true;
    this.statuscode = false;
    this.iconDocumentName = '';
    this.fileName = '';
  }
  cancelPaymentType2() {
    this.clearmessage();
    this.addEnableDisable = true;
    this.addDisableEnable = false;
    this.savelistview = true;
    this.editlistview = false;
  }
  fileChange(event) {
    const eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    const target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.paymentLogo = files[0];
      this.fileName = files[0].name;
    }
    const fSExt = new Array('Bytes', 'KB', 'MB', 'GB');
    const fSize = this.paymentLogo.size;
    if (fSize < 1000000) {
      this.paymentLogoAllowedSize = this.paymentLogo;
      this.iconDocumentName = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.paymentLogo));
    } else {
      this.paymentLogoAllowedSize = '';
      this.imageTypeError = 'SETUPCOMPANY.VALID_IMAGE_FILENAME';
    }
  }
  savePaymentType() {
    if ((this.paymentName === undefined || this.paymentName === '' || this.paymentName === 'undefined') &&
      (this.abbreviation === undefined || this.abbreviation === '' || this.abbreviation === 'undefined') &&
      (this.processElectronicallyInStore === undefined ||
        this.processElectronicallyInStore === '' || this.processElectronicallyInStore === 'undefined') &&
      (this.processElectronicallyOnline === undefined ||
        this.processElectronicallyOnline === '' || this.processElectronicallyOnline === 'undefined') &&
      (this.sortOrder === undefined || this.sortOrder === '' ||
        this.sortOrder === 'undefined' || this.sortOrder < 1 || this.sortOrder > 100 || this.sortOrder === this.sortPattern)) {
      this.error1 = 'SETUPPAYMENT.VALID_NOBLANK_SETUPPAYMENT_NAME';
      this.error2 = 'SETUPPAYMENT.VALID_NOBLANK_SETUPPAYMENT_ABBREVIATION';
      this.error3 = 'SETUPPAYMENT.VALID_SETUPPAYMENT_SORTORDER';
      this.error3 = 'SETUPPAYMENT.VALID_NUMBER_LIMIT';
    } else if (this.paymentName === undefined || this.paymentName === '' || this.paymentName === 'undefined') {
      this.error1 = 'SETUPPAYMENT.VALID_NOBLANK_SETUPPAYMENT_NAME';
    } else if (this.abbreviation === undefined || this.abbreviation === '' || this.abbreviation === 'undefined') {
      this.error2 = 'SETUPPAYMENT.VALID_NOBLANK_SETUPPAYMENT_ABBREVIATION';
    } else if (this.sortOrder === undefined || this.sortOrder === '' ||
      this.sortOrder === 'undefined' || this.sortOrder < 1 || this.sortOrder > 100 || this.sortOrder === this.sortPattern) {
      this.error3 = 'SETUPPAYMENT.VALID_SETUPPAYMENT_SORTORDER';
      this.error3 = 'SETUPPAYMENT.VALID_NUMBER_LIMIT';
    } else if (((this.processElectronicallyInStore === true) &&
      (this.paymentLogo === undefined || this.paymentLogo === '' || this.paymentLogo === 'undefined')) ||
      ((this.processElectronicallyOnline === true) &&
        (this.paymentLogo === undefined || this.paymentLogo === '' || this.paymentLogo === 'undefined')) ||
      (this.processElectronicallyInStore === true && this.processElectronicallyOnline === true &&
        (this.paymentLogo === undefined || this.paymentLogo === '' || this.paymentLogo === 'undefined'))) {
      this.error4 = 'SETUPPAYMENT.VALID_NOBLANK_FILE_REQUIRED';
    } else {
      if (this.processElectronicallyInStore === false) {
        this.processElectronicallyInStore = this.defaultInActive;
        this.error4 = '';
      } else if (this.processElectronicallyOnline === false) {
        this.processElectronicallyOnline = this.defaultInActive;
        this.error4 = '';
      } else if (this.processElectronicallyOnline === true) {
        this.processElectronicallyOnline = this.defaultActive;
      } else if (this.activeStatus === false) {
        this.activeStatus = this.defaultInActive;
      } else if (this.activeStatus === true) {
        this.activeStatus = this.defaultActive;
      }
      this.paymentListNew = {
        'Active__c': this.activeStatus,
        'Name': this.paymentName,
        'Abbreviation__c': this.abbreviation,
        'Process_Electronically__c': this.processElectronicallyInStore,
        'Process_Electronically_Online__c': this.processElectronicallyOnline,
        'Sort_Order__c': this.sortOrder,
      };
      this.setupPyamentTypeService.savePaymentType(this.paymentListNew, this.paymentLogoAllowedSize)
        .subscribe(
          data => {
            this.setupPaymentData = data['data'];
            this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_CREATE_SUCCESS');
            this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
            this.clearmessage();
            this.addEnableDisable = true;
            this.addDisableEnable = false;
            this.getPaymentNames();
            this.editlist = true;
            this.updateList = true;
            this.savelistview = true;
            this.editlistview = false;
          },
          error => {
            const status = JSON.parse(error['status']);
            const statuscode = JSON.parse(error['_body']).status;
            switch (JSON.parse(error['_body']).status) {
              case '2059':
                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                break;
              case '2060':
                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                break;
              case '2061':
                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
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
  editSavePaymentType() {
    if (this.processElectronicallyInStore === 1) {
      this.processElectronicallyInStore = true;
    } else if (this.processElectronicallyInStore === 0) {
      this.processElectronicallyInStore = false;
    }
    if (this.processElectronicallyOnline === 1) {
      this.processElectronicallyOnline = true;
    } else if (this.processElectronicallyOnline === 0) {
      this.processElectronicallyOnline = false;
    }
    if ((this.paymentName === undefined || this.paymentName === '' || this.paymentName === 'undefined') &&
      (this.abbreviation === undefined || this.abbreviation === '' || this.abbreviation === 'undefined') &&
      (this.processElectronicallyInStore === undefined ||
        this.processElectronicallyInStore === '' || this.processElectronicallyInStore === 'undefined') &&
      (this.processElectronicallyOnline === undefined ||
        this.processElectronicallyOnline === '' || this.processElectronicallyOnline === 'undefined') &&
      (this.sortOrder === undefined || this.sortOrder === '' ||
        this.sortOrder === 'undefined' || this.sortOrder < 1 || this.sortOrder > 100 || this.sortOrder === this.sortPattern)) {
      this.error1 = 'SETUPPAYMENT.VALID_NOBLANK_SETUPPAYMENT_NAME';
      this.error2 = 'SETUPPAYMENT.VALID_NOBLANK_SETUPPAYMENT_ABBREVIATION';
      this.error3 = 'SETUPPAYMENT.VALID_SETUPPAYMENT_SORTORDER';
      this.error3 = 'SETUPPAYMENT.VALID_NUMBER_LIMIT';
    } else if (this.paymentName === undefined || this.paymentName === '' || this.paymentName === 'undefined') {
      this.error1 = 'SETUPPAYMENT.VALID_NOBLANK_SETUPPAYMENT_NAME';
    } else if (this.abbreviation === undefined || this.abbreviation === '' || this.abbreviation === 'undefined') {
      this.error2 = 'SETUPPAYMENT.VALID_NOBLANK_SETUPPAYMENT_ABBREVIATION';
    } else if (this.sortOrder === undefined || this.sortOrder === '' ||
      this.sortOrder === 'undefined' || this.sortOrder < 1 || this.sortOrder > 100 || this.sortOrder === this.sortPattern) {
      this.error3 = 'SETUPPAYMENT.VALID_SETUPPAYMENT_SORTORDER';
      this.error3 = 'SETUPPAYMENT.VALID_NUMBER_LIMIT';
    } else {
      if (this.processElectronicallyInStore === false) {
        this.processElectronicallyInStore = this.defaultInActive;
        this.error4 = '';
      } else if (this.processElectronicallyOnline === false || this.processElectronicallyOnline === 0) {
        this.error4 = '';
        this.processElectronicallyOnline = this.defaultInActive;
      } if (this.processElectronicallyOnline === true || this.processElectronicallyOnline === 1) {
        this.processElectronicallyOnline = this.defaultActive;
      } if (this.activeStatus === false || this.activeStatus === 0) {
        this.activeStatus = this.defaultInActive;
      } if (this.activeStatus === true || this.activeStatus === 1) {
        this.activeStatus = this.defaultActive;
      } if (this.processElectronicallyInStore === true) {
        this.processElectronicallyInStore = 1;
      } else if (this.processElectronicallyInStore === false) {
        this.processElectronicallyInStore = 0;
      }
      this.updatePaymentListNew = {
        'Active__c': this.activeStatus,
        'Name': this.paymentName,
        'Abbreviation__c': this.abbreviation,
        'Process_Electronically__c': this.processElectronicallyInStore,
        'Process_Electronically_Online__c': this.processElectronicallyOnline,
        'Sort_Order__c': this.sortOrder,
      };
      this.setupPyamentTypeService.editSavePaymentType(this.updateId, this.updatePaymentListNew, this.paymentLogoAllowedSize)
        .subscribe(
          data => {
            this.setupPaymentUpdateData = data['data'];
            this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_EDIT_SUCCESS');
            this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
            this.clearmessage();
            this.addEnableDisable = true;
            this.addDisableEnable = false;
            this.getPaymentNames();
            this.editlist = true;
            this.updateList = true;
            this.savelistview = true;
            this.editlistview = false;
            this.iconDocumentName = '';
            this.paymentLogoAllowedSize = '';
            this.fileName = '';
          },
          error => {
            const status = JSON.parse(error['status']);
            const statuscode = JSON.parse(error['_body']).status;
            switch (JSON.parse(error['_body']).status) {
              case '2059':
                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                break;
              case '2060':
                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                break;
              case '2061':
                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
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


  deletePaymentType() {
    this.resPaymentName = this.paymentName;
    this.resPaymentAbbreviation = this.abbreviation;
    this.resPaymentSortorder = this.sortOrder;
    this.setupPyamentTypeService.deletePaymentType(this.updateId, this.resPaymentName,
      this.resPaymentAbbreviation, this.resPaymentSortorder)
      .subscribe(
        data => {
          this.setupPaymentUpdateData = data['data'];
          this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_DELETE_SUCCESS');
          this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
          this.clearmessage();
          this.addEnableDisable = true;
          this.addDisableEnable = false;
          this.getPaymentNames();
          this.editlist = true;
          this.updateList = true;
          // this.statuscode = false;
          this.savelistview = true;
          this.editlistview = false;

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

  }

  clear() {
    this.error = '';
    this.error1 = '';
    this.error2 = '';
    this.error3 = '';
    this.error4 = '';
    this.error5 = '';
  }
  clearmessage() {
    this.activeStatus = '';
    this.paymentName = '';
    this.abbreviation = '';
    this.processElectronicallyInStore = '';
    this.processElectronicallyOnline = '';
    this.sortOrder = '';
    this.sortIcon = '';
    this.error = '';
    this.error1 = '';
    this.error2 = '';
    this.error3 = '';
    this.error4 = '';
    this.error5 = '';

  }
  cancel() {
    this.router.navigate(['/setup']);
    this.clear();
    this.clearmessage();
  }
  clearError1() {
    this.error1 = '';
  }
  clearError2() {
    this.error2 = '';
  }
  clearError3() {
    this.error3 = '';
  }
  clearError4() {
    this.error4 = '';
  }
  clearImageError() {
    this.imageError = '';
    this.imageTypeError = '';
  }
  sortData(paymentData) {
    const sortData = [];
    for (let i = 0; i < paymentData.length; i++) {
      sortData.push(paymentData[i].Sort_Order__c);
    }
    const sorted_arr = sortData.slice().sort();
    const results = [];
    for (let i = 0; i < sorted_arr.length - 1; i++) {
      if (sorted_arr[i + 1] === sorted_arr[i]) {
        results.push(sorted_arr[i]);
      }
    }
    if (results.length > 0) {
      this.error5 = 'Duplicate found. No two payment types may have the same sort order';
      window.scroll(0, 0);
    } else {
      this.setupPyamentTypeService.getSortList(paymentData).subscribe(
        data => {
          this.getPaymentNames();
          this.updateList = true;
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
          if (statuscode === '2085' || statuscode === '2071') {
            if (this.router.url !== '/') {
              localStorage.setItem('page', this.router.url);
              this.router.navigate(['/']).then(() => { });
            }
          }
        });
    }
  }
  newRow() {
    this.addEnableDisable = false;
    this.addDisableEnable = true;
    this.editlist = true;
    this.updateList = true;
    this.isEditable = false;
    this.activeStatus = true;
  }
  showData(paymentData) {
    if (paymentData.Name === 'Account Charge' || paymentData.Name === 'Cash' || paymentData.Name === 'Gift Redemption' || paymentData.Name === 'Card on File' ||
      paymentData.Name === 'Prepaid Package') {
      this.isEditable = true;
    } else {
      this.isEditable = false;
    }
    const type = this.defaultType;
    this.updateId = paymentData.Id;
    // this.deletePaymentListNew = {
    //   'Name': this.paymentName,
    //   'Abbreviation__c': this.abbreviation,
    //   'Sort_Order__c': this.sortOrder,
    // };
    this.resPaymentName = paymentData.Name;
    this.resPaymentAbbreviation = paymentData.Abbreviation__c;
    this.resPaymentSortorder = paymentData.Sort_Order__c;
    this.setupPyamentTypeService.getDeleteResponse(this.updateId, type, this.resPaymentName,
      this.resPaymentAbbreviation, this.resPaymentSortorder).subscribe(data => {
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
    this.addEnableDisable = false;
    this.addDisableEnable = true;
    this.updateId = paymentData.Id;
    this.activeStatus = paymentData.Active__c;
    this.paymentName = paymentData.Name;
    if (paymentData.Name === 'Cash') {
      this.abbreviation = '$';
    } else {
      this.abbreviation = paymentData.Abbreviation__c;
    }
    this.processElectronicallyInStore = paymentData.Process_Electronically__c;
    this.processElectronicallyOnline = paymentData.Process_Electronically_Online__c;
    this.sortOrder = paymentData.Sort_Order__c;
    if (paymentData.Icon_Document_Name__c && paymentData.Icon_Document_Name__c !== '') {
      this.iconDocumentName = this.apiEndPoint + '/' + paymentData.Icon_Document_Name__c + '?time=' + new Date().getTime();;
    }
    this.editlist = true;
    this.savelistview = false;
    this.editlistview = true;

  }
}
