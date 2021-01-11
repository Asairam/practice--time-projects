import { Component, OnInit, OnDestroy, Output, EventEmitter, ViewChild, ElementRef, HostListener, Input } from '@angular/core';
import { CommonService } from '../../../../commonService/common.service';
import * as config from '../../../../appConfig/app.config';
import { BuyerEditService } from '../../../component-service/buyer-edit.service';
import { FormBuilder, FormGroup, Validators, FormControl, FormGroupDirective } from '@angular/forms';
import { validateInputValue } from '../../../../shared/_helpers/commonvalidation.validator';
import { AuthService } from '../../../../authService/auth.service';
import { environment } from '../../../../../environments/environment';
import { Location } from '@angular/common';
import { Subject } from 'rxjs';
import 'rxjs/add/operator/takeUntil';
import { ActivatedRoute } from '@angular/router';
import { BuyerBiddingService } from '../../../../component/component-service/buyer-bidding.service';
import { BasicinfoService } from './basicinfo.service';
import { resolve } from 'url';
import * as routerconfig from '../../../../appConfig/router.config';
/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromEditModule from '../state/editmodule.reducer';
import * as fromAppModule from '../../../../state/app.reducer';
import * as editModuleActions from '../state/editmodule.actions';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'BASIC-INFO',
  templateUrl: './basicinfo.component.html',
  styleUrls: ['./basicinfo.component.css'],
  providers: [BasicinfoService]
})
export class BasicinfoComponent implements OnInit, OnDestroy {
  showtopRankOnlyDrop = false;
  aucStatus;
  auctionReadOnly: boolean = false;
  componentActive: boolean = true;
  OpenDateDisabled: boolean = false;
  republishRequired: boolean = false;
  @HostListener('document:keydown', ['$event']) handleKeyboardEvent(event: any) {
    // if (event.target.id == 'basicOpenDate' || event.target.id == 'basicCloseDate') {
    //   event.returnValue = false;
    //   event.preventDefault();
    // }
  }
  @ViewChild('submitElement') submitElement: ElementRef;
  auctionID: any;
  @Output() loadStatus = new EventEmitter<boolean>();
  @Output() orgList = new EventEmitter<boolean>();
  destroySubcriptions$: Subject<boolean> = new Subject<boolean>();
  oldData = null;
  //Dropdown Start
  minBidRange = config.MIN_BID;
  auctionType = config.AUC_TYPE;
  listPrimaryCurrency = [];
  listPrimaryCurrencyCopy = [];
  listBiddingCurrency = [];
  bidInfoSupplier = config.BIDINFOSUPPLIER;
  bestBidInfo = config.BESTBIDINFO;
  extensionType = config.EXTENDAUCTION;
  config = config;
  biddingCurrency = new FormControl();
  enableDate: boolean = true;
  templateAuction = this.route.snapshot.queryParamMap.get('template')
  @Input() roundsAuction = false;

  get resendDisabled() {
    return this.buyerService.auctionData.auctionStatus != 'Published' || this.republishRequired;
  }

  get openDisabled() {
    let status1 = this.buyerService.auctionData.auctionStatus;
    if (status1 == config.AUCTIONSTATUS.PB && !this.republishRequired && !this.common.auctionLeader.host) {
      return false;
    } else {
      return true;
    }
  }

  get closeDisabled() {
    let status2 = this.buyerService.auctionData.auctionStatus;
    if (status2 == config.AUCTIONSTATUS.OP && !this.common.auctionLeader.host) {
      return false;
    } else {
      return true;
    }
  }

  //End

  //Tetxbox Hint
  bidInfoSupplierText: any;
  bestBidInfoText: any;
  //End

  @ViewChild('basicFormRef') basicFormRef: FormGroupDirective;
  basicForm: FormGroup;
  success = "";

  error = {
    hoursError: false,
    hoursCloseError: false,
    minuteError: false,
    minuteCloseError: false,
    startDateError: false,
    endDateError: false
  }
  translateSer: any;
  listOrganisation: any;
  listOrganisationCopy: any;
  aucNameError = "";
  exchangeAmount = null;
  exchangeRateData = null;
  listExchangeRate = [];
  //shedule date 
  today = new Date();
  edo = this.today;
  startDate: any;
  endDate: any;
  timeformat = false;
  //attch document 
  file: string;
  imageURL = environment.rauction;
  imageSrc: any;
  token = this.appConfig.getTokenValue();
  profilePicture: { docId: any; fileName: any; isInternal: boolean; isExternal: boolean; docFileId: any; };
  docId: number = 0;
  tabActive = false;
  public FilterCtrl: FormControl = new FormControl();
  public CurrFilterCtrl: FormControl = new FormControl();
  public BiddCurrFilterCtrl: FormControl = new FormControl();
  opendaAuctionDate: any;
  decimalPlace = config.DECIMAL_PLACES;
  isPublish = false;
  //disable field
  aucType = false;
  rfqNo = null;
  saveCurrencyData = [];
  buyerRemarks = [];
  admin_settings:any;
  adminFeatures:any;
  constructor(
    private route: ActivatedRoute, 
    private location: Location, 
    public appConfig: AuthService, 
    public common: CommonService, 
    private formBuilder: FormBuilder, 
    public buyerService: BuyerEditService,
    private bidService: BuyerBiddingService,
    private basicInfoService: BasicinfoService,
    private store: Store<fromEditModule.EditModuleState>,
    private appStore: Store<fromAppModule.AppModuleState>
    ) {
    this.route.params.subscribe(params => {
      this.buyerService.auctionData.auctionID = params['id'] ? +params['id'] : null;
    });
    this.common.translateSer('BASIC_DETAILS').subscribe(async (text: string) => {
      this.translateSer = text;
    });
  }

