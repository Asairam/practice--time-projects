import { Component, OnInit, Input } from '@angular/core';
import { BuyerBiddingService } from 'src/app/component/component-service/buyer-bidding.service';
import { SocketService } from 'src/app/component/socketService/socket.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import * as api from '../../../../../environments/environment';
import { CommonService } from 'src/app/commonService/common.service';
@Component({
  selector: 'app-live-auction-card-flip',
  templateUrl: './live-auction-card-flip.component.html',
  styleUrls: ['./live-auction-card-flip.component.css']
})
export class LiveAuctionCardFlipComponent implements OnInit {
  imageURLLive = api.environment.rauction;
  @Input() aucDetails;
  itemListData: any[];
  lotList = [];
  timeSocket: Subscription;
  translateSerCommon:any;
  constructor(private bidService: BuyerBiddingService, private socketService: SocketService, private routes: Router,
    private commonService: CommonService,) { 
    this.commonService.translateSer('COMMON').subscribe(async (text: string) => {
      this.translateSerCommon = text;
    });
  }

  ngOnInit() {
    console.log(this.aucDetails)
    this.getItemBidDetails(this.aucDetails)
    this.getItemSocketData(this.aucDetails);
  }

  ngOnDestroy() {
    try {
      this.timeSocket.unsubscribe();
    } catch (e) {
    }
  }

  onBack() {
    this.aucDetails['flip'] = 'inactive';
  }

  getItemBidDetails(data) {
    this.bidService.getItemBidDetails(data.auctionID).subscribe((res) => {
      if (res['success']) {
        this.itemListData = res['data'][0];
        this.lotList = res['data'][0]['lots'];
      }
      console.log(this.itemListData)
    }, (err) => {
    });
  }

  showSummaryView(val) {
    var winref = window.open('', `MyWindowName-${val.auctionID}`, '', true);
    if (winref.location.href === 'about:blank') {
      winref.location.href = `${api.environment.applicationUrl}livebidding/${val.auctionID};breadCrumbStatus=Open;navigation=liveauctions`;
    }
  }

  getItemSocketData(data) {
    this.timeSocket = this.socketService.getBidSocketData(data.auctionID, 'buyer').subscribe(data => {
      this.itemListData = data[0];
      this.lotList = data[0]['lots'];
    })
  }
}
