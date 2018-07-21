import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { ReportWriterService } from './reportwriter.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-reports-app',
  templateUrl: './reportwriter.html',
  styleUrls: ['./reportwriter.css'],
  providers: [ReportWriterService],
})
export class ReportWriterComponent implements OnInit {
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private marketingEmailService: ReportWriterService) {

  }
  ngOnInit() {
  }
}
