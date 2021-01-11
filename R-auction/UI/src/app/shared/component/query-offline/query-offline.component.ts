import { Component, OnInit, Inject, ElementRef, ViewChild, Input } from '@angular/core';
import { MatDialog, MatTableDataSource, MatDialogConfig } from '@angular/material';
import { FormControl, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { AttachDocumentComponent } from '../../../shared/component/attach-document/attach-document.component';
import { QueryChatService } from 'src/app/component/component-service/query-chat.service';
import * as config from 'src/app/appConfig/app.config';
import { AuthService } from 'src/app/authService';
import * as $ from 'jquery';
import { CommonService } from 'src/app/commonService/common.service';
import { ViewPopupComponent } from '../view-popup/view-popup.component';
import { BuyerEditService } from 'src/app/component/component-service/buyer-edit.service';
import { SupplierService } from 'src/app/component/component-service/supplier.service';
import * as api from '../../../../environments/environment';

@Component({
  selector: 'app-query-offline',
  templateUrl: './query-offline.component.html',
  styleUrls: ['./query-offline.component.css']
})
export class QueryOfflineComponent implements OnInit {
  @Input() sealedBID;
  @Input() auctionID = null;
  @Input() auctionData=null;
  @Input() page=null;
  auctionStatusList= config.AUCTIONSTATUS;
  showQueryData = false;
  closeData=0;
  textSearch="";
  sideDiv = false;
  maindiv = true
  collabrationForm: FormGroup;
  collabrationData: any;
  imageData: any = [];
  // imageURL=config.IMAGE_URL;
  imageURL=api.environment.rauction;
  cheakStatus;
  queryList: any = [];
  queryListLength: any;
  queryNumber: any;
  queryType: any;
  supplierList = [];
  supplierData: any;
  shorDesc: any;
  displayedColumns = ['srno', 'subject', 'raisedDate', 'raisedBy', 'action'];
  querySource: any = new MatTableDataSource();
  selectable = true;
  removable = true;
  displayFlag = false;
  querySocketData: any;
  @ViewChild('scrollMe') private myScrollContainer: ElementRef;
  myScrollVariable = 0;
  userDetails: any = { emailID: '', name: '', role: '', vendorCode: '' };
  attachPage = false;
  searchSupplier=[];
  sendData: { flag: string; pageFrom: string; data: { data: any; 'aucStatus': any; }; };

  constructor(private queryService: QueryChatService, private auth: AuthService, public dialog: MatDialog, private formBuilder: FormBuilder, 
    private common: CommonService,private buyerService:BuyerEditService,private supplierService:SupplierService) { }

  ngOnInit() {
    this.cheakStatus = ''
    this.userData();
    this.createForm();
  }


  getSupplierList() {
    this.buyerService.getSupplierDetails(this.auctionID).subscribe((res:any)=>{
    this.displayFlag = true;
    this.supplierList=res["data"].supplierList;
    if(this.sealedBID) {
      this.supplierList.forEach((element,i) => {
        element.supplierName1 = 'Participant '+ (i+1)
      });
    }
    this.userDetails.vendorCode = this.supplierList[0].supplierID;
    this.supplierData = this.supplierList[0];
    this.searchSupplier=[...this.supplierList]
    this.seeParticipants();
    this.getQueryData();
  },err=>{
    this.common.error(err);
  })
  }

  getSupplierQueryByID(data) {
    this.showQueryData = false;
    this.supplierData = data;
    this.sideDiv = false;
    this.maindiv = true;
    this.attachPage = false;
    this.userDetails.vendorCode = data.supplierID;
    this.getQueryData();
    this.seeParticipants();
  }

  remove(document): void {
    const index = this.imageData.indexOf(document);

    if (index >= 0) {
      this.imageData.splice(index, 1);
    }
  }

  getQueryListData() {
    let data = {
      application: "Auction",
      appNo: this.auctionID,
      vendorNo: this.userDetails.vendorCode,
      queryNo: this.closeData
    }
    this.queryService.getQueryList(data).subscribe((res) => {
      res['data'].queryList.forEach(element => {
        element.sendFlag = (this.userDetails.role == element.rollAssign) ? "from" : "to";
        this.queryList.push(element);
      });
    })
  }

  getQueryData() {
    let data = {
      application: "Auction",
      appNo: this.auctionID,
      vendorNo: this.userDetails.vendorCode
    }
    this.queryService.getQuery(data).subscribe((res) => {
      this.responseGetQueryData(res);

    })
  }
  responseGetQueryData(data) {
    if (data.status = "Sucess") {
      data.data = data.data.filter(x => x.queryNo != 0);
      this.querySource = new MatTableDataSource(data.data);
      if (this.querySource.data.length <= 0) {
        this.queryListLength = 0;
      }
      if (this.querySource.data.length > 0) {
        for (let i = 0; i < this.querySource.data.length; i++) {
          this.queryListLength = this.querySource.data[i].queryNo;
        }
      }
    }

  }

  async userData() {
    this.displayFlag = false;
    let userObj = this.auth.getUserData();
    this.userDetails.name = (userObj.name.firstname != undefined) ? userObj.name.firstname + ((userObj.name.lastname != undefined) ? (' ' + userObj.name.lastname) : '') : '';
    this.userDetails.role = this.auth.userRole().toLowerCase();
    this.userDetails.emailID = userObj.email;
    if (config.ROLE_ACCESS_CONTROL.both_supplier.includes(this.userDetails.role)) {
      this.userDetails.vendorCode = userObj.settings.ril.vendorcodeSelected;
      if(this.page=="query_history_auction")
        this.getAuctionData();

      this.getQueryData();
    }
    else {
   this.getSupplierList();
  
    }
  }


  sideDivShow() {
    this.createForm();
    this.sideDiv = true;
    this.maindiv = false;
  }

  closesideDivShow() {
    this.sideDiv = false;
    this.maindiv = true;
  }


  createForm() {
    this.collabrationForm = this.formBuilder.group({
      longDesc: new FormControl('', {
        validators: Validators.required,
        updateOn: 'change'
      }),
      query_type: new FormControl('', {
        updateOn: 'change'
      }),

      sort_desc: new FormControl('', {
        validators: Validators.required,
        updateOn: 'change'
      }),
    })
  }
 
  getSubjectError() {
    return "Subject  is required ";
  }
  getLongDescriptionError() {
    return "write Query  is required ";
  }

  uploadImage() {
    this.sendData = {
      flag: 'openAttach',
      pageFrom: 'query_history',
      data: { data: this.auctionData, 'aucStatus': null },
    }
     this.attachPage = true;
  }

  getAttachData(data) {
    this.imageData = data;
    this.attachPage=false;
  }

  closeChat() {
    let sendData = {
      flag: 'closeAttach',
      pageFrom: 'query-history'
    }
    this.common.toggleDiv.emit(sendData);
  }


  openChat(opendata) {
    this.queryList = [];
    this.closeData = opendata.queryNo;
    let queryList = {
      "id": 0,
      "rollAssign": opendata.rollAssign,
      "shortDesc": opendata.shortDesc,
      "longDesc": opendata.longDesc,
      "createdById": opendata.createdById,
      "createdBy": opendata.createdBy,
      "attachmentList": opendata.attachmentList,
      "createdAt": opendata.createdAt,
      "sendFlag": (this.userDetails.role == opendata.rollAssign) ? "from" : "to"
    }
    this.queryNumber = opendata.queryNo;
    this.queryType = opendata.queryType;
    this.shorDesc = opendata.shortDesc;
    this.queryList.push(queryList);
    this.showQueryData = true;
    this.imageData = [];
    this.getQueryListData();

  }
  closeQueryData() {
    this.showQueryData = false;
  }
  onSubmitQuery() {
    let data = {
      "application": "Auction",
      "appNo": this.auctionID,
      "vendorNo": this.userDetails.vendorCode,
      "shortDesc": this.collabrationForm.controls['sort_desc'].value,
      "longDesc": (this.collabrationForm.controls['longDesc'].value == null) ? "" : this.collabrationForm.controls['longDesc'].value,
      "createdById": this.userDetails.emailID,
      "createdBy": this.userDetails.name,
      "attachmentList": this.imageData,
      "collaboratorNo": 0,
      "rollAssign": this.userDetails.role
    }
    this.queryService.insertQueryData(data).subscribe((res: any) => {
      this.common.success("Query created successfully " + this.collabrationForm.controls['sort_desc'].value);
      this.responseSaveData(res)
    })
  }

  sendFlag = false;
  updateQueryData() {

    let longDesc = this.collabrationForm.controls['longDesc'].value;
    if (this.imageData.length == 0) {
      if (longDesc == "") {
        this.common.error("Write a message");
        return false;
      }
    }
    let data = {
      "application": "Auction",
      "appNo": this.auctionID,
      "vendorNo": this.userDetails.vendorCode,
      "queryNo": this.queryNumber,

      "queryList": {
        "id": 0,
        "rollAssign": this.userDetails.role,
        "shortDesc": this.shorDesc,
        "longDesc": (longDesc == null) ? "" : longDesc,
        "createdById": this.userDetails.emailID,
        "createdBy": this.userDetails.name,
        "attachmentList": this.imageData
      }
    }
    this.queryService.updateQueryData(data).subscribe((res) => {
      this.sendFlag = true;
      this.imageData = [];
      this.collabrationForm.reset();
      data.queryList["sendFlag"]= (this.userDetails.role ==  data.queryList["rollAssign"]) ? "from" : "to";
      data.queryList["createdAt"]=new Date();
      this.queryList.push(data.queryList);
      setTimeout(() => {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      }, 100)
    })
  }

  responseSaveData(res) {

    this.collabrationForm.reset();
    this.sideDiv = false;
    this.maindiv = true;
    this.getQueryData()

  }

  downloadAttachment(attachmentData) {
    const objMatDialogConfig = new MatDialogConfig();
    objMatDialogConfig.panelClass = 'dialog-xs';
    objMatDialogConfig.data = { data: attachmentData, tab: "downloadView" };
    objMatDialogConfig.disableClose = true;
    let refMatDialog = this.dialog.open(ViewPopupComponent, objMatDialogConfig);
    refMatDialog.afterClosed().subscribe((value) => {
    })
  }

  onTextSearch(){
    if(this.searchSupplier.length>0){
    this.supplierList=this.searchSupplier.filter(x=> x.supplierName1.toLowerCase().includes(this.textSearch.toLowerCase()));
    }
  }

  getAuctionData(){
    this.supplierService.getLiveBidDetails(this.auctionID).subscribe((res:any)=>{
      this.auctionData=res["data"];
    },err=>{
      this.common.error(err);
    })
  }

  
  seeParticipants(){
    var element = document.getElementsByClassName("chat-participants");
    var element1 = document.getElementsByClassName("chat-overlay");
    element[0].classList.toggle("participant-slide");
    element1[0].classList.toggle("hide");
  }

}



