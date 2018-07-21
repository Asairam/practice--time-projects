import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { AbcReportService } from './abcreport.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-reports-app',
  templateUrl: './abcreport.html',
  styleUrls: ['./abcreport.css'],
  providers: [AbcReportService],
})
export class AbcReportComponent implements OnInit {
  bsValue = new Date();
  bsValue1 = new Date();
  itemsDisplay = false;
  workerTipsData: any;
  datePickerConfig: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private abcReportService: AbcReportService) {
this.datePickerConfig = Object.assign({},
            {
              showWeekNumbers: false,
              containerClass: 'theme-blue',
            });

  }
  ngOnInit() {
  }
  generateReport() {
    this.itemsDisplay = true;
  }
}
