/*
* Setup service resources component used to store and to retrieve setup service resources information.
* ngonInit(): ngonInit method is used to load required methods on page load.
* setupResourceData(): This method is used to create service resources.
* getData(clang): This method is used to show data when clicking on list in table.
* editResourceService(): This method is used to edit resources.
* getSetupResourceServiceData(): This method is used to get list of resources from database.
* getInactiveResources(value): This method is used to get inactive resources and active resources.
* addNew(): This method is used to enable div to enter and to save resources.
* autocase(text): This method is used to get initial caps.
* cancel(): This method is used to cancel if dont want to go further.
* clearErrMsg(): This method is used to clear message.
* clear(): This method is used to clear fields which required.
*/import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { TranslateService } from 'ng2-translate';
import { ToastrService } from 'ngx-toastr';
import { SetupServiceResourceService } from './setupresources.service';
@Component({
  selector: 'app-setupresources-popup',
  styleUrls: ['./setupresources.css'],
  templateUrl: './setupresources.html',

  providers: [SetupServiceResourceService]
})
export class SetupResourcesComponent implements OnInit {
  resourceActive: any = false;
  resourceName: any;
  numberAvailable: any;
  setupResourseDataObj: any = {};
  setupresourceData: any;
  availabilityvalue: any;
  resourceList: any;
  updateId: any;
  createResourceGroupsData: any = {};
  updateResourceActive: any;
  updateResourceName: any;
  updateNumberAvailable: any;
  addDiv = true;
  editDiv = false;
  hideTable = true;
  disableDiv = true;
  disableEnable: any;
  enableDisable: any = true;
  editResourceServiceData: any;
  error: any;
  showInactiveRecords: any;
  resoucesNumber: number[] = [];
  toastermessage: any;
  // specialformat = /^[a-zA-Z0-9]*$/;
  specialformat = /^([a-zA-Z0-9]+\s)*[a-zA-Z0-9]+$/;
  constructor(
    private setupServiceResourceService: SetupServiceResourceService,
    private translateService: TranslateService,
    private toastr: ToastrService,
    private router: Router) {
  }

