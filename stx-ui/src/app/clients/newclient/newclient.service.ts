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
export class NewClientService {
    constructor(private http: HttpClient,
        @Inject('apiEndPoint') private apiEndPoint: string,
        @Inject('staticJsonFilesEndPoint') private staticJsonFilesEndPoint: string
    ) { }
    getClientData() {
        return this.http.get(this.apiEndPoint + '/api/clients/all')
            .map(this.extractData);
    }

    getServiceLog(clientId) {
        return this.http.get(this.apiEndPoint + '/api/client/servicelog/' + clientId)
            .map(this.extractData);
    }

    getEmailOrTextLog(clientId) {
        return this.http.get(this.apiEndPoint + '/api/client/emaillog/' + clientId)
            .map(this.extractData);
    }
    getClassLog(clientId) {
        return this.http.get(this.apiEndPoint + '/api/client/classlog/' + clientId)
            .map(this.extractData);
    }
    getProductLog(clientId) {
        return this.http.get(this.apiEndPoint + '/api/client/productlog/' + clientId)
            .map(this.extractData);
    }
    // sendOtp(phoneNumber) {
    //     return this.http.post(this.apiEndPoint + '/api/client/send/otp/', phoneNumber)
    //         .map(this.extractData);

    // }
    getClient(clientId) {
        return this.http.get(this.apiEndPoint + '/api/client/' + clientId)
            .map(this.extractData);
    }
    deleteClient(clientId, name) {
        return this.http.delete(this.apiEndPoint + '/api/deleteClient/' + clientId + '/' + name)
            .map(this.extractData);
    }
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
    checkAvaAppt(clientId) {
        return this.http.get(this.apiEndPoint + '/api/client/checkAppt/' + clientId)
            .map(this.extractData);
    }
    uploadPic(clientId, clientPictureFile: File, filePath, status) {
        let formData: any;
        if (status === 'upload') {
            formData = new FormData();
            formData.append('clientPictureFile', clientPictureFile);
        } else if (status === 'remove') {
            formData = { 'filePath': filePath };
        }
        return this.http.put(this.apiEndPoint + '/api/clientProfilePic/' + clientId + '/' + status, formData)
            .map(this.extractData);
    }
    getClientAppointmentsData(client) {
        return this.http.post(this.apiEndPoint + '/api/clientSearch/bookappointments', client)
            .map(this.extractData);
    }
    clientQuickEdit(clientId, editObj) {
        return this.http.put(this.apiEndPoint + '/api/client/quick/' + clientId, editObj)
            .map(this.extractData);
    }
    getNextAppt(clientId) {
        return this.http.get(this.apiEndPoint + '/api/nextappointments/services/' + clientId + '/' + new Date())
            .map(this.extractData);
    }
    getStates(countryName) {
        return this.http.get(this.apiEndPoint + '/api/v1/lookups/states/' + countryName)
            .map(this.extractData);
    }
    getClientFlags() {
        return this.http.get(this.apiEndPoint + '/api/setup/clientpreferences/clientflags')
            .map(this.extractData);
    }
    getOccupations() {
        return this.http.get(this.apiEndPoint + '/api/setup/clientpreferences/occupations')
            .map(this.extractData);
    }
    saveClient(clientId, clientObj, clientPictureFile: File) {
        const formData: any = new FormData();
        formData.append('clientPictureFile', clientPictureFile);
        formData.append('clientObj', JSON.stringify(clientObj));
        return this.http.put(this.apiEndPoint + '/api/client/' + clientId, formData)
            .map(this.extractData);
    }
    updatetokenClient(clientId, clientObj) {
        return this.http.put(this.apiEndPoint + '/api/client/tokenUpdate/' + clientId, clientObj)
            .map(this.extractData);
    }
    saveNotes(id, updateNotes) {
        const notes = {
            'notes': updateNotes
        };
        return this.http.put(this.apiEndPoint + '/api/client/savenotes/' + id, notes)
            .map(this.extractData);
    }
    getClientFields() {
        return this.http.get(this.apiEndPoint + '/api/setup/clientpreferences/clientfields')
            .map(this.extractData);
    }
    // Mobile carriers methods starts
    mobileCarriernames(lookupType) {
        return this.http.get(this.apiEndPoint + '/api/v1/lookups/' + lookupType)
            .map(this.extractData);
    }
    getClientAutoSearch(searchKey) {
        return this.http.get(this.apiEndPoint + '/api/clientsearch/' + searchKey)
            .map(this.extractData);
    }
    getClientLastVistService(id, date) {
        return this.http.get(this.apiEndPoint + '/api/clientlastvist/' + id + '/' + date)
            .map(this.extractData);
    }
    getHideCliContactInfo(id) {
        return this.http.get(this.apiEndPoint + '/api/client/getHideClientContactInfo/' + id)
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
