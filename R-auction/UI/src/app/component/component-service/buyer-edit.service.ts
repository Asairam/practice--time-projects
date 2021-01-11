import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import * as config from '../../appConfig/index';
import { Observable, throwError, forkJoin, Subject } from 'rxjs';
import { catchError, retry, map, shareReplay } from 'rxjs/operators';
import { AuthService } from '../../authService/auth.service';
import * as XLSX from 'xlsx';
import * as FileSaver from 'file-saver';
const EXCEL_TYPE = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';
import { CommonService } from '../../commonService/common.service';
import { EmailTemplate } from './email.template';

@Injectable({
  providedIn: 'root'
})
export class BuyerEditService {
  roundName = '';
  advanceRules = {
    isSealedBidAuction: false
  };
  remarkFlag=false;
  emailTemplate = new EmailTemplate();
  mailAuctionData = {
    auctionName: "",
    type: "",
    description: "",
    businessUnit: "",
    company_name: "",
    startDate: "",
    endDate: "",
    opent: {
      hours: null,
      minutes: null
    },
    endt: {
      hours: null,
      minutes: null
    }
  }
  supplierData = null;
  apiEndPoint = config.APP_CONSTANTS;
  port = config.BASE_URL;
  changeCurrency = new Subject<any>();
  selectPoHistory = new Subject<any>();
  cloneAuctionID: null;
  auctionData: any = {
    auctionID: Number(null),
    minimumChangeValue: 0,
    auctionStatus: null,
    auctionIdData: null,
    decimalPlace: null,
    minimumChangeType: 'amount',
    primaryCurrency: null,
    type: null,
    roundData:null
  };
  basicDetails = true;
  biddingDetails = true;
  scheduleDetails = true;
  itemDetails = [];
  isPublish = false;
  lotList = [];
  participantDetails = [];
  hostDetails = [];
  translateSer: any;
  itemInfo = new Subject<any>();
  customFieldSubject = new Subject<any>();
  customFieldObservable = this.customFieldSubject.asObservable();
  supplierMail = "";
  hostMail = "";
  hostEmail = [];
  supplierEmail = [];
  getCustomFieldObservable() {
    return this.customFieldObservable;
  }
  setCustomFieldObservable(data) {
    this.customFieldSubject.next(data);
  }
  vendorNewaddData = new Subject<any>();
  bidCalculator = new Subject<any>();
  saveAllData = {
    basicDetails: false, items: false, participant: false, host: false, basic: false, biddingRules: false, schedule: false
  }

  constructor(private http: HttpClient, private authService: AuthService, private common: CommonService) {
    this.common.translateSer('ITEM_MSG').subscribe(async (text: string) => {
      this.translateSer = text;
    });
  }

  //start a method for get currencylist
  getCurrencyList() {
    return this.http.get(this.port.baseUrlCore + this.apiEndPoint.GET_CURRENCYLIST)
      .pipe(
        catchError(this.handleError)
      );
  }
  //end

  //start a method for get the company
  getOrganisationList() {
    return this.http.get(this.port.baseUrlCore + this.apiEndPoint.GET_ORGANIZATIONLIST)
      .pipe(
        catchError(this.handleError)
      );
  }
  //end

  //start a method for get the company for admin
  getOrganisationListForAdmin(orgId) {
    return this.http.get(this.port.baseUrlCore + this.apiEndPoint.GET_ORGANIZATIONLIST_ADMIN + orgId)
      .pipe(
        catchError(this.handleError)
      );
  }
  //end

  //start a method for get the previous settings for admin
  getOrganisationSettingForAdmin(orgId) {
    return this.http.get(this.port.baseUrlCore + this.apiEndPoint.GET_ORG_FEATURE + orgId)
      .pipe(
        catchError(this.handleError)
      );
  }
  //end