	ngOnInit() {
    this.store.dispatch(new editModuleActions.SetAuctionReadOnlyMode(
      this.route.snapshot.queryParams.mode && this.route.snapshot.queryParams.mode === "readonly" ? true : false
    ));
    this.appStore.pipe(select(fromAppModule.getAuctionConfigOnly), takeWhile(() => this.componentActive))
      .subscribe(auctioncon => {
        if (auctioncon && auctioncon.features) {
          this.admin_settings = auctioncon.features.testAuction;
          this.adminFeatures = auctioncon.features;
        }
      })
    this.store.pipe(select(fromEditModule.getEditModuleStateInitialized),takeWhile(() => this.componentActive))
      .subscribe( (editModuleStateInitialized) => {
        if(this.buyerService.auctionData.auctionID){          
          this.getAuctionDetailsForId(this.buyerService.auctionData.auctionID).then((res:any) => {
            this.store.dispatch(new editModuleActions.SetStatusAndRepublishRequired({ 
              republishRequired : res.data.republishRequired,
              status : res.data.status.toLowerCase(),
              isSealedBidAuction : res.data.isSealedBidAuction ? res.data.isSealedBidAuction: false,
              bidCurrencyCount : res.data.currency.length,
              auctionId : this.buyerService.auctionData.auctionID
            }));
            this.store.dispatch(new editModuleActions.SetPrimaryCurrencyAndDecimal({
              primaryCurrency: res.data.primaryCurrencyNew,
              currencyDecimal: res.data.currencyDecimalPlace
            }));
                  
          }).catch()
        }
    });
    
    this.store.pipe(select(fromEditModule.getAuctionReadOnly),takeWhile(() => this.componentActive) )
      .subscribe(auctionReadOnly => {
        this.auctionReadOnly = auctionReadOnly;
    })

		this.store.pipe(select(fromEditModule.getAuctionStatus), 
      takeWhile(() => this.componentActive)).subscribe(auctionStatus => {
			if( auctionStatus == 'suspended') {
        console.log('suspended');
			}
			if(auctionStatus == 'published') {
        console.log('published');
			}
			if(auctionStatus == 'paused') {
        console.log('paused');
        this.basicInfoService.pauseStateFormControl(this.basicForm);
        this.biddingCurrency.disable();
        this.OpenDateDisabled = true;
      }
      if(auctionStatus == 'draft') {
        console.log('draft');
      }
            
			this.aucStatus = auctionStatus;
		});
		
		try {
			this.resetForm();
			this.get_CurrencyList_OrgList_ExchangeRateList();
			this.subscriptions();
			if (this.appConfig.userRole() === config.ROLE_ACCESS_CONTROL.restricted_buyer && this.bidInfoSupplier.findIndex(val => val.value === 'supplierName') === -1) {
				this.bidInfoSupplier.push({ key: 3, name: 'Supplier Name', value: "supplierName", description: "" });
			}
		} catch (e) {
		}
		this.imageSrc = this.imageURL + "assets/images/profile.jpg";
	}
	subscriptions() {
		this.FilterCtrl.valueChanges.subscribe(() => {
          this.filterBanks();
		});
		
		this.CurrFilterCtrl.valueChanges.subscribe(() => {
          this.CurrfilterBanks("primaryCurrency");
		});
		
		this.BiddCurrFilterCtrl.valueChanges.subscribe(() => {
          this.CurrfilterBanks("biddingCurrency");
		});
	}

  

	get_CurrencyList_OrgList_ExchangeRateList() {
		this.basicInfoService.get_CurrencyList_OrgList_ExchangeRateList(this.destroySubcriptions$).then((res: any) => {
			this.getCurrencyList(res.CURRENCY_LIST, res.EXCHANGE_RATE);
			this.getOrganisationList(res.ORGANIZATION_LIST);
		}).catch(err => {
			this.common.error(err);
			this.common.loader = false;
		});
	}

  resetForm() {
    this.basicForm = this.formBuilder.group({
      auctionID: [{ value: this.buyerService.auctionData.auctionID, disabled: true }],
      aucType: [null, Validators.required],
      aucName: ["", Validators.required],
      description: "",
      company: [''],
      extensionSeconds: 5,
      gracePeriod: 5,
      extensionType: [this.extensionType[1], Validators.required],
      minBidChangeValue: 0,
      minBidChangeType: [this.minBidRange[0].ID, Validators.required],
      bidInfoSupplier: this.bidInfoSupplier[0],
      bestBidInfo: this.bestBidInfo[1],
      bidCushionTypeLimit: null,
      primaryCurrency: [null, Validators.required],
      openDate: ['', this.templateAuction != 'true' ? Validators.required : null],
      endDate: ['', this.templateAuction != 'true' ? Validators.required : null],
      opent: [null, this.templateAuction != 'true' ? Validators.required : null],
      endt: [null, this.templateAuction != 'true' ? Validators.required : null],
      businessUnit: "",
      bidCushionType: this.minBidRange[0].ID,
      attachmentList: [[]],
      decimalPlace: [null, Validators.required],
      allowties: false,
      remark: [''],
      testUse: [false],
      isSealedBidAuction: [this.route.snapshot.queryParams.mode && this.route.snapshot.queryParams.mode.toLowerCase() === 'sealedbid' ? true : false]
    }, { validator: validateInputValue('minBidChangeValue', 'minBidChangeType', 'bidCushionTypeLimit', 'bidCushionType') }
    )
    this.bidInfoSupplierText = this.basicForm.value.bidInfoSupplier.description;
    this.bestBidInfoText = this.basicForm.value.bestBidInfo.description;
  }

