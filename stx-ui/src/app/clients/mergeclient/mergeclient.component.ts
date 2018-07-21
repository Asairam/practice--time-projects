/*
ngOnInit() : Method to loading athe page..
searchClients() : Method for searching clients
showData() : Method for loading All clients Data.
clearmessage() : Method for Clearing  error messages.
*/
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { MergeClientService } from './mergeclient.service';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-clients-popup',
    templateUrl: './mergeclient.html',
    providers: [MergeClientService]
})
export class MergeClientComponent implements OnInit {
    clientId1: any;
    clientId2: any;
    clientData1: any;
    clientData2: any;
    firstName: any;
    lastName: any;
    primaryPhone: any;
    mobilePhone: any;
    primaryEmail: any;
    secondaryEmail: any;
    notificationPrimaryEmail: any;
    remainderPrimaryEmail: any;
    remainderSecondaryEmail: any;
    firstName1: any;
    lastName1: any;
    primaryPhone1: any;
    mobilePhone1: any;
    primaryEmail1: any;
    secondaryEmail1: any;
    notificationPrimaryEmail1: any;
    remainderPrimaryEmail1: any;
    remainderSecondaryEmail1: any;

    error: any;
    constructor(
        private activatedRoute: ActivatedRoute,
        private mergeclientService: MergeClientService,
        private toastr: ToastrService,
        private router: Router) {
            this.activatedRoute.queryParams.subscribe(params => {
                this.clientId1 = activatedRoute.snapshot.params['sourceId'];
                this.clientId2 = activatedRoute.snapshot.params['targetId'];
            });
    }
    /*Method for page Load */
    ngOnInit() {
        // this.loadClientTokenData();
        this.getSourceClient(this.clientId1);
        this.getTargetClient(this.clientId2);
    }
    getSourceClient(clientId1) {
        this.mergeclientService.getClient(clientId1)
        .subscribe(data => {
            this.clientData1 = data['result'][0];
            this.loadUserData();
        }, error => {
            const status = JSON.parse(error['status']);
            const statuscode = JSON.parse(error['_body']).status;
            switch (JSON.parse(error['_body']).status) {
                case '2033':
                    this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                    window.scrollTo(0, 0);
                    break;
            }
            if (statuscode === '2085' || statuscode === '2071') {
                if (this.router.url !== '/') {
                    localStorage.setItem('page', this.router.url);
                    this.router.navigate(['/']).then(() => { });
                }
            }
        });
    }
    getTargetClient(clientId2) {
        this.mergeclientService.getClient(clientId2)
        .subscribe(data => {
            this.clientData2 = data['result'][0];
            this.loadUserData();
        }, error => {
            const status = JSON.parse(error['status']);
            const statuscode = JSON.parse(error['_body']).status;
            switch (JSON.parse(error['_body']).status) {
                case '2033':
                    this.error = 'COMMON_STATUS_CODES.' + JSON.parse(error['_body']).status;
                    window.scrollTo(0, 0);
                    break;
            }
            if (statuscode === '2085' || statuscode === '2071') {
                if (this.router.url !== '/') {
                    localStorage.setItem('page', this.router.url);
                    this.router.navigate(['/']).then(() => { });
                }
            }
        });
    }
    loadUserData() {
        this.firstName1 = this.clientData1.FirstName;
        this.lastName1 = this.clientData1.LastName;
        this.primaryPhone1 = this.clientData1.Phone;
        this.mobilePhone1 = this.clientData1.MobilePhone;
        this.primaryEmail1 = this.clientData1.Email;
        this.secondaryEmail1 = this.clientData1.Secondary_Email__c;
        this.notificationPrimaryEmail1 = this.clientData1.Notification_Primary_Email__c;
        this.remainderPrimaryEmail1 = this.clientData1.Reminder_Primary_Email__c;
        this.remainderSecondaryEmail1 = this.clientData1.Reminder_Secondary_Email__c;
        this.firstName = this.clientData2.FirstName;
        this.lastName = this.clientData2.LastName;
        this.primaryPhone = this.clientData2.Phone;
        this.mobilePhone = this.clientData2.MobilePhone;
        this.primaryEmail = this.clientData2.Email;
        this.secondaryEmail = this.clientData2.Secondary_Email__c;
        this.notificationPrimaryEmail = this.clientData2.Notification_Primary_Email__c;
        this.remainderPrimaryEmail = this.clientData2.Reminder_Primary_Email__c;
        this.remainderSecondaryEmail = this.clientData2.Reminder_Secondary_Email__c;
        // this.getClient(this.clientId2);
    }
}
