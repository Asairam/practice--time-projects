/*
ngOnInit() : Method to loading athe page..
 saveClientData(): Method to create new client data

*/
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { TranslateService } from 'ng2-translate';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ClientQuickAddService } from './clientquickadd.service';
import { ToastrService } from 'ngx-toastr';
@Component({
    selector: 'app-clients-popup',
    templateUrl: './clientquickadd.html',
    providers: [ClientQuickAddService]
})
export class ClientQuickAddComponent implements OnInit {
    firstName: any;
    middileName: any;
    lastName: any;
    primaryEmail: any;
    clientData: any = {};
    error: any;
    clientquickaddData: any = [];
    toastermessage: any;
    constructor(
        private clientQuickAddService: ClientQuickAddService,
        private toastr: ToastrService,
        private translateService: TranslateService,
        private router: Router) {
    }
    /*Method for page Load */
    ngOnInit() {
    }
    /*Method for Getting data from database */
    getClientDataList() {
        this.clientQuickAddService.
            getClientData().subscribe(data => {

            },
            error => {
                const errStatus = JSON.parse(error['_body'])['status'];
                if (errStatus === '2085' || errStatus === '2071') {
                    if (this.router.url !== '/') {
                        localStorage.setItem('page', this.router.url);
                        this.router.navigate(['/']).then(() => { });
                    }
                }
            });
    }
    /*vlaidations */
    saveClientData() {
        this.clientData = {
            'firstname': this.firstName,
            'middilename': this.middileName,
            'lastname': this.lastName,
            'primaryemail': this.primaryEmail,
        };
        this.clientQuickAddService.createClientData(this.clientData)
            .subscribe(data => {
                this.clientquickaddData = data['result'];
                this.toastermessage = this.translateService.get('COMMON_TOAST_MESSAGES.TOAST_CREATE_SUCCESS');
                this.toastr.success(this.toastermessage.value, null, { timeOut: 1500 });
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
    }/*validations end */

    clearErrMsg() {
        this.error = '';

    }

}
