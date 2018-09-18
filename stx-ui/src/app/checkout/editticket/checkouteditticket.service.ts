/*
  * Display single user details of front end users
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { Headers } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class CheckOutEditTicketService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  getServices() {
    return this.http.get(this.apiEndPoint + '/api/CheckOut/services')
      .map(this.extractData);
  }
  getFavourites() {
    return this.http.get(this.apiEndPoint + '/api/setupticketpreferences/favorites')
      .map(this.extractData);
  }
  getVisitTypes() {
    return this.http.get(this.apiEndPoint + '/api/setup/clientpreferences/visittype/active')
      .map(this.extractData);
  }
  getApptDetails(apptid) {
    return this.http.get(this.apiEndPoint + '/api/appointments/' + apptid)
      .map(this.extractData);
  }
  clientRewardData(clientId) {
    return this.http.get(this.apiEndPoint + '/api/checkout/client/rewards/' + clientId)
      .map(this.extractData);
  }
  getRewardsData() {
    return this.http.get(this.apiEndPoint + '/api/marketing/rewards')
      .map(this.extractData);
  }
  getData(searchKey) {
    return this.http.get(this.apiEndPoint + '/api/clientsearch/' + searchKey)
      .map(this.extractData);
  }
  addClient(clientId, apptId, apptDate) {
    const obj = {
      'Client__c': clientId,
      'isNoService__c': 1,
      'Appt_Date_Time__c': apptDate
    };
    return this.http.put(this.apiEndPoint + '/api/appointments/client/add/' + apptId, obj)
      .map(this.extractData);

  }
  editVisitType(apptId, visitType) {
    const dataObj = {
      'vistTypeVal': visitType
    };
    return this.http.put(this.apiEndPoint + '/api/checkout/visittype/' + apptId, dataObj)
      .map(this.extractData);
  }
  /**
   * Method to get preferences for service tax and retail tax calculation
   */
  getServProdTax() {
    return this.http.get(this.apiEndPoint + '/api/setup/ticketpreferences/pos')
      .map(this.extractData);
  }
  /**
   * to check the service is associated with Any worker
   */
  isWorkerAssociated(Id) {
    return this.http.get(this.apiEndPoint + '/api/CheckOut/worker/services/' + Id)
      .map(this.extractData);
  }
  /**
  * to insert the record into ticket service Table
  */
  addToTicketService(serviceData, type) {
    return this.http.post(this.apiEndPoint + '/api/checkout/addtoticketservices/' + type, serviceData)
      .map(this.extractData);
  }
  /**
    * to add the promotion values to The existing Ticketservice Table and Ticekt product table
    */
  addPromotion(dataObj) {
    return this.http.post(this.apiEndPoint + '/api/checkout/addpromotion', dataObj)
      .map(this.extractData);
  }
  /**
   * to get the ticket services from ticketservice table
   */
  getTicketServicesByApptId(apptid) {
    return this.http.get(this.apiEndPoint + '/api/checkout/services/' + apptid)
      .map(this.extractData);
  }
  /**
    * To get Promotions Data
    */
  getPromotionsData() {
    return this.http.get(this.apiEndPoint + '/api/marketing/promotion')
      .map(this.extractData);
  }
  /**
   * To get paymenttypes Data
   */
  getPaymentTypesData() {
    return this.http.get(this.apiEndPoint + '/api/setup/company/paymenttypes')
      .map(this.extractData);
  }
  getGiftData(giftNumber) {
    return this.http.get(this.apiEndPoint + '/api/checkout/giftbalancingsearch/' + giftNumber)
      .map(this.extractData);
  }
  /**
     * To add data to ticket payment
     */
  addToPaymentsTicket(paymentObj) {
    return this.http.post(this.apiEndPoint + '/api/checkout/ticketpayments', paymentObj)
      .map(this.extractData);
  }
  /**
   * To get ticket payment Records by ApptId
   */
  getTicketPaymentData(apptId) {
    return this.http.get(this.apiEndPoint + '/api/checkout/ticketpayments/' + apptId)
      .map(this.extractData);
  }
  updateTicketPayment(ticketPaymentId, paymentObj) {
    return this.http.put(this.apiEndPoint + '/api/checkout/ticketpayments/' + ticketPaymentId, paymentObj)
      .map(this.extractData);
  }
  deleteTicketPayment(paymentId) {
    return this.http.delete(this.apiEndPoint + '/api/checkout/ticketpayments/' + paymentId)
      .map(this.extractData);
  }
  // '/api/checkout/ticketpayments/
  /**
  * To get getServiceGroups
  */
  getServiceGroups(type) {
    return this.http.get(this.apiEndPoint + '/api/setupservices/servicegroups/' + type)
      .map(this.extractData);
  }
  /**
   * To getWorkerMerchantsData for payments
   */
  getWorkerMerchantsData() {
    return this.http.get(this.apiEndPoint + '/api/checkout/ticketpayments/worker/merchant')
      .map(this.extractData);
  }
  /**
   * Service list modal code starts
   */
  updateServicesListTicket(Id, updateServicesObj) {
    return this.http.put(this.apiEndPoint + '/api/checkout/services/' + Id, updateServicesObj)
      .map(this.extractData);
  }

  removeTicketSerices(ticketServiceId, amountDetails) {
    const headers = new Headers();
    headers.append('amountdetails', JSON.stringify(amountDetails));
    return this.http.deleteHeader(this.apiEndPoint + '/api/checkout/services/' + ticketServiceId, headers)
      .map(this.extractData);
  }

  /**
   * Service list modal code ends
   */

  /**
  * Products code starts
  */
  getProductsBySKU(searchKeyWord) {
    return this.http.get(this.apiEndPoint + '/api/inventory/usage/' + searchKeyWord)
      .map(this.extractData);
  }
  getWorkersList() {
    return this.http.get(this.apiEndPoint + '/api/checkout/product/workers')
      .map(this.extractData);
  }
  getProductsList() {
    return this.http.get(this.apiEndPoint + '/api/checkout/products')
      .map(this.extractData);
  }
  productAddToTicket(productData, action) {
    return this.http.post(this.apiEndPoint + '/api/checkout/addtoproduct/' + action, productData)
      .map(this.extractData);
  }
  getTicketProducts(apptId) {
    return this.http.get(this.apiEndPoint + '/api/checkout/ticketproducts/' + apptId)
      .map(this.extractData);
  }
  // products list model code starts
  updateTicket(Id, updateTicketObj) {
    return this.http.put(this.apiEndPoint + '/api/checkout/products/' + Id, updateTicketObj)
      .map(this.extractData);
  }
  removeTicketProduct(ticketProductId, amountDetails) {
    const headers = new Headers();
    headers.append('amountdetails', JSON.stringify(amountDetails));
    return this.http.deleteHeader(this.apiEndPoint + '/api/checkout/products/' + ticketProductId, headers)
      .map(this.extractData);
  }
  /**
  /**
 * Products code ends
 */

  /**
   * misc code starts
   */
  saveMisc(calObj, action) {
    return this.http.post(this.apiEndPoint + '/api/checkout/miscsale/' + action, calObj)
      .map(this.extractData);
  }
  // getCalList(miscSale, apptId) {
  //   return this.http.get(this.apiEndPoint + '/api/checkout/ticketother/' + miscSale + '/' + apptId)
  //     .map(this.extractData);
  // }
  updateMiscTicket(id, amount) {
    return this.http.put(this.apiEndPoint + '/api/checkout/miscsale/' + id, amount)
      .map(this.extractData);
  }
  deleteMiscTicket(miscId, amountDetails) {
    const headers = new Headers();
    headers.append('amountdetails', JSON.stringify(amountDetails));
    return this.http.deleteHeader(this.apiEndPoint + '/api/checkout/miscsale/' + miscId, headers)
      .map(this.extractData);
  }
  /**
   * misc code ends
   */

  /**
   * others code starts
   */
  getAllServiceDetails(type) {
    if (type === undefined || type === true) {
      type = 'true';
    }
    return this.http.get(this.apiEndPoint + '/api/setupservices/servicepackages/' + type)
      .map(this.extractData);
  }

  addToTicket(ticketObj, action) {
    return this.http.post(this.apiEndPoint + '/api/checkout/ticketother/' + action, ticketObj)
      .map(this.extractData);
  }
  getAllWorkers() {
    return this.http.get(this.apiEndPoint + '/api/setupworkers/setupworkerdetail')
      .map(this.extractData);
  }
  getOthersTicketList(ticketId) {
    return this.http.get(this.apiEndPoint + '/api/checkout/ticketother/' + ticketId)
      .map(this.extractData);
  }
  updateOthersTicket(ticketId, ticketObj) {
    return this.http.put(this.apiEndPoint + '/api/checkout/ticketother/' + ticketId, ticketObj)
      .map(this.extractData);
  }
  detleteOthersTicket(ticketId, amountDetails) {
    const headers = new Headers();
    headers.append('amountdetails', JSON.stringify(amountDetails));
    return this.http.deleteHeader(this.apiEndPoint + '/api/checkout/ticketother/' + ticketId, headers)
      .map(this.extractData);
  }
  /**
   * other Code ends
   */
  /**
 * Worker Tip Code starts
 */
  addTipToTicket(ticketObj, action) {
    return this.http.post(this.apiEndPoint + '/api/checkout/tips/' + action, ticketObj)
      .map(this.extractData);
  }
  updateTipToTicket(tipId, ticketObj) {
    return this.http.put(this.apiEndPoint + '/api/checkout/tips/' + tipId, ticketObj)
      .map(this.extractData);
  }
  getTipsList(apptId) {
    return this.http.get(this.apiEndPoint + '/api/checkout/tips/' + apptId)
      .map(this.extractData);
  }
  deleteWorkerTip(tipId, amountDetails) {
    const headers = new Headers();
    headers.append('amountdetails', JSON.stringify(amountDetails));
    return this.http.deleteHeader(this.apiEndPoint + '/api/checkout/tips/' + tipId, headers)
      .map(this.extractData);
  }
  deleteClearSale(tipId) {
    return this.http.delete(this.apiEndPoint + '/api/checkout/ticket/' + tipId)
      .map(this.extractData);
  }
  getRateToTicket(value, apptId) {
    const dataObj = {
      'rateValue': value
    };
    return this.http.put(this.apiEndPoint + '/api/checkout/ticketrating/' + apptId, dataObj)
      .map(this.extractData);

  }
  xmlPayment(reqObj) {
    return this.http.post(this.apiEndPoint + '/api/payment', reqObj)
      .map(this.extractData);
  }
  getCloverDevices() {
    return this.http.get(this.apiEndPoint + '/api/clover/device/list')
      .map(this.extractData);
  }
  insertCloverTip(reqObj) {
    return this.http.post(this.apiEndPoint + '/api/clover/tip/insert', reqObj)
      .map(this.extractData);
  }
  /**
   * Worker Tip Code Ends
   */
  /*To extract json data*/
  private extractData(res: Response) {
    if (res.headers && res.headers.get('token')) {
      localStorage.setItem('token', res.headers.get('token'));
    }
    const body = res.json();
    return body || {};
  }
}
