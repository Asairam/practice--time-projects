import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
// import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../../../common/http-client';

@Injectable()
export class SetupPyamentTypeService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  savePaymentType(paymentListNew, paymentLogo) {
 // alert("service1" + JSON.stringify(paymentListNew));
   // alert('data service2' + JSON.stringify(paymentLogo));
    const data = new FormData();
    data.append('paymentListNew', JSON.stringify(paymentListNew));
    data.append('paymentLogo', paymentLogo);
  // alert('data service' + JSON.stringify(data));
    return this.http.post(this.apiEndPoint + '/api/setup/company/paymenttypes', data)
      .map(this.extractData);
  }
  editSavePaymentType(updateId, updatePaymentListNew, paymentLogo) {
    const data = new FormData();
    data.append('paymentListNew', JSON.stringify(updatePaymentListNew));
    data.append('paymentLogo', paymentLogo);
    return this.http.put(this.apiEndPoint + '/api/setup/company/paymenttypes/' + updateId, data )
      .map(this.extractData);
  }

  getDeleteResponse(updateId, type, resPaymentName, resPaymentAbbreviation, resPaymentSortorder) {
    return this.http.delete(this.apiEndPoint
      + '/api/setup/company/paymenttypes/'
      + updateId + '/' + type + '/' + resPaymentName + '/' + resPaymentAbbreviation + '/' + resPaymentSortorder)
    .map(this.extractData);
  }

  deletePaymentType(updateId, resPaymentName, resPaymentAbbreviation, resPaymentSortorder) {
    return this.http.delete(this.apiEndPoint
      + '/api/setup/company/paymenttypes/'
      + updateId + '/' + 'delete' + '/' + resPaymentName + '/' + resPaymentAbbreviation + '/' + resPaymentSortorder )
      .map(this.extractData);
  }
  getpaymentList() {
     return this.http.get(this.apiEndPoint + '/api/setup/company/paymenttypes')
      .map(this.extractData);
    }
    getSortList(paymentData) {
      return this.http.put(this.apiEndPoint + '/api/setup/company/paymenttype/sortorder', paymentData)
      .map(this.extractData);
    }
  /*To extract json data*/
  private extractData(res: Response) {
    if (res.headers && res.headers.get('token')) {
      localStorage.setItem('token', res.headers.get('token'));
    }
    const body = res.json();
    return body || {};
  }
}
