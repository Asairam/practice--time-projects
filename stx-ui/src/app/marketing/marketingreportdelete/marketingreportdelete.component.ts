import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { MarketingReportDeleteService } from './marketingreportdelete.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-setuprewards-app',
  templateUrl: './marketingreportdelete.html',
  styleUrls: ['./marketingreportdelete.css'],
  providers: [MarketingReportDeleteService],
})
export class MarketingReportDeleteComponent implements OnInit {
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private marketingReportDelete: MarketingReportDeleteService) {

  }
  ngOnInit() {
  }
}