  get f() { return this.basicForm.controls; }

  getCurrencyList(currency_list, exchange_rate?) {
    let defaultCurrency = [];
    currency_list.forEach(currency => {
      this.listPrimaryCurrency.push(
        {
          currencyCode: currency.code,
          currencyName: currency.name
        })
    })
    this.listBiddingCurrency = this.listPrimaryCurrency;
    this.basicForm.controls.primaryCurrency.setValue(this.listPrimaryCurrency.find(x => x.currencyCode == config.ONEVALUE.currency));
    defaultCurrency = this.listPrimaryCurrency.filter(x => x.currencyCode == config.ONEVALUE.currency);
    if (defaultCurrency.length > 0) {
      defaultCurrency[0]["selected"] = true;
    }
    this.biddingCurrency.setValue([...defaultCurrency]);
    this.common.sortOn(this.listPrimaryCurrency, "selected");
    this.listPrimaryCurrency.sort((a, b) => a.selected - b.selected);
    this.listPrimaryCurrencyCopy = this.listPrimaryCurrency;
    this.buyerService.auctionData.primaryCurrency = this.basicForm.controls.primaryCurrency.value;

    if (this.buyerService.auctionData.auctionID) {

      this.refreshAuctionDetails().then(res => {
        this.setOldAuctionData(res);
      });
    }
  }


  getExchangeRate() {
    let currencyTmp = this.biddingCurrency.value.map(x => ({
      currencyCode: x.currencyCode,
      currencyName: x.currencyName
    }
    ));
    let obj = {
      auctionID: this.buyerService.auctionData.auctionID,
      currency: currencyTmp,
      primaryCurrency: this.basicForm.controls.primaryCurrency.value.currencyCode
    };

    if (!obj.auctionID) {
      delete obj.auctionID;
    }
    this.buyerService.getExchangeRate(obj).subscribe((res: any) => {
      res.data.forEach(element => {
        element.exchangeCurrency = this.basicForm.controls.primaryCurrency.value.currencyCode;
        element.exchangeName = this.basicForm.controls.primaryCurrency.value.currencyName;
      });
      let sendData = {
        flag: 'openAttach',
        pageFrom: 'basic',
        currency: res.data,
        buyerRemarks: this.buyerRemarks
      }
      this.common.toggleDiv.emit(sendData);
    }, err => {
      this.common.error(err);
    })
  }

  openMore() {
    this.getExchangeRate();
  }

  selectedBidInfoSupplier(data) {
    try {
      this.bidInfoSupplierText = data.description;
    }
    catch (e) {
      this.common.error(e.message);
    }

  }
  selectedBestBidInfo(data) {
    try {
      this.bestBidInfoText = data.description;
    }
    catch (e) {
      this.common.error(e.message)
    }
  }

  dateFilter() {
    return new Promise((resolve, reject) => {
      this.error.startDateError = false;
      this.error.endDateError = false;
      let formObj = this.basicForm.getRawValue();

      if (!formObj.openDate || !formObj.endDate || !formObj.opent || !formObj.endt) {
        reject(new Error("Date or Time needs to be entered"));
      } else {
        let month = ((formObj.openDate).getMonth());
        let day = ((formObj.openDate).getDate());
        let year = ((formObj.openDate).getFullYear());
        let hour = ((formObj.opent).getHours());
        let minute = ((formObj.opent).getMinutes());
        // let seconds = new Date(formObj.opent.setSeconds(0));
        let oMonth = ((formObj.endDate).getMonth());
        let oDay = ((formObj.endDate).getDate());
        let oYear = ((formObj.endDate).getFullYear());
        let oHour = ((formObj.endt).getHours());
        let oMinute = ((formObj.endt).getMinutes());
        // let oSeconds = new Date(formObj.endt.setSeconds(0));
        this.startDate = new Date(year, month, day, hour, minute);
        this.endDate = new Date(oYear, oMonth, oDay, oHour, oMinute);
        if (this.endDate <= this.startDate) {
          this.error.endDateError = true;
          reject();
        }
        (this.buyerService.auctionData.auctionID) ? resolve() : reject();
      }
    })
  }

  getOrganisationList(data) {
    this.listOrganisation = data.filter(org => org.isInternal === true);
    this.orgList.emit(JSON.parse(JSON.stringify( this.listOrganisation)));
    this.listOrganisationCopy = this.listOrganisation;
    this.common.sortOn(this.listOrganisation, "name");
  }

  mailScheduleData() {
    return new Promise((resolve, reject) => {
      if (!this.templateAuction) {
        this.dateFilter().then(result => {
          if (!this.templateAuction) {
            return this.saveScheduleData();
          }
        }).then(result => {
          resolve();
        })
          .catch(err => {
            if (err && !err.message) {
              err = { message: err };
            }
            reject(err);
          })
      }
      resolve();
    })
  }



