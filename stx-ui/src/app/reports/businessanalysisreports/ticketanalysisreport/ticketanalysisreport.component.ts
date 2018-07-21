import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { TicketAnalysisReportService } from './ticketanalysisreport.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-reports-app',
  templateUrl: './ticketanalysisreport.html',
  styleUrls: ['./ticketanalysisreport.css'],
  providers: [TicketAnalysisReportService],
})
export class TicketAnalysisReportComponent implements OnInit {
  public bsValue: any = new Date();
  public bsValue1: any = new Date();
  itemsDisplay: any = false;
  datePickerConfig: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private marketingEmailService: TicketAnalysisReportService) {

      this.datePickerConfig = Object.assign({},
                  {
                    showWeekNumbers: false,
                    containerClass: 'theme-blue',
                  });
  }
  ngOnInit() {
    this.bsValue = '';
    this.bsValue1 = '';
  }
  generateReport() {
    this.itemsDisplay = true;
  }
}
