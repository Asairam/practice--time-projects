import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ProcessCompensationService } from './processcompensation.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-reports-app',
  templateUrl: './processcompensation.html',
  styleUrls: ['./processcompensation.css'],
  providers: [ProcessCompensationService],
})
export class ProcessCompensationComponent implements OnInit {
  bsValue = new Date();
  bsValue1 = new Date();
  checkValue: any = false;
  reset: any;
  datePickerConfig: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private marketingEmailService: ProcessCompensationService) {
      this.datePickerConfig = Object.assign({},
                  {
                    showWeekNumbers: false,
                    containerClass: 'theme-blue',
                  });
  }
  ngOnInit() {
    this.bsValue = null;
    this.bsValue1 = null;
    this.reset = '0.00';
  }
  selectAll() {
    this.checkValue = true;
  }
  unSelectAll() {
    this.checkValue = false;
  }
  resetMethod() {
  this.reset = '.00';
  }
}
