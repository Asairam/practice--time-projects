import { Component, Input, OnInit, ViewChild, ElementRef, Output, EventEmitter } from '@angular/core';
import { CommonService } from 'src/app/commonService/common.service';
import * as config from 'src/app/appConfig/app.config';
import { AuthService } from 'src/app/authService';
import { QueryChatService } from 'src/app/component/component-service/query-chat.service';
import * as api from '../../../../environments/environment';

@Component({
  selector: 'app-chat-bot',
  templateUrl: './chat-bot.component.html',
  styleUrls: ['./chat-bot.component.css']
})
export class ChatBotComponent implements OnInit {
  @Input() issealedBidDis = false;
  @Input() buyerauctionData = null;
  @Input() auctionID: any;
  @Input() chatNotification = [];
  selectedSupplier: any = null;
  @Input() supplierList = [];
  queryList = [];
  chatAllVisible = false;
  displayFlag = false;
  userDetails: any = { emailID: '', name: '', role: '', vendorCode: '' };
  queryNo = 0;
  socketID = 0;
  longDesc: string;
  // imageURL=config.IMAGE_URL;
  imageURL=api.environment.rauction;
  sendFlag = false;
  allDesc: string;
  checkedData=false;
  checked=false;
  @ViewChild('scrollMe') myScrollContainer: ElementRef;
  myScrollVariable = 0;
  translateText: any;
  @Output() closeMethod = new EventEmitter<any>();
  searchSupplier=[];
  textSearch="";
  @Input() auctionData=null;
  auctionStatusList= config.AUCTIONSTATUS;

  constructor(public common: CommonService, private auth: AuthService, private queryService: QueryChatService) {
    this.common.translateSer('CHAT').subscribe(async (text: string) => {
      this.translateText = text;
    });
  }

  ngOnInit() {
    try {
      if (this.common.commonStatus.toLowerCase() == this.auctionStatusList.OP.toLowerCase()) {
        this.chatAllVisible = false
      }
      else {
        this.chatAllVisible = true
      }
      this.userData();
    }
    catch (ex) {
      this.common.error(ex);
    }
  }

  async userData() {
    this.displayFlag = false;
    let userObj = this.auth.getUserData();
    this.userDetails.name = (userObj.name.firstname != undefined) ? userObj.name.firstname + ((userObj.name.lastname != undefined) ? (' ' + userObj.name.lastname) : '') : '';
    this.userDetails.role = this.auth.userRole().toLowerCase();
    if (config.ROLE_ACCESS_CONTROL.both_supplier.includes(this.userDetails.role)) {
      this.userDetails.vendorCode = userObj.settings.ril.vendorcodeSelected;
      this.getQueryListData();
    }
    else {
      await this.getSupplierList();
      await this.seeParticipants();
     
    }
  }

  getSupplierList() {
    this.userDetails.vendorCode = this.supplierList[0].supplierID;
    this.selectedSupplier = this.supplierList[0];
    this.displayFlag = true;
    this.supplierList.forEach((element,i) => {
      element.notifyFlag = false;
      // element.status = this.buyerService.supplierStatusData.filter(x => x.email == element.supplierID)[0].status;
      if (this.chatNotification.length > 0) {
        let chatData = this.chatNotification.filter(x => x.vendorcode == element.supplierID);
        if (chatData.length > 0 && this.selectedSupplier.supplierID != chatData[0].vendorcode) {
          element.notifyFlag = true;
        }
      }
    });
    this.searchSupplier=[...this.supplierList]
    this.getQueryListData();
    return null;
  }

  onTextSearch(){
    if(this.searchSupplier.length>0){
    this.supplierList=this.searchSupplier.filter(x=> x.supplierName1.includes(this.textSearch));
    }
  }

