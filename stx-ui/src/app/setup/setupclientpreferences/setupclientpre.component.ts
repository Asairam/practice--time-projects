/*
ngOnInit(): Method to load clientPreference page
listClientFields(): method for listing client fields
listVisitTypes(): Method for listing visit types
clearVisitTypeErrorDuplicate(): Method for clearing visit types error messages
listClientFlags(): Method fo listing client flags
clearClientFlagsErrorDuplicate(): Method for clearing client flags error messages
listOccupation(): Method to listing client occupations
clearOccupationErrorDuplicate(): Method to clearing occupations error messages
checkIfoccupationNameExists(inputs): Method to check Duplicates in occupations
mobileCarriernamesData(): Method for listing client mobile carrier fields
addMobileInput(): Method to add new line in mobile carriers
clearMobileCarrierErrorDuplicateMobile(): Method to clearing error messages in mobile carriers
checkIfmobileCarrierNameExists(mobileInputs): Method to check duplicates in mobile carriers listing
cancel(): Method for cancel all changes
commonSave(): Method for commonSave validations
getTab(param: String): Method for routing tabs
*/

import { Component, OnInit, ViewChild } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { SetupClientPreferenceService } from './setupclentpre.service';
import { ToastrService } from 'ngx-toastr';
import { TabsetComponent } from 'ngx-bootstrap';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-setupclient-popup',
  templateUrl: './setupclientpre.html',
  providers: [SetupClientPreferenceService],
  styleUrls: ['./setupclientpre.css']
})
export class SetupClientPreferenceComponent implements OnInit {
  isClassVisible: any = false;
  activeTab: any;
  activeTab2 = [false, false, false, false, false];
  activeTabClass = ['active', '', '', '', ''];
  // Client fields
  quickAddAllow = false;
  quickaddprimaryphone = false;
  quickaddmobilephone = false;
  quickaddbirthdate = false;
  quickaddmailingaddress = false;
  quickaddprimaryemail = false;
  quickaddsecondaryemail = false;
  quickaddgender = false;
  clientcardprimaryphone = false;
  clientcardmobilephone = false;
  clientcardbirthdate = false;
  clientcardmailingaddress = false;
  clientcardprimaryemail = false;
  clientcardsecondaryemail = false;
  clientcardgender = false;
  onlinebookingnewreg = false;
  onlinebookingmobilephone = false;
  setupClientData1 = false;
  clientpref: any = {};
  clientPrefenceDetails: any = {};
  toastermessage: any;
  onlineBooking: any;
  clientCard: any;
  clientQuick: any;
  // visit types
  checkBox1 = false;
  checkBox2 = false;
  checkBox3 = false;
  checkBox4 = false;
  checkBox5 = false;
  checkBox6 = false;
  checkBox7 = false;
  checkBox8 = false;
  checkBox9 = false;
  checkBox10 = false;
  textBox1: any;
  textBox2: any;
  textBox3: any;
  textBox4: any;
  textBox5: any;
  textBox6: any;
  textBox7: any;
  textBox8: any;
  textBox9: any;
  textBox10: any;
  visitTypes: any = {};
  setupClientData: any;
  active: any;
  visitTypesss: any;
  error: any;
  error1: any;
  visitTypesData0: any;
  visitTypesData1: any;
  visitTypesData2: any;
  visitTypesData3: any;
  visitTypesData4: any;
  visitTypesData5: any;
  visitTypesData6: any;
  visitTypesData7: any;
  visitTypesData8: any;
  visitTypesData9: any;
  checkBoxs0: any;
  checkBoxs1: any;
  checkBoxs2: any;
  checkBoxs3: any;
  checkBoxs4: any;
  checkBoxs5: any;
  checkBoxs6: any;
  checkBoxs7: any;
  checkBoxs8: any;
  checkBoxs9: any;
  Uniqueness: any;
  // client flags
  checkBox0 = false;
  checkBox11 = false;
  checkBox12 = false;
  checkBox13 = false;
  checkBox14 = false;
  checkBox15 = false;
  checkBox16 = false;
  checkBox17 = false;
  checkBox18 = false;
  textBox0: any;
  textBox11: any;
  textBox12: any;
  textBox13: any;
  textBox14: any;
  textBox15: any;
  textBox16: any;
  textBox17: any;
  textBox18: any;
  error0: any;
  clientFlags0: any;
  clientFlags1: any;
  clientFlags2: any;
  clientFlags3: any;
  clientFlags4: any;
  clientFlags5: any;
  clientFlags6: any;
  clientFlags7: any;
  clientFlags8: any;
  Uniqueness1: any;
  Required: any;
  // Occupations
  ocError: any;
  OccupationList: any;
  listOcc: any;
  setupOCCupation: any;
  occupations: any;
  occupationName: any;
  // inputs: any;
  Uniqueness2: any;
  Required2: any;
  isDuplicate: any;