  saveAuctionDetails(valdCheck?) {
    let allData = [];
    return new Promise((resolve, reject) => {
      this.saveAucPart1()
        .then(result => {
          console.log('saveAuctionDetails :: Step 1 completed');
          allData.push({ basicData: result });
          return this.saveBiddingRules(valdCheck);
        })
        .then(result => {
          console.log('saveAuctionDetails :: Step 2 completed');
          allData.push({ biddingData: result });
          if (!this.templateAuction) {
            return this.dateFilter();
          }
        })
        .then(result => {
          console.log('saveAuctionDetails :: Step 3 completed');
          if (!this.templateAuction) {
            return this.saveScheduleData();
          }
        })
        .then(result => {
          console.log('saveAuctionDetails :: Step 4 completed');
          allData.push({ scheduleData: result });
          let objData = { ...allData[0]["basicData"], ...allData[1]["biddingData"], ...allData[2]["scheduleData"] };
          if (this.buyerService.auctionData.auctionStatus == config.AUCTIONSTATUS.PB) {
            if (!this.buyerService.remarkFlag) {
              this.buyerService.remarkFlag = config.compareData(objData, this.oldData);
              if (this.buyerService.remarkFlag) {
                this.setOldAuctionData(objData);
              }
            }
          }
          else {
            this.setOldAuctionData(objData);
          }
          resolve();
        })
        .catch(err => {
          if (err && !err.message) {
            console.log('%c ' + err.message, 'background: #222; color: #bada55');
            err = { message: err };
          }
          reject(err);
        })
    })
  }

  saveAucPart1() {
    let basicFormObj = this.basicForm.getRawValue();
    if (!basicFormObj.aucName) return new Promise((resolve, reject) => reject(new Error('Auction name cannot be empty.')));
    let objBasicInfo = {
      type: basicFormObj.aucType,
      auctionName: basicFormObj.aucName,
      description: basicFormObj.description,
      auctionStatus: config.AUCTIONSTATUS.DR,
      primaryCurrency: basicFormObj.primaryCurrency.currencyCode,
      company: basicFormObj.company,
      auctionLeader: null,
      businessUnit: basicFormObj.businessUnit,
      auctionID: this.buyerService.auctionData.auctionID,
      currencyDecimalPlace: basicFormObj.decimalPlace,
      testUse: basicFormObj.testUse,
      attachmentList: (this.basicForm.value.attachmentList) ? this.basicForm.value.attachmentList : [],
      currency: [],
      primaryCurrencyNew: basicFormObj.primaryCurrency,
      remark: basicFormObj.remark,
      isTemplate: this.templateAuction ? true : false
    };

    if(!this.buyerService.auctionData.auctionID) {
      Object.assign(objBasicInfo, {isSealedBidAuction : basicFormObj.isSealedBidAuction});
    }

    if (objBasicInfo.primaryCurrencyNew.selected) {
      delete objBasicInfo.primaryCurrencyNew.selected;
    }

    this.populateCurrency(objBasicInfo);

    if (objBasicInfo.currency.length == 0) return new Promise((resolve, reject) => reject(new Error('Select atleast 1 bidding currency.')));

    if (this.buyerService.auctionData.auctionID) {
      delete objBasicInfo.auctionLeader;
      return this.updateAuc(objBasicInfo);
    } else {
      delete objBasicInfo.auctionID;
      return this.saveAuc(objBasicInfo);
    }
  }

  populateCurrency(objBasicInfo) {
    this.biddingCurrency.value.forEach(element => {
      if (element)
        objBasicInfo.currency.push({ currencyCode: element.currencyCode, currencyName: element.currencyName });
    });
  }

  updateAuc(objBasicInfo) {
    objBasicInfo.republishRequired = this.republishRequired;
    return new Promise((resolve, reject) => {
      this.buyerService.updateAuctionData(objBasicInfo).subscribe((res: any) => {
        this.republishRequired = res["data"].republishRequired;
        let basicFormObj = this.basicForm.getRawValue();
        this.aucNameError = "";
        this.saveCurrencyData = [...res["data"].currency];
        this.convertToDecimal();
        this.buyerService.mailAuctionData.auctionName = basicFormObj.aucName;
        this.buyerService.mailAuctionData.type = basicFormObj.aucType;
        this.buyerService.mailAuctionData.description = basicFormObj.description;
        this.buyerService.mailAuctionData.businessUnit = basicFormObj.businessUnit;
        this.buyerService.mailAuctionData.company_name = basicFormObj.company;
        this.store.dispatch(new editModuleActions.SetStatusAndRepublishRequired({ 
          republishRequired: res['data'].republishRequired,
          bidCurrencyCount: res["data"].currency.length,
          auctionId : this.buyerService.auctionData.auctionID
        }));
        this.store.dispatch(new editModuleActions.SetPrimaryCurrencyAndDecimal({
          primaryCurrency: res.data.primaryCurrencyNew,
          currencyDecimal: res.data.currencyDecimalPlace
        }));
        resolve(objBasicInfo);
      }, (err) => {
        reject(err);
      })
    });
  }

  convertToDecimal() {
    this.saveCurrencyData.forEach((data) => {
      data.exchangeRate = data.exchangeRate.toFixed(this.basicForm.getRawValue().decimalPlace);
    })
  }

