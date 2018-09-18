import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { MarketingSetsService } from './marketingsets.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { CommonService } from '../../common/common.service';
import { isNullOrUndefined } from 'util';
import { DatePipe } from '@angular/common';
import { JwtHelper } from 'angular2-jwt';
@Component({
  selector: 'app-setuprewards-app',
  templateUrl: './marketingsets.html',
  styleUrls: ['./marketingsets.component.css'],
  providers: [MarketingSetsService, CommonService],
})
export class MarketingSetsComponent implements OnInit {
  addDiv = false;
  editDiv = false;
  hideTable = true;
  disableDiv = true;
  marketingUserList: any;
  showInactiveData: any = false;
  activeStatus: any = false;
  merketingSetName: any;
  marketingFrequency: any;
  marketingGenereteEvery: any;
  outputMarketing: any;
  marketingEmail: any = {};
  nextGenerationEvery: any;
  marketingTimes: any;
  updateActiveStatus: any;
  updateMerketingSetName: any;
  updateMarketingFrequency: any;
  updateMarketingGenereteEvery: any;
  updateOutputMarketing: any;
  updateMarketingEmail: any;
  updateNextGenerationEvery: any;
  resEmail = false;
  updateLastGeneration: any;
  marketingError: any;
  error: any;
  marketingSetData: any = {};
  updateMarketingSetData: any = {};
  marketingData: any;
  toastermessage: any;
  frequencyData: any;
  outputData: any;
  TimeData: any;
  emailData: any;
  datePickerConfig: any;
  updateMarketingTimes: any;
  marketingSetId: any = '';
  minDate = new Date();
  decodedToken: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private setsService: MarketingSetsService,
    private commonService: CommonService) {
    this.datePickerConfig = Object.assign({},
      {
        showWeekNumbers: false,
        containerClass: 'theme-blue',
      });

  }
  ngOnInit() {
    // ---Start of code for Permissions Implementation--- //
    try {
      this.decodedToken = new JwtHelper().decodeToken(localStorage.getItem('rights'));
  } catch (error) {
      this.decodedToken = {};
  }
  if (this.decodedToken.data && this.decodedToken.data.permissions) {
      this.decodedToken = JSON.parse(this.decodedToken.data.permissions);
  } else {
      this.decodedToken = {};
  }
  // ---End of code for permissions Implementation--- //
    this.getMarketingUserList();
    this.getFreaquency();
    this.getOutput();
    this.getTimes();
    this.getMarketingEmail();
    // this.getPreferenceByName();
  }
  /*Method used to get userlist */
  getMarketingUserList() {
    this.setsService.getMarketingUserList()
      .subscribe(data => {
        this.marketingUserList = data['result'];
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
  getFreaquency() {
    this.setsService.getFreaquencyTypes().subscribe(
      data => {
        this.frequencyData = data['marketingfrequency'];
        const type = this.frequencyData[0].type;
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
  getOutput() {
    this.setsService.getOutputTypes().subscribe(
      data => {
        this.outputData = data['marketingoutput'];
        const type = this.outputData[0].type;
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
  getMarketingEmail() {
    this.setsService.getEmailTypes().subscribe(
      data => {
        this.emailData = data['marketingemail'];
        const name = this.emailData[0].name;
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

  // getEmailList(name, value) {
  //   const myblob = new Blob([name + ':' + value], {
  //     type: 'text/plain'
  //   });
  //   this.convertTobase64(myblob);
  // }
  // convertTobase64(myblob) {
  //   let encryptedData;
  //   const mailList = (bs64) => {
  //     this.setsService.getEmailList(bs64).subscribe((data) => {
  //     },
  //     error => {
  //         const errStatus = JSON.parse(error['_body'])['status'];
  //         if (errStatus === '2085' || errStatus === '2071') {
  //           if (this.router.url !== '/') {
  //             localStorage.setItem('page', this.router.url);
  //             this.router.navigate(['/']).then(() => { });
  //           }
  //         }
  //     });
  //   };
  //   const reader = new FileReader();

  //   reader.addEventListener('load', function () {
  //     encryptedData = reader.result;
  //     //mailList(encryptedData.split(',')[1]);
  //   }, false);
  //   if (myblob) {
  //     reader.readAsDataURL(myblob);
  //   }
  // }

  // getPreferenceByName() {
  //   this.setsService.getPreference('Email App Subuser').subscribe(
  //     data => {
  //       if (!isNullOrUndefined(data)) {
  //         // const userName = data['result']['Text__c'];
  //         // const referCode = data['result']['Encrypted__c'];
  //         // this.getEmailList(userName, referCode);
  //       }
  //     },
  //     error => {
  //         const errStatus = JSON.parse(error['_body'])['status'];
  //         if (errStatus === '2085' || errStatus === '2071') {
  //           if (this.router.url !== '/') {
  //             localStorage.setItem('page', this.router.url);
  //             this.router.navigate(['/']).then(() => { });
  //           }
  //         }
  //     });
  // }
  getTimes() {
    this.setsService.getTimeHour().subscribe(
      data => {
        this.TimeData = data['marketingtimes'];
        const value = this.TimeData[0].value;
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
  /*Method used to get inactive clients data */
  showInActive() {
    this.showInactiveData = !this.showInactiveData;
  }
  /*Method used to show add div */
  addNew() {
    this.clear();
    this.addDiv = true;
    this.hideTable = false;
    this.disableDiv = false;
    this.outputMarketing = 'Email';
    this.output(this.outputMarketing);
  }
  output(type) {
    if (type === 'Email') {
      this.resEmail = true;
      this.marketingEmail.External_Email_Name__c = this.emailData[0].name;
    } else if (type === 'Online Report') {
      this.resEmail = false;
      this.marketingEmail = {};
    }
  }
  changeType(value) {
  }
  // validations
  marketingSetsData() {
    if (this.marketingEmail.External_Email_Name__c === 'undefined') {
      this.marketingEmail.External_Email_Name__c = '';
    }
    if (this.marketingEmail.External_Email_ID__c === 'undefined') {
      this.marketingEmail.External_Email_ID__c = '';
    }
    if (this.merketingSetName === '' || this.merketingSetName === undefined) {
      this.marketingError = 'MARKETING_SETS.NO_BLANK_MARKETING_SET_NAME';
    } else if (this.marketingFrequency === '' || this.marketingFrequency === undefined || this.marketingFrequency === '--None--') {
      this.marketingError = 'MARKETING_SETS.NO_BLANK_FREQUENCY';
    } else if (this.marketingGenereteEvery < 1 || this.marketingGenereteEvery > 31) {
      this.marketingError = 'MARKETING_SETS.INVALID_GENERETE_EVERY';
    } else {
      let Filters: any = [];
      if (this.activeStatus) {
        Filters = [{ 'filterType': 'Boolean', 'filterName': 'Active', 'booleanValue': true }];
      }
      this.marketingSetData = {
        'Active__c': this.activeStatus,
        'Name': this.merketingSetName,
        'Frequency__c': this.marketingFrequency,
        'Generate_Every__c': this.marketingGenereteEvery,
        'Output__c': this.outputMarketing,
        'External_Email_Name__c': this.marketingEmail.External_Email_Name__c,
        'External_Email_ID__c': this.marketingEmail.External_Email_ID__c,
        'Filters__c': JSON.stringify(Filters)
        // 'Next_Generation__c': this.nextGenerationEvery + ' ' + this.marketingTimes,
      };
      if (!isNullOrUndefined(this.nextGenerationEvery) && this.nextGenerationEvery !== '') {
        if (!isNullOrUndefined(this.marketingTimes) && this.marketingTimes !== '') {
          const time = this.timeConversion(this.marketingTimes);
          const next_generation: Date = this.setDateAccToTime(this.nextGenerationEvery, time.hours, time.minutes);
          this.marketingSetData['Next_Generation__c'] = this.commonService.getDBDatTmStr(next_generation);
        } else {
          // At no selected next generation time 7:00 Am is the  default  time
          const time = this.timeConversion(this.TimeData[0].value);
          const next_generation: Date = this.setDateAccToTime(this.nextGenerationEvery, time.hours, time.minutes);
          this.marketingSetData['Next_Generation__c'] = this.commonService.getDBDatTmStr(next_generation);
        }
      } else {
        this.marketingSetData['Next_Generation__c'] = null;
      }
      if (this.marketingSetId === '') {
        this.setsService.MarketingSetsService(this.marketingSetData).subscribe(
          data => {
            this.marketingData = data['data'];
            this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_CREATE_SUCCESS');
            this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
            this.disableDiv = true;
            this.hideTable = true;
            this.addDiv = false;
            this.editDiv = false;
            this.getMarketingUserList();
            this.clear();
          },
          error => {
            const status = JSON.parse(error['status']);
            const statuscode = JSON.parse(error['_body']).status;
            switch (status) {
              case 500:
                break;
              case 400:
                if (statuscode === '2076') {
                  this.marketingError = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                  window.scrollTo(0, 0);
                } else if (statuscode === '2085' || statuscode === '2071') {
                  if (this.router.url !== '/') {
                    localStorage.setItem('page', this.router.url);
                    this.router.navigate(['/']).then(() => { });
                  }
                } break;
            }
          });
      } else {
        this.setsService.updateMarketingSetsService(this.marketingSetData, this.marketingSetId).subscribe(
          data => {
            this.marketingData = data['data'];
            this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_UPDATE_SUCCESS');
            this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
            this.disableDiv = true;
            this.hideTable = true;
            this.addDiv = false;
            this.editDiv = false;
            this.getMarketingUserList();
            this.clear();
          },
          error => {
            const status = JSON.parse(error['status']);
            const statuscode = JSON.parse(error['_body']).status;
            switch (status) {
              case 500:
                break;
              case 400:
                if (statuscode === '2076') {
                  this.marketingError = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                  window.scrollTo(0, 0);
                } else if (statuscode === '2085' || statuscode === '2071') {
                  if (this.router.url !== '/') {
                    localStorage.setItem('page', this.router.url);
                    this.router.navigate(['/']).then(() => { });
                  }
                } break;
            }
          });
      }
    }
  } // validationsend

  timeConversion(time: string): { 'hours': number, 'minutes': number } {
    let hours: any;
    const minutes = +time.split(' ')[0].split(':')[1];
    if (time.split(' ')[1] === 'AM') {
      hours = +time.split(' ')[0].split(':')[0];
      if (+hours === 12) {
        hours = 0;
      }
    } else if (time.split(' ')[1] === 'PM') {
      hours = time.split(' ')[0].split(':')[0];
      if (parseInt(hours, 10) !== 12) {
        hours = parseInt(hours, 10) + 12;
      }
    }
    return { 'hours': +hours, 'minutes': +minutes };
  }

  setDateAccToTime(date: Date, hours: number, minutes: number) {
    return new Date(date.getFullYear(), date.getMonth(), date.getDate(), hours, minutes, 0);
  }

  getTimeFromDate(date: Date) {
    return new DatePipe('en-Us').transform(date, 'h:mm a');
  }

  showData(marketingSetData) {
    this.addDiv = true;
    this.editDiv = false;
    this.disableDiv = false;
    this.hideTable = false;
    this.marketingSetId = marketingSetData.Id;
    this.activeStatus = marketingSetData.Active__c;
    this.merketingSetName = marketingSetData.Name;
    this.marketingFrequency = marketingSetData.Frequency__c;
    this.marketingGenereteEvery = marketingSetData.Generate_Every__c;
    this.outputMarketing = marketingSetData.Output__c;
    this.resEmail = this.outputMarketing === 'Email' ? true : false;
    this.marketingEmail.External_Email_Name__c = marketingSetData.External_Email_Name__c;
    this.marketingEmail.External_Email_ID__c = marketingSetData.External_Email_ID__c;
    if (!isNullOrUndefined(marketingSetData.Next_Generation__c) && marketingSetData.Next_Generation__c !== '') {
      this.nextGenerationEvery = new Date(marketingSetData.Next_Generation__c);
      this.marketingTimes = this.getTimeFromDate(this.nextGenerationEvery);
    } else {
      this.marketingTimes = '';
      this.nextGenerationEvery = null;
    }

  }

  // edit validations
  deleteMarketingSetsData() {
    this.setsService.deleteMarketingSetsService(this.marketingSetId, this.merketingSetName).subscribe(
      data => {
        this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_DELETE_SUCCESS');
        this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
        this.disableDiv = true;
        this.hideTable = true;
        this.addDiv = false;
        this.editDiv = false;
        this.getMarketingUserList();
        this.clear();
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
      });

  }// edit validations end

  clearErrorMsg() {
    this.marketingError = '';
  }
  clear() {
    this.activeStatus = '';
    this.merketingSetName = '';
    this.marketingFrequency = '';
    this.marketingGenereteEvery = '';
    this.outputMarketing = '';
    this.marketingEmail = {};
    this.nextGenerationEvery = null;
    this.marketingTimes = '';
    this.marketingSetId = '';
    this.clearErrorMsg();

  }
  cancel() {
    this.addDiv = false;
    this.editDiv = false;
    this.hideTable = true;
    this.disableDiv = true;
    this.clear();
  }

  goToSelectFilters() {
    this.router.navigate(['/marketing/client/filters/' + this.marketingSetId]);
  }
  /* method to restrict specialcharecters  */
 numOnly(event: any) {
  const pattern = /[0-9]/;
  const inputChar = String.fromCharCode(event.charCode);
  if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
  }
}


} // main
