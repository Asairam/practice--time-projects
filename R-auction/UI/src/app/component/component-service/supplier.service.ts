import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import * as config from '../../appConfig/index';
import { Observable, throwError, Subject, forkJoin } from 'rxjs';
import { catchError, retry, map } from 'rxjs/operators';
import { Router } from '@angular/router';
import { AuthService } from '../../authService/auth.service';
@Injectable({
    providedIn: 'root'
})
export class SupplierService {
    apiEndPoint = config.APP_CONSTANTS;
    port = config.BASE_URL;
    acceptStatus = new Subject<any>();
    suppFilCol = [
        { ind: 0, item_id: 'minimumDesiredQuantity', item_text: 'Reliance Quantity', selected: true, disable: false },
        { ind: 1, item_id: 'unitOfMeasure', item_text: 'UOM', selected: true, disable: false },
        { ind: 2, item_id: 'minimumChangeValue', item_text: 'Min Bid Change', selected: true, disable: false },
        { ind: 12, item_id: 'startPrice', item_text: 'Start Price', selected: true, disable: false },
        { ind: 3, item_id: 'cost-weightage', item_text: 'Cost weightage', selected: false, disable: false },
        { ind: 4, item_id: 'currencyCode', item_text: 'Currency', selected: true, disable: false },
        { ind: 5, item_id: 'itemsBestBid', item_text: 'Best Bid Unit Rate', selected: true, disable: false },
        { ind: 6, item_id: 'itemsBestBidUnitCost', item_text: 'Best Bid Total Value', selected: true, disable: false },
        { ind: 7, item_id: 'baseCost', item_text: 'My Unit Rate', selected: true, disable: false },
        { ind: 8, item_id: 'variableCost', item_text: 'My Total Value', selected: true, disable: false },
        { ind: 9, item_id: 'landedCost', item_text: 'My Landed Unit Rate', selected: false, disable: false },
        { ind: 10, item_id: 'totalLandedCost', item_text: 'My Total Landed Cost', selected: false, disable: false },
        { ind: 11, item_id: 'rank', item_text: 'Rank', selected: true, disable: false},    
    ];
    constructor(private http: HttpClient, private router: Router, private authService: AuthService) { }

    socketDateFil(data) {
        let enddate = new Date(data.endDate).getTime();
        let startdate = new Date(data.startPauseDate).getTime();
        return (enddate - startdate) / 1000;
    }

    getSupplierData(data) {
        return this.http.get(this.port.baseUrlBid + this.apiEndPoint.GET_SUPPLIER_LIST + data.status + '/' + data.pageNum)
            .pipe(
                catchError(this.handleError)
            );
    }

    getSupplierkpiData(obj) {
        return this.http.get(this.port.baseUrlBid + this.apiEndPoint.SUPPLIER_LANDING + 'duration=' + obj.duration + '&futureDuration=' + obj.futureDuration)
            .pipe(
                catchError(this.handleError)
            );
    }

    getLiveBidDetails(id) {
        return this.http.get(this.port.baseUrlBid + this.apiEndPoint.GET_AUCTIONDATABYID + id)
            .pipe(
                catchError(this.handleError)
            );
    }

    getSupplierOrgFeature(auctionID){
        return this.http.get(this.port.baseUrlBid + this.apiEndPoint.GET_SUPPLIER_ORG_FEATURE_AUCTIONID + auctionID)
            .pipe(
                catchError(this.handleError)
            );
    }

    getSupplierBiddingList(id) {
        return this.http.get(this.port.baseUrlBid + this.apiEndPoint.GET_SUPPLIERBIDDING_LIST + id)
            .pipe(
                catchError(this.handleError)
            );
    }

    insertBidItem(obj) {
        return this.http.post(this.port.baseUrlBid + this.apiEndPoint.POST_BIDITEM, obj)
            .pipe(
                catchError(this.handleError)
            );
    }

    insertBidAllItem(data) {
        let multipleJoin = []
        data.forEach(item => {
            multipleJoin.push(this.http.post(this.port.baseUrlBid + this.apiEndPoint.POST_BIDITEM, item))
        });
        return forkJoin(multipleJoin)
            .pipe(
                catchError(this.handleError)
            );
    }

    updateAccept(obj) {
        return this.http.post(this.port.baseUrlBid + this.apiEndPoint.POST_ACCEPTBID, obj)
            .pipe(
                catchError(this.handleError)
            );
    }
    getBidHistory(id) {
        return this.http.get(this.port.baseUrlBid + this.apiEndPoint.GET_SUPPLIER_BID_HISTORY + id)
            .pipe(
                catchError(this.handleError)
            );
    }

    takeLead(obj) {
        return this.http.post(this.port.baseUrlBid + this.apiEndPoint.TAKE_LEAD, obj)
            .pipe(
                catchError(this.handleError)
            );
    }

    getBidReport(auctionId, reportType) {
        // return this.http.get(this.port.baseUrlBid + this.apiEndPoint.GET_SUPPLIER_BID_REPORT + auctionId, {responseType: 'text'})
        // .pipe(
        //     catchError(this.handleError)
        // );
        
        let token = this.authService.getTokenValue();
        let vcode = this.authService.getUserData().settings.ril.vendorcode[0];
        let id = auctionId + '?token=' + token + "&vendorcode="+vcode;
        window.open(this.port.baseUrlBid + this.apiEndPoint.GET_SUPPLIER_BID_REPORT + id, "_self");
    }

    private handleError(error: HttpErrorResponse) {
        // return an observable with a user-facing error message
        return throwError(
            (error.error.message) ? error.error.message : 'Unable to connect to server.');
    };
}
