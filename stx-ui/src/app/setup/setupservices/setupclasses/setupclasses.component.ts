import { Component, OnInit, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { SetupClassesService } from './setupclasses.service';
import { ToastrService } from 'ngx-toastr';
import { Jsonp } from '@angular/http/src/http';
@Component({
  templateUrl: './setupclasses.html',
  styleUrls: ['./setupclasses.component.css'],
  providers: [SetupClassesService]
})
export class SetupClassesComponent implements OnInit {
  addDiv = false;
  editDiv = false;
  hideTable = true;
  classesActive: any = true;
  disableDiv = true;
  classesName: any;
  classesDuration: any;
  classesMaxattendence: any;
  classesPrice: any;
  classesResources: any;
  dataObject: any;
  getClassesList: any;
  classActive: any = true;
  servicesList: any;
  updateactive: any = false;
  updateclasses: any;
  updateduration: any;
  updatemaxattendees: any;
  updateprice: any;
  updateresource: any;
  updateResName: any;
  updateresused: any;
  duplicateError: any;
  classesId: any;
  classesActives: any = true;
  error: any;
  errorMsg: any;
  errorClass: any;
  errorMsgss: any;
  errorMaxAttendees: any;
  errorPricePerAttendees: any;
  errorNameExit: any;
  resAll = false;
  resAny = false;
  priorityError: any;
  getResourcesDropdown: any;
  resourceList: any;
  resourcenames: any;
  resourceName: any;
  priority: any;
  priorityss: any;
  updateresourcename: any;
  updatepriority: any;
  pressAny: any;
  getListClassess: any = [];
  updateAny: any;
  updateAll: any;
  occupations1: any;
  priorityResouceError: any;
  updateResources: any;
  updateResourcess: any;
  inputs = [];
  updateInputs = [];
  isclass = 1;
  data1: any;
  hidePlus: any;
  updateInput: any;
  updateresourceNamesss: any;
  eee: any;
  dropdownCheck: any = false;
  errorResource: any;
  deletedResources: any = [];
  errorMsgss1: any;
  nearestFive: number;
  classId: any;
  className: any;
  toastermessage: any;
  statuscode: any;
  bookingDataList: any;
  classList: any;
  bookingIntervalMinutes: any;

  addInput() {
    this.inputs.push({ srId: '', resourceName: '', priority: '' });
  }
  addupdate() {
    this.updateInputs.push({ srId: '', remove: false, resourceId: '', Priority__c: '' });
  }
  deleteFieldValue(index) {
    this.inputs.splice(index, 1);
  }
  deleteFieldValues1(getList, index) {
    this.getListClassess[index]['remove'] = true;
    this.deletedResources.push(this.getListClassess[index]);
    this.getListClassess.splice(index, 1);

  }
  deleteFieldValue2(updateInput, index) {
    this.updateInputs.splice(index, 1);

  }
  constructor(private setupClassesService: SetupClassesService,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private router: Router,
    @Inject('defaultType') public defaultType: string) {
  }
  ngOnInit() {
    this.getClassesDatas();
    this.getResources();
    this.getResouDropdown();
    this.getpriority();
    this.getBookingData();
  }
  createClassesData(param: string) {
    const remainderNearest = Number(this.classesDuration) % this.bookingIntervalMinutes;
    if ((this.classesName === '' || this.classesName === undefined || this.classesName === null) ||
      (this.classesDuration === '' || this.classesDuration === undefined || this.classesDuration == null) ||
      (this.classesMaxattendence < 0 || this.classesMaxattendence > 100) ||
      (this.classesPrice > 99999.999 || this.classesPrice < 0 || this.classesPrice !== '' && !this.classesPrice.match(/^[\d]{1,5}(\.[\d]{1,3})?$/))) {
      if (this.classesName === '' || this.classesName === undefined || this.classesName === null) {
        this.errorClass = 'SETUP_CLASSES.VALID_NOBLANK_CLASS_NAME';
      } if (this.classesDuration === '' || this.classesDuration === undefined || this.classesDuration === null) {
        this.errorMsgss = 'SETUP_CLASSES.VALID_NOBLANK_DURATION_BLANK';
      } if (this.classesMaxattendence < 0 || this.classesMaxattendence > 100) {
        this.errorMaxAttendees = 'SETUP_CLASSES.VALID_NOBLANK_MAX_Attendees_BLANK';
      } if ((this.classesPrice !== '' && !this.classesPrice.match(/^[\d]{1,5}(\.[\d]{1,3})?$/))) {
        this.errorPricePerAttendees = 'SETUP_CLASSES.NO_VALID_PRICE_PER_ATTENDEE';
      } if (this.classesPrice < 0) {
        this.errorPricePerAttendees = 'SETUP_CLASSES.INVALID_PRICE_PER_ATTENDEE';
      }
    } else if (remainderNearest !== 0) {
      this.errorMsgss1 = 'The class duration must be a multiple of the appointment booking ' + this.bookingIntervalMinutes + ' minute interval';
      window.scrollTo(0, 0);
    } else {
      if (!this.classesActive) {
        this.classesActive = 0;
      } if (this.classesActive) {
        this.classesActive = 1;
      }

      if (!this.classesResources) {
        this.classesResources = this.resourceList.filter((obj) => obj['NAME'].toLowerCase() === 'none')[0]['NAME'];
      }

      if (!this.checkResource(this.classesResources.toLowerCase(), this.inputs, 'resourceName', 'priority')) {
        return;
      }
      const resources = this.inputs;
      const dataObject = {
        'is_Class': this.isclass,
        'active': this.classesActive,
        'name': this.classesName,
        'duration': this.classesDuration,
        'maxAttendees': this.classesMaxattendence,
        'pricePerAttendee': this.classesPrice,
        'resourcesUsed': this.classesResources,
        'resources': resources,
        'pageName': 'classes'
      };
      this.setupClassesService.saveClassesData(dataObject)
        .subscribe(
          data => {
            this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_CREATE_CLASS_SUCCESS');
            this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
            this.clearmessage();
            this.getClassesDatas();
            if (param === 'create') {
              this.disableDiv = true;
              this.hideTable = true;
              this.addDiv = false;
            } else {
              this.disableDiv = false;
              this.hideTable = false;
              this.addDiv = true;
            }
          },
          error => {
            const status = JSON.parse(error['status']);
            const statuscode = JSON.parse(error['_body']).status;
            switch (JSON.parse(error['_body']).status) {
              case '2033':
                this.errorNameExit = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                break;
              case '2034':
                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                break;
              case '2045':
                this.duplicateError = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
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

  getClassesDatas() {
    // if (this.classActive === undefined || this.classActive === '0') {
    //   this.classActive = 'true';
    // }
    this.setupClassesService.getClassesData()
      .subscribe(data => {
        this.classList = data['result'];
        if (!this.classActive) {
          this.getClassesList = this.classList;
        } else {
          this.getClassesList = this.classList
            .filter(filterList => filterList.Active__c === 1);
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

  getInactive(value) {
    this.classActive = !this.classActive;
    this.getClassesDatas();
  }

  /*-- Method to delete product line --*/
  deleteClass() {
    this.setupClassesService.deleteProductLine(this.classId, this.className)
      .subscribe(data => {
        this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_DELETE_SUCCESS');
        this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
        this.getClassesDatas();
        this.clearmessage();
        this.disableDiv = true;
        this.hideTable = true;
        this.addDiv = false;
        this.editDiv = false;
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
  showData(classes) {
    const type = this.defaultType;
    this.classId = classes.Id;
    this.className = classes.Name;
    this.setupClassesService.getDeleteResponse(this.classId, type, this.className)
      .subscribe(data => {
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
    this.addDiv = false;
    this.disableDiv = false;
    this.editDiv = true;
    this.hideTable = false;
    this.classesId = classes.Id;
    this.deletedResources = [];
    this.setupClassesService.getClassesUpdateFields(classes.Id)
      .subscribe(data => {
        this.data1 = data['result'];
        this.updateInputs = [];
        this.getListClassess = this.data1.resrdata;

        if (this.getListClassess.length === 0) {
          this.addupdate();
        } else {
          const delObj = { remove: false };
          this.getListClassess = this.data1.resrdata.map((obj) => {
            Object.assign(obj, delObj);
            if (obj['Priority__c'] === 0 || obj['Priority__c'] === null) {
              obj['Priority__c'] = '';
            }
            return obj;
          });

        }
        this.updateactive = this.data1.results[0].Active__c;
        if (this.data1.results[0].Active__c === 0) {
          this.updateactive = false;
        } else if (this.data1.results[0].Active__c === 1) {
          this.updateactive = true;
        }
        this.updateclasses = this.data1.results[0].serviceName;
        this.updateduration = this.data1.results[0].Duration_1__c;
        this.updatemaxattendees = this.data1.results[0].Max_Attendees__c;
        this.updateprice = this.data1.results[0].Price_per_Attendee__c;
        this.updateresource = this.data1.results[0].Resource_Filter__c;
        if (!this.updateresource) {
          this.updateresource = this.resourceList.filter((obj) => obj['NAME'].toLowerCase() === 'none')[0]['NAME'];
        }
        if (this.updateresource === 'All') {
          this.updateAll = true;
          this.updateAny = false;
        } else if (this.updateresource === 'Any') {
          this.updateAny = true;
          this.updateAll = false;
        } else {
          this.updateAny = false;
          this.updateAll = false;
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
  updateClassesDatas(param: string) {
    const remainderNearest = Number(this.updateduration) % this.bookingIntervalMinutes;
    if ((this.updateclasses === '' || this.updateclasses === undefined || this.updateclasses === null) ||
      (this.updateduration === '' || this.updateduration === undefined || this.updateduration == null) ||
      (this.updatemaxattendees < 0 || this.updatemaxattendees > 100) ||
      (this.updateprice > 99999.999 || this.updateprice < 0 || this.updateprice !== '' && !this.updateprice.toString().match(/^[\d]{1,5}(\.[\d]{1,3})?$/))) {
      if (this.updateclasses === '' || this.updateclasses === undefined || this.updateclasses === null) {
        this.errorClass = 'SETUP_CLASSES.VALID_NOBLANK_CLASS_NAME';
      } if (this.updateduration === '' || this.updateduration === undefined || this.updateduration === null) {
        this.errorMsgss = 'SETUP_CLASSES.VALID_NOBLANK_DURATION_BLANK';
      } if (this.updatemaxattendees < 0 || this.updatemaxattendees > 100) {
        this.errorMaxAttendees = 'SETUP_CLASSES.VALID_NOBLANK_MAX_Attendees_BLANK';
      } if ((this.updateprice !== '' && !this.updateprice.match(/^[\d]{1,5}(\.[\d]{1,3})?$/))) {
        this.errorPricePerAttendees = 'SETUP_CLASSES.NO_VALID_PRICE_PER_ATTENDEE';
      } if (this.updateprice < 0) {
        this.errorPricePerAttendees = 'SETUP_CLASSES.INVALID_PRICE_PER_ATTENDEE';
      }
    } else if (remainderNearest !== 0) {
      this.errorMsgss1 = 'The class duration must be a multiple of the appointment booking ' + this.bookingIntervalMinutes + ' minute interval';
      window.scrollTo(0, 0);
    } else {
      if (this.updateactive === false || this.updateactive === undefined) {
        this.updateactive = 0;
      } if (this.updateactive === true) {
        this.updateactive = 1;
      }
      if (this.updateresource.toLowerCase() === 'none') {
        this.updateInputs = [];
      }
      this.updateResources = this.getListClassess;
      this.updateResourcess = this.updateResources.concat(this.updateInputs);
      if (!this.checkResource(this.updateresource.toLowerCase(), this.updateResourcess, 'resourceId', 'Priority__c')) {
        return;
      }
      if (this.deletedResources.length !== 0) {
        this.updateResourcess = this.updateResourcess.concat(this.deletedResources);
      }
      this.dataObject = {
        'classActive': this.updateactive,
        'className': this.updateclasses,
        'duration': this.updateduration,
        'maxAttendees': this.updatemaxattendees,
        'pricePerAttendee': this.updateprice,
        'resourcesUsed': this.updateresource,
        'resources': this.updateResourcess,
        'pageName': 'classes'
      };
      this.setupClassesService.editClassesDatas(this.dataObject, this.classesId)
        .subscribe(
          data => {
            this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_UPDATE_CLASS_SUCCESS');
            this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
            this.clearmessage();
            this.getClassesDatas();
            if (param === 'edit') {
              this.disableDiv = true;
              this.hideTable = true;
              this.addDiv = false;
              this.editDiv = false;
            } else {
              this.disableDiv = false;
              this.hideTable = false;
              this.editDiv = false;
              this.addDiv = true;
            }
          },
          error => {
            const status = JSON.parse(error['status']);
            const statuscode = JSON.parse(error['_body']).status;
            switch (JSON.parse(error['_body']).status) {
              case '2033':
                this.errorNameExit = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                break;
              case '2034':
                this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                break;
              case '2045':
                this.duplicateError = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                break;
              case '2046':
                this.priorityError = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                break;
              case '2047':
                this.priorityResouceError = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
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
  getBookingData() {
    this.setupClassesService.getBookingData().subscribe(
      data => {
        this.bookingDataList = data['result'];
        this.bookingIntervalMinutes = this.bookingDataList.bookingIntervalMinutes;
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
  saveAndNewMethod() {
    this.createClassesData('saveandnew');
  }
  editAndNewMethod() {
    this.updateClassesDatas('editandnew');
  }
  clearmessage() {
    this.classesName = '';
    this.classesDuration = '';
    this.classesMaxattendence = '';
    this.classesPrice = '';
    this.classesResources = '';
    this.error = '';
    this.duplicateError = '';
    this.getListClassess = '';
    this.clearErrorMsg();
    this.clearErrorDuplicateRes();
    this.clearMaxMsg();
    this.clearErrorMsg1();
    this.inputs = [];
    this.addInput();
    this.resAny = false;
    this.resAll = false;
  }

  cancel() {
    this.addDiv = false;
    this.editDiv = false;
    this.hideTable = true;
    this.disableDiv = true;
    this.error = '';
    this.duplicateError = '';
    this.resAll = false;
    this.resAny = false;
    this.clearErrorMsg();
    this.clearmessage();
  }
  clearErrorMsg() {
    this.errorClass = '';
    this.errorNameExit = '';
    this.errorPricePerAttendees = '';
    this.errorResource = '';
    this.priorityError = '';
    this.priorityResouceError = '';
    this.errorMsgss1 = '';
  }
  clearErrorDuplicateRes() {
    this.duplicateError = '';
  }
  clearMaxMsg() {
    this.errorMaxAttendees = '';
    this.errorPricePerAttendees = '';
  }
  clearErrorMsg1() {
    this.errorMsgss = '';
    this.errorMsgss1 = '';
  }
  resouceListhide() {
    this.clearErrorMsg();
    this.clearErrorDuplicateRes();
    this.clearMaxMsg();
    this.clearErrorMsg1();
    this.data1 = '';
    // this.getListClassess = '';
  }
  resource(value) {
    this.classesResources = value;
    if (value.toLowerCase() === 'all') {
      this.resAll = true;
      this.resAny = false;
      this.updateInputs = this.updateInputs.filter((obj) => {
        if (obj.hasOwnProperty('priority')) {
          delete obj.priority;
          return obj;
        } else {
          return obj;
        }
      });
    } else if (value.toLowerCase() === 'any') {
      this.resAny = true;
      this.resAll = false;
    } else {
      this.resAll = false;
      this.resAny = false;
      this.inputs = [];
      this.addInput();
      this.clearErrorMsg();
    }
  }
  // update div dropdown
  updateResource(value) {
    this.clearErrorMsg();
    if (value.toLowerCase() === 'all') {
      this.updateAll = true;
      this.updateAny = false;
      this.getListClassess = this.getListClassess.filter((obj) => {
        if (obj.hasOwnProperty('Priority__c')) {
          delete obj.Priority__c;
          return obj;
        } else {
          return obj;
        }
      });
      this.updateInputs = this.updateInputs.filter((obj) => {
        if (obj.hasOwnProperty('Priority__c')) {
          delete obj.Priority__c;
          return obj;
        } else {
          return obj;
        }
      });
    } else if (value.toLowerCase() === 'any') {
      this.updateAny = true;
      this.updateAll = false;
    } else {
      // this.getListClassess = '';
      this.updateAll = false;
      this.updateAny = false;
      if (this.getListClassess.length !== 0) {
        this.getListClassess.forEach(obj => {
          obj['remove'] = true;
          this.deletedResources.push(obj);
        });
      }

      this.getListClassess = [];
      this.updateInputs = [];
      this.addupdate();
      this.clearErrorMsg();
    }
  }
  getResouDropdown() {
    this.setupClassesService.getResourceDropdown('RESOURCE_USE')
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
  addNew() {
    this.inputs = [];
    this.addInput();

    this.classesResources = this.resourceList.filter((obj) => obj['NAME'].toLowerCase() === 'none')[0]['NAME'];
    this.addDiv = true;
    this.disableDiv = false;
    this.hideTable = false;
    this.clearmessage();
  }
  public getResources() {
    this.setupClassesService.getResourceUse('RESOURCE_USE').subscribe(
      data => {
        this.resourceList = data['result'];
        this.classesResources = this.resourceList.filter((obj) => obj['NAME'].toLowerCase() === 'none')[0]['NAME'];
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
  // number 1-10
  getpriority() {
    this.setupClassesService.getResourcepriority()
      .subscribe(
        data => {
          this.priority = data['result'];
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
  // checkResource() {
  //   if (this.classesResources.toLowerCase() === 'none') {
  //     return true;
  //   } else {
  //     if (this.inputs.map((obj) => obj.hasOwnProperty('resourceName')).indexOf(false) !== -1) {
  //       this.errorResource = 'SETUP_CLASSES.RESOURCES_REQUIRE';
  //       return false;
  //     }
  //   }
  //   this.clearErrorMsg();
  //   return true;
  // }
  // remove one id
  // removeResourceId(id) {
  //   this.setupClassesService.removeResourceId(id)
  //     .subscribe(
  //     data => {
  //       this.toastr.warning('Record Deleted Successfully', null, { timeOut: 1500 });
  //       this.setupClassesService.getClassesUpdateFields(this.classesId)
  //         .subscribe(data2 => {
  //           this.data1 = data2['result'];

  //           this.getListClassess = this.data1.resrdata;
  //           this.updateactive = this.data1.results[0].Active__c;
  //           if (this.data1.results[0].Active__c === 0 ) {
  //              this.updateactive = false;
  //           }else if (this.data1.results[0].Active__c === 1) {
  //               this.updateactive = true;
  //           }
  //           this.updateclasses = this.data1.results[0].serviceName;
  //           this.updateduration = this.data1.results[0].Duration_1__c;
  //           this.updatemaxattendees = this.data1.results[0].Max_Attendees__c;
  //           this.updateprice = this.data1.results[0].Price_per_Attendee__c;
  //           this.updateresource = this.data1.results[0].Resource_Filter__c;
  //           if (this.updateresource === 'All') {
  //             this.updateAll = true;
  //             this.updateAny = false;
  //           } else if (this.updateresource === 'Any') {
  //             this.updateAny = true;
  //             this.updateAll = false;
  //           } else {
  //             this.updateAny = false;
  //             this.updateAll = false;
  //           }
  //         });
  //         // this.clearmessage();
  //         // this.getClassesDatas();
  //         this.ngOnInit();
  //     });

  // }
  /* Method to restrict special charesters(allow only numbers and dot sign) */
  keyPress(event: any) {
    const pattern = /^[0-9]*\.?[0-9]*$/;
    const inputChar = String.fromCharCode(event.charCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
      event.preventDefault();
    }
  }
  selectResource(value, index) {
    if (this.classesResources.toLowerCase() !== 'none') {
      this.inputs[index]['resourceName'] = value;
    }
    this.clearErrorMsg();
  }
  selectPriority(value, index) {
    this.inputs[index]['priority'] = parseInt(value, 10);
    this.clearErrorMsg();
  }
  selectResourceForUpdate(value, index) {
    if (this.updateresource.toLowerCase() !== 'none') {
      this.updateInputs[index]['resourceId'] = value;
    }
    this.clearErrorMsg();
  }
  selectPriorityForUpdate(value, index) {
    this.updateInputs[index]['Priority__c'] = parseInt(value, 10);
    this.clearErrorMsg();
  }
  checkResource(resourcesName: string, inputs: Array<any>, key: string, priorityName: string) {
    if (resourcesName === 'none') {
      return true;
    } else {
      if (inputs.map((obj) => obj[key] !== '').indexOf(false) !== -1) {
        this.errorResource = 'SETUP_CLASSES.RESOURCES_REQUIRE';
        return false;
      }
    }
    this.clearErrorMsg();
    return this.checkForDuplicate(resourcesName, inputs, key, priorityName);
  }
  selectPriorityForList(value, i) {
    this.getListClassess[i]['Priority__c'] = value;
  }
  checkUnique(values: Array<any>, key): boolean {
    let i = 1;
    /* index +date  was used to  generate unique number
     the values null will replaced with unique numbers  */
    const valueArr = values.map((item) => item[key] ? item[key].toString() : (new Date().getTime() + i++).toString());
    const isDuplicate = valueArr.some(function (items, idx) {
      return valueArr.indexOf(items.toString()) !== idx;
    });
    return isDuplicate;
  }
  checkForDuplicate(resourcesName: string, inputs: Array<any>, key: string, priorityName: string): boolean {
    if (resourcesName === 'any') {
      if (this.checkUnique(inputs, priorityName) && this.checkUnique(inputs, key)) {
        this.errorResource = 'COMMON_STATUS_CODES.2047';
        return false;
      } else if (this.checkUnique(inputs, key)) {
        this.errorResource = 'COMMON_STATUS_CODES.2045';
        return false;
      } else if (this.checkUnique(inputs, priorityName)) {
        this.errorResource = 'COMMON_STATUS_CODES.2046';
        return false;
      } else {
        return true;
      }
    } else {
      if (this.checkUnique(inputs, key)) {
        this.errorResource = 'COMMON_STATUS_CODES.2045';
        return false;
      }
    }
    return true;
  }
}
