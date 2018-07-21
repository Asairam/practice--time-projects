/*
  * Display single user details of front end users
  * extractData(): To extract the data
  * handleError(): To handle error messages.
*/
import { Injectable, Inject } from '@angular/core';
import { Response } from '@angular/http';
// import { Headers, RequestOptions, URLSearchParams } from '@angular/http';
import { HttpClient } from '../../common/http-client';

@Injectable()
export class ClientEditService {
  constructor(private http: HttpClient,
    @Inject('apiEndPoint') private apiEndPoint: string,
    @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
  ) { }
  /**
   * Common methods starts
   */

  getClient(clientId) {
    return this.http.get(this.apiEndPoint + '/api/client/' + clientId)
      .map(this.extractData);
  }
  getData(searchKey) {
    return this.http.get(this.apiEndPoint + '/api/clientsearch/' + searchKey)
      .map(this.extractData);
  }
  saveClient(clientId, clientObj, clientPictureFile: File) {
    const formData: any = new FormData();
    formData.append('clientPictureFile', clientPictureFile);
    formData.append('clientObj', JSON.stringify(clientObj));
    return this.http.put(this.apiEndPoint + '/api/client/' + clientId, formData)
      .map(this.extractData);
  }
  /**
   * Common methods ends
   */
  /**
   * Client info methods starts
   */
  getLookupsList(lookupType) {
    return this.http.get(this.apiEndPoint + '/api/v1/lookups/' + lookupType)
      .map(this.extractData);
  }
  getStates(countryName) {
    return this.http.get(this.apiEndPoint + '/api/v1/lookups/states/' + countryName)
      .map(this.extractData);
  }
  deleteClientResponse(type, clientId) {
    return this.http.delete(this.apiEndPoint + '/api/client/' + clientId + '/' + type)
    .map(this.extractData);
  }
  deleteClient(clientId) {
    return this.http.delete(this.apiEndPoint + '/api/client/' + clientId + '/' + 'delete')
    .map(this.extractData);
  }
  /**
 * Client info methods ends
 */
  /**
   * Client profile methods starts
   */
  getOccupations() {
    return this.http.get(this.apiEndPoint + '/api/setup/clientpreferences/occupations')
      .map(this.extractData);
  }
  getClientFlags() {
    return this.http.get(this.apiEndPoint + '/api/setup/clientpreferences/clientflags')
      .map(this.extractData);
  }
  getGenders() {
    return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
      .map(this.extractData);
  }
  /**
   * Client profile methods ends
   */
  /**
   * Preferences methods starts
   */
  getMobileData() {
    return this.http.get(this.apiEndPoint + '/api/setup/clientpreferences/mobilecarriers')
      .map(this.extractData);
  }
/**
 * Preferences methods ends
 */
/**
 * Appointments start
 */
getBRTypes() {
  return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
    .map(this.extractData);
}
getApptViews() {
  return this.http.get(this.staticJsonFilesEndPoint + 'common.json')
    .map(this.extractData);
}
getClientAppointmentsData(client) {
  return this.http.post(this.apiEndPoint + '/api/clientSearch/bookappointments', client )
  .map(this.extractData);
}
 /**
  * Appointments end
  */
 /**
  * Accounts Start
  */
getClientRewardsData(clientId) {
  return this.http.get(this.apiEndPoint + '/api/client/rewards/' + clientId)
  .map(this.extractData);
}
getClientMembershipsData(clientId) {
  return this.http.get(this.apiEndPoint + '/api/client/memberships/' + clientId)
  .map(this.extractData);
}
getClientPackagesData(clientId) {
  return this.http.get(this.apiEndPoint + '/api/client/packages/' + clientId)
  .map(this.extractData);
}
getClientAccountsData(clientId) {
  return this.http.get(this.apiEndPoint + '/api/client/accounts/' + clientId)
  .map(this.extractData);
}
/**
  * Accounts end
  */
/* * Email/textLog methods starts
 */
getEmailOrTextLog(clientId) {
  return this.http.get(this.apiEndPoint + '/api/client/emaillog/' + clientId)
    .map(this.extractData);
}
/**
 *  Email/textLog methods ends
 */
/**
 * Product log methods starts
 */
getProductLog(clientId) {
  return this.http.get(this.apiEndPoint + '/api/client/productlog/' + clientId)
    .map(this.extractData);
}
/**
 * Product log method ends
 */
/**
 * Service log methods starts
 */
getServiceLog(clientId) {
  return this.http.get(this.apiEndPoint + '/api/client/servicelog/' + clientId)
    .map(this.extractData);
}
saveNotes(serviceLogId, clientId, notes) {
  const notesValue = {
    'notes': notes
  };
  return this.http.put(this.apiEndPoint + '/api/client/savenotes/' + serviceLogId + '/' + clientId, notesValue)
  .map(this.extractData);
}
/**
 * Service log method ends
 */
getClassLog(clientId) {
  return this.http.get(this.apiEndPoint + '/api/client/classlog/' + clientId)
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
