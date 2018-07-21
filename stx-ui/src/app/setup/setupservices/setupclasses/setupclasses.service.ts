/*
  * Display single user details of front end users
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
import { URLSearchParams } from '@angular/http';
import { HttpClient } from '../../../common/http-client';

@Injectable()
export class SetupClassesService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }

  saveClassesData(dataObject) {
   const data = new URLSearchParams();
   data.append('setupService', JSON.stringify(dataObject));
    return this.http.post(this.apiEndPoint + '/api/setupclasses/classes', data)
      .map(this.extractData);
  }

  getClassesData() {
     return this.http.get(this.apiEndPoint + '/api/setup/setupclass/activeinactive')
      .map(this.extractData);
  }
  editClassesDatas(dataObject, classesId) {
    return this.http.put(this.apiEndPoint + '/api/setupservices/classes/' + classesId, dataObject)
      .map(this.extractData);
  }
  // for  [any,none,all]
  getResourceUse(lookupType) {
    return this.http.get(this.apiEndPoint + '/api/v1/lookups/' + lookupType)
      .map(this.extractData);
  }
  // number 1-10
  getResourcepriority() {
    return this.http.get(this.apiEndPoint + '/api/v1/lookups/' + 'PRIORITY')
      .map(this.extractData);

  }
 getResourceDropdown(RESOURCE_USE) {
     return this.http.get(this.apiEndPoint + '/api/setupservices/resources/' + RESOURCE_USE)
       .map(this.extractData);
}

// gettting data from db for update purpose
getClassesUpdateFields(id) {
  return this.http.get(this.apiEndPoint + '/api/setupservices/resource/' + id)
  .map(this.extractData);
}
// removing record
removeResourceId(id) {
  return this.http.delete(this.apiEndPoint + '/api/setupservices/resource/' + id)
  .map(this.extractData);
}

 /*-- Method used to delete product line --*/
 deleteProductLine(classId, name) {
  return this.http.delete(this.apiEndPoint + '/api/setupservices/classes/' + classId + '/' + 'delete' + '/' + name)
    .map(this.extractData);
}
getDeleteResponse(classId, type, name) {
  return this.http.delete(this.apiEndPoint + '/api/setupservices/classes/' + classId + '/' + type + '/' + name)
    .map(this.extractData);
}
getBookingData() {
  return this.http.get(this.apiEndPoint + '/api/appointmentsandemails/booking')
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
