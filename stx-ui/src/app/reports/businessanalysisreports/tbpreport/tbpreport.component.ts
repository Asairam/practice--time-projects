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
  bsValue = new Date();
  bsValue1 = new Date();
  itemsDisplay = false;
  tbpList: any;
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
   const startTime = (this.bsValue.getFullYear() + '') + '-' + ('00' + (this.bsValue.getMonth() + 1)).slice(-2) + '-' + ('00' + this.bsValue.getDate()).slice(-2);
    const endTime = (this.bsValue1.getFullYear() + '') + '-' + ('00' + (this.bsValue1.getMonth() + 1)).slice(-2) + '-' + ('00' + this.bsValue1.getDate()).slice(-2);
    this.tbpReportReportService.getTbpReport(startTime, endTime).subscribe(
      data => {
        this.itemsDisplay = true;
        this.tbpList = data['result'][0];
      },
      error => {
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (status) {
          case 500:
            break;
          case 400:
            break;
        }
        if (statuscode === '2085' || statuscode === '2071') {
          if (this.router.url !== '/') {
            localStorage.setItem('page', this.router.url);
            this.router.navigate(['/']).then(() => { });
          }
        }
      }
    );
  }
}
