import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductSalesChartService } from './productsaleschart.service';
@Component({
  selector: 'app-reports-app',
  templateUrl: './productsaleschart.html',
  providers: [ProductSalesChartService],
})
export class ProductSalesChartComponent implements OnInit {
  data: any;
  options: any;
  prodSalesList: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private productSalesChartService: ProductSalesChartService) {

  }
  ngOnInit() {
    this.getProductSalesData();
    this.options = {
      maintainAspectRatio: false
    };
  }
  getProductSalesData() {
    this.productSalesChartService.getSalesData().subscribe(
      data => {
        const bgColors = [];
        const price = [];
        const labels = [];
        let total = 0;
        const List = data['result'];
        if (List && List.length > 0) {
          List.map((obj) => total += +obj.price);
          for (let i = 0; i < List.length; i++) {
            labels.push(List[i]['name'] + '-' + (((+List[i]['price']) / (total)) * 100).toFixed(2) + '%');
            bgColors.push(List[i]['Color__c']);
            price.push(List[i]['price']);
          }
          this.data = {
            labels: labels,
            datasets: [
              {
                label: 'Product Sales Last Month',
                data: price,
                backgroundColor: bgColors,
                hoverBackgroundColor: bgColors
              }]
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
