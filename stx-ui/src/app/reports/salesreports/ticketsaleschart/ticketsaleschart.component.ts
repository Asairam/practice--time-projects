import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { TicketSalesChartService } from './ticketsaleschart.service';
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
    private ticketSalesChartService: TicketSalesChartService) {

  }
  ngOnInit() {
    this.getTicketSalesData();
    this.options = {
      maintainAspectRatio: false
    };
  }
  getTicketSalesData() {
    this.ticketSalesChartService.getTicketSalesData().subscribe(
      data => {
        const price = [];
        const labels = [];
        const List = data['result'];
        if (List && List.length > 0) {
          for (let i = 0; i < List.length; i++) {
            labels.push(List[i]['aptDt']);
            price.push(List[i]['Payments__c']);
          }
          this.data = {
            labels: labels,
            datasets: [
                {
                    label: 'Ticket Sales Last Month',
                    backgroundColor: '#42A5F5',
                    borderColor: '#1E88E5',
                    data: price
                }
            ]
        };
        }
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
