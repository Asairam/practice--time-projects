import { Component, OnInit, ViewChild, ViewChildren, QueryList, Input } from '@angular/core';
import { BuyerEditService } from '../../component-service/buyer-edit.service';
import { MatDialog, MatDialogRef, MatSort, MatTableDataSource, MatPaginator } from '@angular/material';
import { config } from 'rxjs';
import * as appConfig from '../../../appConfig/app.config';

@Component({
  selector: 'app-audit-log',
  templateUrl: './audit-log.component.html',
  styleUrls: ['./audit-log.component.css']
})
export class AuditLogComponent implements OnInit {
  @Input() auctionID;
  auditLogArray: any;
  auditLogBuyerArray: any;
  @ViewChild(MatSort) sort: MatSort;
  // @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChildren(MatPaginator) paginator = new QueryList<MatPaginator>();
  displayedColumns: string[] = ['Activity', 'Field', 'OldValue', 'NewValue', 'CreatedBy', 'UpdatedAt'
  , 'AuctionStatus'
];
  displayedSupplierColumns: string[] = ['Activity', 'Field', 'OldValue', 'NewValue', 'CreatedBy', 'UpdatedAt'
  , 'AuctionStatus'
];

  constructor(private buyereditservice: BuyerEditService, public MatDialogRef: MatDialogRef<AuditLogComponent>) { }

  ngOnInit() {
    this.getbuyerAuditLogData();
  }

  getbuyerAuditLogData(){
  this.buyereditservice.getauditlogbuyer(this.auctionID).subscribe((res =>{
  this.auditLogArray = res['data'];
    this.auditLogArray = new MatTableDataSource(res['data']);
     this.auditLogArray.sort = this.sort;
     this.auditLogArray.paginator = this.paginator.toArray()[0];
  }))
  
 }

 getSupplierAuditLogData(){
  this.buyereditservice.getauditlogsup(this.auctionID).subscribe((res =>{
    this.auditLogBuyerArray = res['data'];
    this.auditLogBuyerArray = new MatTableDataSource(res['data']);
     this.auditLogBuyerArray.sort = this.sort;
      this.auditLogBuyerArray.paginator = this.paginator.toArray()[1];    
    }));
 }

 getTabIndexData(event){

  if(event.index == 0){
    this.getbuyerAuditLogData();
  }
  else
  {
    this.getSupplierAuditLogData();
  }

}

isDataType(val){
  return appConfig.DATATYPES(val);
}


}
