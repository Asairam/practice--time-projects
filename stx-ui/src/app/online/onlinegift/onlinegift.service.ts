import { Injectable, Inject } from '@angular/core';
import { Headers, Response } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class OnlineGiftService {

    constructor(private http: HttpClient,
        @Inject('apiEndPoint') private apiEndPoint: string
    ) { }


    onlineGiftPurchase(purchaseGiftObj) {
        const headers = new Headers();
        headers.append('token', localStorage.getItem('clienttoken'));
        return this.http.postHeader(this.apiEndPoint + '/api/onlinegift/purchase', purchaseGiftObj, headers)
            .map(this.extractData);
    }
    onlineGiftPurchaseWithoutlogin(purchaseGiftObj) {
        return this.http.post(this.apiEndPoint + '/api/onlinegift/purchase/withoutlogin/' + localStorage.getItem('param') + '/' + localStorage.getItem('compname'), purchaseGiftObj)
            .map(this.extractData);
    }
    getStates(countryName) {
        return this.http.get(this.apiEndPoint + '/api/v1/lookups/states/' + countryName)
            .map(this.extractData);
    }
    /**
   * To get paymenttypes Data
   */
    getPaymentTypesData() {
        const headers = new Headers();
        headers.append('token', localStorage.getItem('clienttoken'));
        return this.http.getHeader(this.apiEndPoint + '/api/setup/company/paymenttypes', headers)
            .map(this.extractData);
    }

    getPaymentTypesDataGlobal() {
        return this.http.get(this.apiEndPoint + '/api/setup/company/pt/' + localStorage.getItem('param'))
            .map(this.extractData);
    }

    deleteThePaymentFailedRecords(apptId) {
        const headers = new Headers();
        headers.append('token', localStorage.getItem('clienttoken'));
        return this.http.deleteHeader(this.apiEndPoint + '/api/payment/' + apptId, headers)
            .map(this.extractData);
    }
    addToPaymentsTicket(paymentObj, withoutlogin) {
        if (withoutlogin === 'any') {
            return this.http.post(this.apiEndPoint + '/api/checkout/ticketpayments/withoutlogin/' + localStorage.getItem('param') + '/' + localStorage.getItem('compid'), paymentObj)
                .map(this.extractData);
        } else {
            const headers = new Headers();
            headers.append('token', localStorage.getItem('clienttoken'));
            return this.http.postHeader(this.apiEndPoint + '/api/checkout/ticketpayments', paymentObj, headers)
                .map(this.extractData);
        }
    }
    /**
   * To getWorkerMerchantsData for payments
   */
    getWorkerMerchantsData() {
        const headers = new Headers();
        headers.append('token', localStorage.getItem('clienttoken'));
        return this.http.getHeader(this.apiEndPoint + '/api/checkout/ticketpayments/worker/merchant', headers)
            .map(this.extractData);
    }
    xmlPayment(reqObj, checklogin) {
        const headers = new Headers();
        headers.append('token', localStorage.getItem('clienttoken'));
        return this.http.post(this.apiEndPoint + '/api/payment', reqObj)
            .map(this.extractData);
    }


    private extractData(res: Response) {
        if (res.headers && res.headers.get('token')) {
            localStorage.setItem('clienttoken', res.headers.get('token'));
        }
        const body = res.json();
        return body || {};
    }

}
