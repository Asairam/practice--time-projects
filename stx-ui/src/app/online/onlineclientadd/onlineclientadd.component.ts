import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { OnlineClientAddService } from './onlineclientadd.service';
import * as config from '../../app.config';

@Component({
  selector: 'app-onlineclientadd',
  templateUrl: './onlineclientadd.component.html',
  styleUrls: ['./onlineclientadd.component.css'],
  providers: [OnlineClientAddService]
})

export class OnlineClientAddComponent implements OnInit {

  apiEndPoints = config['API_END_POINT'];
  companyLogo = '';
  companyName = '';
  dbName = '';
  clientInfo: any = {
    firstname: '',
    lastname: '',
    email: '',
    Notification_Opt_Out__c: 0,
    Marketing_Opt_Out__c: 0,
    Reminder_Opt_Out__c: 0,
    primaryPhone: '',
    cmpName: ''
  };
  isClientSaved = false;
  isApprovelSent = false;
  clientErr = '';
  constructor(
    private toastr: ToastrService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private onlineClientAddService: OnlineClientAddService
  ) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.dbName = activatedRoute.snapshot.params['db'];
    });
  }

  ngOnInit() {
    this.companyName = localStorage.getItem('compname');
    this.companyLogo = localStorage.getItem('complogo');
  }

  assaignValues(key) {
    this.clientInfo[key] = !this.clientInfo[key];
    this.clientInfo[key] = this.clientInfo[key] ? 1 : 0;
  }

  clearError() {
    this.clientErr = '';
  }
  saveProfile() {
    const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (!this.clientInfo['email']) {
      this.clientErr = 'Email is required';
      window.scrollTo(0, 0);
    } else if (!this.clientInfo['firstname']) {
      this.clientErr = 'FirstName is required';
      window.scrollTo(0, 0);
    } else if (!this.clientInfo['lastname']) {
      this.clientErr = 'LastName is required';
      window.scrollTo(0, 0);
    } else if (!EMAIL_REGEXP.test(this.clientInfo['email'])) {
      this.clientErr = 'Invalid Email Address';
      window.scrollTo(0, 0);
    } else {
      this.clientInfo['dbName'] = this.dbName;
      this.clientInfo['cmpName'] = this.companyName;
      this.clientInfo['clientInfoMailingCountry'] = 'United States';
      this.clientInfo['email_c'] = localStorage.getItem('compEmail__c');
      this.onlineClientAddService.saveClientProfile(this.clientInfo).subscribe(
        data => {
          if (data['result'] === 'Approvel Sent') {
            this.isApprovelSent = true;
          } else {
            this.isClientSaved = true;
          }
        },
        error => {
          this.clientErr = 'CLIENTS.DUPLICATE_CLIENT';
          // this.toastr.error('CLIENTS.DUPLICATE_CLIENT', null, { timeOut: 3000 });
        }
      );
    }

  }

  login() {
    this.router.navigate(['clientlogin/' + localStorage.getItem('param')]);
  }
}