  /*--- On page load method ---*/
  ngOnInit() {
    this.assaignResourcesNumber();
    this.getSetupResourceServiceData();
    if (this.numberAvailable === undefined) {
      this.numberAvailable = 1;
    }
  }
  /*--- Method to setup service resources ---*/
  setupResourceData() {
    if (this.resourceName === undefined || this.resourceName === '' || this.resourceName === 'undefined') {
      this.error = 'SETUP_RESOURCES.VALID_NOBLANK_RESOURCE_NAME';
    } else if (this.specialformat.test(this.resourceName) === false) {
      this.error = 'SETUP_RESOURCES.VALID_SPECIAL_CHAR';
    } else {
      this.setupResourseDataObj = {
        setupResourcesObj: {
          'resourceActive': this.resourceActive,
          'resourceName': this.autocase(this.resourceName.trim().replace(/\s\s+/g, ' ')),
          'numberAvailable': this.numberAvailable
        }
      };
      this.setupServiceResourceService.createSetupResourceServiceData(this.setupResourseDataObj)
        .subscribe(
          data => {
            this.setupresourceData = data['data'];
            this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_RESOURCE_CREATE_SUCCESS');
            this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
            this.enableDisable = true;
            this.disableEnable = false;
            this.getSetupResourceServiceData();
            this.clear();
          },
          error => {
            const status = JSON.parse(error['status']);
            const statuscode = JSON.parse(error['_body']).status;
            switch (JSON.parse(error['_body']).status) {
              case '2033':
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
  /*--- This method is used to get list of resources from database ---*/
  getSetupResourceServiceData() {
    if (this.showInactiveRecords === undefined) {
      this.showInactiveRecords = 1;
    }
    this.setupServiceResourceService.getSetupResourceServiceData(this.showInactiveRecords)
      .subscribe(resourceData => {
        this.resourceList = resourceData['result'];
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
  /*--- This method is used to get inactive resources and active resources ---*/
  getInactiveResources(value) {
    this.showInactiveRecords = value.target.checked;
    if (this.showInactiveRecords === true) {
      this.showInactiveRecords = 0;
    }
    this.setupServiceResourceService.getSetupResourceServiceData(this.showInactiveRecords)
      .subscribe(resourceData => {
        this.resourceList = [];
        if (this.showInactiveRecords === 0) {
          this.resourceList = resourceData['result'];
        } else {
          this.resourceList = resourceData['result'].filter(
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
  showData(resourcelist) {
    this.enableDisable = false;
    this.disableEnable = true;
    this.editDiv = true;
    this.addDiv = false;
    this.updateId = resourcelist.Id;
    this.updateResourceActive = resourcelist.Active__c;
    this.updateResourceName = resourcelist.Name;
    this.updateNumberAvailable = resourcelist.Number_Available__c;
  }
  editResourceService() {
    if (this.updateResourceName === undefined || this.updateResourceName === '' || this.updateResourceName === 'undefined') {
      this.error = 'SETUP_RESOURCES.VALID_NOBLANK_RESOURCE_NAME';
    } else if (this.specialformat.test(this.updateResourceName) === false) {
      this.error = 'SETUP_RESOURCES.VALID_SPECIAL_CHAR';
    } else {
      if (this.updateResourceActive) {
        this.updateResourceActive = 1;
      } else {
        this.updateResourceActive = 0;
      }
      this.editResourceServiceData = {
        editResourceServiceData: {
          'resourceActive': this.updateResourceActive,
          'resourceName': this.autocase(this.updateResourceName.trim().replace(/\s\s+/g, ' ')),
          'numberAvailable': this.updateNumberAvailable
        }
      };
      this.setupServiceResourceService.editSetupResourceData(this.editResourceServiceData, this.updateId).subscribe(
        data => {
          this.createResourceGroupsData = data['data'];
          this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_RESOURCE_UPDATE_SUCCESS');
          this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
          this.getSetupResourceServiceData();
          this.Editcancel();
        },
        error => {
          const status = JSON.parse(error['status']);
          const statuscode = JSON.parse(error['_body']).status;
          switch (JSON.parse(error['_body']).status) {
            case '2033':
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
  /*--- This method is used to enable div to enter and to save resources ---*/
  addNew() {
    this.disableEnable = true;
    this.enableDisable = false;
    this.addDiv = true;
    this.editDiv = false;
    this.resourceActive = true;
    this.setupServiceResourceService.getSetupResourceServiceData(this.showInactiveRecords)
      .subscribe(resourceData => {
        if (this.showInactiveRecords === true) {
          this.showInactiveRecords = 0;
        }
        if (this.showInactiveRecords === 0) {
          this.setupServiceResourceService.getSetupResourceServiceData('')
            .subscribe(resourceResult => {
              this.resourceList = [];
              this.resourceList = resourceResult['result'];
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
        } else {
          this.setupServiceResourceService.getSetupResourceServiceData('')
            .subscribe(resourceResult => {
              this.resourceList = [];
              this.resourceList = resourceResult['result'].filter(
                filterList => filterList.active === true);
            },
              error2 => {
                const errStatus = JSON.parse(error2['_body'])['status'];
                if (errStatus === '2085' || errStatus === '2071') {
                  if (this.router.url !== '/') {
                    localStorage.setItem('page', this.router.url);
                    this.router.navigate(['/']).then(() => { });
                  }
                }
              });
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
  autocase(text) {
    if (text) {
      return text.replace(/(&)?([a-z])([a-z]{0,})(;)?/ig, function (all, prefix, letter, word, suffix) {
        if (prefix && suffix) { return all; }
        return letter.toUpperCase() + word.toLowerCase();
      });
    } else { return ''; }
  }
  cancel() {
    this.disableEnable = false;
    this.enableDisable = true;
    this.editDiv = false;
    this.addDiv = true;
    this.error = '';
    this.clear();
  }
  Editcancel() {
    this.editDiv = true;
    this.addDiv = false;
    this.disableEnable = false;
    this.enableDisable = true;
    this.error = '';
    this.updateResourceActive = '';
    this.updateResourceName = '';
    this.updateNumberAvailable = 1;
  }
  clearErrMsg() {
    this.error = '';
  }
  clear() {
    this.resourceActive = '',
      this.resourceName = '',
      this.numberAvailable = 1;
  }
  assaignResourcesNumber() {
    for (let i = 1; i <= 20; i++) {
      this.resoucesNumber[i - 1] = i;
    }
  }

}