  //start a method for get auction data if auction id is available
  getAuctionData(id) {
    return this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_BASIC_AUCTION + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  //end

  rawDataReportColTemplate(data) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.RAWDATA_REPORT_COL_TEMPLATE, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  //start a method for publish the auction
  postPublishAuction(data) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.POST_PUBLISH_AUCTION, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  //end

  //start a method for save the auction data
  postAuctionData(data) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.BASIC_INFO, data)
      .pipe(
        catchError(this.handleError)
      );
  }
  //end

  uploadMultipleData(arrData) {
    let multipleJoin = [];
    const httpOptions = {
      headers: new HttpHeaders({
        'authorization': 'Bearer ' + this.authService.getTokenValue(),
        'appId': this.port.appID
      })
    }
    arrData.forEach(element => {
      let data = new FormData();
      data.append('media', element.file.rawFile);
      multipleJoin.push(this.http.post(this.port.commonUrlDocument + this.apiEndPoint.IMAGE_UPLOAD, data, httpOptions));
    });
    return forkJoin(multipleJoin)
      .pipe(
        catchError(this.handleError)
      );
  }
  //end


  //start a method for update the auction data
  updateAuctionData(data) {
    return this.http.put(this.port.baseUrlAuction + this.apiEndPoint.BASIC_INFO, data)
      .pipe(
        catchError(this.handleError)
      );
  }
  //end

  //start a method for update the bidding rules data
  updateBiddingRules(data) {
    return this.http.put(this.port.baseUrlAuction + this.apiEndPoint.PUT_BIDRULES, data)
      .pipe(
        catchError(this.handleError)
      );
  }
  //end

  //start a method for update the scheduling data
  updateScheduleData(data) {
    return this.http.put(this.port.baseUrlAuction + this.apiEndPoint.PUT_SCHEDULEDATA, data)
      .pipe(
        catchError(this.handleError)
      );
  }
  //end

  //start a method for get and save the item details
  // getItemDetails(id) {
  //   return this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_ITEMDETAILS + id)
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }
  //end

  //start a method for get and save the supplier details
  getSupplierDetails(id) {
    return this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_SUPPLIERDETAILS + id)
      .pipe(
        catchError(this.handleError)
      );
  }
  //end

  //start a method for buyer audti log
  getauditlogbuyer(id) {
    return this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_BUYER_AUDTITLOG + id)
      .pipe(
        catchError(this.handleError)
      );
  }
  //end
  //start a method for supplier audti log
  getauditlogsup(id) {
    return this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_SUP_AUDITLOG + id)
      .pipe(
        catchError(this.handleError)
      );
  }
  //end

  getVendorList(data) {
    return this.http.post(this.port.baseUrlCore + this.apiEndPoint.GET_VENDORLIST, data)
      .pipe(
        catchError(this.handleError)
      );
  }
  getCustomerList(data) {
    return this.http.post(this.port.baseUrlCore + this.apiEndPoint.GET_CUSTOMERLIST, data)
      .pipe(
        catchError(this.handleError)
      );
  }


  getUnregisterVendorList(data) {
    return this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_UNREGISTERSUPPLIERDETAILS + data)
      .pipe(
        catchError(this.handleError)
      );
  }

  // getAllUser(data) {
  //   return this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_UNREGISTERSUPPLIERDETAILS + data)
  //     .pipe(
  //       catchError(this.handleError)
  //     );
  // }

  uom() {
    return this.http.get(this.port.baseUrlCore + this.apiEndPoint.UOM)
      .pipe(
        map((resObj: any) => {
          resObj.data.forEach(obj => {
            obj.name = obj.name.replace('"', "");
          });
          return resObj;
        }),
        catchError(this.handleError)
      );
  }

  getLotData(id) {
    return this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_LOT + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  getHostData(id) {
    return this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_HOST_DATA + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  getPoHistory(id) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.PO_HISTORY_REPORT + id, {})
      .pipe(
        catchError(this.handleError)
      );
  }

  saveItemList(arr, id) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.SAVE_ITEM_LIST + id, arr)
      .pipe(
        catchError(this.handleError)
      );

  }

  saveLotSequence(payload) {
    return this.http.put(this.port.baseUrlAuction + this.apiEndPoint.SAVE_LOT_SEQUENCE, payload)
      .pipe(
        catchError(this.handleError)
      );

  }

  saveItemListSortOrder(obj) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.SAVE_ITEM_LIST_SORT_ORDER, obj)
      .pipe(
        catchError(this.handleError)
      );

  }

  getbasicinfodata(id) {
    return this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_BASICINFOPOPUPDATA + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  itemRemove(obj) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.ITEM_REMOVE, obj)
      .pipe(
        catchError(this.handleError)
      );
  }

  excelUpload(arr) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.ITEM_EXCEL_UPLOAD, arr)
      .pipe(
        catchError(this.handleError)
      );
  }

  excelUploadMMCS(arr) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.ITEM_EXCEL_MMCS_UPLOAD, arr)
      .pipe(
        catchError(this.handleError)
      );
  }

  uploadMmcsList(arr) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.ITEM_ARRAY_MMCS_UPLOAD, arr)
      .pipe(
        catchError(this.handleError)
      );
  }

  createLot(obj) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.CREATE_LOT, obj)
      .pipe(
        catchError(this.handleError)
      );
  }
  updateLot(data) {
    return this.http.put(this.port.baseUrlAuction + this.apiEndPoint.UPDATE_LOT, data)
      .pipe(
        catchError(this.handleError)
      );
  }
  deleteLot(obj) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.DELETE_LOT, obj)
      .pipe(
        catchError(this.handleError)
      );
  }

  getLotList(auctionID) {
    this.lotList = [];
    this.getLotData(auctionID).subscribe((res) => {
      this.lotList = res['data'];
    }, (err) => { });
    return this.lotList;
  }

  getBothLot(id, newID) {
    let multipleJoin = [this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_LOT + id),
    this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_LOT + newID),
    this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_ITEMDETAILS + id),
    this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_SUPPLIERDETAILS + id),
    this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_HOST_DATA + id),
    this.http.get(this.port.baseUrlBid + this.apiEndPoint.GET_CUSTOM_FIELD_LIST + id)
    ]
    return forkJoin(multipleJoin)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAuctionPrintpreview(id) {
    let multipleJoin = [this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_BASIC_AUCTION + id),
    // this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_LOT + id),
    this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_ITEMDETAILS + id),
    this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_SUPPLIERDETAILS + id),
    this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_HOST_DATA + id),
    //this.http.get(this.port.baseUrlBid + this.apiEndPoint.GET_CUSTOM_FIELD_LIST + id),
    this.getPreliminaryBidById(id)
    ]
    return forkJoin(multipleJoin)
      .pipe(
        catchError(this.handleError)
      );
  }

  getSupplierAndPreliminary(id, vendorcode) {
    let multipleJoin = [this.getSupplierDetails(id), this.getPreliminaryBidByVendorCode(id, vendorcode)];
    return forkJoin(multipleJoin)
      .pipe(
        catchError(this.handleError)
      );
  }

  getBidHistory(id, sortBy) {
    return this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_BID_HISTORY + id +"?sortName="+sortBy.columnName+"&sortType="+sortBy.type)
      .pipe(
        catchError(this.handleError)
      );

  }

  getExchangeRate(data) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.GET_EXCHANGE_RATE, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  getMasterData() {
    let multipleJoin = [this.http.get(this.port.baseUrlCore + this.apiEndPoint.GET_CURRENCYLIST),
    this.http.get(this.port.baseUrlCore + this.apiEndPoint.GET_ORGANIZATIONLIST),
    this.http.get(this.port.baseUrlCore + this.apiEndPoint.GET_EXCHANGE_RATE)]

    return forkJoin(multipleJoin)
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllTemplate() {
    return this.http.get(this.port.baseUrlCore + this.apiEndPoint.GET_ALLTEMPLATE)
  }

  createAuctionUsingTemplate(data) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.CREATE_AUCTIONWITHTEMPLATE, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  getItemsData(id) {
    let multipleJoin = [this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_LOT + id),
    this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_ITEMDETAILS + id)
    ]

    return forkJoin(multipleJoin)
      .pipe(
        catchError(this.handleError)
      );
  }

  getItem(id){
    return this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_ITEMDETAILS + id)
    .pipe(
      catchError(this.handleError)
    );
  }

  getItemDataPass(itemData) {
    this.itemInfo.next({ lotData: this.lotList, itemData: itemData });
  }

  getHostsByEmailId(data) {
    let multipleJoin = [];
    data.forEach(element => {
      multipleJoin.push(this.http.get(this.port.userProfile + this.apiEndPoint.GET_SUPPLIERBYEMAILID + element.trim()))
    });
    return forkJoin(multipleJoin).pipe(
      catchError(this.handleError)
    );
  }

  getSuppliersByEmailId(data) {
    let multipleJoin = [];
    data.forEach(element => {
      if(element.useremail1)
      multipleJoin.push(this.http.get(this.port.userProfile + this.apiEndPoint.GET_SUPPLIERBYEMAILID + element.useremail1.trim()));
    });
    return forkJoin(multipleJoin).pipe(map(x => {
      x.forEach(data => {
        if (data["data"]) {
          if (data["data"]["settings"]) {
            let vendor = data["data"]["settings"];
            if (vendor["ril"]["customerCode"]) {
              if (vendor["ril"]["vendorcode"]) {
                vendor["ril"]["vendorcode"]=[...vendor["ril"]["vendorcode"],...vendor["ril"]["customerCode"]];
              }
              else {
                vendor["ril"]["vendorcode"] = vendor["ril"]["customerCode"];
              }
              delete vendor["ril"]["customerCode"];
            }
          }
        }
      })
      return x;
    })).pipe(
      catchError(this.handleError)
    );
  }

  getSupplierByEmailId(email) {
    return this.http.get(this.port.userProfile + this.apiEndPoint.GET_SUPPLIERBYEMAILID + email.trim())
      .pipe(
        catchError(this.handleError)
      );
  }

  registerNewVendor(obj) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.POST_NEWREGISTER_VENDOR, obj)
      .pipe(
        catchError(this.handleError)
      );
  }

  insertSupplierData(objData: any) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.POST_SUPPLIER_DATA, objData)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateSupplierData(objData: any, liveParticipantAdd) {
    if(liveParticipantAdd) {
      return this.http.put(this.port.baseUrlAuction + this.apiEndPoint.PUT_SUPPLIER_DATA_LIVE , objData)
      .pipe(
        catchError(this.handleError)
      );
    } else {
      return this.http.put(this.port.baseUrlAuction + this.apiEndPoint.PUT_SUPPLIER_DATA, objData)
      .pipe(
        catchError(this.handleError)
      );
    }
    
  }

  insertHostData(objData: any) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.POST_HOST_DATA, objData)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateHostData(objData: any) {
    return this.http.put(this.port.baseUrlAuction + this.apiEndPoint.PUT_HOST_DATA, objData)
      .pipe(
        catchError(this.handleError)
      );
  }

  insertPreBidItem(objData: any) {
    return this.http.post(this.port.baseUrlBid + this.apiEndPoint.POST_PREBIDITEM, objData)
      .pipe(
        catchError(this.handleError)
      );
  }

  getPreliminaryBidById(id) {
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.GET_BIDITEM + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  getPreliminaryBidByVendorCode(id, vendorcode) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + this.authService.getTokenValue(),
        'vendorcode': vendorcode
      }),
    }
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.GET_BIDITEM_VENDORCODE + id, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  deletePreliminaryBid(objData: any) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + this.authService.getTokenValue()
      }),
      body: objData
    }
    return this.http.delete(this.port.baseUrlBid + this.apiEndPoint.DELETE_BIDITEM, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateStatusOpenClose(objData) {
    objData.auctionID = Number(objData.auctionID);
    return this.http.post(this.port.baseUrlBid + this.apiEndPoint.OPEN_CLOSE_AUCTION, objData)
      .pipe(
        catchError(this.handleError)
      );
  }

  inviteHost(objData) {
    return this.http.post(this.port.baseUrlBid + this.apiEndPoint.INVITE_HOST, objData)
      .pipe(
        catchError(this.handleError)
      );
  }
  inviteSupplier(objData) {
    return this.http.post(this.port.baseUrlBid + this.apiEndPoint.INVITE_SUPPLIER, objData)
      .pipe(
        catchError(this.handleError)
      );
  }

  createCustomFieldData(data) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.CREATE_CUSTOM_FIELD, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  updateCustomFieldData(data) {
    return this.http.put(this.port.baseUrlAuction + this.apiEndPoint.UPDATE_CUSTOM_FIELD, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteCustomFieldData(data) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.DELETE_CUSTOM_FIELD, data)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCustomFieldList(auctionId) {
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.GET_CUSTOM_FIELD_LIST + auctionId)
      .pipe(
        catchError(this.handleError)
      );
  }

  getMaterialDetails(id) {
    return this.http.get(this.port.baseUrlMaterial + this.apiEndPoint.GET_MATERIAL_DETAILS_URL + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  getMaterialAttachmentDetails(id) {
    return this.http.get(this.port.baseUrlMaterial + this.apiEndPoint.GET_MATERIAL_ATTACHMENT_DETAILS + id)
      .pipe(
        catchError(this.handleError)
      );
  }
  getMmcdDownloadUrl(sapcode, sapdocno) {
    if (!sapdocno) {
      return "Document number missing";
    }
    return this.port.baseUrlMaterial + this.apiEndPoint.MMCS_FILE_DOWNLOAD + sapcode + '/' + sapdocno;
  }

  hostMailBody = (remark=null,status=null) => {    
    if (this.hostMail) {
      if(this.roundName) {
        this.hostMail = this.updateRound(this.hostMail);
      }
      if (remark) {
        this.hostMail = this.updateRemark(remark, this.hostMail);
      }
      if (!(this.hostMail.includes("<style>")))
        this.hostMail += this.emailTemplate.mailStyle;

      this.hostMail = this.updateMailTemplate(this.hostMail,status);
      return this.hostMail;
    }
    return this.defaultHostMail();
  }

  defaultHostMail = () => {
    let data = this.commonMailData();
    return this.emailTemplate.hostMailTemplate(data);
  }

  commonMailData = () => {
    let value = this.mailAuctionData;
    let name = value.auctionName ? value.auctionName : '';
    let type = value.type ? value.type : '';
    let description = value.description ? value.description : '';
    let businessUnit = value.businessUnit ? value.businessUnit : '';
    let org_name = this.authService.getUserData();
    let company_name = value.company_name ? value.company_name : '';
    let startDate = value.startDate ? new Date(value.startDate) : '';
    let sTime = value.opent.hours ? (value.opent.hours + ':' + (value.opent.minutes < 10 ? '0' + value.opent.minutes : value.opent.minutes)) : '';
    let endDate = value.endDate ? new Date(value.endDate) : '';
    let eTime = value.endt.hours ? (value.endt.hours + ':' + (value.endt.minutes < 10 ? '0' + value.endt.minutes : value.endt.minutes)) : '';
    let Fname = org_name.name.firstname;
    let fname = Fname.toUpperCase();
    let Lname = org_name.name.lastname;
    let lname = Lname.toUpperCase();
    let applicationUrl = config.BASE_URL.applicationUrl;
    return {
      value, name, type, description, businessUnit, org_name, company_name, startDate, sTime, endDate, eTime, Fname, fname, Lname, lname, applicationUrl
    };
  }

  defaultSupplierMail = () => {
    let data = this.commonMailData();
    return this.emailTemplate.supplierMailtemplate(data);
  }

  updateRemark(remark=null, data,supplier=false) {
    let e = document.createElement("div");
    e.setAttribute('style', 'display: none;');
    e.innerHTML = data;
    let update = e.querySelectorAll('.update');
    if (update.length > 0) {
      if (e.getElementsByClassName('remark').length > 0) {
        e.getElementsByClassName('remark')[0].innerHTML =(supplier)? this.emailTemplate.republishRemark(this.mailAuctionData.company_name, this.auctionData.auctionID, remark)
        :this.emailTemplate.republishRemarkHost(this.mailAuctionData.company_name, this.auctionData.auctionID, remark);
      }
      if (e.getElementsByClassName('note').length > 0) {
        e.getElementsByClassName('note')[0].innerHTML =(supplier)? this.emailTemplate.noteSup(): this.emailTemplate.noteHost();
      }
      return e.innerHTML;
    }
    else {
      return data;
    }
  }

  updateMailTemplate(data,status=null,supplier=false) {
    let e = document.createElement("div");
    e.setAttribute('style', 'display: none;');
    e.innerHTML = data;
    let update = e.querySelectorAll('.update');
    if (update.length > 0) {
      for (let i = 0; i < update.length; i++) {
        update[i].setAttribute("contenteditable", "false");
      }

      let commonData = this.commonMailData();
      commonData.startDate = new Date(commonData.startDate);
      commonData.endDate = new Date(commonData.endDate);
      let startDate = (commonData.sTime && commonData.startDate) ? (commonData.startDate.getDate() + '/' + (commonData.startDate.getMonth() + 1) + '/' + commonData.startDate.getFullYear() + ' ' + (commonData.sTime ? commonData.sTime : '')) : '';
      let endDate = (commonData.eTime && commonData.endDate) ? (commonData.endDate.getDate() + '/' + (commonData.endDate.getMonth() + 1) + '/' + commonData.endDate.getFullYear() + ' ' + (commonData.eTime ? commonData.eTime : '')) : ''
      
      if (e.getElementsByClassName('remark').length > 0 && status) {
        e.getElementsByClassName('remark')[0].setAttribute("contenteditable", "false");
        e.getElementsByClassName('remark')[0].innerHTML =(supplier)?this.emailTemplate.inviteRemarkSup(commonData.company_name):this.emailTemplate.inviteRemark(commonData.company_name);
      }

      if (e.getElementsByClassName('company').length > 0) {
        e.getElementsByClassName('company')[0].setAttribute("contenteditable", "false");
        e.getElementsByClassName('company')[0].innerHTML = commonData.company_name;
      }

      if (e.getElementsByClassName('name').length > 0) {
        e.getElementsByClassName('name')[0].setAttribute("contenteditable", "false");
        e.getElementsByClassName('name')[0].innerHTML = commonData.name;
      }

      if (e.getElementsByClassName('type').length > 0) {
        e.getElementsByClassName('type')[0].setAttribute("contenteditable", "false");
        e.getElementsByClassName('type')[0].innerHTML = commonData.type.toUpperCase();
      }

      if (e.getElementsByClassName('description').length > 0) {
        e.getElementsByClassName('description')[0].setAttribute("contenteditable", "false");
        e.getElementsByClassName('description')[0].innerHTML = commonData.description;
      }

      if (e.getElementsByClassName('business').length > 0) {
        e.getElementsByClassName('business')[0].setAttribute("contenteditable", "false");
        e.getElementsByClassName('business')[0].innerHTML = commonData.businessUnit.toUpperCase();
      }

      if (e.getElementsByClassName('start').length > 0) {
        e.getElementsByClassName('start')[0].setAttribute("contenteditable", "false");
        e.getElementsByClassName('start')[0].innerHTML = startDate;
      }

      if (e.getElementsByClassName('end').length > 0) {
        e.getElementsByClassName('end')[0].setAttribute("contenteditable", "false");
        e.getElementsByClassName('end')[0].innerHTML = endDate;
      }

      if (e.getElementsByClassName('login').length > 0) {
        e.getElementsByClassName('login')[0].setAttribute("contenteditable", "false");
      }

      return e.innerHTML;
    }
    else {
      return data;
    }
  }

  supplierMailBody = (remark = null,status=null) => {
    if (this.supplierMail) {
      if(this.roundName) {
        this.supplierMail = this.updateRound(this.supplierMail);
      }
      if (remark) {
        this.supplierMail = this.updateRemark(remark, this.supplierMail,true);
      }
      if (!(this.supplierMail.includes("<style>")))
        this.supplierMail += this.emailTemplate.mailStyle;

      this.supplierMail = this.updateMailTemplate(this.supplierMail,status,true);

      return this.supplierMail;
    }
    return this.defaultSupplierMail();
  }

  public exportAsExcelFile(json: any[], excelFileName: string, uom: any[]): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json, {
      header: ["S.No", "Lot", "Item Code", "Name", "Description", "Minimum Desired Quantity", "Unit Of Measure",
        "Historical Cost", "Historical Cost Date", "Start Price", "Minimum Bid Change"]
    });
    const workbook: XLSX.WorkBook = { Sheets: { 'data': worksheet }, SheetNames: ['data'] };
    
    this.appendSheetInstruction(workbook);
    if(uom && uom.length > 0) this.appendSheetUOM(workbook, uom);
    const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    //const excelBuffer: any = XLSX.write(workbook, { bookType: 'xlsx', type: 'buffer' });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  appendSheetInstruction(workbook) {
    var ws_data = [
      ["Note"],
      ["Sr no is mandatory."],
      ["Date format DD-MM-YYYY."],
      ["In Historical date forward slash or hyphen is allowed."],
      ["Field length for minimum desired quantity is 13(upto 2 decimal places allowed)."],
      ["Field length for Historical cost,Minimum bid change ,Start price is 14(upto 2 decimal places allowed)."],
      ["MMCS data is non editable."]
    ];    
    var ws_name = "Instructions";
    var ws = XLSX.utils.aoa_to_sheet(ws_data);
    XLSX.utils.book_append_sheet(workbook, ws, ws_name);
  }

  appendSheetUOM(workbook, uom) {  
    let body = uom.map((ele, index) => {
      return {"Sr.no": index+1, "Name": ele.name, "Description": ele.description};
    })
    var ws_name = "Unit of Measurement";
    var ws = XLSX.utils.json_to_sheet(body, {header:["Sr.no","Name","Description"]});
    XLSX.utils.book_append_sheet(workbook, ws, ws_name);
  }

  private saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], {
      type: EXCEL_TYPE
    });
    FileSaver.saveAs(data, fileName + '_export' + EXCEL_EXTENSION);
    this.common.success(this.translateSer['EXCEL_DOWN_SU']);
  }

  getBidDelete(obj) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + this.authService.getTokenValue()
      }),
      body: obj
    }
    return this.http.delete(this.port.baseUrlBid + this.apiEndPoint.REMOVE_BID_HISTORY, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  auctionDelete(id) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.AUC_DELETE + id, '')
      .pipe(
        catchError(this.handleError)
      );
  }

  auctionHardDelete(id) {
    return this.http.delete(this.port.baseUrlAuction + this.apiEndPoint.AUC_HARD_DELETE + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  buyerRemark(objInfo=null) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.POST_BUYER_REMARK, objInfo)
      .pipe(
        catchError(this.handleError)
      );
  }
  saveSettingForAdmin(objData: any) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.GET_ORG_FEATURE, objData)
      .pipe(
        catchError(this.handleError)
      );
  }
  suspendAuctionId(id) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.SUSPEND_AUCTION_ID + id, '')
      .pipe(
        catchError(this.handleError)
      );
  }

  getCustomFilList(id) {
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.GET_SUPP_CUS_FIL + id)
        .pipe(
            catchError(this.handleError)
        );
   }

   insertCustomFilList(obj) {
    return this.http.post(this.port.baseUrlBid + this.apiEndPoint.SUPP_CUS_FIL, obj)
        .pipe(
            catchError(this.handleError)
        );
    }

    insertMatrixCustomFilList(obj) {
    return this.http.post(this.port.baseUrlBid + this.apiEndPoint.MATRIX_CUS_FIL, obj)
        .pipe(
            catchError(this.handleError)
        );
    }

    saveDisColumnsFil(payload){
      this.insertCustomFilList(payload).subscribe((res: any) => {
        this.common.loader = true;
      }, (err) => {});
    }

    uploadPreliminaryExcel(excelData: any,aucID) {
      return this.http.post(this.port.baseUrlBid + this.apiEndPoint.PRELIMINARY_EXCEL_UP + aucID, excelData)
        .pipe(
          catchError(this.handleError)
        );
    }


    getItemExchangeRate(data) {
      return this.http.post(this.port.baseUrlMaterial + this.apiEndPoint.GET_EXCHANGE_RATE, data)
        .pipe(
          catchError(this.handleError)
        );
    }

    updateRound(data) {
      let e = document.createElement("div");
      e.setAttribute('style', 'display: none;');
      e.innerHTML = data;
      let update = e.querySelectorAll('.update');
      if (update.length > 0) {
        if (e.getElementsByClassName('round').length > 0) {
          e.getElementsByClassName('round')[0].innerHTML =this.emailTemplate.roundAucName(this.roundName);
        }
        return e.innerHTML;
      }
      else {
        return data;
      }

    }

  private handleError(error: HttpErrorResponse) {
    // return an observable with a user-facing error message
    return throwError(
      (error.error.message) ? error.error.message : 'Unable to connect to server.');
  };
  
}
