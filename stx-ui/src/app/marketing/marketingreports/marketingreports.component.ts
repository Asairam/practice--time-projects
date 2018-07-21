import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { MarketingReportsService } from './marketingreports.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-setuprewards-app',
  templateUrl: './marketingreports.html',
  styleUrls: ['./marketingreports.css'],
  providers: [MarketingReportsService],
})
export class MarketingReportsComponent implements OnInit {
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private reportsService: MarketingReportsService) {

  }
  ngOnInit() {
  }
}
