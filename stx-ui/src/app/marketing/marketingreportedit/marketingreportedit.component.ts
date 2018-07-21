import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { MarketingReportEditService } from './marketingreportedit.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-setuprewards-app',
  templateUrl: './marketingreportedit.html',
  styleUrls: ['./marketingreportedit.css'],
  providers: [MarketingReportEditService],
})
export class MarketingReportEditComponent implements OnInit {
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private marketingReportEdit: MarketingReportEditService) {

  }
  ngOnInit() {
  }
  myFunction() {
    window.print();
}
}
