import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { AdjustmentReportListService} from './adjustmentreportlist.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-reports-app',
  templateUrl: './adjustmentreportlist.html',
  styleUrls: ['./adjustmentreportlist.css'],
  providers: [AdjustmentReportListService],
})
export class AdjustmentReportListComponent implements OnInit {
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private adjustmentReportListService: AdjustmentReportListService) {

  }
  ngOnInit() {
  }
}
