import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { MonthlyBussinessAnalysisService } from './monthlybussinessanalysis.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-reports-app',
  templateUrl: './monthlybussinessanalysis.html',
  styleUrls: ['./monthlybussinessanalysis.css'],
  providers: [MonthlyBussinessAnalysisService],
})
export class MonthlyBussinessAnalysisComponent implements OnInit {
  itemsDisplay: any = false;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private monthlyBussinessAnalysisService: MonthlyBussinessAnalysisService) {

  }
  ngOnInit() {
  }
  generateReport() {
    this.itemsDisplay = true;
  }
}