  saveAuc(objBasicInfo) {
    return new Promise((resolve, reject) => {
      let userDtls = this.appConfig.getUserData();
      objBasicInfo.auctionLeader = { email: userDtls.email, name: (userDtls.name.firstname + ' ' + userDtls.name.lastname) };
      this.buyerService.postAuctionData(objBasicInfo).subscribe((res: any) => {
        this.aucNameError = "";
        let basicFormObj = this.basicForm.getRawValue();
        this.buyerService.auctionData.auctionID = res['auctionID'];
        this.buyerService.auctionData.auctionIdData = ((objBasicInfo.type == "forward") ? "AUCFWD-" : "AUCRVS-") + String(this.buyerService.auctionData.auctionID);
        this.buyerService.auctionData.type = objBasicInfo.type;
        this.aucType = true;
        this.saveCurrencyData = [...res["data"].currency];
        this.convertToDecimal();
        let sendData = {
          flag: 'auctionCreated',
          auctionID: res['auctionID']
        }
        this.buyerService.mailAuctionData.auctionName = basicFormObj.aucName;
        this.buyerService.mailAuctionData.type = basicFormObj.aucType;
        this.buyerService.mailAuctionData.description = basicFormObj.description;
        this.buyerService.mailAuctionData.businessUnit = basicFormObj.businessUnit;
        this.buyerService.mailAuctionData.company_name = basicFormObj.company;

        this.common.toggleDiv.emit(sendData);
        setTimeout(() => {
          this.buyerService.basicDetails = false;
          let url = `${routerconfig.buyer_router_links.EDIT_AUCTION}/${this.buyerService.auctionData.auctionID}?status=Draft`;
          if (this.templateAuction) {
            url += "&template=true";
          this.common.success("Template ID Created Successfully");
          } else {
          this.common.success("Auction ID Created Successfully");
          }
          this.location.go(url);
          this.store.dispatch(new editModuleActions.SetStatusAndRepublishRequired({ 
            republishRequired: res['data'].republishRequired,
            status: res['data'].status.toLowerCase(),
            bidCurrencyCount: res['data'].currency.length,
            auctionId : this.buyerService.auctionData.auctionID
          }));
          this.store.dispatch(new editModuleActions.SetPrimaryCurrencyAndDecimal({
            primaryCurrency: res.data.primaryCurrencyNew,
            currencyDecimal: res.data.currencyDecimalPlace
          }));
          this.buyerService.lotList = this.buyerService.getLotList(res['auctionID']);
          resolve();
        }, 300);

      }, (err) => {
        this.common.loader = false;
        reject(err);
      })
    });
  }

  saveBiddingRules(valdCheck?) {
    return new Promise((resolve, reject) => {
      // resolve();
      this.triggerFullFormSubmit()
        .then(result => {
          let formObj = this.basicForm.getRawValue();
          let objBiddingRules = {
            auctionID: this.buyerService.auctionData.auctionID,
            extensionSeconds: formObj.extensionSeconds * 60,
            minBidChangeValue: formObj.minBidChangeValue ? formObj.minBidChangeValue : 0,
            minBidChangeType: formObj.minBidChangeType,
            gracePeriod: formObj.gracePeriod * 60,
            extensionType: formObj.extensionType.value.toLowerCase(),
            infoShownToSupplier: formObj.bidInfoSupplier.value.toLowerCase(),
            bestBidInfoShownBy: formObj.bestBidInfo.value.toLowerCase(),
            // bidCushionType: (formObj.bidCushionTypeLimit == "") ? null : formObj.bidCushionType,
            bidCushionType: formObj.bidCushionType,
            bidCushionTypeLowerLimit: (formObj.aucType != this.auctionType[0].value && formObj.bidCushionTypeLimit) ? formObj.bidCushionTypeLimit : null,
            bidCushionTypeUpperLimit: (formObj.aucType == this.auctionType[0].value && formObj.bidCushionTypeLimit) ? formObj.bidCushionTypeLimit : null,
            allowties: formObj.allowties
          }
          this.buyerService.auctionData.minimumChangeValue = objBiddingRules.minBidChangeValue;
          this.buyerService.auctionData.minimumChangeType = objBiddingRules.minBidChangeType;
          if (this.basicForm.controls.bidCushionType.errors || this.basicForm.controls.bidCushionTypeLimit.errors) {
            delete objBiddingRules.bidCushionType;
            delete objBiddingRules.bidCushionTypeLowerLimit;
            delete objBiddingRules.bidCushionTypeUpperLimit;
          }
          this.buyerService.updateBiddingRules(objBiddingRules).subscribe((res) => {
            this.buyerService.biddingDetails = false;
            resolve(objBiddingRules);
          }, (err) => {
            this.common.error(err);
            reject(new Error("Check bidding rules save api"));
          })
        })
        .catch(err => {
          if (valdCheck === "bypassValidation") {
            reject();
          } else {
            reject(err);
          }

        })
    });
  }

