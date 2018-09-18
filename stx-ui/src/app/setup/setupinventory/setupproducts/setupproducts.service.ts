/*
  * Display single user details of front end users
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
// import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../../../common/http-client';

@Injectable()
export class SetupProductsService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  saveProductData(productData, productPic: File) {
    const formData = new FormData();
    formData.append('filename', productPic);
    formData.append('productData', JSON.stringify(productData));
    return this.http.post(this.apiEndPoint + '/api/setupinventory/setupproduct', formData)
      .map(this.extractData);
  }
  editProductData(updatedId, productEditData, productPic) {
    const formData = new FormData();
    formData.append('filename', productPic);
    formData.append('productData', JSON.stringify(productEditData));
    return this.http.put(this.apiEndPoint + '/api/setupinventory/setupproduct/' + updatedId, formData)
      .map(this.extractData);
  }
  getProductSuppliersData(updatedId) {
    return this.http.get(this.apiEndPoint + '/api/setupinventory/setupproduct/' + updatedId)
      .map(this.extractData);
  }
  getProducts(type, productLineId, inventoryGroupName) {
    if (type === undefined) {
      type = 1;
    }
    return this.http.get(this.apiEndPoint + '/api/setupinventory/setupproducts/' + type + '/' + productLineId + '/' + inventoryGroupName)
      .map(this.extractData);
  }
  getProductlines(type) {
    if (type === undefined || type === true) {
      type = 0;
    }
    return this.http.get(this.apiEndPoint + '/api/setupinventory/setupproductline/' + type)
      .map(this.extractData);
  }
  getInventoryGroups(value) {
    return this.http.get(this.apiEndPoint + '/api/setupinventory/setupproducts/inventorygroup/' + value)
      .map(this.extractData);
  }
  getTaxableByInventoryGroups(value) {
    return this.http.get(this.apiEndPoint + '/api/setupinventory/inventorygroups/' + value)
      .map(this.extractData);
  }
  getSuppliers(type) {
    return this.http.get(this.apiEndPoint + '/api/setupinventory/setupsuppliers/' + type)
      .map(this.extractData);
  }
  deleteSuppliers(updatedId) {
    return this.http.delete(this.apiEndPoint + '/api/setupinventory/setupproduct/' + updatedId)
    .map(this.extractData);
  }
  /*-- Method used to delete product line --*/
  deleteProduct(updateId, type, name) {
    return this.http.delete(this.apiEndPoint + '/api/setupinventory/setupproducts/' + updateId + '/' + type + '/' + name)
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
