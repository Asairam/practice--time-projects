import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import * as config from '../../appConfig/index';
import { Observable, throwError, forkJoin, Subject } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { AuthService } from '../../authService/auth.service';
import { CommonService } from '../../commonService/common.service';

@Injectable({
  providedIn: 'root'
})
export class BuyerBiddingService {
  disCol = ['quantity','uom','BaselineSavingsP','Currency','numberOfBids','ItemCode','minimumChangeValue','BaselineUnitCost','Baseline','StartPrice'];
  BestBidInformationShownBasedOn;
  apiEndPoint = config.APP_CONSTANTS;
  port = config.BASE_URL;
  summaryList: any;
  supplierDetails = [];
  translateSer: any;
  participantsArr = [];
  landedColumnIndex = [7, 8, 11];
  columnIndex = [5, 6];
  columnNames = [];
  savingTypeSubject = new Subject();
  savingTypeObs = this.savingTypeSubject.asObservable();
  displayedColumns=[];
  columnNamesMatrix=[];
  columnNamesItem=[];

  constructor(private http: HttpClient, private authService: AuthService, private common: CommonService) {

  }

  get columnName(){
    return this.columnNames;
  }


  get displayedColumn(){
    return this.displayedColumns;
  }

  set setColumn(value){
    this.displayedColumns = [value, ...this.columnNamesMatrix.map(x => { return x.selected ? x.item_id : '' }).filter(x => x)];
   }

  set matrixColumn(viewType) {
     if (viewType == 'item') {
      if (this.columnNamesItem.length == 0)
        this.setColumnNames();

      this.columnNames = this.columnNamesItem;
    }
    else if (viewType == 'supplier') {
      // this.columnNamesMatrix = [];
      if (this.columnNamesMatrix.length == 0) {
        this.columnNamesMatrix = [{ ind: 1, item_id: 'quantity', item_text: 'Reliance Quantity', selected: true },
        { ind: 2, item_id: 'unitMeasure', item_text: 'UOM', selected: true },
        { ind: 3, item_id: 'baselineUnit', item_text: 'Historical Unit Rate', selected: false },
        { ind: 4, item_id: 'baseline', item_text: 'Historical Total Value', selected: true },
        { ind: 0, item_id: 'itemCode', item_text: 'Item Code', selected: true },
        { ind: 5, item_id: 'startPrice', item_text: 'Start Price', selected: false },
        { ind: 6, item_id: 'bidders', item_text: 'Active Participants', selected: false },
        ]
        this.supplierDetails.forEach((supplier, index) => {
          this.columnNamesMatrix.push({
            ind: 7 + index, item_id: supplier.supplierID, item_text: supplier.supplierName1, selected: true, participant:true
          })
        });
       this.setColumn = 'name';
      }
      this.columnNames = this.columnNamesMatrix;

    }
  }

  setColumnNames() {
    this.columnNamesItem = [{ ind: 0, item_id: 'quantity', item_text: 'Reliance Quantity', selected: true, disable: false },
    { ind: 1, item_id: 'uom', item_text: 'UOM', selected: true, disable: false },
    { ind: 2, item_id: 'BaselineUnitCost', item_text: 'Historical Unit Rate', selected: true, disable: false },
    { ind: 3, item_id: 'Baseline', item_text: 'Historical Total Value', selected: true, disable: false },
    { ind: 4, item_id: 'Currency', item_text: 'Currency', selected: true, disable: false },
    { ind: 5, item_id: 'CurrentBidUnitCost', item_text: 'Best Bid Unit Rate', selected: true, disable: false },
    { ind: 6, item_id: 'CurrentBid', item_text: 'Best Bid Total Value', selected: true, disable: false },
    { ind: 7, item_id: 'LandedUnit', item_text: 'Landed Unit Rate', selected: false, disable: false },
    { ind: 8, item_id: 'TotalLanded', item_text: 'Total Landed Cost', selected: false, disable: false },
    { ind: 9, item_id: 'BaselineSavingsP', item_text: 'Savings %', selected: true, disable: false },
    { ind: 10, item_id: 'BaselineSavings', item_text: 'Savings', selected: true, disable: false },
    { ind: 11, item_id: 'SupplierOrganization', item_text: ' Top Participant', selected: false, disable: false },
    { ind: 12, item_id: 'ItemCode', item_text: 'Item Code', selected: false, disable: false },
    { ind: 13, item_id: 'StartPrice', item_text: 'Start Price', selected: false, disable: false },
    { ind: 14, item_id: 'PreliminaryBidCost', item_text: 'Preliminary Bid Cost', selected: false, disable: false },
    { ind: 15, item_id: 'IntialBidCost', item_text: 'Intial Bid Cost', selected: false, disable: false },
    { ind: 16, item_id: 'PreliminaryBidCostTotalValue', item_text: 'Preliminary Bid Total Value', selected: false, disable: false },
    { ind: 17, item_id: 'IntialBidCostTotalValue', item_text: 'Intial Bid Total Value', selected: false, disable: false },
    { ind: 18, item_id: 'minimumChangeValue', item_text: 'Minimum Bid Change', selected: false, disable: false }
    ]
  }