  saveScheduleData() {
    return new Promise((resolve, reject) => {
      let objScheduleData = {
        auctionID: this.buyerService.auctionData.auctionID,
        startDate: this.startDate,
        endDate: this.endDate
      }
      this.buyerService.updateScheduleData(objScheduleData).subscribe((res) => {
        this.buyerService.scheduleDetails = false;
        if (res["success"]) {
          this.buyerService.mailAuctionData.startDate = this.basicForm.value.openDate;
          this.buyerService.mailAuctionData.endDate = this.basicForm.value.endDate;
          this.buyerService.mailAuctionData.opent = {
            hours: this.basicForm.value.opent ? this.basicForm.value.opent.getHours() : null,
            minutes: this.basicForm.value.opent ? this.basicForm.value.opent.getMinutes() : null
          };
          this.buyerService.mailAuctionData.endt = {
            hours: this.basicForm.value.endt ? this.basicForm.value.endt.getHours() : null,
            minutes: this.basicForm.value.endt ? this.basicForm.value.endt.getMinutes() : null
          };
          resolve(objScheduleData);
        }

      }, (err) => {
        reject(new Error(err));
      })
    })
  }

  saveBasicDetails(flag = 0) {
    if (flag == 1) {
      if (this.basicForm.value.aucName && this.basicForm.value.decimalPlace != null && this.basicForm.value.aucType) {
        this.saveAucPart1()
        .then(result => {
          return this.refreshAuctionDetails();
        })
        // this.saveAuctionDetails("bypassValidation").then(res => {
        //   debugger
        // })
        .catch(err => {
          if (err && err.message) this.common.error(err.message);
        });
      }
    }
  }

  selectBiddingCurrency(data, flag = null) {
    try {
      if (flag) {
        this.onTextSaveData(flag);
      }
    }
    catch (e) {
      this.common.error(e);
    }
  }

  onTextSaveData(flag = 0) {
    try {

      if (!(this.buyerService.auctionData.auctionID)) {
        this.saveBasicDetails(flag);
      }
    }
    catch (e) {

    }
  }

  selectPrimary() {
    try {
      let bidCurrency = [...this.biddingCurrency.value];
      this.listPrimaryCurrency.forEach(element => {
        if (element.selected) {
          delete element.selected;
        }
        if (element.currencyCode == this.basicForm.controls.primaryCurrency.value.currencyCode) {
          bidCurrency = bidCurrency.filter(x => x.currencyCode != element.currencyCode);
          element.selected = true;
          if (!(this.biddingCurrency.value.includes(x => x.currencyCode == element.currencyCode))) {
            bidCurrency.push(element);
          }
        }
      })
      this.buyerService.auctionData.primaryCurrency = this.basicForm.controls.primaryCurrency.value;
      this.biddingCurrency.setValue(bidCurrency);
    }
    catch (ex) {
      this.common.error(ex);
    }
  }

  resetBiddingCurrency() {
    this.listBiddingCurrency.forEach(element => delete element.selected);
    this.basicForm.controls.primaryCurrency.value.selected = true;
    let arr = [this.basicForm.controls.primaryCurrency.value];
    this.biddingCurrency.setValue(arr);    
  }

	setOldAuctionData(data = null) {
		this.oldData = JSON.parse(JSON.stringify(data));
		this.getAuctionDetailsForId(this.buyerService.auctionData.auctionID).then(res => {
			this.buyerService.auctionData.isTemplate = res["data"].isTemplate ? res["data"].isTemplate : false;
		}).catch(err => {
			this.common.loader = false;
			this.common.error(err);
		});
	}

	getAuctionDetailsForId(auctionId) {
		return new Promise((resolve, reject) => {
			this.buyerService.getAuctionData(this.buyerService.auctionData.auctionID).subscribe((res) => {
				resolve(res);
			}, err => {
				reject();
			})
		})
	}

	refreshAuctionDetails() {
		return new Promise((resolve, reject) => {
			this.buyerService.getAuctionData(this.buyerService.auctionData.auctionID).subscribe((res: any) => {
        //DISPATCH
        this.store.dispatch(new editModuleActions.SetStatusAndRepublishRequired({
          republishRequired: res["data"].republishRequired,
          status: res["data"].status.toLowerCase(),
          isSealedBidAuction: res["data"].isSealedBidAuction ? res["data"].isSealedBidAuction : false,
          bidCurrencyCount: res["data"].currency.length
        }));
        this.store.dispatch(new editModuleActions.SetPrimaryCurrencyAndDecimal({
          primaryCurrency: res.data.primaryCurrencyNew,
          currencyDecimal: res.data.currencyDecimalPlace
        }));
        this.buyerService.auctionData.roundData = res["data"].roundData;
				this.processAuctionData(res);
				resolve({ ...res["data"] });
			}, (err) => {
				this.common.loader = false;
				this.common.error(err);
				reject(err);
			})
		})
	}

