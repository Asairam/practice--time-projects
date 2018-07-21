import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { WorkerTipsService } from './workertips.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
// import {Component} from "@angular/core";
@Component({
  selector: 'app-reports-app',
  templateUrl: './workertips.html',
  styleUrls: ['./workertips.css'],
  providers: [WorkerTipsService],
})
export class WorkerTipsComponent implements OnInit {
  bsValue = new Date();
  bsValue1 = new Date();
  itemsDisplay = false;
  workerTipsData: any;
  dataList: any;
  datePickerConfig: any;
  constructor(
    private workerTipsService: WorkerTipsService,
    // private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService) {
      this.datePickerConfig = Object.assign({},
                  {
                    showWeekNumbers: false,
                    containerClass: 'theme-blue',
                  });
  }
  ngOnInit() {
    this.getEvery() ;
  }

  generateReport() {
    this.itemsDisplay = true;
  }
  getEvery() {
    this.workerTipsService.getEveryTypes().subscribe(
        data => {
            this.dataList = data['workerTips'];
            this.workerTipsData = this.dataList[0].option;
        },
        error => {
            const errStatus = JSON.parse(error['_body'])['status'];
            if (errStatus === '2085' || errStatus === '2071') {
              if (this.router.url !== '/') {
                localStorage.setItem('page', this.router.url);
                this.router.navigate(['/']).then(() => { });
              }
            }
        });
  }

}
