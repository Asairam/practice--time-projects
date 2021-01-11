import { Component, OnInit, Input } from '@angular/core';
import { BuyerBiddingService } from 'src/app/component/component-service/buyer-bidding.service';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material';
@Component({
  selector: 'app-live-audit-log',
  templateUrl: './live-audit-log.component.html',
  styleUrls: ['./live-audit-log.component.css']
})
export class LiveAuditLogComponent implements OnInit {
  @Input() issealedBidDis2 = false;
  @Input() allSupplierList = [];
  @Input() auctionData = null;
  selectedSupplier = "";
  supplierDrop = [];
  selectedevent = 'socketEvent';
  bothStartDate = new Date();
  bothEndDate = new Date();
  startDate = new Date();
  startTime = new Date();
  endTime = new Date();
  endDate = new Date();
  auctionstartDate: any;
  auctionendDate: any;
  length = 0;
  pageSize = 20;
  pageNo = 0;
  pageEvent: PageEvent;
  listdata = [];
  auditLogList = new MatTableDataSource();
  public supplierFilterCtrl: FormControl = new FormControl();
  displayedColumns: string[];
  show=false;
  constructor(public bidService: BuyerBiddingService) { }

  ngOnInit() {
    this.supplierDrop = [...this.allSupplierList];
    try {
      this.supplierFilterCtrl.valueChanges
      .subscribe(() => {
        this.filterBanks();
      });
    this.startDate = new Date(this.auctionData.startDate);
    this.endDate = new Date(this.auctionData.endDate);
    this.auctionstartDate = new Date(this.startDate.getFullYear(), this.startDate.getMonth(), this.startDate.getDate());
    this.auctionendDate = new Date(this.endDate);
    this.bothStartDate = new Date((this.startDate.getMonth() + 1) + '-' + this.startDate.getDate() + '-' + this.startDate.getFullYear() + ' ' + this.startDate.getHours() + ':' + this.startDate.getMinutes());
    this.bothEndDate = new Date((this.endDate.getMonth() + 1) + '-' + this.endDate.getDate() + '-' + this.endDate.getFullYear() + ' ' + this.endDate.getHours() + ':' + this.endDate.getMinutes());
  
      // if (Object.keys(this.auctionData).length != 0) {
      //   let startDateNew = new Date(this.auctionData.startDate)
      //   this.auctionstartDate = new Date(startDateNew.getFullYear(), startDateNew.getMonth(), startDateNew.getDate());
      //   this.auctionendDate = new Date(this.auctionData.endDate);
      // }
      this.getAuditList();
    } catch (err) { }
  }

  filterBanks() {
    // start supplier filter
    if (this.supplierFilterCtrl.value) {
      this.supplierDrop = [...this.allSupplierList];
      this.supplierDrop = this.allSupplierList.filter(
        item => item.supplierName1.toLowerCase().indexOf(this.supplierFilterCtrl.value.toLowerCase()) > -1
      );
    } else {
      this.supplierDrop = [...this.allSupplierList];
    }
  }

  getAuditList() {
    try {
      let obj = {
        vendorcode: this.selectedSupplier?[this.selectedSupplier["supplierID"]]:[...this.supplierDrop.map(x=>x.supplierID)],
        eventType: this.selectedevent,
        from: this.bothStartDate,
        to: this.bothEndDate,
        pageNO: this.pageNo,
        auctionID: this.auctionData.auctionID
      };
      this.show=false;
      this.listdata=[];
      this.auditLogList = new MatTableDataSource([]);
     
      if (this.selectedevent === "socketEvent") {
        this.displayedColumns = ['no', 'activityType', 'createdBy','createdAt'];
      } else if (this.selectedevent === "bidSave") {
        this.displayedColumns = ['no','item', 'messageType', 'value', 'message', 'createdBy','createdAt'];
      } else if(this.selectedevent === "buyerChanges") {
        this.displayedColumns = ['no','activityType', 'oldValue', 'newValue', 'createdBy','createdAt'];        
      }
      if(this.issealedBidDis2){
        this.displayedColumns = this.displayedColumns.filter((obj)=>obj !== 'createdBy');
      }
      this.bidService.getauditlog(obj).subscribe((res) => {
        this.length = res['data']['count'];
        res['data']['activity'].forEach((element,i) => {
          if (this.selectedSupplier && !this.selectedSupplier["supplierID"]) {
            element.supplierName = this.supplierDrop.find(x => x.supplierID == element.createdBy)["supplierName1"];
          } 
          if(this.auctionData.isSealedBidAuction && element.createdBy) {
            element.createdBy = this.supplierDrop.find(x => x.supplierID == element.createdBy)["supplierName1"];
          }
          this.listdata.push(element);
        });
        this.auditLogList = new MatTableDataSource(this.listdata);
        this.show=true;
      }, (err) => {
        this.show=true;
       })
    } catch (err) {

    }
  }

  onOptionsSelected(val=null) {
    if(val){
    if (val === 'start') {
      this.bothStartDate = new Date((this.startDate.getMonth() + 1) + '-' + this.startDate.getDate() + '-' + this.startDate.getFullYear() + ' ' + this.startDate.getHours() + ':' + this.startDate.getMinutes());
    }     
    else {
      this.bothEndDate = new Date((this.endDate.getMonth() + 1) + '-' + this.endDate.getDate() + '-' + this.endDate.getFullYear() + ' ' + this.endDate.getHours() + ':' + this.endDate.getMinutes());
    }
  }
    this.listdata = [];
    this.getAuditList();
  }

  pageFilter() {
    if (this.pageEvent) {
      this.pageNo = this.pageEvent.pageIndex;
      this.getAuditList();
    }
  }



}
