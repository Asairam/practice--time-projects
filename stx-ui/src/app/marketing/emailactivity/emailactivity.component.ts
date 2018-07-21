import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { EmailActivityService } from './emailactivity.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-emailactivity-app',
  templateUrl: './emailactivity.html',
  styleUrls: ['./emailactivity.css'],
  providers: [EmailActivityService],
})
export class EmailActivityComponent implements OnInit {
  bsValue = new Date();
  bsValue1 = new Date();
  itemsDisplay = false;
  datePickerConfig: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private activityservice: EmailActivityService) {
    this.datePickerConfig = Object.assign({},
            {
              showWeekNumbers: false,
              containerClass: 'theme-blue',
            });

  }
  ngOnInit() {
    this.bsValue = null;
    this.bsValue1 = null;
  }
  generateReport() {
    this.itemsDisplay = true;
  }
}