	processAuctionData(res) {
    this.buyerService.basicDetails = false;
    let aucObj = res["data"];
    this.republishRequired = aucObj.republishRequired;
    this.basicInfoService.patchBasicForm(aucObj, this.basicForm, this.listPrimaryCurrency);		
		this.buyerRemarks = this.basicInfoService.getBuyerRemark(aucObj);      
		this.buyerService.auctionData.primaryCurrency = this.basicForm.controls.primaryCurrency.value;

		if (res["data"].currency.length > 0) {
			let biddingCurrency = [];
			this.listPrimaryCurrency.forEach(element => {
			if (element.selected) {
				delete element.selected;
			}
			if (element.currencyCode == res["data"].primaryCurrency) {
				element.selected = true;
			}
			})
			res["data"].currency.forEach(element => {
			let bidding = this.listPrimaryCurrency.filter(x => x.currencyCode == element.currencyCode);
			if (bidding.length > 0)
				biddingCurrency.push(bidding[0]);
			});
			this.biddingCurrency.setValue(biddingCurrency)
			this.saveCurrencyData = [...res["data"].currency];
			this.convertToDecimal();
		}

		this.buyerService.auctionData.isTemplate = res["data"].isTemplate ? res["data"].isTemplate : false;
        this.rfqNo = (res["data"].rfqNo) ? res["data"].rfqNo : null;
        this.buyerService.auctionData.auctionStatus = res["data"].status;      
        this.buyerService.auctionData.auctionIdData = res["data"].auctionCode + '-' + String(this.buyerService.auctionData.auctionID);
        // this.buyerService.auctionData.minimumChangeValue = res["data"].currencyDecimalPlace;
        if (res["data"].minBidChangeValue >= 0) {
			this.buyerService.biddingDetails = false;
			this.buyerService.auctionData.minimumChangeValue = res["data"].minBidChangeValue;
			this.buyerService.auctionData.minimumChangeType = res["data"].minBidChangeType;
			this.basicForm.patchValue({
				bidInfoSupplier: this.bidInfoSupplier.filter(obj => obj.value.toLowerCase() == res["data"].infoShownToSupplier)[0],
				bestBidInfo: this.bestBidInfo.filter(obj => obj.value.toLowerCase() == res["data"].bestBidInfoShownBy)[0],
				bidCushionTypeLimit: (this.basicForm.value.aucType != this.auctionType[0].value) ? res["data"].bidCushionTypeLowerLimit : res["data"].bidCushionTypeUpperLimit,
				bidCushionType: this.minBidRange.filter(obj => obj.ID.toLowerCase() == res["data"].bidCushionType)[0].ID,
				extensionType: this.extensionType.filter(obj => obj.value.toLowerCase() == res["data"].extensionType)[0],
				gracePeriod: res["data"].gracePeriod / 60,
				extensionSeconds: res["data"].extensionSeconds / 60,
				minBidChangeValue: res["data"].minBidChangeValue,
				minBidChangeType: this.minBidRange.filter(obj => obj.ID.toLowerCase() == res["data"].minBidChangeType)[0].ID,
        allowties: res["data"].allowties
			})
		}
		
		if (res["data"].startDate) {
			this.buyerService.scheduleDetails = false;
			this.basicForm.patchValue({
				openDate: new Date(res["data"].startDate),
				opent: new Date(res["data"].startDate),
				endDate: new Date(res["data"].endDate),
				endt: new Date(res["data"].endDate)
			})
		}
		this.aucType = true;
		this.buyerService.mailAuctionData = {
			auctionName: this.basicForm.value.aucName,
			type: this.basicForm.value.aucType,
			description: this.basicForm.value.description,
			businessUnit: this.basicForm.value.businessUnit,
			company_name: this.basicForm.value.company,
			startDate: this.basicForm.value.openDate,
			endDate: this.basicForm.value.endDate,
			opent: {
				hours: this.basicForm.value.opent ? this.basicForm.value.opent.getHours() : null,
				minutes: this.basicForm.value.opent ? this.basicForm.value.opent.getMinutes() : null
			},
			endt: {
				hours: this.basicForm.value.endt ? this.basicForm.value.endt.getHours() : null,
				minutes: this.basicForm.value.endt ? this.basicForm.value.endt.getMinutes() : null
			}
    }
    this.topRankShow(aucObj);


	
	}

	

  onAttachDocument() {
    try {
      let sendData = {
        flag: 'openAttach',
        pageFrom: 'header_attachment',
        data: { data: this.basicForm.value, 'aucStatus': this.aucStatus ? this.aucStatus : null },
      }
      this.common.toggleDiv.emit(sendData);
    } catch (e) {
      this.common.error(e.message);
    }
  }

  filterBanks() {
    this.listOrganisation = this.listOrganisationCopy;
    if (this.FilterCtrl.value) {
      this.listOrganisation = this.listOrganisationCopy.filter(
        item => item.name.toLowerCase().indexOf(this.FilterCtrl.value.toLowerCase()) > -1
      );
    }
  }

  CurrfilterBanks(type) {
    this.listPrimaryCurrency = this.listPrimaryCurrencyCopy;
    this.listBiddingCurrency = this.listPrimaryCurrencyCopy;
    if (type == "primaryCurrency" && this.CurrFilterCtrl.value) {
      this.listPrimaryCurrency = this.listPrimaryCurrencyCopy.filter(
        item => item.currencyName.toLowerCase().indexOf(this.CurrFilterCtrl.value.toLowerCase()) > -1
      );
    }
    if (type == "biddingCurrency" && this.BiddCurrFilterCtrl.value) {
      this.listBiddingCurrency = this.listPrimaryCurrencyCopy.filter(
        item => item.currencyName.toLowerCase().indexOf(this.BiddCurrFilterCtrl.value.toLowerCase()) > -1
      );
    }
  }

  aucCapitalize(value) {
    this.basicForm.patchValue({
      aucName: this.common.firstLetterCapital(value)
    });
  }

