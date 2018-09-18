import {
  Component, ViewContainerRef, ViewEncapsulation, OnInit, ViewChild, ElementRef, NgZone,
  AfterViewInit, Inject, Output, EventEmitter, Directive, HostListener
} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
// import { BrowserModule } from '@angular/platform-browser';
import { FormControl } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { SetupCompanyInfoService } from './setupcompanyinfo.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { AgmCoreModule } from '@agm/core';
// import { } from 'googlemaps';
import { MapsAPILoader } from '@agm/core';
import { HttpClient } from '@angular/common/http';
import * as config from '../../../app.config';

@Component({
  selector: 'app-setupcompanyinfo-popup',
  templateUrl: './setupcompanyinfo.html',
  providers: [SetupCompanyInfoService],
  styleUrls: ['./setupcompanyinfo.css']
})


export class SetupCompanyInfoComponent implements OnInit {

  public latitude: number;
  public longitude: number;
  public searchControl: FormControl;
  public zoom: number;
  companyListLength: any;
  color = '#55ccff';
  color1 = '#55ccff';
  setupCompanyData: any;
  companyName: any;
  phone: any;
  email: any;
  countries: any;
  streetAddress: any;
  postalCode: any;
  city: any;
  state: any;
  country: any;
  states: any;
  errorMessage: any;
  headerColor: any;
  footerColor: any;
  companyLogo: File;
  companyLogoAllowedSize: any;
  company: any = {};
  imgSrc: any;
  imageTypeError: any;
  error: any;
  error1: any;
  error2: any;
  emailError: any;
  error3: any;
  toastermessage: any;
  imageMinSize: any;
  imgStatus: any;
  imageMaxSize: any;
  selectCountry: any;
  imageError: any;
  postalCodes1 = '';
  getPostals: any;
  pincodeError: any;
  companyInfoList: any;
  companyColors: any;
  updateCompanyName: any;
  updatePhone: any;
  updateEmail: any;
  updateStreetAddress: any;
  updatePostalCode = '';
  updateCountryCode: any;
  updateStateCode: any;
  updpateCity: any;
  // updateHeaderColor: any;
  // updateFooterColor: any;
  companyId: any;
  imageDiv = false;
  logo: SafeUrl = '';
  fileName = 'No file chosen';
  @ViewChild('search')
  public searchElementRef: ElementRef;
  submitParam = true;

