import { Component, OnInit } from '@angular/core';
import { BuyerStatusService } from '../../component-service/buyer-status.service';
import { CommonService } from '../../../commonService/common.service';
import { Router } from '@angular/router';
import * as routerconfig from '../../../appConfig/router.config';

@Component({
  selector: 'app-template-auction',
  templateUrl: './template-auction.component.html',
  styleUrls: ['./template-auction.component.css']
})
export class TemplateAuctionComponent implements OnInit {
  aucStatus = 'Template';
  auctionList = [];
  view = 'card';
  scrollDistance = 1;
  scrollUpDistance = 2;
  throttle = 300;
  sum = 1;
  translateSerCommon: any;
  translateSer: any;

  constructor(private buyerstatusService:BuyerStatusService, private commonService:CommonService, private route:Router) { 
    this.commonService.translateSer('STATUS_DETAILS').subscribe(async (text: string) => {
      this.translateSer = text;
    });
    this.commonService.translateSer('COMMON').subscribe(async (text: string) => {
      this.translateSerCommon = text;
    });
  }

  ngOnInit() {
    this.getAucList(this.aucStatus, 1);

  }

  getAucList(aucStatus, no) {
    try {
      let status = aucStatus;
      // if (aucStatus === 'Clone') {
      //   status = '';
      // }
      let obj = {
        "status": status,
        "pageNum": no
      }
      this.buyerstatusService.getBuyerList(obj).subscribe((res: any) => {
        if (res['success']) {
          res['data'].forEach((obj) => {
            this.auctionList.push(obj);
            console.log(this.auctionList);
          });
        }
      }, error => { });
    } catch (err) { }
  }
  viewType(type) {
    this.view = type;
  }
  onScrollDown() {
    this.sum += 1;
    this.getAucList(this.aucStatus, this.sum);
  }
  editTemplate(data){
    //xlet url=`status=Draft&template=true`;
    this.route.navigate([routerconfig.buyer_router_links.EDIT_AUCTION+'/',data], { queryParams: {status: 'Draft',template:'true'} });

  }

  seleAtt(val) {
    if (val.attachmentList && val.attachmentList.length == 0) {
      this.commonService.warning(this.translateSerCommon['NO_REC_FOU']);
    } else {
      let sendData = {
        flag: 'openAttach',
        pageFrom: 'header_attachment',
        data: { data: val, 'pageFrom': 'readonly'}
      }
      this.commonService.toggleDiv.emit(sendData);
    }
  }

  onCli() {
    this.commonService.buyerRedirectLanding();
  }
}
