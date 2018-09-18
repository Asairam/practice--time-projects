import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from './login.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';

@Component({
  selector: 'app-login-popup',
  templateUrl: './login.html',
  providers: [LoginService],
  styleUrls: ['./login.css']
})
export class LoginComponent implements OnInit {
  userName: any;
  password: any;
  userDetails: any = {};
  users: any;
  error: any;
  glyphiconClass = 'glyphicon-eye-open';
  passwordType = 'password';
  submitParam = true;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private loginService: LoginService) {

  }
  ngOnInit() {
    // localStorage.clear();
  }
  getAuthorised() {
    if (this.userName === undefined || this.userName === '' || this.userName === 'undefined') {
      this.error = 'LOGIN.USER_BLANK';
      const toastermessage: any = this.translateService.get('LOGIN.USER_BLANK');
      this.toastr.error(toastermessage.value, null, { timeOut: 1500 });
    } else if (this.password === undefined || this.password === '' || this.password === 'undefined') {
      this.error = 'LOGIN.PASSWORD_BLANK';
      const toastermessage: any = this.translateService.get('LOGIN.PASSWORD_BLANK');
      this.toastr.error(toastermessage.value, null, { timeOut: 1500 });
    } else {
      const loginObj = {
        'userName': this.userName,
        'password': this.password
      };
      if (this.submitParam) {
        this.submitParam = false;
        this.loginService.authorised(loginObj).subscribe(
          data => {
            localStorage.setItem('rights', data['result']['rights']);
            this.submitParam = true;
            const previousPage = localStorage.getItem('page');
            localStorage.removeItem('page');
            if (previousPage && previousPage !== '/') {
              this.router.navigate([previousPage]).then(() => {
                const toastermessage: any = this.translateService.get('LOGIN.LOGIN_SUCESSFULLY');
                this.toastr.success(toastermessage.value, null, { timeOut: 1500 });
              });
            } else {
              this.router.navigate(['/home']).then(() => {
                const toastermessage: any = this.translateService.get('LOGIN.LOGIN_SUCESSFULLY');
                this.toastr.success(toastermessage.value, null, { timeOut: 1500 });
              });
            }
          },
          error => {
            this.submitParam = true;
            const status = JSON.parse(error['status']);
            const statuscode = JSON.parse(error['_body']).status;
            const toastermessage: any = this.translateService.get('LOGIN.USER_PASSWORD_INCORRECT');
            switch (status) {
              case 500:
                this.error = 'LOGIN.USER_PASSWORD_INCORRECT';
                this.toastr.error(toastermessage.value, null, { timeOut: 1500 });
                break;
              case 400:
                if (statuscode === '2001') {
                  this.error = 'LOGIN.USER_PASSWORD_INCORRECT';
                  this.toastr.error(toastermessage.value, null, { timeOut: 1500 });
                } break;
              case 401:
                if (statuscode === '2001') {
                  this.error = 'LOGIN.USER_PASSWORD_INCORRECT';
                  this.toastr.error(toastermessage.value, null, { timeOut: 1500 });
                } break;
            }
          }
        );
      }
    }
  }
  clear() {
    this.error = '';
  }

  forgotPassword() {
    if (this.userName === undefined || this.userName === '' || this.userName === 'undefined') {
      this.error = 'LOGIN.USER_BLANK';
    } else {
      this.error = '';
      if (this.submitParam) {
        this.submitParam = false;
        this.loginService.forgotPassword({ 'username': this.userName }).subscribe(
          data => {
            this.submitParam = true;
            const toastermessage: any = this.translateService.get('LOGIN.RESET_PASSWORD_LINK');
            this.toastr.success(toastermessage.value, null, { timeOut: 3000 });
          },
          error => {
            this.submitParam = true;
            const status = JSON.parse(error['status']);
            const statuscode = JSON.parse(error['_body']).status;
            switch (status) {
              case 500:
                break;
              case 400:
                if (statuscode === '2073') {
                  const toastermessage: any = this.translateService.get('LOGIN.USERNAME_INCORRECT');
                  this.toastr.error(toastermessage.value, null, { timeOut: 3000 });
                } break;
            }
          }
        );
      }
    }
  }

  togglePassword() {
    if (this.glyphiconClass === 'glyphicon-eye-open') {
      this.glyphiconClass = 'glyphicon-eye-close';
      this.passwordType = 'text';
    } else {
      this.glyphiconClass = 'glyphicon-eye-open';
      this.passwordType = 'password';
    }
  }
}