  constructor(private setupCompanyService: SetupCompanyInfoService,
    @Inject('apiEndPoint') public apiEndPoint: string,
    @Inject('defaultCountry') public defaultCountry: string,
    private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private sanitizer: DomSanitizer, private http: HttpClient) {
    this.selectCountry = defaultCountry;
  }
  ngOnInit() {
    this.getCountries();
    //    this.postCodeFetch();

    // create search FormControl
    this.searchControl = new FormControl();

    // set current position
    this.setCurrentPosition();
    this.getCompanyInfo();

    // load Places Autocomplete
    // this.mapsAPILoader.load().then(() => {
    //   const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
    //     types: ['address'],
    //     componentRestrictions: { country: 'US' }
    //   });
    //   autocomplete.addListener('place_changed', () => {
    //     this.ngZone.run(() => {
    //       // get the place result
    //       const place: google.maps.places.PlaceResult = autocomplete.getPlace();
    //       if (!place.formatted_address) {
    //         alert('No details available for input: ' + place.name + '" "' + 'enter maually data');
    //         return;
    //       }
    //       let address1 = '';
    //       if (place.address_components) {
    //         address1 = [
    //           (place.address_components[0] && place.address_components[0].short_name || ''),
    //           (place.address_components[1] && place.address_components[1].short_name || ''),
    //           (place.address_components[2] && place.address_components[2].short_name || '')
    //         ].join(' ');
    //       }
    //       // set latitude, longitude and zoom
    //       this.latitude = place.geometry.location.lat();
    //       this.longitude = place.geometry.location.lng();
    //       this.zoom = 12;
    //     });
    //   });
    // });

  }
  private setCurrentPosition() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition((position) => {
        this.latitude = position.coords.latitude;
        this.longitude = position.coords.longitude;
        this.zoom = 12;
      });
    }
  }
  getCountries() {
    this.setupCompanyService.getLookupsList('COUNTRIES').subscribe(
      data => {
        this.countries = data['result'];
        // if (data.statusCode === '1001') {
        // }
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

  getCountryStates(countryName) {
    if (countryName !== '') {
      this.error3 = '';
    }
    this.country = countryName;
    this.state = '';
    this.setupCompanyService.getStates(countryName)
      .subscribe(statesValues => {
        this.states = statesValues['result'];
      },
        error => {
          this.errorMessage = <any>error;
          const errStatus = JSON.parse(error['_body'])['status'];
          if (errStatus === '2085' || errStatus === '2071') {
            if (this.router.url !== '/') {
              localStorage.setItem('page', this.router.url);
              this.router.navigate(['/']).then(() => { });
            }
          }
        });
  }
  getStates(state) {
    this.state = state;
  }
  getCompanyInfo() {
    this.setupCompanyService.getCompanyInfo().subscribe(data => {
      this.companyInfoList = data['result']['cmpresult'];
      this.companyColors = data['result']['coloursresult'];
      this.companyListLength = this.companyInfoList.length;
      if (this.companyListLength !== 0) {
        this.companyId = this.companyInfoList[0].Id;
        this.updateCompanyName = this.companyInfoList[0].Name;
        this.updatePhone = this.companyInfoList[0].Phone__c;
        this.updateEmail = this.companyInfoList[0].Email__c;
        this.updateStreetAddress = this.companyInfoList[0].Street_Address__c;
        this.updatePostalCode = this.companyInfoList[0].Postal_Code__c;
        this.updateCountryCode = this.companyInfoList[0].Country_Code__c;
        this.updateStateCode = this.companyInfoList[0].State_Code__c;
        this.updpateCity = this.companyInfoList[0].City__c;
        // this.updateHeaderColor = JSON.parse(this.companyColors).headerColor;
        // this.updateFooterColor = JSON.parse(this.companyColors).footerColor;
        this.logo = this.apiEndPoint + '/' + this.companyInfoList[0].Logo__c + '?time=' + new Date().getTime();
        this.getCountryStates(this.updateCountryCode);
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
  imageUpload(event) {
    const eventObj: MSInputMethodContext = <MSInputMethodContext>event;
    const target: HTMLInputElement = <HTMLInputElement>eventObj.target;
    const files: FileList = event.target.files;
    if (files.length > 0) {
      this.companyLogo = files[0];
      this.fileName = files[0].name;
    }
    const fSExt = new Array('Bytes', 'KB', 'MB', 'GB');
    const fSize = this.companyLogo.size;
    if (fSize < 1000000) {
      this.companyLogoAllowedSize = this.companyLogo;
      this.logo = this.sanitizer.bypassSecurityTrustUrl(window.URL.createObjectURL(this.companyLogo));
    } else {
      this.companyLogoAllowedSize = '';
      this.imageTypeError = 'SETUPCOMPANY.VALID_IMAGE_FILENAME';
    }
    if (!this.imageDiv) {
      this.imageDiv = true;
    }
  }

  createSetupCompanyData() {
    const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // if ((this.companyName === undefined || this.companyName === '' || this.companyName === 'undefined') &&
    //   (this.phone === undefined || this.phone === '' || this.phone === 'undefined') &&
    //   (this.streetAddress === undefined || this.streetAddress === '' || this.streetAddress === 'undefined') &&
    //   (this.postalCode === undefined || this.postalCode === '' || this.postalCode === 'undefined') &&
    //   (this.city === undefined || this.city === '' || this.city === 'undefined') &&
    //   (this.state === undefined || this.state === '' || this.state === 'undefined') &&
    //   (this.country === undefined || this.country === '' || this.country === 'undefined')) {
    //   //   this.error = 'SETUPCOMPANY.VALID_NOBLANK_MANDATORY_FIELD';
    // }
    if (this.companyName === undefined || this.companyName === '' || this.companyName === 'undefined') {
      this.error1 = 'SETUPCOMPANY.VALID_NOBLANK_SETUPCOMPANY_NAME';
    } if (this.phone === undefined || this.phone === '' || this.phone === 'undefined') {
      this.error2 = 'SETUPCOMPANY.VALID_NOBLANK_SETUPCOMPANY_PHONE';
    } if (this.country === undefined || this.country === '' || this.country === 'undefined') {
      this.error3 = 'SETUPCOMPANY.VALID_SETUPCOMPANY_COUNTRY_CODE';
    } if (this.email !== 'undefined' && this.email !== undefined && this.email !== '' && !EMAIL_REGEXP.test(this.email)) {
      this.emailError = 'SETUPCOMPANY.INVALID_EMAIL_ID';
    } else {
      this.company.companyName = this.companyName.trim();
      this.company.headerColor = {
        'headerColor': this.color,
        'footerColor': this.color1
      };
      this.company.contactDetails = {
        'phone': this.phone,
        'email': this.email
      };
      this.company.address = {
        'streetAddress': this.streetAddress,
        'postalCode': this.postalCodes1,
        'city': this.city,
        'state': this.state,
        'country': this.country
      };
      if (this.submitParam) {
        this.submitParam = false;
        this.setupCompanyService.createSetupCompanyData(this.company, this.companyLogoAllowedSize)
          .subscribe(
            data => {
              this.submitParam = true;
              this.setupCompanyData = data['data'];
              this.router.navigate(['/setup/company']).then(() => {
                this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_SUCCESS');
                this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
              });
              this.clearmessage();
            },
            error => {
              this.submitParam = true;
              const status = JSON.parse(error['status']);
              const statuscode = JSON.parse(error['_body']).status;
              switch (JSON.parse(error['_body']).status) {
                case '2058':
                  this.imageError = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
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
  }
  updateCompanyInfo() {
    const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    // if ((this.updateCompanyName === undefined || this.updateCompanyName === '' || this.updateCompanyName === 'undefined') &&
    //   (this.updatePhone === undefined || this.updatePhone === '' || this.phone === 'undefined') &&
    //   (this.streetAddress === undefined || this.streetAddress === '' || this.streetAddress === 'undefined') &&
    //   (this.postalCode === undefined || this.postalCode === '' || this.postalCode === 'undefined') &&
    //   (this.city === undefined || this.city === '' || this.city === 'undefined') &&
    //   (this.state === undefined || this.state === '' || this.state === 'undefined') &&
    //   (this.country === undefined || this.country === '' || this.country === 'undefined') &&
    //   (this.country === undefined || this.country === '' || this.country === 'undefined')) {
    //   //   this.error = 'SETUPCOMPANY.VALID_NOBLANK_MANDATORY_FIELD';
    // }
    if (this.updateCompanyName === undefined || this.updateCompanyName === '' || this.updateCompanyName === 'undefined') {
      this.error1 = 'SETUPCOMPANY.VALID_NOBLANK_SETUPCOMPANY_NAME';
    } else if (this.updatePhone === undefined || this.updatePhone === '' || this.updatePhone === 'undefined') {
      this.error2 = 'SETUPCOMPANY.VALID_NOBLANK_SETUPCOMPANY_PHONE';
    } else if (this.updateCountryCode === undefined || this.updateCountryCode === '' || this.updateCountryCode === 'undefined') {
      this.error3 = 'SETUPCOMPANY.VALID_SETUPCOMPANY_COUNTRY_CODE';
    } else if (this.updateEmail && this.updateEmail !== 'undefined' && this.updateEmail !== undefined && this.updateEmail !== '' && !EMAIL_REGEXP.test(this.updateEmail)) {
      this.emailError = 'SETUPCOMPANY.INVALID_EMAIL_ID';
    } else {
      this.company.updateCompanyName = this.updateCompanyName.trim();
      // this.company.headerColor = {
      //   'headerColor': this.updateHeaderColor,
      //   'footerColor': this.updateFooterColor
      // };
      this.company.contactDetails = {
        'phone': this.updatePhone,
        'email': this.updateEmail
      };
      this.company.address = {
        'streetAddress': this.updateStreetAddress,
        'postalCode': this.updatePostalCode,
        'city': this.updpateCity,
        'state': this.updateStateCode,
        'country': this.updateCountryCode
      };
      if (this.submitParam) {
        this.submitParam = false;
        this.setupCompanyService.editCompanyInfo(this.company, this.companyLogoAllowedSize, this.companyId)
          .subscribe(
            data => {
              this.submitParam = true;
              this.setupCompanyData = data['data'];
              this.router.navigate(['/setup/company']).then(() => {
                this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_SUCCESS');
                this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
              });
              this.clearmessage();
            },
            error => {
              this.submitParam = true;
              const status = JSON.parse(error['status']);
              const statuscode = JSON.parse(error['_body']).status;
              switch (JSON.parse(error['_body']).status) {
                case '2058':
                  this.imageError = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
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

  }
  hyphen_generate_mobile(value) {
    if (value === undefined) {
      value = '';
    }
    if (value.length === 0) {
      (<HTMLInputElement>document.getElementById('mobile_id')).value = value.concat('(');
    }
    if (value.length === 4) {
      (<HTMLInputElement>document.getElementById('mobile_id')).value = value.concat(')');
    } if (value.length === 8) {
      (<HTMLInputElement>document.getElementById('mobile_id')).value = value.concat('-');
    }
  }
  hyphen_generate_mobile1(value) {
    if (value === undefined) {
      value = '';
    }
    if (value.length === 0) {
      (<HTMLInputElement>document.getElementById('mobile_id1')).value = value.concat('(');
    }
    if (value.length === 4) {
      (<HTMLInputElement>document.getElementById('mobile_id1')).value = value.concat(')');
    } if (value.length === 8) {
      (<HTMLInputElement>document.getElementById('mobile_id1')).value = value.concat('-');
    }
  }
  clear() {
    this.error = '';
    this.error1 = '';
    this.error2 = '';
    this.error3 = '';
    this.pincodeError = '';
  }
  clearmessage() {
    this.companyName = '';
    this.phone = '';
    this.email = '';
    this.streetAddress = '';
    this.postalCode = '';
    this.city = '';
    this.state = '';
    this.country = '';
    this.headerColor = '';
    this.footerColor = '';
    // this.companyLogo = '';
    this.error = '';
    this.error1 = '';
    this.error2 = '';
    this.error3 = '';
    this.pincodeError = '';
  }
  cancel() {
    this.router.navigate(['/setup/company']);
    //  window.localStorage.setItem('title', 'Setup');
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
  clearImageError() {
    this.imageError = '';
    this.imageTypeError = '';
  }
  Emailclear() {
    this.emailError = '';
  }
  // postCodeFetch() {
  //   this.setupCompanyService.postPostalcode(this.postalCodes1)
  //     .subscribe(
  //     data => {
  //       this.getPostals = data['result'][0];
  //       this.city = this.getPostals.city;
  //       this.state = this.getPostals.state;
  //       this.country = this.getPostals.country;
  //     },
  //     error => {
  //       const status = JSON.parse(error['status']);
  //       const statuscode = JSON.parse(error['_body']).status;
  //       switch (JSON.parse(error['_body']).status) {
  //         case '2072':
  //           this.pincodeError = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
  //           break;
  //       }
  //     });
  // }
  // postCodeFetch1() {
  //   this.setupCompanyService.postPostalcode(this.updatePostalCode)
  //     .subscribe(
  //     data => {
  //       this.getPostals = data['result'][0];
  //       this.city = this.getPostals.city;
  //       this.state = this.getPostals.state;
  //       this.country = this.getPostals.country;
  //     },
  //     error => {
  //       const status = JSON.parse(error['status']);
  //       const statuscode = JSON.parse(error['_body']).status;
  //       switch (JSON.parse(error['_body']).status) {
  //         case '2072':
  //           this.pincodeError = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
  //           break;
  //       }
  //     });
  // }
  getLocation(param) {
    if (param === 'edit') {
      if (this.updatePostalCode.length > 4) {
        this.http.get('https://ziptasticapi.com/' + this.updatePostalCode).subscribe(
          result => {
            if (result['error']) {
              const toastermessage: any = this.translateService.get('SETUPCOMPANY.ZIP_CODE_NOT_FOUND');
              this.toastr.error(toastermessage.value, null, { timeOut: 1500 });
            } else {
              if (result['country'] === 'US') {
                this.updateCountryCode = 'United States';
                this.getCountryStates(this.updateCountryCode);
                config.states.forEach(state => {
                  if (state.abbrev === result['state']) {
                    this.updateStateCode = state.name;
                  }
                });

              }
              const cityArray = result['city'].split(' ');
              for (let i = 0; i < cityArray.length; i++) {
                if (i === 0) {
                  this.updpateCity = cityArray[i].charAt(0).toUpperCase() + cityArray[i].slice(1).toLowerCase() + ' ';
                } else {
                  this.updpateCity += cityArray[i].charAt(0).toUpperCase() + cityArray[i].slice(1).toLowerCase() + ' ';
                }
              }
            }
          },
          error => {
          }
        );
      }
    } else {
      if (this.postalCodes1.length > 4) {
        this.http.get('https://ziptasticapi.com/' + this.postalCodes1).subscribe(
          result => {
            if (result['error']) {
              const toastermessage: any = this.translateService.get('SETUPCOMPANY.ZIP_CODE_NOT_FOUND');
              this.toastr.error(toastermessage.value, null, { timeOut: 1500 });
            } else {
              if (result['country'] === 'US') {
                this.country = 'United States';
                this.getCountryStates(this.country);
                config.states.forEach(state => {
                  if (state.abbrev === result['state']) {
                    this.state = state.name;
                  }
                });
              }
              this.city = result['city'].charAt(0).toUpperCase() + result['city'].slice(1).toLowerCase();
            }
          },
          error => {
          }
        );
      }
    }
  }

  imageErrorHandler(event) {
    event.target.src = '/assets/images/no-preview.png';
  }

}

