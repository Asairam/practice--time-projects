import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from 'src/app/commonService/common.service';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { BuyerEditService } from 'src/app/component/component-service/buyer-edit.service';
import { BuyerBiddingService } from 'src/app/component/component-service/buyer-bidding.service';
@Component({
  selector: 'app-custom-dis-columns',
  templateUrl: './custom-dis-columns.component.html',
  styleUrls: ['./custom-dis-columns.component.css']
})
export class CustomDisColumnsComponent implements OnInit {
  itemboundClick = false;
  term = null;
  @Input() viewPageFlag;
  @Input() auctionID;
  @Input() columnNames;
  constructor(public common: CommonService,
    private buyerService: BuyerEditService,
    public bidService: BuyerBiddingService, ) { }

  ngOnInit() {
  }
  saveItemCustFil() {
    this.common.loader = false;
    if (!this.itemboundClick) {
      let payload = {
        auctionID: this.auctionID,
        filterColumn: this.columnNames
      };
      if (this.viewPageFlag == 'item') {
        this.buyerService.insertCustomFilList(payload).subscribe((res: any) => {
          this.common.loader = true;
        }, (err) => { });
      } else {
        this.buyerService.insertMatrixCustomFilList(payload).subscribe((res: any) => {
          this.common.loader = true;
        }, (err) => { });
      }
    }
  }
  drop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.columnNames, event.previousIndex, event.currentIndex);
    this.suppCol();
  }

  onSelectCustomFil(event, col) {
    let index = this.columnNames.findIndex(obj => obj.item_id == col.item_id)
    this.columnNames[index]['selected'] = event;
    if(col.item_id == 'bidders') {
      this.bidService.matrixShowOnlyBidders('dro')
    }
    this.suppCol();
  }

  suppCol() {
    if (this.viewPageFlag == 'supplier') {
      // this.bidService.matrixShowOnlyBidders()
      this.bidService.setColumn = 'name';
    }
  }
}
