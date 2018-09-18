import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { MarketingReportsService } from './marketingreports.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
import { JwtHelper } from 'angular2-jwt';
@Component({
  selector: 'app-setuprewards-app',
  templateUrl: './marketingreports.html',
  styleUrls: ['./marketingreports.css'],
  providers: [MarketingReportsService],
})
export class MarketingReportsComponent implements OnInit {
  decodedToken: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private reportsService: MarketingReportsService) {

  }
  ngOnInit() {
    // ---Start of code for Permissions Implementation--- //
    try {
      this.decodedToken = new JwtHelper().decodeToken(localStorage.getItem('rights'));
  } catch (error) {
      this.decodedToken = {};
  }
  if (this.decodedToken.data && this.decodedToken.data.permissions) {
      this.decodedToken = JSON.parse(this.decodedToken.data.permissions);
  } else {
      this.decodedToken = {};
  }
  // ---End of code for permissions Implementation--- //

  }
}
