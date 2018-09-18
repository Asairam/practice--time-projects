import { Component, OnInit } from '@angular/core';
import { MarketingClientFilterService } from './marketingclientfilters.service';
import { ActivatedRoute, Router } from '@angular/router';
import { isNullOrUndefined } from 'util';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { CommonService } from '../../common/common.service';
@Component({
  selector: 'app-marketing-client-filters',
  templateUrl: './marketingclientfilters.component.html',
  styleUrls: ['./marketingclientfilters.component.css'],
  providers: [MarketingClientFilterService, CommonService]
})
export class MarketingClientFiltersComponent implements OnInit {

  public filterSelected: any = '';
  public serviceGroupList: any = [];
  public workersList: any = [];
  public servicesList: any = [];
  public clientId: any;
  public clientFilterData: Array<any> = [];
  public clientFlags: any = {};
  public clientFlagsList: Array<any> = [];
  public numbers = [];
  public datePickerConfig: any;
  public workerName: any;
  public error: any = '';
  public currentDate = new Date();
  public daysInAMonth = 0;
  public apptTypes = [{ name: 'Any', value: 'Any' },
  { name: 'First Visit', value: 'First Visit' },
  { name: 'Last Visit', value: 'Last Visit' }
  ];
  public isUpdatingFilter = false;
  public filterIndex: number;
  constructor(private marketingClientFilterService: MarketingClientFilterService,
    private router: ActivatedRoute,
    private route: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private commonService: CommonService) { }
  ngOnInit() {
    this.datePickerConfig = Object.assign({},
      {
        showWeekNumbers: false,
        containerClass: 'theme-blue',
      });
    for (let i = 0; i <= 31; i++) {
      this.numbers.push(i);
    }
    this.clientFlags = this.init();
    this.router.paramMap.subscribe((params) => {
      this.clientId = params.get('id');
    });
    this.getMarketingSetsById(this.clientId);
    this.getServiceGroups();
    this.getWorkersList();
    this.getAllSetupServices();
    this.getClientFlags();
  }

  selectFilterParam(name: string, type?: string) {
    this.error = '';
    this.filterSelected = name;
    this.isUpdatingFilter = false;
    // this.clientFlags[type] = this.init(type);
  }

