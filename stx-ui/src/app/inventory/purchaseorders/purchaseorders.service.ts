import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
// import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class PurchaseOrderService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  /* Method to get purchase order data */
  getOrdersData() {
    return this.http.get(this.apiEndPoint + '/api/inventory/purcahseorders')
      .map(this.extractData);
  }
  /* method for updating purchase order data */
  editPurchaseOrderData(updateId, editDataObj) {
    return this.http.put(this.apiEndPoint + '/api/inventory/purcahseorders/' + updateId, editDataObj)
      .map(this.extractData);
  }
  /* Method to get Suppliers data */
  getSuppliersData() {
    return this.http.get(this.apiEndPoint + '/api/Inventory/purcahseorders/suppliers')
      .map(this.extractData);
  }
  /* Method to get product data by search with sku */
  getProductsBySKU(searchKeyWord, supplierId) {
    return this.http.get(this.apiEndPoint + '/api/Inventory/purcahseorders/productsbysuppliers/' + searchKeyWord + '/' + supplierId)
      .map(this.extractData);
  }
  /*Method to save purchase order data */
  saveData(productsList) {
    return this.http.post(this.apiEndPoint + '/api/inventory/purcahseorders', productsList)
      .map(this.extractData);
  }
  /* method to show product data (show data) */
  getProductsSupplier(purchageOrderId) {
    return this.http.get(this.apiEndPoint + '/api/Inventory/purcahseorders/' + purchageOrderId)
      .map(this.extractData);
  }
  /* Method to get product list */
  getProducts(supId) {
    return this.http.get(this.apiEndPoint + '/api/inventory/products/' + supId)
      .map(this.extractData);
  }
  /*method to check uniqness With SupplierName And OrderDate */
  checkIfSupplierAndOrderDateisExist(supplierName, bsValue) {
    return this.http.get(this.apiEndPoint + '/api/inventory/purcahseorders/supplieridandorderdate/' + supplierName + '/' + bsValue)
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
