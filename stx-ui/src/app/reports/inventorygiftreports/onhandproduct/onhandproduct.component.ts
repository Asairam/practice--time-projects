import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { SafeUrl, DomSanitizer } from '@angular/platform-browser';
import { OnHandProductService } from './onhandproduct.service';
import { ToastrService } from 'ngx-toastr';
import { TranslateService } from 'ng2-translate';
@Component({
  selector: 'app-reports-app',
  templateUrl: './onhandproduct.html',
  styleUrls: ['./onhandproduct.css'],
  providers: [OnHandProductService],
})
export class OnHandProductComponent implements OnInit {
  showProdList: any = false;
  productLineList: any;
  pdLineId: any;
  totalSize = 0;
  isGenerate = false;
  noDataErr: any;
  itemsDisplay = false;
  productSalesObj = [];
  inventoryGroups: any;
  constructor(private route: ActivatedRoute,
    private router: Router,
    private toastr: ToastrService,
    private translateService: TranslateService,
    private onHandProductService: OnHandProductService) {

  }
  ngOnInit() {
    this.getProductLine();
    this.getInventoryGroups();
  }
  pdLineListOnChange(value) {
    this.pdLineId = value;
  }
  /*-- Method to get product lines list(active) --*/
  getProductLine() {
    this.onHandProductService.getProductLineDetails(1)
      .subscribe(data => {
        this.productLineList = data['result'];
        this.pdLineId = this.productLineList[0]['Id'];
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
  getInventoryGroups() {
    /*--- Method to get inventory groups ---*/
    this.onHandProductService.getInventoryGroupData()
      .subscribe(data => {
        this.inventoryGroups = data['result'];
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
  generateReport() {
    this.productSalesObj = [];
    const productObj = {
      'pdLine': this.pdLineId
    };
    this.onHandProductService.generateReport(productObj).subscribe(data => {
      this.isGenerate = true;
      const temp = data['result'];
      this.totalSize = temp.length;
      const dataList = [];
      for (let i = 0; i < this.inventoryGroups.length; i++) {
        let price = 0;
        dataList.push(temp.filter((obj) => obj.Inventory_Group__c === this.inventoryGroups[i]['inventoryGroupName']));
        const tempArr = temp.filter((obj) => obj.Inventory_Group__c === this.inventoryGroups[i]['inventoryGroupName']);
        dataList[i]['inventoryGroupName'] = this.inventoryGroups[i]['inventoryGroupName'];
        dataList[i]['size'] = tempArr ? tempArr.length : 0;
      }
      this.productSalesObj = dataList.filter((obj) => obj.length);
      if (this.productSalesObj.length === 0) {
        this.noDataErr = '**Data Not Found';
      } else {
        this.noDataErr = '';
      }
    },
      error => {
        this.itemsDisplay = false;
        const status = JSON.parse(error['status']);
        const statuscode = JSON.parse(error['_body']).status;
        switch (JSON.parse(error['_body']).status) {
          case '2033':
            break;
        }
        if (statuscode === '2085' || statuscode === '2071') {
          if (this.router.url !== '/') {
            localStorage.setItem('page', this.router.url);
            this.router.navigate(['/']).then(() => { });
          }
        }
      });
  }
}