  getAuctionDataById(id) {
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.GET_AUCTIONDATABYID + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  getItemBidDetails(id) {
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.GET_BUYER_SUMMARY_LIST + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  participateSupplierList(id) {
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.PARTICIPATE_AUC_SUPPLIER_LIST + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  getLiveBidDetails(id) {
    let multipleJoin = [this.http.get(this.port.baseUrlBid + this.apiEndPoint.GET_AUCTIONDATABYID + id),
    this.http.get(this.port.baseUrlAuction + this.apiEndPoint.GET_SUPPLIERDETAILS + id)
    ]

    return forkJoin(multipleJoin)
      .pipe(
        catchError(this.handleError)
      );
  }

  pauseResumeAuction(obj) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.PAUSE_RESUME, obj)
      .pipe(
        catchError(this.handleError)
      );
  }

  getMatrixDetails(id) {
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.GET_MATRIXDETAILS + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  getBidReport(auctionID, baseLineType) {
    let id = auctionID + "/" + baseLineType;
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.BID_REPORT + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  getBidReportExcel(auctionID, baseLineType) {
    let token = this.authService.getTokenValue();
    let id = auctionID + "/" + baseLineType + '?token=' + token;
    // window.open(this.port.baseUrlBid + this.apiEndPoint.BID_REPORT_EXCEL + id, "_self");
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.BID_REPORT_EXCEL + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  getBidReportExcelLandscape(auctionID, baseLineType) {
    let token = this.authService.getTokenValue();
    let id = auctionID + "/" + baseLineType + '?token=' + token;
    // window.open(this.port.baseUrlBid + this.apiEndPoint.BID_REPORT_LANDSCAPE_EXCEL + id, "_self");
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.BID_REPORT_LANDSCAPE_EXCEL + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  getRawBid(auctionID, data?) {
    let id = auctionID;
    if(!data) data = '';
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.GET_RAW_BID_INFO + id + data)
      .pipe(
        catchError(this.handleError)
    );
  }

  getAuctionHeaders() {
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.GET_AUCTION_HEADERS)
      .pipe(
        catchError(this.handleError)
      );
  }

  getRawBidReportExcel(auctionID, qry) {
    let token = this.authService.getTokenValue();
    let id = auctionID + '?token=' + token;
    if(qry) id = id + qry;
    // window.open(this.port.baseUrlBid + this.apiEndPoint.GET_RAW_BID_REPORT_EXCEL + id, "_self");
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.GET_RAW_BID_REPORT_EXCEL + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  getBidHistoryExcel(auctionID){
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.BID_HISTORY_EXCEL + auctionID)
      .pipe(
        catchError(this.handleError)
      );
    // window.open(this.port.baseUrlBid + this.apiEndPoint.BID_HISTORY_EXCEL + auctionID, "_self")
  }

  getAdminReports(startDate, endDate, org, method) {
    let id = '?org=' + org + '&startDate=' + startDate + '&endDate=' + endDate  + '&method=' + method;
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.ADMIN_REPORT + id)
      .pipe(
        catchError(this.handleError)
      );
  }
  getAdminReportExcel(startDate, endDate, org, method) {
    let token = this.authService.getTokenValue();
    let id = '?token=' + token + '&org=' + org + '&startDate=' + startDate + '&endDate=' + endDate  + '&method=' + method;
    // window.open(this.port.baseUrlBid + this.apiEndPoint.ADMIN_REPORT_EXCEL + id, "_self");
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.ADMIN_REPORT_EXCEL + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  getMisReports(startDate, endDate, pageNum, pageSize) {
    let id = '?startDate=' + startDate + '&endDate=' + endDate  + '&pageSize=' + pageSize;
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.MIS_REPORT + pageNum + id)
      .pipe(
        catchError(this.handleError)
      );
  }
  getMISReportExcel(startDate, endDate, auctionHeader, itemheader) {
    let token = this.authService.getTokenValue();
    let queryParam = `?token=${token}&startDate=${startDate}&endDate=${endDate}&auctionHeader=${auctionHeader}&itemHeader=${itemheader}`;
    window.open(this.port.baseUrlBid + this.apiEndPoint.MIS_REPORT_EXCEL + queryParam, "_self");
  }

  getCumulativeAdminReport(startDate, endDate, org, pageNum, host, pageSize) {
    let queryParam = `?org=${org}&startDate=${startDate}&endDate=${endDate}&host=${host}&pageSize=${pageSize}`;
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.ADMIN_CUMULATIVE_REPORT+ pageNum + queryParam)
      .pipe(
        catchError(this.handleError)
      );
  }

  getCumulativeAdminReportExcel(startDate, endDate, org, host, auctionHeader, itemheader, type) {
    let token = this.authService.getTokenValue();
    let queryParam = `?org=${org}&startDate=${startDate}&endDate=${endDate}&host=${host}&auctionHeader=${auctionHeader}&itemHeader=${itemheader}&type=${type}`;
    // window.open(this.port.baseUrlBid + this.apiEndPoint.ADMIN_CUMULATIVE_REPORT_EXCEL + queryParam, "_self");

    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.ADMIN_CUMULATIVE_REPORT_EXCEL + queryParam)
      .pipe(
        catchError(this.handleError)
      );
  }

