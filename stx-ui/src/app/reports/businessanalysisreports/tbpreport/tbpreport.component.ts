import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { TbpReportReportService } from './tbpreport.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-reports-app',
  templateUrl: './tbpreport.html',
  styleUrls: ['./tbpreport.css'],
  providers: [TbpReportReportService],
})
export class TbpReportReportComponent implements OnInit {
  bsValue = '04/24/2017';
  bsValue1 = new Date();
  itemsDisplay = false;
  workerTipsData: any;
  datePickerConfig: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private tbpReportReportService: TbpReportReportService) {
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
