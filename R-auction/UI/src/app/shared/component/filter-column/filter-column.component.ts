import { Component, OnInit } from '@angular/core';
import { BuyerBiddingService } from 'src/app/component/component-service/buyer-bidding.service';
@Component({
  selector: 'app-filter-column',
  templateUrl: './filter-column.component.html',
  styleUrls: ['./filter-column.component.css']
})
export class FilterColumnComponent implements OnInit {

  constructor(public buyerBidService: BuyerBiddingService) { }

  ngOnInit() {
  }
  onSelect(event, ind) {
    this.buyerBidService.columnNames[ind]['selected'] = event;
  }
  
  ngOnDestroy(){
    this.buyerBidService.setColumn='name';
  }
}