  // Method for service groups
  getServiceGroups() {
    this.marketingClientFilterService.getServiceGroups().subscribe(data => {
      this.serviceGroupList = data['result'];
    },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (JSON.parse(error['_body']).status) {
          case '2033':
            break;
        }
        if (statuscode === '2085' || statuscode === '2071') {
          if (this.route.url !== '/') {
            localStorage.setItem('page', this.route.url);
            this.route.navigate(['/']).then(() => { });
          }
        }
      });
  }

  getMarketingSetsById(clientId) {
    this.marketingClientFilterService.getMarketingSetById(clientId).subscribe(data => {
      const clientInfo = data['result'];
      if (!isNullOrUndefined(clientInfo.Filters__c) && clientInfo.Filters__c !== '') {
        this.clientFilterData = JSON.parse(clientInfo.Filters__c);
        this.clientFilterData.map((obj1) => {
          if (obj1.filterName === 'Status / Service' || obj1.filterName === 'Was Referred') {
            if (!isNullOrUndefined(obj1.beginDate) && obj1.beginDate !== '') {
              obj1.beginDate = new Date(obj1.beginDate);
            }
            if (!isNullOrUndefined(obj1.endDate) && obj1.endDate !== '') {
              obj1.endDate = new Date(obj1.endDate);
            }
          }
        });
        this.getWorkerName();
        this.isAddedToClientFilters();
      } else {
        this.clientFilterData = [];
      }
    },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (JSON.parse(error['_body']).status) {
          case '2033':
            break;
        }
        if (statuscode === '2085' || statuscode === '2071') {
          if (this.route.url !== '/') {
            localStorage.setItem('page', this.route.url);
            this.route.navigate(['/']).then(() => { });
          }
        }
      });
  }

  getWorkerName() {
    if (isNullOrUndefined(this.workerName)) {
      this.clientFilterData.filter((filterData) => filterData.filterName === 'Status / Service').map((obj) => {
        if (obj.worker && obj.worker !== '') {
          this.assaignWorkerNameById(obj.worker);
        }
      });
    }
  }
  getWorkersList() {
    this.marketingClientFilterService.getUserList().subscribe(data => {
      this.workersList = data['result'];
      this.getWorkerName();
    },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (JSON.parse(error['_body']).status) {
          case '2033':
            break;
        }
        if (statuscode === '2085' || statuscode === '2071') {
          if (this.route.url !== '/') {
            localStorage.setItem('page', this.route.url);
            this.route.navigate(['/']).then(() => { });
          }
        }
      });
  }

  getAllSetupServices() {
    this.marketingClientFilterService.getAllSetupServices().subscribe(data => {
      this.servicesList = data['result'];
    },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (JSON.parse(error['_body']).status) {
          case '2033':
            break;
        }
        if (statuscode === '2085' || statuscode === '2071') {
          if (this.route.url !== '/') {
            localStorage.setItem('page', this.route.url);
            this.route.navigate(['/']).then(() => { });
          }
        }
      });
  }
  getClientFlags() {
    this.marketingClientFilterService.getClientFlags().subscribe(
      data => {
        this.clientFlagsList = data['result'];
        this.resetClientFlagData();
      },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (status) {
          case 500:
            break;
          case 400:
          if (statuscode === '2085' || statuscode === '2071') {
            if (this.route.url !== '/') {
              localStorage.setItem('page', this.route.url);
              this.route.navigate(['/']).then(() => { });
            }
          }
            break;
        }
      }
    );
  }

  saveMarketingFilters() {
    const filteredData: any = [];
    this.clientFilterData.filter((obj) => {
      const obj1 = Object.assign({}, obj);
      delete obj1.flag;
      if (obj1.filterName === 'Status / Service' || obj1.filterName === 'Was Referred') {
        if (!isNullOrUndefined(obj1.beginDate) && obj1.beginDate !== '') {
          obj1.beginDate = this.commonService.getDBDatStr(obj1.beginDate);
        }
        if (!isNullOrUndefined(obj1.endDate) && obj1.endDate !== '') {
          obj1.endDate = this.commonService.getDBDatStr(obj1.endDate);
        }
      }
      filteredData.push(obj1);
    });
    const filterData = {
      marketingFilter: JSON.stringify(filteredData)
    };
    this.marketingClientFilterService.saveMarketingFilter(this.clientId, filterData).subscribe(
      data => {
        this.route.navigate(['/marketing/sets']).then(() => {
          const toastermessage: any = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_UPDATE_SUCCESS');
          this.toastr.success(toastermessage.value, null, { timeOut: 1500 });
        });

      }, error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (status) {
          case 500:
            break;
          case 400:
          if (statuscode === '2085' || statuscode === '2071') {
            if (this.route.url !== '/') {
              localStorage.setItem('page', this.route.url);
              this.route.navigate(['/']).then(() => { });
            }
          }
            break;
        }
      });
  }

  isAddedToClientFilters() {
    Object.keys(this.clientFlags).map((key) => {
      this.clientFilterData.map((obj) => {
        if (key === obj.filterName.replace(/\s/g, '')) {
          this.clientFlags[key]['flag'] = false;
        }
      });
    });
  }

  removeFilter(index) {
    const filterName = this.clientFilterData[index]['filterName'].replace(/\s/g, '');
    this.clientFlags[filterName] = this.init(filterName);
    if (filterName === 'ClientFlags') {
      this.resetClientFlagData();
    }
    if (index = this.filterIndex) {
      this.filterSelected = '';
    }
    this.clientFilterData.splice(index, 1);
  }

  resetClientFlagData() {
    if (this.clientFlagsList.length > 0) {
      this.clientFlags['ClientFlags']['stringValue'] = this.clientFlagsList[0]['flagName'];
    }
  }
  addFilter(filterName: string) {
    this.error = '';
    let data: any;
    switch (filterName) {
      case 'Active': {
        data = this.clientFlags['Active'];
        this.isUpdatingFilter ? this.addUpdateFilter(data) : this.clientFilterData.push(data);
      } break;
      case 'Birthdate': {
        data = this.clientFlags['Birthdate'];
        if (data.dateSelector === 'Specified') {
          const isNotExsist = ['yearNumber', 'monthNumber', 'endDay', 'beginDay'].filter((name) => data[name] !== 0 && data[name]).length === 0;
          if (isNotExsist) {
            this.error = 'At least one criteria must specified on the Birthdate filter';
            return;
          } else {
            this.clientFlags['Birthdate']['yearNumber'] = data.yearNumber ? data.yearNumber : 0;
            if (data.yearNumber !== 0 && (data.yearNumber < 1900 || data.yearNumber > 2020)) {
              this.error = 'Year Must be grater than or equal to 1900 and less than or equal to 2020';
              return;
            }
            ['yearNumber', 'monthNumber', 'endDay', 'beginDay'].filter((name) => this.clientFlags['Birthdate'][name] = +data[name]);
            data = this.clientFlags['Birthdate'];
            this.isUpdatingFilter ? this.addUpdateFilter(data) : this.clientFilterData.push(data);
          }
        } else {
          ['yearNumber', 'monthNumber', 'endDay', 'beginDay'].filter((name) => this.clientFlags['Birthdate'][name] = 0);
          data = this.clientFlags['Birthdate'];
          this.isUpdatingFilter ? this.addUpdateFilter(data) : this.clientFilterData.push(data);
        }
      } break;
      case 'PrimaryEmail': {
        data = this.clientFlags['PrimaryEmail'];
        this.isUpdatingFilter ? this.addUpdateFilter(data) : this.clientFilterData.push(data);
      } break;
      case 'ClientFlags': {
        data = this.clientFlags['ClientFlags'];
        this.isUpdatingFilter ? this.addUpdateFilter(data) : this.clientFilterData.push(data);
      } break;
      case 'Gender': {
        if (this.clientFlags['Gender']['genderValue'] === '') {
          this.error = 'Gender Value is required';
          return;
        } else {
          data = this.clientFlags['Gender'];
          this.isUpdatingFilter ? this.addUpdateFilter(data) : this.clientFilterData.push(data);
        }
      } break;
      case 'MyReferrals': {
        this.clientFlags['MyReferrals']['amountValue'] = this.clientFlags['MyReferrals']['amountValue'] ? this.clientFlags['MyReferrals']['amountValue'] : 0;
        data = this.clientFlags['MyReferrals'];
        this.isUpdatingFilter ? this.addUpdateFilter(data) : this.clientFilterData.push(data);
      } break;
      case 'WasReferred': {
        if (this.isHavingDateSelector('WasReferred', 'dateSelector')) {
          data = this.clientFlags['WasReferred'];
          this.isUpdatingFilter ? this.addUpdateFilter(data) : this.clientFilterData.push(data);
          if (data.worker !== 'Any') {
            this.assaignWorkerNameById(data.worker);
          }
        } else {
          return;
        }
      } break;
      case 'Status/Service': {
        data = this.clientFlags['Status/Service'];
        const isNotExsist = ['apptType', 'serviceGroup', 'serviceName', 'worker', 'dateSelector', 'status'].filter((name) => data[name] !== 'Any' && data[name]).length === 0;
        if (isNotExsist) {
          this.error = 'At least one criteria must specified on the Status / Service';
          return;
        } else {
          if (this.isHavingDateSelector('Status/Service', 'dateSelector')) {
            data = this.clientFlags['Status/Service'];
            this.isUpdatingFilter ? this.addUpdateFilter(data) : this.clientFilterData.push(data);
            if (data.worker !== 'Any') {
              this.assaignWorkerNameById(data.worker);
            }
          } else {
            return;
          }

        }

      } break;
      case 'CurrentBalance': {
        this.clientFlags['CurrentBalance']['amountValue'] = this.clientFlags['CurrentBalance']['amountValue'] ? this.clientFlags['CurrentBalance']['amountValue'] : 0;
        data = this.clientFlags['CurrentBalance'];
        this.isUpdatingFilter ? this.addUpdateFilter(data) : this.clientFilterData.push(data);
      } break;
    }
    this.isAddedToClientFilters();
    this.filterSelected = '';
    this.isUpdatingFilter = false;
  }

  init(filterType?: string): any {
    const Flags: any = {
      'Active': {
        flag: true, filterType: 'Boolean', filterName: 'Active',
        booleanValue: false
      },
      'Birthdate': {
        flag: true, filterType: 'Birth Date', filterName: 'Birthdate',
        dateSelector: 'Specified',
        yearNumber: null, monthNumber: 0, endDay: 0, beginDay: 0
      },
      'PrimaryEmail': {
        flag: true, filterType: 'Email', filterName: 'Primary Email',
        validEmail: true, booleanValue: true
      },
      'ClientFlags': {
        flag: true, filterType: 'String', filterName: 'Client Flags', stringValue: ''
      },
      'Gender': {
        flag: true, filterType: 'Gender', filterName: 'Gender', genderValue: ''
      },
      'MyReferrals': {
        flag: true, filterType: 'Amount', filterName: 'My Referrals', comparator: '>', amountValue: null
      },
      'WasReferred': {
        flag: true, filterType: 'String', filterName: 'Was Referred', dateSelector: 'Any',
        beginDate: null, endDate: null
      },
      'Status/Service': {
        flag: true, filterType: 'Appt Status / Service', filterName: 'Status / Service',
        apptType: 'Any', serviceGroup: 'Any', serviceName: 'Any', worker: 'Any',
        status: 'Any', dateSelector: 'Any', beginDate: null, endDate: null
      },
      'CurrentBalance': {
        flag: true, filterType: 'Amount', filterName: 'Current Balance', comparator: '>', amountValue: null
      }
    };

    if (!isNullOrUndefined(filterType)) {
      return Flags[filterType];
    } else {
      return Flags;
    }
  }
  changeTypeInStatus(event) {
    const value = event.target.value;
    if (value !== 'Any') {
      this.clientFlags['Status/Service']['status'] = 'Complete';
    } else {
      this.clientFlags['Status/Service']['status'] = 'Any';
      this.clientFlags['Status/Service']['apptType'] = 'Any';
    }
  }
  serviceChange(event, type: string) {
    const value = event.target.value;
    if (value !== 'Any') {
      if (type === 'service-group') {
        this.clientFlags['Status/Service']['serviceName'] = 'Any';
      } else {
        this.clientFlags['Status/Service']['serviceGroup'] = 'Any';
      }
    }
  }

  changeBirthDay(event) {
    this.clientFlags['Birthdate']['beginDay'] = +this.clientFlags['Birthdate']['beginDay'];
    const birthdate = this.clientFlags['Birthdate'];
    if (isNullOrUndefined(birthdate.beginDay) || +birthdate.beginDay === 0) {
      this.clientFlags['Birthdate']['endDay'] = 0;
    }
  }
  changeWorker(event) {
    const workerId = event.target.value;

  }
  assaignWorkerNameById(workerId) {
    this.workersList.filter((worker) => {
      if (worker.Id === workerId) {
        this.workerName = worker.FirstName + ' ' + worker.LastName;
      }
    });
  }
  cancel() {
    this.route.navigate(['/marketing/sets']);
  }

  IsNumeric(e) {
    const value = e.target.value;
    let ret: boolean;
    const code = e.keyCode === 0 ? e.charCode : e.keyCode;
    const commonCondition: boolean = (code >= 48 && code <= 57) || (code === 8) || code >= 37 && code <= 40;
    if (commonCondition) { // check digits
      ret = true;
    } else {
      ret = false;
    }
    return ret;
  }

  showDatesAccToMonths(event) {
    const monthNumber = event.target.value;
    this.clientFlags['Birthdate']['beginDay'] = 0;
    this.clientFlags['Birthdate']['endDay'] = 0;
    if (monthNumber !== 'null') {
      if (+monthNumber === 2) {
        this.daysInAMonth = 29;
      } else {
        this.daysInAMonth = this.getDaysByMonth(this.currentDate, +monthNumber);
      }
    } else {
      this.daysInAMonth = 0;
    }

  }
  getDaysByMonth(date: Date, month): number {
    const year = date.getFullYear();
    return new Date(year, month, 0).getDate();
  }

  clearError() {
    this.error = '';
  }

  isHavingDateSelector(filterName, type) {
    const apptFilter = this.clientFlags[filterName];
    if (apptFilter[type] === 'Before') {
      if (isNullOrUndefined(apptFilter['beginDate']) || apptFilter['beginDate'] === '') {
        this.error = 'Before date must be selected';
        return false;
      }
    } else if (apptFilter[type] === 'After') {
      if (isNullOrUndefined(apptFilter['beginDate']) || apptFilter['beginDate'] === '') {
        this.error = 'After date must be selected';
        return false;
      }
    } else if (apptFilter[type] === 'Between') {
      if (isNullOrUndefined(apptFilter['beginDate']) || apptFilter['beginDate'] === '' || isNullOrUndefined(apptFilter['endDate']) || apptFilter['endDate'] === '') {
        this.error = 'Begin and end date must be selected';
        return false;
      }
    } else {
      this.clientFlags[filterName]['beginDate'] = null;
      this.clientFlags[filterName]['endDate'] = null;
    }

    return true;

  }

  updateFilter(index, data) {
    this.isUpdatingFilter = true;
    this.filterIndex = index;
    const name = data.filterName.replace(/\s/g, '');
    this.filterSelected = name;
    this.clientFlags[name] = {};
    Object.assign(this.clientFlags[name], data);
  }
  addUpdateFilter(data) {
    this.clientFilterData[this.filterIndex] = data;
    this.isUpdatingFilter = false;
  }
  removeOrAddMaxDate(value, filterName) {
    if (value !== 'Between') {
      this.clientFlags[filterName]['endDate'] = null;
    }
  }
}