  concat: any;
  // active: any;
  name: any;
  inputs: any = [];
  clientFlags: any = {};
  setupClientData2: any;
  // mobile carriers
  mobileCarrierValues: any;
  mobileCarriersList: any;
  mobileInputs = [];
  addDiv = false;
  // editDiv = false;
  hideTable = true;
  setupMobileData: any;
  mobileCarrierListValue1 = '';
  inputCheck1 = false;
  Required3: any;
  Uniqueness3: any;
  mobileData = [];
  mobileError: any;
  mobileCarrier: any = {};
  @ViewChild('staticTabs') staticTabs: TabsetComponent;
  selectTab(tab_id: number) {
    this.staticTabs.tabs[tab_id].active = true;
  }
  disableEnable() {
    this.staticTabs.tabs[0].disabled = !this.staticTabs.tabs[0].disabled;
    this.staticTabs.tabs[0].active = true;
  }
  addInput() {
    this.inputs.push({});
  }
  constructor(private setupClientPreferenceService: SetupClientPreferenceService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private router: Router) {

  }
  /*method to page load */
  ngOnInit() {
    // client fields
    this.listClientFields();
    // visit types
    this.listVisitTypes();
    // client flags
    this.listClientFlags();
    // occupations
    this.listOccupation();
    // mobile carriers
    this.mobileCarriernamesData();
    this.getMobileCarriersData();
    this.updateTabs(0);
  }
  /*client fields method start */
  /*--- This Method lists Client Fields ---*/
  listClientFields() {
    this.setupClientPreferenceService.getClientFields().subscribe(
      data => {
        const clientFeilds = data['result'];
        clientFeilds.forEach((obj, i) => {
          const clientFeildData = JSON.parse(obj.JSON__c);
          if (obj.Name === 'Client Quick Add Required Fields') {
            this.quickaddprimaryphone = clientFeildData.primaryPhone;
            this.quickaddsecondaryemail = clientFeildData.secondaryEmail;
            this.quickaddprimaryemail = clientFeildData.primaryEmail;
            this.quickaddmobilephone = clientFeildData.mobilePhone;
            this.quickaddmailingaddress = clientFeildData.mailingAddress;
            this.quickaddgender = clientFeildData.gender;
            this.quickaddbirthdate = clientFeildData.birthDate;
            this.quickAddAllow = clientFeildData.allowQuickAdd;
          } else if (obj.Name === 'Client Card Required Fields') {
            this.clientcardprimaryphone = clientFeildData.primaryPhone;
            this.clientcardmobilephone = clientFeildData.mobilePhone;
            this.clientcardbirthdate = clientFeildData.birthDate;
            this.clientcardmailingaddress = clientFeildData.mailingAddress;
            this.clientcardprimaryemail = clientFeildData.primaryEmail;
            this.clientcardsecondaryemail = clientFeildData.secondaryEmail;
            this.clientcardgender = clientFeildData.gender;
          } else if (obj.Name === 'Online Booking Required Fields') {
            this.onlinebookingnewreg = clientFeildData.newRegistrationsRequireApproval;
            this.onlinebookingmobilephone = clientFeildData.mobilePhone;
          } else {

          }
        });





      },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (status) {
          case 500:
            break;
          case 400:
            if (statuscode === '2085' || statuscode === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                this.router.navigate(['/']).then(() => { });
              }
            }
            break;
        }
      }
    );
  }
  /*client fields method end */

  /*visit type methods end */
  /*This function lists Client Visit Types*/
  public listVisitTypes() {
    this.setupClientPreferenceService.getVisitTypes().subscribe(
      data => {
        this.visitTypesData0 = data['result'][0].visitType;
        this.checkBoxs0 = data['result'][0].active;
        this.visitTypesData1 = data['result'][1].visitType;
        this.checkBoxs1 = data['result'][1].active;
        this.visitTypesData2 = data['result'][2].visitType;
        this.checkBoxs2 = data['result'][2].active;
        this.visitTypesData3 = data['result'][3].visitType;
        this.checkBoxs3 = data['result'][3].active;
        this.visitTypesData4 = data['result'][4].visitType;
        this.checkBoxs4 = data['result'][4].active;
        this.visitTypesData5 = data['result'][5].visitType;
        this.checkBoxs5 = data['result'][5].active;
        this.visitTypesData6 = data['result'][6].visitType;
        this.checkBoxs6 = data['result'][6].active;
        this.visitTypesData7 = data['result'][7].visitType;
        this.checkBoxs7 = data['result'][7].active;
        this.visitTypesData8 = data['result'][8].visitType;
        this.checkBoxs8 = data['result'][8].active;
        this.visitTypesData9 = data['result'][9].visitType;
        this.checkBoxs9 = data['result'][9].active;
      },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (status) {
          case 500:
            break;
          case 400:
            if (statuscode === '2085' || statuscode === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                this.router.navigate(['/']).then(() => { });
              }
            }
            break;
        }
      }
    );
  }
  clearVisitTypeErrorDuplicate() {
    this.error1 = '';
    this.Uniqueness = '';
  }
  /*visit type methods end */

  /*Client Flag methods start */
  /*This function lists Client flags*/
  public listClientFlags() {
    this.setupClientPreferenceService.getClientFlags().subscribe(
      data => {
        this.clientFlags = data['result'];
        this.textBox0 = data['result'][0].flagName;
        this.checkBox0 = data['result'][0].active;

        this.textBox11 = data['result'][1].flagName;
        this.checkBox11 = data['result'][1].active;

        this.textBox12 = data['result'][2].flagName;
        this.checkBox12 = data['result'][2].active;

        this.textBox13 = data['result'][3].flagName;
        this.checkBox13 = data['result'][3].active;

        this.textBox14 = data['result'][4].flagName;
        this.checkBox14 = data['result'][4].active;

        this.textBox15 = data['result'][5].flagName;
        this.checkBox15 = data['result'][5].active;

        this.textBox16 = data['result'][6].flagName;
        this.checkBox16 = data['result'][6].active;

        this.textBox17 = data['result'][7].flagName;
        this.checkBox17 = data['result'][7].active;

        this.textBox18 = data['result'][8].flagName;
        this.checkBox18 = data['result'][8].active;
      },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (status) {
          case 500:
            break;
          case 400:
            if (statuscode === '2085' || statuscode === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                this.router.navigate(['/']).then(() => { });
              }
            }
            break;
        }
      }
    );
  }
  clearClientFlagsErrorDuplicate() {
    this.error0 = '';
    this.error1 = '';
    this.Uniqueness1 = '';
  }
  /*Client Flags methods end */

  /* Occupations methods starts*/
  /* function lists Client occupations*/
  listOccupation() {
    this.setupClientPreferenceService.getOccupations().subscribe(
      data => {
        this.inputs = data['result'];
        for (let i = 0; i < this.inputs.length; i++) {
          if ((this.inputs[i].active === false || this.inputs[i].active === undefined) && (this.inputs[i].occupationName === '' || this.inputs[i].occupationName === undefined)) {
            this.inputs.splice(i, 1);
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
      }
    );
  }
  clearOccupationErrorDuplicate() {
    this.Required2 = '';
    this.Uniqueness2 = '';
  }
  /*Method to check duplicates in occupations */
  checkIfoccupationNameExists(inputs) {
    const valueArr = this.inputs.map(function (item) {
      return item.occupationName;
    });
    this.isDuplicate = valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) !== idx;
    });
    if (this.isDuplicate === true) {
      this.Uniqueness2 = 'SETUP_CLIENT_PREFERENCES.VALID_OCCUPATION_NAME_FIELD_UNIQUE';
      this.updateTabs(3);
    }
  }
  /* Occupations methods ends*/

  /*Mobile carriers methods starts*/
  /* function lists Client mobile carrier*/
  mobileCarriernamesData() {
    this.setupClientPreferenceService.mobileCarriernames('MOBILE_CARRIERS').subscribe(
      data => {
        this.mobileCarriersList = data['result'];
      },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (status) {
          case 500:
            break;
          case 400:
            if (statuscode === '9961') {
            } else if (statuscode === '2085' || statuscode === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                this.router.navigate(['/']).then(() => { });
              }
            } break;
        }
      }
    );
  }
  getMobileCarriersData() {
    this.setupClientPreferenceService.getMobileData().subscribe(
      data => {
        this.mobileInputs = data['result'];
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
  addMobileInput() {
    this.mobileInputs.push({ 'active': 'true' });
  }
  deleteFieldValue(index) {
    this.mobileInputs.splice(index, 1);
  }

  clearErrMsg() {
    this.mobileError = '';
    this.mobileError = '';
  }
  clearMobileCarrierErrorDuplicateMobile() {
    this.Required3 = '';
    this.Uniqueness3 = '';
  }
  /* Method to check duplicates in mobile carriers */
  checkIfmobileCarrierNameExists(mobileInputs) {
    const valueArr = this.mobileInputs.map(function (item) {
      return item.mobileCarrierName;
    });
    this.isDuplicate = valueArr.some(function (item, idx) {
      return valueArr.indexOf(item) !== idx;
    });
    const rtnVal = this.validMobCar(mobileInputs);
    if (!rtnVal) {
      this.Uniqueness3 = 'SETUP_CLIENT_PREFERENCES.VALID_NOBLANK_MOBILE_CARRIER_NAME_FIELD';
      this.updateTabs(4);
    } else if (this.isDuplicate === true) {
      this.Uniqueness3 = 'SETUP_CLIENT_PREFERENCES.VALID_MOBILECARRIER_NAME_FIELD_UNIQUE';
      this.updateTabs(4);
    }
  }
  /* Mobile carriers methods ends*/

  validMobCar(mobileInputs) {
    let retVal = true;
    if (mobileInputs && mobileInputs.length > 0) {
      for (let i = 0; i < mobileInputs.length; i++) {
        if (!mobileInputs[mobileInputs.length - 1].mobileCarrierName) {
          retVal = false;
        }
      }
    }
    return retVal;
  }

  /*Method for cancel changes */
  cancel() {
    this.router.navigate(['/setup']);
  }

  // COMMON SAVE VALIDATION
  commonSave() {
    this.checkIfoccupationNameExists(this.inputs);
    // if (this.Uniqueness2.length === 0) {
    this.checkIfmobileCarrierNameExists(this.mobileInputs);
    // }
    for (let i = 0; i < this.inputs.length; i++) {
      if ((this.inputs[i].active === true || this.inputs[i].active === 'true') && (this.inputs[i].occupationName === '' || this.inputs[i].occupationName === undefined)) {
        this.Required2 = 'SETUP_CLIENT_PREFERENCES.VALID_NOBLANK_OCCUPATION_NAME_FIELD';
        this.updateTabs(3);
      }
    }
    const tempAr = [];
    tempAr.push(this.visitTypesData0);
    tempAr.push(this.visitTypesData1);
    tempAr.push(this.visitTypesData2);
    tempAr.push(this.visitTypesData3);
    tempAr.push(this.visitTypesData4);
    tempAr.push(this.visitTypesData5);
    tempAr.push(this.visitTypesData6);
    tempAr.push(this.visitTypesData7);
    tempAr.push(this.visitTypesData8);
    tempAr.push(this.visitTypesData9);

    const tempArray = [];
    tempArray.push(this.textBox0);
    tempArray.push(this.textBox11);
    tempArray.push(this.textBox12);
    tempArray.push(this.textBox13);
    tempArray.push(this.textBox14);
    tempArray.push(this.textBox15);
    tempArray.push(this.textBox16);
    tempArray.push(this.textBox17);
    tempArray.push(this.textBox18);


    const filter_sorted_arr = tempAr.filter((string) => string !== '' && string !== undefined && string !== null).map((string) => string.toLowerCase());
    const results = [];
    const isDuplicateForVisitType = filter_sorted_arr.some(function (item, idx) {
      return filter_sorted_arr.indexOf(item) !== idx;
    });

    const sorted_array = tempArray.slice().sort();
    const resultss = [];
    for (let i = 0; i < sorted_array.length - 1; i++) {
      if ((sorted_array[i + 1] === sorted_array[i]) && sorted_array[i] !== '') {
        resultss.push(sorted_array[i]);
      }
    }
    // client flags and visit Types validations
    if (this.checkBoxs0 === true && this.visitTypesData0 === '') {
      this.error1 = 'SETUP_CLIENT_PREFERENCES.VALID_ACTIVE_VISTITYPES_NO_BLANK';
      this.updateTabs(1);
    } else if (this.checkBoxs1 === true && this.visitTypesData1 === '') {
      this.error1 = 'SETUP_CLIENT_PREFERENCES.VALID_ACTIVE_VISTITYPES_NO_BLANK';
      this.updateTabs(1);
    } else if (this.checkBoxs2 === true && this.visitTypesData2 === '') {
      this.error1 = 'SETUP_CLIENT_PREFERENCES.VALID_ACTIVE_VISTITYPES_NO_BLANK';
      this.updateTabs(1);
    } else if (this.checkBoxs3 === true && this.visitTypesData3 === '') {
      this.error1 = 'SETUP_CLIENT_PREFERENCES.VALID_ACTIVE_VISTITYPES_NO_BLANK';
      this.updateTabs(1);
    } else if (this.checkBoxs4 === true && this.visitTypesData4 === '') {
      this.error1 = 'SETUP_CLIENT_PREFERENCES.VALID_ACTIVE_VISTITYPES_NO_BLANK';
      this.updateTabs(1);
    } else if (this.checkBoxs5 === true && this.visitTypesData5 === '') {
      this.error1 = 'SETUP_CLIENT_PREFERENCES.VALID_ACTIVE_VISTITYPES_NO_BLANK';
      this.updateTabs(1);
    } else if (this.checkBoxs6 === true && this.visitTypesData6 === '') {
      this.error1 = 'SETUP_CLIENT_PREFERENCES.VALID_ACTIVE_VISTITYPES_NO_BLANK';
      this.updateTabs(1);
    } else if (this.checkBoxs7 === true && this.visitTypesData7 === '') {
      this.error1 = 'SETUP_CLIENT_PREFERENCES.VALID_ACTIVE_VISTITYPES_NO_BLANK';
      this.updateTabs(1);
    } else if (this.checkBoxs8 === true && this.visitTypesData8 === '') {
      this.error1 = 'SETUP_CLIENT_PREFERENCES.VALID_ACTIVE_VISTITYPES_NO_BLANK';
      this.updateTabs(1);
    } else if (this.checkBoxs9 === true && this.visitTypesData9 === '') {
      this.error1 = 'SETUP_CLIENT_PREFERENCES.VALID_ACTIVE_VISTITYPES_NO_BLANK';
      this.updateTabs(1);
    } else if (this.checkBox0 === true && this.textBox0 === '') {
      this.error0 = 'SETUP_CLIENT_PREFERENCES.VALID_ACTIVE_CLIENTFLAGS_NO_BLANK';
      this.updateTabs(1);
    } else if (this.textBox0.length > 40) {
      this.error0 = 'SETUP_CLIENT_PREFERENCES.VALID_LIMIT_CLIENTFLAGS_FIELD';
      this.updateTabs(2);
    } else if (this.checkBox11 === true && this.textBox11 === '') {
      this.error0 = 'SETUP_CLIENT_PREFERENCES.VALID_ACTIVE_CLIENTFLAGS_NO_BLANK';
      this.updateTabs(2);
    } else if (this.textBox11.length > 40) {
      this.error0 = 'SETUP_CLIENT_PREFERENCES.VALID_LIMIT_CLIENTFLAGS_FIELD';
      this.updateTabs(2);
    } else if (this.checkBox12 === true && this.textBox12 === '') {
      this.error0 = 'SETUP_CLIENT_PREFERENCES.VALID_ACTIVE_CLIENTFLAGS_NO_BLANK';
      this.updateTabs(2);
    } else if (this.textBox12.length > 40) {
      this.error0 = 'SETUP_CLIENT_PREFERENCES.VALID_LIMIT_CLIENTFLAGS_FIELD';
      this.updateTabs(2);
    } else if (this.checkBox13 === true && this.textBox13 === '') {
      this.error0 = 'SETUP_CLIENT_PREFERENCES.VALID_ACTIVE_CLIENTFLAGS_NO_BLANK';
      this.updateTabs(2);
    } else if (this.textBox13.length > 40) {
      this.error0 = 'SETUP_CLIENT_PREFERENCES.VALID_LIMIT_CLIENTFLAGS_FIELD';
      this.updateTabs(2);
    } else if (this.checkBox14 === true && this.textBox14 === '') {
      this.error0 = 'SETUP_CLIENT_PREFERENCES.VALID_ACTIVE_CLIENTFLAGS_NO_BLANK';
      this.updateTabs(2);
    } else if (this.textBox14.length > 40) {
      this.error0 = 'SETUP_CLIENT_PREFERENCES.VALID_LIMIT_CLIENTFLAGS_FIELD';
      this.updateTabs(2);
    } else if (this.checkBox15 === true && this.textBox15 === '') {
      this.error0 = 'SETUP_CLIENT_PREFERENCES.VALID_ACTIVE_CLIENTFLAGS_NO_BLANK';
      this.updateTabs(2);
    } else if (this.textBox15.length > 40) {
      this.error0 = 'SETUP_CLIENT_PREFERENCES.VALID_LIMIT_CLIENTFLAGS_FIELD';
      this.updateTabs(2);
    } else if (this.checkBox16 === true && this.textBox16 === '') {
      this.error0 = 'SETUP_CLIENT_PREFERENCES.VALID_ACTIVE_CLIENTFLAGS_NO_BLANK';
      this.updateTabs(2);
    } else if (this.textBox16.length > 40) {
      this.error0 = 'SETUP_CLIENT_PREFERENCES.VALID_LIMIT_CLIENTFLAGS_FIELD';
      this.updateTabs(2);
    } else if (this.checkBox17 === true && this.textBox17 === '') {
      this.error0 = 'SETUP_CLIENT_PREFERENCES.VALID_ACTIVE_CLIENTFLAGS_NO_BLANK';
      this.updateTabs(2);
    } else if (this.textBox17.length > 40) {
      this.error0 = 'SETUP_CLIENT_PREFERENCES.VALID_LIMIT_CLIENTFLAGS_FIELD';
      this.updateTabs(2);
    } else if (this.checkBox18 === true && this.textBox18 === '') {
      this.error0 = 'SETUP_CLIENT_PREFERENCES.VALID_ACTIVE_CLIENTFLAGS_NO_BLANK';
      this.updateTabs(2);
    } else if (this.textBox18.length > 40) {
      this.error0 = 'SETUP_CLIENT_PREFERENCES.VALID_LIMIT_CLIENTFLAGS_FIELD';
      this.updateTabs(2);
    } else if ((this.Required2 === undefined || this.Required2 === '' || this.Required2 === 'undefined') &&
      (this.Uniqueness2 === undefined || this.Uniqueness2 === '' || this.Uniqueness2 === 'undefined')
      && (this.Uniqueness3 === undefined || this.Uniqueness3 === '' || this.Uniqueness3 === 'undefined')) {
      if (isDuplicateForVisitType) {
        this.Uniqueness = 'SETUP_CLIENT_PREFERENCES.VALID_VISITTYPES_NAME_FIELD_UNIQUE';
      } else if (resultss.length > 0) {
        this.Uniqueness1 = 'SETUP_CLIENT_PREFERENCES.VALID_CLENTFLAGS_NAME_FIELD_UNIQUE';
      } else {
        // createClientFields() validations
        this.clientPrefenceDetails = {
          clientPrefenceDetails: {
            quickAddRequiredFields: {
              'allowQuickAdd': this.quickAddAllow,
              'primaryPhone': this.quickaddprimaryphone,
              'mobilePhone': this.quickaddmobilephone,
              'birthDate': this.quickaddbirthdate,
              'mailingAddress': this.quickaddmailingaddress,
              'primaryEmail': this.quickaddprimaryemail,
              'secondaryEmail': this.quickaddsecondaryemail,
              'gender': this.quickaddgender
            },
            clientCardRequiredFields: {
              'primaryPhone': this.clientcardprimaryphone,
              'mobilePhone': this.clientcardmobilephone,
              'birthDate': this.clientcardbirthdate,
              'mailingAddress': this.clientcardmailingaddress,
              'primaryEmail': this.clientcardprimaryemail,
              'secondaryEmail': this.clientcardsecondaryemail,
              'gender': this.clientcardgender
            },
            onlineBookingRequiredFields: {
              'newRegistrationsRequireApproval': this.onlinebookingnewreg,
              'mobilePhone': this.onlinebookingmobilephone
            }
          }
        };
        // ocupations
        const occupationsData = [
          {
            occupationName: this.inputs
          }
        ];
        const occupations1 = this.inputs;
        const occupationsss = {
          occupations: occupations1
        };
        // mobile carriers
        const mobileData = [{
          mobileData: this.mobileInputs
        }];
        const mobileCarrier1 = this.mobileInputs;
        const mobileCarrier = {
          mobileCarrier: mobileCarrier1
        };
        // visit types
        this.visitTypesss = [
          { active: this.checkBoxs0, isSystem: null, visitType: this.visitTypesData0 },
          { active: this.checkBoxs1, isSystem: null, visitType: this.visitTypesData1 },
          { active: this.checkBoxs2, isSystem: null, visitType: this.visitTypesData2 },
          { active: this.checkBoxs3, isSystem: null, visitType: this.visitTypesData3 },
          { active: this.checkBoxs4, isSystem: null, visitType: this.visitTypesData4 },
          { active: this.checkBoxs5, isSystem: null, visitType: this.visitTypesData5 },
          { active: this.checkBoxs6, isSystem: null, visitType: this.visitTypesData6 },
          { active: this.checkBoxs7, isSystem: null, visitType: this.visitTypesData7 },
          { active: this.checkBoxs8, isSystem: null, visitType: this.visitTypesData8 },
          { active: this.checkBoxs9, isSystem: null, visitType: this.visitTypesData9 }
        ];
        // client flags
        this.clientFlags = [
          { flagName: this.textBox0, active: this.checkBox0 },
          { flagName: this.textBox11, active: this.checkBox11 },
          { flagName: this.textBox12, active: this.checkBox12 },
          { flagName: this.textBox13, active: this.checkBox13 },
          { flagName: this.textBox14, active: this.checkBox14 },
          { flagName: this.textBox15, active: this.checkBox15 },
          { flagName: this.textBox16, active: this.checkBox16 },
          { flagName: this.textBox17, active: this.checkBox17 },
          { flagName: this.textBox18, active: this.checkBox18 }
        ];
        this.setupClientPreferenceService.setupClientFields(this.clientPrefenceDetails).subscribe(
          data => {
            this.setupClientData1 = data['data'];
          },
          error => {
            const status = JSON.parse(error['status']);
            const statuscode = JSON.parse(error['_body']).status;
            switch (status) {
              case 500:
                break;
              case 400:
                if (statuscode === '9961') {
                } else if (statuscode === '2085' || statuscode === '2071') {
                  if (this.router.url !== '/') {
                    localStorage.setItem('page', this.router.url);
                    this.router.navigate(['/']).then(() => { });
                  }
                } break;
            }
          });
        this.setupClientPreferenceService.postVisitTypes(this.visitTypesss).subscribe(
          data => {
            this.setupClientData = data['data'];
          },
          error => {
            const status = JSON.parse(error['status']);
            const statuscode = JSON.parse(error['_body']).status;
            switch (JSON.parse(error['_body']).status) {
              case '2049':
              //     this.Uniqueness = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
              //    // this.toastr.warning('Duplicate record found', null, { timeOut: 1500 });
              //      window.scrollTo(0, 0);
              // this.Uniqueness = 'Duplicate record found';
              //     break;
            }
            if (statuscode === '2085' || statuscode === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                this.router.navigate(['/']).then(() => { });
              }
            }
          });

        this.setupClientPreferenceService.postClientFlags(this.clientFlags).subscribe(
          data => {
            this.setupClientData2 = data['data'];
          },
          error => {
            const status = JSON.parse(error['status']);
            const statuscode = JSON.parse(error['_body']).status;
            // switch (JSON.parse(error['_body']).status) {
            //   case '2050':
            //     // this.Required = 'Fields cannot be blank';
            //     break;
            //   case '2051':
            //     //     this.Uniqueness1 = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
            //     //     this.toastr.warning('Duplicate record found', null, { timeOut: 1500 });
            //     // this.Uniqueness1 = 'Duplicate record found';
            // }
            if (statuscode === '2085' || statuscode === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                this.router.navigate(['/']).then(() => { });
              }
            }
          });

        this.setupClientPreferenceService.postOccupations(occupationsss).subscribe(
          data => {
            this.setupOCCupation = data['data'];
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
        this.setupClientPreferenceService.postMobileData(mobileCarrier).subscribe(
          data => {
            this.setupMobileData = data['data'];
            this.hideTable = true;
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
        this.router.navigate(['/setup']);
        this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_SUCCESS');
        this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
      } // else end here
    } // else if end here
  } // commonSave end here

  /*Method for Routing */
  updateTabs(order: number) {
    for (let i = 0; i < this.activeTab2.length; i++) {
      if (i === order) {
        this.activeTab2[i] = true;
        this.activeTabClass[i] = 'active';
      } else {
        this.activeTab2[i] = false;
        this.activeTabClass[i] = '';
      }
    }
  }
}
