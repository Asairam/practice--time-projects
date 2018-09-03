import { Component, OnInit } from '@angular/core';
import { ClientLoginService } from './clientLogin.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { Router, ActivatedRoute } from '@angular/router';
import * as config from '../../app.config';
import { JwtHelper } from 'angular2-jwt';

@Component({
  selector: 'app-client-login-popup',
  templateUrl: './clientLogin.html',
  providers: [ClientLoginService],
  styleUrls: ['./clientLogin.css']
})
export class ClientLoginComponent implements OnInit {
  companyName = '';
  companyLogo = 'assets/images/logo.png';
  dbName = '';
  apiEndPoints = config['API_END_POINT'];
  userName: any;
  pin = '';
  forgotpinEmails = [];
  submitParam = true;
  forgotpinTab = false;
  selectpinemail = '';
  loginMessage: any;
  onlineMerchant: any;
  purchaseGiftButt: any;
  email_c: any;
  constructor(
    private toastr: ToastrService,
    private translateService: TranslateService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
    private clientLoginService: ClientLoginService) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.dbName = activatedRoute.snapshot.params['db'];
      localStorage.setItem('param', this.dbName);
    });
  }
  ngOnInit() {
    this.clientLoginService.getClientInfo(this.dbName).subscribe(
      data => {
        localStorage.setItem('compname', data['result']['Name']);
        localStorage.setItem('complogo', data['result']['Logo__c']);
        localStorage.setItem('compphone', data['result']['Phone__c']);
        localStorage.setItem('compid', data['result']['cmpId']);
        localStorage.setItem('compEmail__c', data['result']['Email__c']);
        this.companyName = data['result']['Name'];
        this.companyLogo = data['result']['Logo__c'];
        this.loginMessage = data['result']['msg'];
        this.email_c = data['result']['Email__c'];
      },
      error => {
        this.toastr.error('Invalid URL', null, { timeOut: 3000 });
      }
    );
    this.onlineMerchantAccount();
  }

  getAuthorised() {
    if (!this.userName) {
      this.toastr.error('Email cannot be blank', null, { timeOut: 3000 });
    } else if (!this.pin) {
      this.toastr.error('PIN cannot be blank', null, { timeOut: 3000 });
    } else {
      const loginObj = {
        'dbname': this.dbName,
        'email': this.userName,
        'pin': this.pin
      };
      if (this.submitParam) {
        this.submitParam = false;
        this.clientLoginService.authorised(loginObj).subscribe(
          data => {
            this.submitParam = true;
            if (data['result'][0][0].Allow_Online_Booking__c !== 0) {
              try {
                const decodedToken = new JwtHelper().decodeToken(localStorage.getItem('clienttoken'));
                localStorage.setItem('fname', decodedToken['data']['firstName']);
                localStorage.setItem('lname', decodedToken['data']['lastName']);
                localStorage.setItem('clientid', data['result'][0][0].Id);
              } catch (error) {
                localStorage.setItem('fname', 'Firstname');
                localStorage.setItem('fname', 'Lastname');
              }
              this.router.navigate(['/onlinebook']).then(() => {
                const toastermessage: any = this.translateService.get('LOGIN.LOGIN_SUCESSFULLY');
                this.toastr.success(toastermessage.value, null, { timeOut: 1500 });
              });
            } else {
              this.toastr.error('We are unable to process your request at this time.Please contact ' + this.companyName + ' for assistance.', null, { timeOut: 3000 });
            }
          },
          error => {
            this.submitParam = true;
            this.toastr.error('Invalid Credentials', null, { timeOut: 3000 });
          }
        );
      }
    }
  }

  sendPin() {
    const EMAIL_REGEXP = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if (this.userName === '' || this.userName === undefined) {
      this.forgotpinEmails = [];
      this.toastr.error('Primary Email is required', null, { timeOut: 3000 });
    } else if (this.userName !== '' && !EMAIL_REGEXP.test(this.userName)) {
      this.toastr.error('Invalid Email.', null, { timeOut: 3000 });
      this.forgotpinEmails = [];
    } else {
      let sendData = {};
      if (this.forgotpinEmails.length > 0) {
        sendData = {
          'username': this.userName,
          'dbname': this.dbName,
          'id': this.selectpinemail,
          'cName': this.companyName,
          'email_c': this.email_c
        };
      } else {
        sendData = {
          'username': this.userName,
          'dbname': this.dbName,
          'cName': this.companyName,
          'email_c': this.email_c
        };
      }
      this.clientLoginService.forgotPin(sendData).subscribe(
        data => {
          this.forgotpinEmails = data['result'];
          this.selectpinemail = '';
          const status = JSON.parse(data.status);
          switch (status) {
            case 2057:
              this.toastr.success('A 4-digit PIN has been emailed to you. Use your email address and the PIN to login for online appointment booking.', null, { timeOut: 1500 });
              this.forgotpinTab = false;
              this.userName = '';
              break;
          }
        },
        error => {
          const status = JSON.parse(error['status']);
          const statuscode = JSON.parse(error['_body']).status;
          switch (status) {
            case 400:
              if (statuscode === '2084') {
                this.toastr.error('The email address you entered does not exist in our records.', null, { timeOut: 1500 });
                break;
              }
          }
        }
      );
    }
  }

  onlineMerchantAccount() {
    this.clientLoginService.onlineMerchantAccount().subscribe(
      data => {
        this.onlineMerchant = JSON.parse(data['result'][1].JSON__c);
        if (this.onlineMerchant.onlineTerminalID !== '' && this.onlineMerchant.sharedSecret !== '') {
          this.purchaseGiftButt = true;
        } else {
          this.purchaseGiftButt = false;
        }
      },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
      }
    );
  }
}
