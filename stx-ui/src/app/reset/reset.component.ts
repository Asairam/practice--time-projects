import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ResetService } from './reset.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-reset-popup',
  templateUrl: './reset.html',
  providers: [ResetService],
  styleUrls: ['./reset.css']
})
export class ResetComponent implements OnInit {
  password = '';
  password2 = '';
  userDetails: any = {};
  users: any;
  error: any;
  glyphiconClass = 'glyphicon-eye-open';
  glyphiconClass2 = 'glyphicon-eye-open';
  passwordType = 'password';
  passwordType2 = 'password';
  token = '';
  constructor(private activatedRoute: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private restService: ResetService) {
    this.activatedRoute.queryParams.subscribe(params => {
      this.token = activatedRoute.snapshot.params['token'];
    });
  }
  ngOnInit() {
  }

  clear() {
    this.error = '';
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

  togglePassword2() {
    if (this.glyphiconClass2 === 'glyphicon-eye-open') {
      this.glyphiconClass2 = 'glyphicon-eye-close';
      this.passwordType2 = 'text';
    } else {
      this.glyphiconClass2 = 'glyphicon-eye-open';
      this.passwordType2 = 'password';
    }
  }

  resetPassword() {
    if (this.password === '') {
      this.error = 'LOGIN.NEW_PASSWORD_BLANK';
    } else if (this.password2 === '') {
      this.error = 'LOGIN.REENTER_NEW_PASSWORD';
    } else if (this.password !== this.password2) {
      this.error = 'LOGIN.PASSWORD_MISSMATCH';
    } else {
      this.restService.resetPassword(this.password, this.token).subscribe(
        data => {
          this.router.navigate(['/']);
        },
        error => {
          const status = JSON.parse(error['status']);
          const statuscode = JSON.parse(error['_body']).status;
          switch (status) {
            case 500:
              break;
            case 400:
              if (statuscode === '2071') {
                this.error = 'COMMON_STATUS_CODES.' + statuscode;
              }
          }
        }
      );
    }
  }
}
