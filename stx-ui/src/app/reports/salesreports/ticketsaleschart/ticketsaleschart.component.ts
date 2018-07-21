import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { TicketSalesChartService } from './ticketsaleschart.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-reports-app',
  templateUrl: './ticketsaleschart.html',
  // styleUrls: ['./ticketsaleschart.css'],
  providers: [TicketSalesChartService],
})
export class TicketSalesChartComponent implements OnInit {
  data: any;
  options: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private ticketSalesChartService: TicketSalesChartService) {

  }
  ngOnInit() {
    this.data = {
      labels: ['2/1/2018', '2/2/2018', '2/3/2018', '2/4/2018', '2/5/2018', '2/6/2018', '2/7/2018',
        '2/8/2018', '2/9/2018', '2/10/2018', '2/11/2018', '2/12/2018', '2/13/2018', '2/14/2018',
        '2/15/2018', '2/16/2018', '2/17/2018', '2/18/2018', '2/19/2018', '2/20/2018', '2/21/2018',
        '2/22/2018', '2/23/2018', '2/24/2018', '2/25/2018', '2/26/2018', '2/27/2018', '2/28/2018'],
      datasets: [
        {
          label: '$',
          data: [65, 59, 80, 81, 56, 55, 40,
            0, 33, 80, 81, 56, 0, 40,
            65, 11, 80, 0, 22, 55, 40,
            65, 59, 0, 81, 56, 55, 40]
        }
      ]
    };
    this.options = {
      maintainAspectRatio: false
    };
  }
}
