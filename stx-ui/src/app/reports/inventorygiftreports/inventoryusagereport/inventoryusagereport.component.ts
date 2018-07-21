import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { InventoryusageReportService } from './inventoryusagereport.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-reports-app',
  templateUrl: './inventoryusagereport.html',
  styleUrls: ['./inventoryusagereport.css'],
  providers: [InventoryusageReportService],
})
export class InventoryusageReportComponent implements OnInit {
  bsValue = new Date();
  bsValue1 = new Date();
  itemsDisplay = false;
  workerTipsData: any;
  datePickerConfig: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private inventoryusageReportService: InventoryusageReportService) {
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