  getReportGenerateStatus(pageNum) {
      return this.http.get(this.port.baseUrlBid + this.apiEndPoint.GET_REPORT_GENERATE_STATUS + pageNum)
      .pipe(
        catchError(this.handleError)
      );
  }

  getUserSpecificCumuReportSettings() {
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.CUMU_REPORT_USER_CONFIG)
      .pipe(
        catchError(this.handleError)
      );
  }
  saveUserSpecificCumeReportSettings(obj) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.CUMU_REPORT_USER_CONFIG, obj)
      .pipe(
        catchError(this.handleError)
      );
  }


  getUserSpecificMISReportSettings() {
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.GET_MIS_REPORT_USER_CONFIG)
      .pipe(
        catchError(this.handleError)
      );
  }
  saveUserSpecificMISReportSettings(obj) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.MIS_REPORT_USER_CONFIG, obj)
      .pipe(
        catchError(this.handleError)
      );
  }

  getOrganization(id) {

    return this.http.get(encodeURI(this.port.baseUrlBid + this.apiEndPoint.GET_ORG + id))
      .pipe(
        catchError(this.handleError)
      );
  }

  getAllOrganization() {
    return this.http.get(encodeURI(this.port.baseUrlBid + this.apiEndPoint.GET_ALL_ORG_LIST))
      .pipe(
        catchError(this.handleError)
      );
  }

  removeparticipateSupplier(obj) {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json',
        'authorization': 'Bearer ' + this.authService.getTokenValue()
      }),
      body: obj
    }
    return this.http.delete(this.port.baseUrlBid + this.apiEndPoint.REMOVE_PARTICIPATE_SUPP, httpOptions)
      .pipe(
        catchError(this.handleError)
      );
  }

  getauditlog(obj) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.AUDIT_LOG, obj)
      .pipe(
        catchError(this.handleError)
      );
  }

  getuserOrgList(id) {
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.GET_USER_ORG_LIST + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  getUsersInAnOrg(orgId) {
    let qp = `?filter={"org":{"$in":[${orgId}]}}`;
    // http://rauctiondev.ril.com/pnc/security/api/v1/user?filter={"org":{"$in":[1268]}}
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.GET_USER_IN_AN_ORG + qp)
      .pipe(
        catchError(this.handleError)
      );
  }

  filterSavingAuction(obj) {
    return this.http.post(this.port.baseUrlAuction + this.apiEndPoint.SAVINGS_FILTER, obj)
      .pipe(
        catchError(this.handleError)
      );
  }

  getMatrixCusFilDetails(id) {
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.MATRIX_GET_CUS_FIL + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  matrixShowOnlyBidders(sele) {
    let b1 = this.columnNamesMatrix.find((obj) => obj.item_id == 'bidders');
    if (b1 && b1.selected) {
      let findBidded = this.supplierDetails.filter((det) => det.status.toLowerCase() == 'bidded');
      if (findBidded && findBidded.length > 0) {
        this.columnNamesMatrix.filter((det) => det.participant).forEach((fil) => {
          fil.disable = true;
          if (!(findBidded.find((f1) => f1.supplierID == fil.item_id))) {
            fil.selected = false;
          } else if(findBidded.find((f1) => f1.supplierID == fil.item_id)){
            fil.selected = true;
          }
        })
      } else {
        this.columnNamesMatrix.filter((det) => det.participant).forEach(element => {
          element.selected = false;
          element.disable = true;
        });
      }
    } else {
      if(sele == "dro"){
      this.columnNamesMatrix.filter((det) => det.participant).forEach(element => {
        element.selected = true;
        element.disable = false;
      });
    }
    }
  }

  getInviteSealedBid(id) {
    return this.http.get(this.port.baseUrlBid + this.apiEndPoint.MATRIXPAGE_SEALEDBID + id)
      .pipe(
        catchError(this.handleError)
      );
  }

  clearReports() {   
    return this.http.delete(this.port.baseUrlBid + this.apiEndPoint.REPORTS_CLEAR)
      .pipe(
        catchError(this.handleError)
      );
  }



  private handleError(error: HttpErrorResponse) {
    // return an observable with a user-facing error message
    return throwError(
      'Unable to connect to server.');
  };
}
