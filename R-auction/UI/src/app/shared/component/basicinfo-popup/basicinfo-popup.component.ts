import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';
import { BuyerEditService } from '../../../component/component-service/buyer-edit.service';
import { BuyerBiddingService } from '../../../component/component-service/buyer-bidding.service';
import { CommonService } from '../../../commonService/common.service';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from '../../../authService/auth.service'
import * as config from '../../../appConfig/app.config';


@Component({
  selector: 'app-basicinfo-popup',
  templateUrl: './basicinfo-popup.component.html',
  styleUrls: ['./basicinfo-popup.component.css']
})
export class BasicinfoPopupComponent implements OnInit {
  convert_exeTime: any;
  convert_grace: any;
  contact_info: any;
  currencyCode: any;
  basicinfodata: any=null;
  @Input() auctionId;
  @Input() biddings;
  @Output() openAttach=new EventEmitter<any>();

  constructor(private buyerService: BuyerEditService, private route: ActivatedRoute,
    public authService: AuthService, private commonService: CommonService, private buyerBiddingService: BuyerBiddingService) {

  }

  ngOnInit() {
    if (this.auctionId &&  !this.basicinfodata) {
      this.getbasicdata();
    }
  }

  getbasicdata() {
    // this.commonService.loader = true;

    this.buyerBiddingService.getAuctionDataById(this.auctionId).subscribe((res) => {
      this.basicinfodata = res['data'];
      if (this.basicinfodata && this.biddings && this.biddings.biddingcurrency['exchangeRate'] && this.basicinfodata['minBidChangeValue'] && this.basicinfodata['minBidChangeType'] === 'amount') {
        this.basicinfodata['minBidChangeValue'] = (+this.basicinfodata['minBidChangeValue'] / +this.biddings.biddingcurrency['exchangeRate']).toFixed(this.biddings.decimalValue);
      } else {
        this.currencyCode = this.basicinfodata['primaryCurrency'];
      }

      if(this.biddings) {
        this.currencyCode = this.biddings.biddingcurrency['currencyCode'];
      }
      // this.commonService.loader = false;
      this.contact_info = this.authService.getUserData();
      this.convert_exeTime = this.basicinfodata.extensionSeconds / 60;
      this.convert_grace = this.basicinfodata.gracePeriod / 60;
      if(this.basicinfodata.attachmentList.length>0){
        if(config.ROLE_ACCESS_CONTROL.both_supplier.includes(this.authService.userRole())){
          this.basicinfodata.attachmentList=this.basicinfodata.attachmentList.filter(x=> x.isExternal);
        }
      }
      if(this.basicinfodata && this.basicinfodata.infoShownToSupplier == 'top rank only'){
        this.basicinfodata.infoShownToSupplier = config.supplierShown.topRank;
      }
    }, (err) => {
      this.commonService.loader = false;
    })
  }

  onAttachDocument(data) {
    try {
      if (data.length > 0) {
        this.openAttach.emit(data);
      }
      else{
        return this.commonService.error("Not uploaded any file")
      }

    } catch{


    }

  }



}