  updateStatus(type, status) {
    let objDtls = {
      auctionID: this.buyerService.auctionData.auctionID,
      type: type
    }
    this.buyerService.updateStatusOpenClose(objDtls).subscribe((res: any) => {
      if (res.success && status.toLowerCase() == config.AUCTIONSTATUS.OP.toLowerCase()) {
        this.buyerService.auctionData.auctionStatus = config.AUCTIONSTATUS.OP;
        this.store.dispatch(new editModuleActions.SetStatusAndRepublishRequired({ 
          republishRequired: false,
          status: config.AUCTIONSTATUS.OP.toLowerCase() 
        })); 
        this.basicForm.patchValue({ startDate: new Date(res.data.currentDate) });
        this.location.replaceState(`/${routerconfig.buyer_router_links.EDIT_AUCTION}/${this.buyerService.auctionData.auctionID}?status=${this.buyerService.auctionData.auctionStatus}`);
      }
      if (res.success && status == config.AUCTIONSTATUS.CO) {
        this.buyerService.auctionData.auctionStatus = config.AUCTIONSTATUS.CO;
        this.store.dispatch(new editModuleActions.SetStatusAndRepublishRequired({ 
          republishRequired: false,
          status: config.AUCTIONSTATUS.CO.toLowerCase() 
        }));
        this.basicForm.patchValue({ endDate: new Date(res.data.currentDate) });
        this.location.replaceState(`/${routerconfig.buyer_router_links.EDIT_AUCTION}/${this.buyerService.auctionData.auctionID}?status=${this.buyerService.auctionData.auctionStatus}`);
      }
    });
  }

  resendMailToHost() {
    let objEmailDtls1 = {
      auctionID: this.buyerService.auctionData.auctionID,
    }
    this.buyerService.inviteHost(objEmailDtls1).subscribe((res: any) => {
      if (res.success) { this.common.success("Mail Sent Successfully"); }
    })
  }

  resendMailToSupplier() {
    let objEmailDtls2 = {
      auctionID: this.buyerService.auctionData.auctionID,
    }
    this.buyerService.inviteSupplier(objEmailDtls2).subscribe((res: any) => {
      if (res.success) {
        this.common.success("Mail Sent Successfully");
      }
    })
  }

  datechnage(data) {
    this.edo = data.value;
  }

  triggerFullFormSubmit() {
    // This method is called from "EDIT" Component.
    return new Promise((resolve, reject) => {
      this.submitElement.nativeElement.click();
      setTimeout(() => {
        if (this.basicForm.valid && (this.templateAuction != 'true' ? this.validateForPublishing() : this.validateForSaveWhenTemplate())) {
          resolve();
        } else if (this.basicForm.controls.minBidChangeValue.errors && this.basicForm.controls.minBidChangeValue.errors.error) {
          reject(new Error("Input Correct Minimum Bid Change Value "));
        } else if (this.basicForm.controls.bidCushionTypeLimit.errors && this.basicForm.controls.bidCushionTypeLimit.errors.error) {
          reject(new Error("Input Correct Minimum Cushion Limit Value "));
        } else {
          reject(new Error("Fill the required field of basic details"));
        }
      }, 300);
    })
  }

  validateForPublishing() {
    let formObj = this.basicForm.getRawValue();
    if (!formObj.aucName || !String(formObj.decimalPlace) || !formObj.aucType ||
      !formObj.primaryCurrency || !formObj.extensionType || !formObj.openDate ||
      !formObj.opent || !formObj.endDate && formObj.endt) {
      return false;
    } else {
      return true;
    }
  }

  validateForSaveWhenTemplate() {
    let formObj = this.basicForm.getRawValue();
    if (!formObj.aucName || !String(formObj.decimalPlace) || !formObj.aucType ||
      !formObj.primaryCurrency || !formObj.extensionType) {
      return false;
    } else {
      return true;
    }
  }

  submitForm() { console.log("Submitted"); }
  onlyNumberKey(event) {
    const pattern = /[0-9\/\-\ ]/;  
    let inputChar = String.fromCharCode(event.keyCode);
    if (!pattern.test(inputChar)) {
      // invalid character, prevent input
         return false;
    }
   }

	setRawDataReportHeaderInTemplate() {
		let promObj = Promise.all([
		new Promise((resolve, reject) => {
			this.bidService.getRawBid(this.buyerService.auctionData.auctionID).subscribe((res: any) => {
			resolve(res)
			}, (err) => {
			reject()
			})
		}),
		new Promise((resolve, reject) => {
			this.bidService.getAuctionHeaders().subscribe((res: any) => {
			resolve(res);
			}, (err) => {
			reject()
			})
		}),
		new Promise((resolve, reject) => {
			this.buyerService.getAuctionData(this.buyerService.auctionData.auctionID).subscribe((res: any) => {
			if(res["data"].rawDataColumns) {
				this.buyerService.auctionData.rawDataColumns = res["data"].rawDataColumns;
			}
			resolve(res)
			}, (err) => {
			reject()
			})
		})  
		]);

		promObj.then((result) => {
		this.basicInfoService.templateSettingForRawReportHeader(result, this.buyerService.auctionData);
		}).catch(err => {
		console.log('api failed')
		})
	}

  ngOnDestroy() {
    try {
      this.componentActive = false;
      this.destroySubcriptions$.next(true);
      this.destroySubcriptions$.complete();
    } catch (e) {

    }
  }

  topRankShow(aucObj) {
    if (aucObj.type == 'reverse') {
      this.showtopRankOnlyDrop = true;
    }
  }

  openRoundPopup() {
    let sendData = {
      flag: 'openAttach',
      pageFrom: 'roundsAuc',
      data:{
        auctionID:this.buyerService.auctionData.auctionID
      }
    }
    this.common.toggleDiv.emit(sendData);
  }
}
