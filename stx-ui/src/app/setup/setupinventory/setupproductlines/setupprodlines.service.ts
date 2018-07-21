/*
  * Displays product line details
  * getProductLineDetails(inactive): This method is used to get product lines(active or inactive)
  * createProductLine(productLineObj): This method is used to create product line
  * getInventoryGroups(): This method is used to get inventory groups
  * updateInventoryProductLine(updateProductLineObj, updateId): This method is used to edit product line
  * deleteProductLine(updateId): This method is used to delete product line
  * getDeleteResponse(updateId, type): This method is used to get response to show delete button
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { URLSearchParams } from '@angular/http';
import { HttpClient } from '../../../common/http-client';

@Injectable()
export class SetupProductLinesService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  /*-- Method to get product lines(active or inactive) --*/
  getProductLineDetails(inactive) {
    return this.http.get(this.apiEndPoint + '/api/setupinventory/setupproductline/' + inactive)
      .map(this.extractData);
  }
  /*-- Method to create product line --*/
  createProductLine(productLineObj) {
    const data = new URLSearchParams();
    data.append('productLineObj', JSON.stringify(productLineObj));
    return this.http.post(this.apiEndPoint + '/api/setupinventory/setupproductline', data)
      .map(this.extractData);
  }
  /*-- Method to get inventory groups --*/
  getInventoryGroups() {
    return this.http.get(this.apiEndPoint + '/api/setupinventory/inventorygroups')
      .map(this.extractData);
  }
  /*-- Method used to edit product line --*/
  updateInventoryProductLine(updateProductLineObj, updateId) {
    return this.http.put(this.apiEndPoint + '/api/setupinventory/setupproductline/' + updateId, updateProductLineObj)
      .map(this.extractData);
  }
  /*-- Method used to delete product line --*/
  deleteProductLine(updateId, name) {
    return this.http.delete(this.apiEndPoint + '/api/setupinventory/setupproductline/' + updateId + '/' + 'delete' + '/' + name)
      .map(this.extractData);
  }
  /*-- Method used to get response to show delete button --*/
  getDeleteResponse(updateId, type, name) {
    return this.http.delete(this.apiEndPoint + '/api/setupinventory/setupproductline/' + updateId + '/' + type + '/' + name)
      .map(this.extractData);
  }
  removeInventoryGroup(removeName) {
    return this.http.delete(this.apiEndPoint + '/api/setupinventory/inventorygroup/' + removeName)
      .map(this.extractData);
  }
  productDependencyToDisableInvGrp(Id) {
    return this.http.get(this.apiEndPoint + '/api/setupinventory/product/dependency/' + Id)
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