  getSocketChat(...rest) {
    try {
      let flag;
      rest[0].queryList.forEach(query => {
        query.sendFlag = (this.auth.userRole().toLowerCase() == query.rollAssign) ? "from" : "to";
      });
      if ((rest[2]) ? this.selectedSupplier.supplierID != rest[1] : false) {
        flag = rest[0].queryList[(rest[0].queryList.length - 1)].rollAssign;
        this.supplierList.forEach(element => {
          if(!element.notifyFlag)
                element.notifyFlag = (!(flag.toLowerCase() == config.ROLE_ACCESS_CONTROL.buyer.toLowerCase()) && (element.supplierID == rest[1])) ? true : false;
        });
      }
      else {
        this.queryList = [];
        this.queryList = rest[0].queryList;
      }
      if (!this.checkedData) {
        setTimeout(() => {
          this.myScrollVariable = this.myScrollContainer.nativeElement.scrollHeight;
        }, 100);
      }
    }
    catch (ex) {
      this.common.error(ex);
    }
  }

  getSupplierQueryByID(data) {
    //console.log("get chat -----");
    if (data.notifyFlag) {
      data.notifyFlag = false;
    }
    this.selectedSupplier = data;
    this.userDetails.vendorCode = data.supplierID;
    this.queryList = [];
    this.longDesc = "";
    this.seeParticipants();
    this.getQueryListData();
  }

//geting chat data
  getQueryListData() {
    let data = {
      application: "Auction",
      appNo: this.auctionID,
      vendorNo: this.userDetails.vendorCode,
      queryNo: this.queryNo
    }
    this.queryService.getQueryList(data).subscribe((res) => {
      if (res['data']) {
        res['data'].queryList.forEach(element => {
          element.sendFlag = (this.userDetails.role == element.rollAssign) ? "from" : "to";
          this.queryList.push(element);
        });
        //console.log("this.queryList---", this.queryList);
        this.socketID = res['data']._id;
        setTimeout(() => {
          this.myScrollVariable = this.myScrollContainer.nativeElement.scrollHeight;
        }, 100);
      }
    }, err => {
      this.common.error(err);
    })
  }

  seeParticipants(){
    var element = document.getElementsByClassName("chat-participants");
    var element1 = document.getElementsByClassName("chat-overlay");
    element[0].classList.toggle("participant-slide");
    element1[0].classList.toggle("hide");
    return null;
  }

  onSubmitQuery(flag = false) {

    if ((flag && this.allDesc == "") || (!flag && this.longDesc == "")) {
      this.common.error("Write a message");
      return false;
    }

    if(flag){
      this.checkedData=true;
    }
    else{
      this.checkedData=false;
    }

    let data = {
      "application": "Auction",
      "appNo": this.auctionID,
      "vendorNo": flag ? '' : this.userDetails.vendorCode,
      "shortDesc": "System Generated",
      "createdById": this.userDetails.vendorCode,
      "createdBy": this.userDetails.name,
      "fromChat": true,
      "allowStatus": flag,
      "queryList": {
        "id": 0,
        "rollAssign": this.userDetails.role,
        "shortDesc": "System Generated",
        "longDesc": (flag) ? this.allDesc : this.longDesc,
        "createdById": this.userDetails.vendorCode,
        "createdBy": this.userDetails.name,
        "attachmentList": []
      },
      "vendorList": (flag) ? this.supplierList.map(x => { return x.supplierID }) : []
    }

    this.queryService.insertQueryData(data).subscribe((res: any) => {
      this.sendFlag = true;
      this.longDesc = "";
      this.allDesc = "";
      this.checked = false;
    })
  }

 updateQueryData() {

    if (this.longDesc == "") {
      this.common.error("Write a message");
      return false;
    }
    this.checkedData=false;
    let data = {
      "application": "Auction",
      "appNo": this.auctionID,
      "vendorNo": this.userDetails.vendorCode,
      "queryNo": this.queryNo,
      "queryList": {
        "id": 0,
        "rollAssign": this.userDetails.role,
        "shortDesc": "System Generated",
        "longDesc": this.longDesc,
        "createdById": this.userDetails.vendorCode,
        "createdBy": this.userDetails.name,
        "attachmentList": []
      },
    }
    this.queryService.updateQueryData(data).subscribe((res) => {
      this.sendFlag = true;
      this.longDesc = "";
    })
  }

  closeChat() {
    this.closeMethod.emit();
  }

  ifSealedBidgetPartName(id) {
    return this.supplierList.find(obj=>obj.supplierID ==id.createdById)['supplierName1'];
  }
}
