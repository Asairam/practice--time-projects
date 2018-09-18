import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from 'ng2-translate';
import { ToastrService } from 'ngx-toastr';
import { SetupServicePackagesService } from './setupservicepackages.service';
@Component({
  selector: 'app-setupservicepackages',
  templateUrl: './setupservicepackages.html',
  styleUrls: ['./setupservicepackages.css'],
  providers: [SetupServicePackagesService]
})
export class SetupServicePackagesComponent implements OnInit {
  inActive: any;
  serviceDetailsList: any;
  packages: any;
  price: any;
  sendpricess: any;
  priceList: any;
  serviceId: any;
  priceEach: any;
  discountValue: any;
  packageActive: any;
  packageName: any;
  availableforOnlinePurchase: any;
  availableforClientSelfBooking: any;
  clientFacingName: any;
  description: any;
  packageValueBeforeDiscounts = 0;
  discountedPackage = 0;
  taxPercent = this.defaultPrice;
  packageData: any = {};
  packageService: any = {};
  reps: any;
  error: any;
  inputs = [];
  packagesList: any;
  editpackageData: any = {};
  addDiv = false;
  editDiv = false;
  hideTable = true;
  disableDiv = true;
  updateId: any;
  updatePackageName: any;
  updateDescription: any;
  updatePackageValueBeforeDiscounts: any;
  updateDiscountedPackage: any;
  updatePackageService: any;
  updatePackageActive: any;
  updateClientFacingName: any;
  updateAvailableforClientSelfBooking: any;
  updateAvailableforOnlinePurchase: any;
  updateReps: any;
  discountedPackageSumForTaxableService = 0;
  serviceTaxValue: number;
  JSON__c: any;
  taxableValue: any;
  SertviceTaxData: any;
  value1: any;
  value2: any;
  testval: any;
  duplicateArray = [];
  selectedService: any;
  constructor(private setupServicePackagesService: SetupServicePackagesService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private router: Router,
    @Inject('defaultPrice') public defaultPrice: number) {
  }
  /*--- On page load method ---*/
  ngOnInit() {
    this.getServiceDetails();
    this.getpackagesListing();
    this.serviceTaxValue = 0.00;
    // this.inputs.push({
    //   'serviceDetailsList': this.serviceDetailsList,
    //   'used': 0, 'taxable': 0, 'serviceId': '', 'reps': 0, 'priceEach': 0,
    //   'lineNumber': 0, 'discountPriceEach': 0
    // });
  }
  /*--- Method to create get service packages ---*/
  getServicePackages(value, i) {
    this.serviceId = value;
    this.setupServicePackagesService.getSingleServiceDetails(this.serviceId).subscribe(data => {
      const Levels__c = data['result'];
      this.priceList = JSON.parse(Levels__c[0].Levels__c);
      // const testPriceValue = this.priceList[0].Levels__c;
      if (this.priceList === null || this.priceList === 'null') {
        this.priceEach = 0;
        this.taxableValue = false;
        this.selectedService = '';
        this.inputs[i]['priceEach'] = this.priceEach;
        this.inputs[i]['discountPriceEach'] = this.priceEach;
        this.inputs[i]['serviceId'] = this.serviceId;
        this.inputs[i]['taxable'] = this.taxableValue;
        this.inputs[i]['lineNumber'] = i + 1;
      } else {
        this.priceEach = this.priceList[0].price;
        this.taxableValue = JSON.stringify(Levels__c[0].Taxable__c);
        this.selectedService = Levels__c[0].Name;
        this.inputs[i]['priceEach'] = this.priceEach;
        this.inputs[i]['discountPriceEach'] = this.priceEach;
        this.inputs[i]['serviceId'] = this.serviceId;
        this.inputs[i]['taxable'] = this.taxableValue;
        this.inputs[i]['lineNumber'] = i + 1;
      }
      this.discountedPackageCaluculation();
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

  addInput() {
    this.inputs.push({
      'used': 0, 'taxable': 0, 'serviceId': '', 'reps': 0, 'priceEach': 0,
      'lineNumber': 0, 'discountPriceEach': 0
    });
    this.discountedPackageCaluculation();
  }
  packageValueCaluculationBeforeDiscounts(i) {
    this.packageValueBeforeDiscounts = 0;
    for (let j = 0; j < this.inputs.length; j++) {
      this.value1 = parseInt(this.inputs[j].reps, 10) * this.inputs[j].priceEach;
      this.packageValueBeforeDiscounts = this.value1 + this.packageValueBeforeDiscounts;
      if (i === 0) {
        this.discountedPackage = this.value1;
      }
    }
    this.discountedPackageCaluculation();
  }
  discountedPackageCaluculation() {
    this.discountedPackage = 0;
    this.discountedPackageSumForTaxableService = 0;
    this.serviceTaxValue = 0.00;
    for (let j = 0; j < this.inputs.length; j++) {
      this.value2 = parseInt(this.inputs[j].reps, 10) * this.inputs[j].discountPriceEach;
      this.discountedPackage = this.value2 + this.discountedPackage;
      if (parseInt(this.inputs[j].taxable, 10) === 1) {
        const testvalue2: any = parseInt(this.inputs[j].reps, 10) * this.inputs[j].discountPriceEach;
        this.discountedPackageSumForTaxableService = this.discountedPackageSumForTaxableService + testvalue2;
        this.serviceTaxValue = this.discountedPackageSumForTaxableService * (this.taxPercent / 100);
      }
    }

  }
  deleteFieldValue(index) {
    this.inputs.splice(index, 1);
    this.discountedPackageCaluculation();
    this.error = '';
  }
  savePackages() {
    this.checkIfServiceExists(this.inputs);
    for (let i = 0; i < this.inputs.length; i++) {
      if (this.packageName === '' || this.packageName === undefined || this.packageName === 'undefined') {
        this.error = 'SETUP_PACKAGES.VALID_NOBLANK_PACKAGE_NAME_BLANK';
        window.scrollTo(0, 0);
      } else if (this.inputs[i].serviceId === '' || this.inputs[i].serviceId === undefined || this.inputs[i].serviceId === 'undefined') {
        this.error = 'SETUP_PACKAGES.VALID_NOBLANK_SERVICE_NAME_BLANK';
        window.scrollTo(0, 0);
      } else if (this.inputs[i].reps === '' || this.inputs[i].reps === undefined || this.inputs[i].reps === 'undefined') {
        this.error = 'SETUP_PACKAGES.VALID_NOBLANK_REPS_BLANK';
        window.scrollTo(0, 0);
      } else if (this.inputs[i].reps < 1 || this.inputs[i].reps > 99) {
        this.error = 'SETUP_PACKAGES.VALID_NOBLANK_REPS_BLANK';
        window.scrollTo(0, 0);
      }
    }
    if (this.error === '') {
      if (this.packageActive === true) {
        // this.packageActive = 1;
        this.packageData.packageActive = 1;
      }
      if (this.packageActive === false) {
        // this.packageActive = 0;
        this.packageData.packageActive = 0;
      }
      if (this.packageActive === undefined) {
        this.packageActive = 0;
      }
      if (this.clientFacingName === undefined) {
        this.packageData.clientFacingName = '';
      } else {
        this.packageData.clientFacingName = this.clientFacingName;
      }
      if (this.availableforOnlinePurchase === true) {
        this.availableforOnlinePurchase = 1;
      }
      if (this.availableforOnlinePurchase === false) {
        this.availableforOnlinePurchase = 0;
      }
      if (this.availableforOnlinePurchase === undefined) {
        this.availableforOnlinePurchase = 1;
      }
      if (this.availableforClientSelfBooking === true) {
        this.availableforClientSelfBooking = 1;
      }
      if (this.availableforClientSelfBooking === false) {
        this.availableforClientSelfBooking = 0;
      }
      if (this.availableforClientSelfBooking === undefined) {
        this.availableforClientSelfBooking = 1;
      }
      this.packageData.packageName = this.packageName,
        this.packageData.availableforOnlinePurchase = this.availableforOnlinePurchase,
        this.packageData.availableforClientSelfBooking = this.availableforClientSelfBooking,
        // this.packageData.clientFacingName = this.clientFacingName,
        this.packageData.description = this.description,
        this.packageData.packageValueBeforeDiscounts = this.packageValueBeforeDiscounts,
        this.packageData.discountedPackage = this.discountedPackage,
        this.packageData.taxPercent = this.taxPercent;
      this.packageData.serviceTaxValue = this.serviceTaxValue;
      this.packageData.JSON__c = this.inputs;
      this.setupServicePackagesService.packageData(this.packageData)
        .subscribe(
          data => {
            this.packageData = data['result'];
            this.toastr.success('Service Packages Success', null, { timeOut: 1500 });
            this.getpackagesListing();
            this.disableDiv = true;
            this.hideTable = true;
            this.addDiv = false;
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
              case '2038':
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
  checkIfServiceExists(inputs) {
    const valueArr = this.inputs.map(function (item) { return item.serviceId; });
    const isDuplicate = valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) !== idx;
    });
    if (isDuplicate === true) {
      this.error = 'SETUP_PACKAGES.DUBLICATE_SERVICE';
      window.scrollTo(0, 0);
    }
  }
  getInactiveRecords(value) {
    if (value.target.checked === true) {
      this.inActive = 'false';
    } else {
      this.inActive = 'true';
    }
    this.setupServicePackagesService.getAllServiceDetails(this.inActive)
      .subscribe(data => {
        this.packagesList = data['result'];
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
    this.packageActive = true;
    this.hideTable = false;
    this.addDiv = true;
    this.disableDiv = false;
    this.getSertviceTaxData();
    this.addInput();
  }
  getServiceDetails() {
    this.setupServicePackagesService.getServiceDetails(this.inActive)
      .subscribe(data => {
        this.serviceDetailsList = data['result'];
        this.price = data['result'];
        this.sendpricess = this.price[0].priceLevels;
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
  pricelevels() {
    this.setupServicePackagesService.getSingleServiceDetails(this.serviceId).subscribe(data => {
      this.priceList = data['result'];
      this.priceEach = this.priceList.priceLevels[0].price;

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
  getpackagesListing() {
    this.setupServicePackagesService.getAllServiceDetails(this.inActive).subscribe(data => {
      this.packagesList = data['result'];
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
  getSertviceTaxData() {
    this.setupServicePackagesService.getServiceTax().subscribe(data => {
      this.SertviceTaxData = data['result'];
      const serviceTax = JSON.parse(this.SertviceTaxData[3].JSON__c);
      this.taxPercent = serviceTax.serviceTax;
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
  showData(serviceslist) {
    this.inputs = [];
    this.hideTable = false;
    this.disableDiv = false;
    this.editDiv = true;
    this.getSertviceTaxData();
    this.updateId = serviceslist.Id,
      this.updatePackageName = serviceslist.Name,
      this.updateDescription = serviceslist.Description__c,
      this.packageValueBeforeDiscounts = serviceslist.Package_value_before_discounts__c,
      this.discountedPackage = serviceslist.Discounted_Package__c,
      this.updatePackageActive = serviceslist.Active__c;
    this.updateClientFacingName = serviceslist.Client_Facing_Name__c;
    this.updateAvailableforClientSelfBooking = serviceslist.Available_Client_Self_Booking__c;
    this.updateAvailableforOnlinePurchase = serviceslist.Available_Online_Purchase__c;
    this.inputs = JSON.parse(serviceslist.JSON__c);
    this.updatePackageValueBeforeDiscounts = serviceslist.Package_value_before_discounts__c;
    this.updateDiscountedPackage = serviceslist.Discounted_Package__c;
    this.taxPercent = serviceslist.Tax_Percent__c;
    this.serviceTaxValue = serviceslist.Tax__c;
    // this.getServicePackages(JSON.parse(this.value1, i));
    if (!Number.isInteger(serviceslist.Tax_Percent__c)) {
      this.discountedPackageCaluculation();
    }
  }
  editData() {
    this.discountedPackageCaluculation();
    this.editDiv = true;
    this.checkIfServiceExists(this.inputs);
    for (let i = 0; i < this.inputs.length; i++) {
      if (this.updatePackageName === '' || this.updatePackageName === undefined || this.updatePackageName === 'undefined') {
        this.error = 'SETUP_PACKAGES.VALID_NOBLANK_PACKAGE_NAME_BLANK';
        window.scrollTo(0, 0);
      } else if (this.inputs[i].serviceId === '' || this.inputs[i].serviceId === undefined || this.inputs[i].serviceId === 'undefined') {
        this.error = 'SETUP_PACKAGES.VALID_NOBLANK_SERVICE_NAME_BLANK';
        window.scrollTo(0, 0);
      } else if (this.inputs[i].reps === '' || this.inputs[i].reps === undefined || this.inputs[i].reps === 'undefined') {
        this.error = 'SETUP_PACKAGES.VALID_NOBLANK_REPS_BLANK';
        window.scrollTo(0, 0);
      } else if (this.inputs[i].reps < 1 || this.inputs[i].reps > 99) {
        this.error = 'SETUP_PACKAGES.VALID_NOBLANK_REPS_BLANK';
        window.scrollTo(0, 0);
      }
    }
    if (this.error === '' || this.error === undefined) {
      if (this.updatePackageActive === true) {
        this.updatePackageActive = 1;
      }
      if (this.updatePackageActive === false) {
        this.updatePackageActive = 0;
      }
      if (this.updatePackageActive === undefined) {
        this.updatePackageActive = 1;
      }
      if (this.updateAvailableforOnlinePurchase === true) {
        this.updateAvailableforOnlinePurchase = 1;
      }
      if (this.updateAvailableforOnlinePurchase === false) {
        this.updateAvailableforOnlinePurchase = 0;
      }
      if (this.updateAvailableforOnlinePurchase === undefined) {
        this.updateAvailableforOnlinePurchase = 1;
      }
      if (this.updateAvailableforClientSelfBooking === true) {
        this.updateAvailableforClientSelfBooking = 1;
      }
      if (this.updateAvailableforClientSelfBooking === false) {
        this.updateAvailableforClientSelfBooking = 0;
      }
      if (this.updateAvailableforClientSelfBooking === undefined) {
        this.updateAvailableforClientSelfBooking = 1;
      }
      this.editpackageData.packageActive = this.updatePackageActive,
        this.editpackageData.packageName = this.updatePackageName,
        this.editpackageData.availableforOnlinePurchase = this.updateAvailableforOnlinePurchase,
        this.editpackageData.availableforClientSelfBooking = this.updateAvailableforClientSelfBooking,
        this.editpackageData.clientFacingName = this.updateClientFacingName,
        this.editpackageData.description = this.updateDescription,
        this.editpackageData.packageValueBeforeDiscounts = this.packageValueBeforeDiscounts,
        this.editpackageData.discountedPackage = this.discountedPackage,
        this.editpackageData.taxPercent = this.taxPercent;
      this.editpackageData.JSON__c = this.inputs;
      this.editpackageData.serviceTaxValue = this.serviceTaxValue;
      this.setupServicePackagesService.updatepackageData(this.editpackageData, this.updateId)
        .subscribe(
          data => {
            this.packageData = data['data'];
            this.toastr.success('Setup Service Packages Updated Successfully', null, { timeOut: 1500 });
            this.getpackagesListing();
            this.ngOnInit();
            this.disableDiv = true;
            this.hideTable = true;
            this.addDiv = false;
            this.editDiv = false;
            // this.inputs = [];
            this.clear();
            if (this.inActive === 'false') {
              this.inActive = 'true';
            }
            this.setupServicePackagesService.getAllServiceDetails(this.inActive).subscribe(data1 => {
              this.packagesList = data1['result'];
            });
          },
          error => {
            const status = JSON.parse(error['status']);
            const statuscode = JSON.parse(error['_body']).status;

            switch (JSON.parse(error['_body']).status) {
              case '2033':
                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                break;
              case '2038':
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
  cancel() {
    this.addDiv = false;
    this.editDiv = false;
    this.hideTable = true;
    this.disableDiv = true;
    this.error = '';
    this.clear();
  }
  clearErrMsg() {
    this.error = '';
  }
  clear() {
    this.packageActive = '',
      this.packageName = '',
      this.availableforOnlinePurchase = '',
      this.availableforClientSelfBooking = '',
      this.clientFacingName = '',
      this.description = '',
      this.packageValueBeforeDiscounts = 0.00,
      this.discountedPackage = 0.00,
      this.taxPercent = 0.00;
    this.error = '';
    this.inputs = [];
    this.serviceTaxValue = 0;
  }
}
