import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { MarketingEmailService } from './marketingemail.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-setuprewards-app',
  templateUrl: './marketingemail.html',
  providers: [MarketingEmailService],
})
export class MarketingEmailComponent implements OnInit {
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private marketingEmailService: MarketingEmailService) {

  }
  ngOnInit() {
  }
}
