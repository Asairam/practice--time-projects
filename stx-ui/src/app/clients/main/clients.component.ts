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
import {ClientsService } from './clients.service';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-clients-popup',
    templateUrl: './clients.html',
    providers: [ClientsService],
    styleUrls: ['./clients.css']
})
export class ClientsComponent implements OnInit {
    DataObj: any;
    allData: any;
    error: any;
    error1: any;
    searchKey: any;
    hide: false;
  //  showNewButton: any = false;
    showSeperator: any = false;
    activeCount: any = 0;
    ActiveCount: any = 0;
    rowsPerPage = 10;
    clientId: any = '';
    constructor(
        private clientsService: ClientsService,
        private toastr: ToastrService,
        private router: Router) {
    }
    /*Method for page Load */
    ngOnInit() {
        // this.getData();
        // this.clientPreferencesData();
    }
    /*Method for Searching clients */
    searchClients() {
        if ( this.searchKey === '' ||  this.searchKey === undefined || (this.searchKey.trim()).length <= 1 ) {
            this.error1 = 'CLIENTS.VALID_NOBLANK_SEARCH_FIELD';
        } else {
        this.clientsService.getData(this.searchKey)
            .subscribe(data => {
                this.DataObj = data['result'];

               // this.showNewButton = true;
                this.activeCount = '';
                this.ActiveCount = '';
                if (this.DataObj.length !== undefined) {
                     let k = 0;
                    for (let i = 0; i < this.DataObj.length; i++) {
                        if (this.DataObj[i].Active__c === 1) {
                            k++;
                            this.activeCount = k;
                        }
                    }
                    let p = 0;
                    for (let i = 0; i < this.DataObj.length; i++) {
                        if (this.DataObj[i].Active__c === 0) {
                            p++;
                            this.ActiveCount = p;
                        }
                    }
                }
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
    }
    getUserData(DataObj) {
        // alert(JSON.stringify(DataObj));
        localStorage.setItem('clientData', JSON.stringify(DataObj));
        localStorage.setItem('isNewClient', JSON.stringify(false));
    }
    /*Method for getting clients information */
    showData() {
        this.clientsService.getAllData()
        .subscribe(data => {
                    this.DataObj = data['result'];
                    this.activeCount = 0;
                    this.ActiveCount = 0;
                if (this.DataObj.length !== undefined) {
                    let z = 0;
                    for (let i = 0; i < this.DataObj.length; i++) {
                        if (this.DataObj[i].Active__c === 1) {
                            z++;
                            this.activeCount = z;
                        }
                    }
                    let y = 0;
                    for (let i = 0; i < this.DataObj.length; i++) {
                        if (this.DataObj[i].Active__c === 0) {
                            y++;
                            this.ActiveCount = y;
                        }
                    }
                }
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
    /*Method for clearing error messages */
    clearmessage() {
        this.error1 = '';
    }
    addNewClient() {
        localStorage.setItem('isNewClient', JSON.stringify(true));
        // const obj = JSON.parse(localStorage.getItem('isNewClient'));
        this.router.navigate(['/client/quick/add']).then(() => {
          });
      }
}
