import { environment } from '../../../../../environments/environment'
import { Component, OnInit, Input, ViewChild, ElementRef } from '@angular/core';
import { BuyerEditService } from 'src/app/component/component-service/buyer-edit.service';
declare var jsPDF: any;
import { AuthService } from '../../../../authService/auth.service';
import { CommonService } from '../../../../commonService/common.service';
import { PrintPreviewService} from './printpreview.service';

@Component({
  selector: 'app-printpreview',
  templateUrl: './printpreview.component.html',
  styleUrls: ['./printpreview.component.scss'],
  providers: [PrintPreviewService]
})
export class PrintpreviewComponent implements OnInit {

  @ViewChild('contentData') contentData: ElementRef;
  printData: any;
  allAuctionData: any;
  imageURL = environment.rauction;
  @Input() viewData;
  lotData = [];
  itemData = [];
  participantList = [];

  customFields = [];
  hostList = [];
  basicInfoData: any;
  sheduleData: any;
  

  constructor(
    private buyerService: BuyerEditService, 
    private authservice: AuthService, 
    private common: CommonService,
    private printService: PrintPreviewService) {
     }

  ngOnInit(){
    if (this.viewData["flag"]) {
      this.buyerService.getPreliminaryBidByVendorCode(this.viewData.basicInformation.auctionID, this.viewData.supplier[0].supplierID)
        .subscribe((res) => {
          this.getInitDataBySupplier(res);
          this.getAuctionCustomField(this.viewData.basicInformation.auctionID);
        })
    }
    else {
      this.buyerService.getAuctionPrintpreview(this.buyerService.auctionData.auctionID).subscribe((res: any) => {
        this.getInitDataByBuyer(res);
        this.getAuctionCustomField(this.buyerService.auctionData.auctionID);
      })
    }
    console.log("cfield---", this.viewData)
    // this.customFields = this.viewData.customField;
  }

  getAuctionCustomField(auctionID) {
    if(auctionID) {			
			this.buyerService.getCustomFieldList(auctionID).subscribe((res: any) => {
				this.customFields = res.data.sort((a, b) => {
					return a._id - b._id;
        });
      });
    }
  }

  getInitDataBySupplier(res) {
    this.basicInfoData = this.viewData.basicInformation;
    this.basicInfoData["attachmentList"] = this.basicInfoData["attachmentList"].filter( a => a.isInternal==false && a.isExternal==true ); 
    this.itemData = this.viewData.item;
    this.itemData.forEach(item => {
      item.attachmentList = item.attachmentList.filter(attachment => {
        return attachment.isExternal;
      })
    })


    this.participantList = this.viewData.supplier;
    this.hostList=[];
    this.participantList.forEach(supplier => {
      supplier.bids = res['data'].filter(x => x.bidderID == supplier.supplierID);
      supplier.baseCost = 0;
      supplier.variableCost = 0;
      supplier.landedCost = 0;
      supplier.totalLandedCost = 0;
      supplier.bids.forEach(itemS => {
        supplier.baseCost += itemS["baseCost"] ? Number(itemS.baseCost) : 0;
        supplier.variableCost += itemS["variableCost"] ? Number(itemS.variableCost) : 0;
        supplier.landedCost += itemS["landedCost"] ? Number(itemS.landedCost) : 0;
        supplier.totalLandedCost += itemS["totalLandedCost"] ? Number(itemS.totalLandedCost) : 0;
      });
    })


    setTimeout(()=> {
      var printPreview = document.getElementById("printPreview");
      printPreview.scroll(0,0); 
    }, 1000);  

  }

  getInitDataByBuyer(res) {

    if (res[0]['data']) {
      this.basicInfoData = res[0]['data'];
      this.lotData = res[1]['data'];
      let itemDataList = res[1]['data'];
      this.getLongText(itemDataList).then(result => {
        this.itemData = result;
      }).catch(err => {
        console.log("mmcs api failed"); 
      })
      
      this.participantList = res[2]['data'].supplierList;
      this.hostList = res[3]['data'] ? res[3]['data'].hostInvites : [];
      this.participantList.forEach(supplier => {
        supplier.bids = res[4]['data'].filter(x => x.bidderID == supplier.supplierID);
        supplier.baseCost = 0;
        supplier.variableCost = 0;
        supplier.landedCost = 0;
        supplier.totalLandedCost = 0;
        supplier.bids.forEach(itemB => {
          supplier.baseCost += itemB["baseCost"] ? Number(itemB.baseCost) : 0;
          supplier.variableCost += itemB["variableCost"] ? Number(itemB.variableCost) : 0;
          supplier.landedCost += itemB["landedCost"] ? Number(itemB.landedCost) : 0;
          supplier.totalLandedCost += itemB["totalLandedCost"] ? Number(itemB.totalLandedCost) : 0;

        });
      });
    }
  }

  getLongText(itemDataList) {
    return Promise.all(itemDataList.map(element => {
      return new Promise((resolve, reject) => {
        if(!element.fromMMCS) {
          resolve(element);
        } else {
          this.buyerService.getMaterialDetails(element.itemCode).subscribe((res: any) => { 
            if(res.success) {
              if(res.data.result.length == 0) {
                resolve()
                return;
              }

              let val =  res.data.result[0];
              if( val.characteristics.length >0 || val.companyReferences.length>0 || val.longdesc) {   
                element.longTextChar = {
                  mmcsCharacteristics : val.characteristics,
                  companyReferences : val.companyReferences,
                  mmcsLongDesc : val.longdesc,
                }
              }
              resolve(element);
            }
          }, (err) => {
            reject();
          })
        }
      })
    }));
  }

  downloadPDF() {
    document.getElementById('contentData')
    this.getLogo().then((result => {
      let doc = jsPDF();
      this.drawLogo(doc, result);
      this.drawBasicInfo(doc);
      this.drawContactInfo(doc);
      this.drawAuctionBiddingRules(doc);
      this.drawItemDetails(doc);
      this.drawParticipants(doc);
      this.drawCohost(doc);
      this.drawHeaderAttachment(doc);
      this.drawItemAttachment(doc);
      this.drawSchedule(doc);
      doc.save('summary.pdf');
    })).catch((err) => {
      console.log(err);
    })
  }

  drawLogo(doc, logo) {
    let cord = {x: 62, y: 10}
    doc.addImage(logo, 'PNG', cord.x, cord.y, 87, 19);
  }

  drawBasicInfo(doc) {
    doc.autoTable({
      startY: 35,
      head: [],
      body: [
        ['Basic Information']
      ],
      bodyStyles: {
        fontSize: 14
      },
      theme: 'plain',
    })
    let finalY = doc.previousAutoTable.finalY;
    this.drawHr(doc, finalY, 100)
    let auctionName = this.basicInfoData.auctionName? this.basicInfoData.auctionName:'';
    let auctionId = this.basicInfoData.auctionID? this.basicInfoData.auctionID:'';
    let auctionType = this.camelToTitle(this.basicInfoData.type? this.basicInfoData.type:'');
    let primaryCurrency = this.basicInfoData.primaryCurrencyNew.currencyName? this.basicInfoData.primaryCurrencyNew.currencyName:''+this.basicInfoData.primaryCurrencyNew.currencyCode?this.basicInfoData.primaryCurrencyNew.currencyCode:''
    doc.autoTable({
      startY: finalY + 3,
      head: [['Auction name', 'Auction Id', 'Auction Type', 'Primary Currency']],
      body: [
        [auctionName, auctionId, auctionType, primaryCurrency]    
      ],
      theme: 'plain',
    })
    finalY = doc.previousAutoTable.finalY;    
    this.drawHr(doc, finalY+1, 230);

    let currency = this.basicInfoData.currency.map(element => {
      return element.currencyCode;
    });

    let desc = this.basicInfoData.description? this.basicInfoData.description:'';
    let company = this.basicInfoData.company? this.basicInfoData.company:'';
    //let autionRemark = this.basicInfoData.remark? this.basicInfoData.remark:'';
    doc.autoTable({
      startY: finalY + 2,
      head: [['Bidding Currency', 'Description', 'Company Code']],   //,'Auction Remark'
      body: [
        [currency.join(' , '), desc, company]      //, autionRemark
      ],
      theme: 'plain',
    })
    finalY = doc.previousAutoTable.finalY;    
    this.drawHr(doc, finalY+1, 230);

    let currencyy = this.basicInfoData.currency.map(element => {
      return element.currencyCode;
    });

    // let desc = this.basicInfoData.description? this.basicInfoData.description:'';
    // let company = this.basicInfoData.company? this.basicInfoData.company:'';
    let autionRemark = this.basicInfoData.remark? this.basicInfoData.remark:'';
    let head1 = ['Auction Remark'];
    let body1 = [autionRemark];
    if(this.basicInfoData.rfqNo) {
      head1 =  ['Auction Remark','RFQ No'];
      body1 = [autionRemark,this.basicInfoData.rfqNo];
    }
    doc.autoTable({
      startY: finalY + 2,
      head: [head1],
      body: [
        body1
      ],
      theme: 'plain',
    })
  }
  
  drawContactInfo(doc) {
    
    let finalY = doc.previousAutoTable.finalY;

    doc.autoTable({
      startY: finalY + 7,
      head: [],
      body: [
        ['Contact Information']
      ],
      bodyStyles: {
        fontSize: 14
      },
      theme: 'plain',
    });
    finalY = doc.previousAutoTable.finalY;
    this.drawHr(doc, finalY, 100);

    let name = this.viewData.flag == "supplier" ?  this.viewData.basicInformation.auctionLeader.name : this.viewData.contactperson.name;
    let email = this.viewData.flag == "supplier" ?  this.viewData.basicInformation.auctionLeader.email : this.viewData.contactperson.email;
    let number = this.viewData.flag == "supplier" ?  this.viewData.basicInformation.auctionLeader.number : this.viewData.contactperson.number;

    doc.autoTable({
      startY: finalY+3,
      head: [['Name', 'Email', 'Contact Number']],
      body: [
        [name, email, number]
      ],
      theme: 'plain',
    })
  }

  drawAuctionBiddingRules(doc) {
    
    let finalY = doc.previousAutoTable.finalY;
    doc.autoTable({
      startY: finalY + 7,
      head: [],
      body: [ ['Auction Bidding Rules']],
      bodyStyles: {fontSize: 14},
      theme: 'plain',
    })
    finalY = doc.previousAutoTable.finalY;
    this.drawHr(doc, finalY, 100);

    let extType = this.camelToTitle(this.basicInfoData.extensionType);
    let gracePeriod = this.viewData.biddingRules.gracePeriod/60 + ' mins';
    let extTime = this.viewData.biddingRules.extentionTime/60 + ' mins';
    doc.autoTable({
      startY: finalY + 3,
      head: [['Extend Auction if a new bid is', 'Grace Period', 'Extension Time']],
      body: [
        [extType, gracePeriod, extTime]
      ],
      theme: 'plain',
    })
    finalY = doc.previousAutoTable.finalY;
    this.drawHr(doc, finalY + 1, 230);

    let minBidChange = this.viewData.biddingRules.minBidChange;
    let bidCushionLimit = this.viewData.biddingRules.bidCusionLimit ? this.viewData.biddingRules.bidCusionLimit :  '';
    doc.autoTable({
      startY: finalY + 2,
      head: [['Minimum Bid Change', 'Bid Cushion Limit']],
      body: [
        [minBidChange, bidCushionLimit]
      ],
      theme: 'plain',
    })
  }

  drawHr(doc, finalY, color) {
    doc.setDrawColor(color, color, color);
    let startX = 15;
    let endX = 195;
    doc.line(startX, finalY, endX, finalY);
  }


  filterIt(ref) {
		if(ref == 'PN' || ref == 'OPN' || ref == 'CAT' || ref == 'MM') {
			return true;
		} else {
			return false;
		}
  }
  
  COMPANY_REFERENCES_LABELS = new Map([
		['PN', 'Part Number'], 
		['OPN', 'Old Part Number'],
		['CAT', 'Catalogue Number'],
		['MM',  'Manufacturer’s Model Type'],
		['companyName', 'Manufacturer']
	]);
	
	getDescForCompanyReferences(key) {
		return this.COMPANY_REFERENCES_LABELS.get(key);
	}

  drawItemDetails(doc) {
    let finalY = doc.previousAutoTable.finalY;
    doc.autoTable({
      startY: finalY + 5,
      head: [],
      body: [ ['Item Details']],
      bodyStyles: {fontSize: 14},
      theme: 'plain',
    })
    finalY = doc.previousAutoTable.finalY;

    this.drawHr(doc, finalY, 100);
    let header2 = ['Sr.no', 'Item Code', 'Lot Name/Item Name', 'Start Price' , 'Reliance Quantity', 'Minimum Bid Change', 'UOM', 'Remarks'];
    let customHeader = [];
    if(this.customFields != undefined){
    for(var i=0; i<this.customFields.length;i++) {
      if(this.viewData.flag && this.customFields[i].vendorLevelDisplay) {
      customHeader.push(this.customFields[i].fieldName)
      } else if(!this.viewData.flag) {
        customHeader.push(this.customFields[i].fieldName)
      }
      
    }};
    this.viewData.customHeader = customHeader;
    let newBody = this.printService.getTableBodyListItemDetails(this.itemData, this.viewData);
    finalY = doc.previousAutoTable.finalY;
    doc.autoTable({
      startY: finalY +2 ,
      head: [header2],
      body: newBody,
      styles: { 
        lineColor: [144, 162, 180],
        lineWidth: 0.1,
      },
      didParseCell: function(data) {
        if(data.cell.raw && data.cell.raw.customData) {
          data.cell.styles.fillColor = [40, 170, 100];
        }
        if (data.cell.raw && data.cell.raw.content && data.cell.raw.content.longDesc) {
          let content = data.cell.raw.content;
          if(content.isdesc) {
            data.cell.text = content.desc? content.desc : 'Not Applicable.';
          }
          if(content.isdescLabel) {
            data.cell.text = content.descLabel
          }
          if(content.ischarLabel) {
            data.cell.text = content.charLabel
          } 
        }
      },
      
      willDrawCell: function(data) { 
        if(data.cell.raw && data.cell.raw.customData) {
          data.cell.contentHeight = 0;
          data.cell.height = 0;
          data.row.height = 0;
          data.row.maxCellHeight = 0;
        }
       },
      didDrawCell:  (data) => {      
        if(data.cell.raw && data.cell.raw.customData) {
          let content = data.cell.raw.customData;
          data.cell.styles.fillColor = [40, 170, 100];
          if(content.ischar) {
            let height;
            let charBody = this.printService.getTableBodyListLongDesc(content);            
            doc.autoTable({
              head: [["Sr.no","Description", "Unit", "Types", "Values", "Abbrev Value"]],
              body: charBody,
              startY: data.cell.y + 2,
              margin: {left: data.cell.x + data.cell.padding('left')},
              tableWidth: 'wrap',
              theme: 'grid',
              styles: { fontSize: 9, cellPadding: 1},
              didDrawCell: function (data2) {},
              didDrawPage: function(data2) {                  
                height = data2.table.height + (charBody.length/2);
              }
            });
            data.cell.styles.fillColor = [40, 170, 100];
            data.row.height = height;
            data.row.maxCellHeight = height;
            }
        }
      },
      didDrawPage: function(data) {}
    });
  }

  drawParticipants(doc) {
    let finalY = doc.previousAutoTable.finalY;
    doc.autoTable({
      startY: finalY + 3,
      head: [],
      body: [['Participants'] ],
      bodyStyles: { fontSize: 14 },
      theme: 'plain',
    })
    finalY = doc.previousAutoTable.finalY;
    this.drawHr(doc, finalY, 100);

    let header = ['S.no', 'Supplier Code', 'Supplier Name', 'Address', 'Contact Person Name', 'Email', 'Mobile Number'];
    let body = this.printService.getTableBodyListParticipants(this.participantList, this.basicInfoData, this.itemData);
    
    finalY = doc.previousAutoTable.finalY;
    doc.autoTable({
      startY: finalY + 3 ,
      head: [header],
      body: body,
      // tableLineColor: [231, 76, 60],
      // tableLineWidth: 1,
      styles: {
        lineColor: [144, 162, 180],
        lineWidth: 0.1,
      },
      didParseCell: function(data) {},      
      willDrawCell: (data) =>  {
        if(data.cell.raw && data.cell.raw.customData) {
          data.cell.contentHeight = 0;
          data.cell.height = 0;
          data.row.height = 0;
          data.row.maxCellHeight = 0;
        }
      },
      didDrawCell:  (data) => {      
        if (data.cell.raw && data.cell.raw.content) {
            let height;
            let supplier = data.cell.raw.content.supplier;
            let basicInfoData = data.cell.raw.content.basicInfoData;
            let itemData = data.cell.raw.content.itemData;

            let headers = this.printService.getHeaderListBidsInParticipants(supplier, basicInfoData, itemData);
            let tableBody = this.printService.getTableBodyListBidsInParticipants(supplier, basicInfoData, itemData);
            doc.autoTable({
              head: [headers],
              body: tableBody,
              startY: data.cell.y + 2,
              margin: {left: data.cell.x + data.cell.padding('left')},
              tableWidth: 'wrap',
              theme: 'grid',
              styles: {fontSize: 9, cellPadding: 1},
              didDrawCell: function (data2) {},
              didDrawPage: function(data2) {                  
                height = data2.table.height + (tableBody.length/2);
              }
            });
            data.row.height = height;
            data.row.maxCellHeight = height;
        }
      },
    });
  }

  drawCohost(doc) {
    let finalY = doc.previousAutoTable.finalY;
    doc.autoTable({
      startY: finalY + 5,
      head: [],
      body: [['Co-Host']],
      bodyStyles: {fontSize: 14},
      theme: 'plain',
    })
    finalY = doc.previousAutoTable.finalY;
    this.drawHr(doc, finalY, 100);
    finalY = doc.previousAutoTable.finalY;
    let header = ['Sr.no', 'Employee ID', 'Employee Name', 'Email', 'Mobile Number'];
    let body = this.printService.getTableBodyListCohost(this.hostList);
    finalY = doc.previousAutoTable.finalY;
    doc.autoTable({
      startY: finalY + 3 ,
      head: [header],
      body: body,
      styles: { lineColor: [144, 162, 180], lineWidth: 0.1,}
    });
  }



  
  drawHeaderAttachment(doc) {
    let finalY = doc.previousAutoTable.finalY;
    doc.autoTable({
      startY: finalY + 10,
      head: [
         ['Summary Of Attachments']
      ],
      headStyles: {
        halign: 'center',
         fontSize: 14
        },
      body: [
        ['Header Level Attachment Documents']
      ],
      bodyStyles: {
        fontSize: 14,
      },
      theme: 'plain',
    })
    finalY = doc.previousAutoTable.finalY;
    this.drawHr(doc, finalY, 100);
    finalY = doc.previousAutoTable.finalY;
    let header = ['Sr.No', 'Attachment'];
    let body = [];
    this.basicInfoData.attachmentList.forEach((data , index) => {
      let attachment = data.fileName;
      let url = this.common.downloadAttachmentData(data);
      body.push([index+1 , { content: attachment, customData: {text: attachment, url: url }, colSpan: 0, rowSpan: 0, styles: { fillColor: 255 } }])
    });    
        
    finalY = doc.previousAutoTable.finalY;
    doc.autoTable({
      startY: finalY + 3 ,
      head: [header],
      body: body,
      styles: { lineColor: [144, 162, 180], lineWidth: 0.1,},
      didDrawCell: (data) =>  {
        if(data.section == "body" && data.cell.raw && data.cell.raw.customData) {
          doc.link(data.cell.textPos.x, data.cell.textPos.y,  data.cell.width,  data.cell.height, {url: data.cell.raw.customData.url});
        }
      }
    });

    finalY = doc.previousAutoTable.finalY;
  }

  drawItemAttachment(doc) {
    let finalY = 10;
    doc.addPage();
    doc.autoTable({
      startY: finalY,
      head: [],
      body: [
        ['LineItem Attachment Documents']
      ],
      bodyStyles: {
        fontSize: 14
      },
      theme: 'plain',
    })
    finalY = doc.previousAutoTable.finalY;
    this.drawHr(doc, finalY, 100);
    finalY = doc.previousAutoTable.finalY;
    let header = ['Sr.No', 'Item Code', 'Item/Material Description', 'Attachment'];
    let body = [];
    let srno = 0;
    this.itemData.forEach((data , index) => {
      srno = data.attachmentList.length > 0 ? srno + 1 : srno;
      let itemcode = data.itemCode;
      let lot = data.lotType ? data.lotType : data.lotName;
      let name = data.itemName;

      data.attachmentList.forEach((element, otherIndex) => {
        if(otherIndex + 1 == 1) {
          let url = this.common.downloadAttachmentData(element);
          body.push([srno, itemcode, name , { content: element.fileName, customData: {text: element.fileName, url: url }, colSpan: 0, rowSpan: 0, styles: { fillColor: 255 } }])
        } else {
          let url = this.common.downloadAttachmentData(element);
          body.push([{content: '', colSpan: 3}, { content: element.fileName, customData: {text: element.fileName, url: url }, colSpan: 0, rowSpan: 0, styles: { fillColor: 255 } }])
        }
      });
    })
        
    finalY = doc.previousAutoTable.finalY;
    doc.autoTable({
      startY: finalY + 3 ,
      head: [header],
      body: body,
      styles: { lineColor: [144, 162, 180], lineWidth: 0.1,} ,
      didDrawCell: (data) =>  {
        if(data.section == "body" && data.cell.raw && data.cell.raw.customData) {
          doc.link(data.cell.textPos.x, data.cell.textPos.y,  data.cell.width+100,  data.cell.height, {url: data.cell.raw.customData.url});
        }
      }
    });
  }

  drawSchedule(doc) {
    let finalY = doc.previousAutoTable.finalY;
    doc.autoTable({
      startY: finalY + 8,
      head: [],
      body: [['Schedule'] ],
      bodyStyles: { fontSize: 14},
      theme: 'plain',
    });
    finalY = doc.previousAutoTable.finalY;
    this.drawHr(doc, finalY, 100);
    let startDate = this.basicInfoData.startDate? this.dateAndTime(this.basicInfoData.startDate):'';
    let endDate = this.basicInfoData.endDate? this.dateAndTime(this.basicInfoData.endDate):'';
    doc.autoTable({
      startY: finalY+3,
      head: [['Start Date/Time', 'End Date/Time']],
      body: [ [startDate, endDate]],
      theme: 'plain',
    })
  }

  getLogo() {
    return new Promise((resolve, reject) => {
      function toDataUrl(url, callback) {
        var xhr = new XMLHttpRequest();
        xhr.onload = function() {
          var reader = new FileReader();
          reader.onloadend = function() {
            callback(reader.result);
          };
          reader.readAsDataURL(xhr.response);
        };
        xhr.open('GET', url);
        xhr.responseType = 'blob';
        xhr.send();
      }
  
      let imageURL;
      if(window.location.hostname == "localhost") {
        imageURL = window.location.origin+ '/';
      } else {
        imageURL = this.imageURL;
      }
      let logo: any = imageURL+'assets/images/rauction_logo.png';
      toDataUrl(logo, (result) => {
        resolve(result);
      })
    }) 
  }


  printfun() {

    let printContents, popupWin;
    printContents = document.getElementById('print-section');
    let imageLogo = printContents.getElementsByClassName("logo-rauction")[0].getElementsByTagName("img")[0];
    //imageLogo.src=this.imageSrc;
    popupWin = window.open('', '_blank', 'top=0,left=0,height=100%,width=auto');
    popupWin.document.open();
    popupWin.document.write(`
      <html>
        <head>
          <title>Print tab</title>
          <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
        <style>

        body{
          padding: 10px 0;
          margin: 10px 0;
        }
          h4{
            color: #22297a;
            font-size: 18px;
            border-bottom: 1px solid #e1e1e1;
        }
        h5{
          font-size: 16px;
        }

        .logo-rauction {
          width: 100%;
          text-align: center;
          padding-bottom: 25px;
        }

        .table-sb thead th {}

        .col-print-1 {width:8%;  float:left;}
        .col-print-2 {width:16%; float:left;}
        .col-print-3 {width:25%; float:left;}
        .col-print-4 {width:33%; float:left;}
        .col-print-5 {width:42%; float:left;}
        .col-print-6 {width:50%; float:left;}
        .col-print-7 {width:58%; float:left;}
        .col-print-8 {width:66%; float:left;}
        .col-print-9 {width:75%; float:left;}
        .col-print-10{width:83%; float:left;}
        .col-print-11{width:92%; float:left;}
        .col-print-12{width:100%; float:left;}

        strong {
          font-size: 14px;
          display: block;
          margin-top: 8px;
        }
        span {
          display: block;
          font-size: 15px;
          margin-bottom: 5px;
        }
        hr {
          display: none;
        }

        .darkgrayfont {
          color: #454545!important;
      }

        .font14 {
          font-size: 14px!important;
      }

        .make45 {
          width: 45%;
        }
        .make25 {
          width: 25%;
      }
        .bold {
          font-weight: 500;
      }

      .p-1 {
        padding: .25rem!important;
    }


        </style>
        </head>
    <body onload="window.print();window.close()">${printContents.innerHTML}</body>
      </html>`
    );
    popupWin.document.close();

  }

  downloadToPdf() {
    // html2canvas(document.getElementById('contentData')).then(function (canvas) {
    //   const img =  canvas.toDataURL('image/png', 1.0);
    //   const doc = new jsPDF("p", "mm", "a4");
    //   doc.addImage(img, 'JPEG', 5, 5, 200, 230);    
    //   doc.save('summary.pdf');
    //   });
  }

  camelToTitle = (camelCase) => camelCase
    .replace(/([A-Z])/g, (match) => ` ${match}`)
    .replace(/^./, (match) => match.toUpperCase())
    .trim();

  dateAndTime(val) {
    if (!val) return;
    let date = new Date(val);
    let d = date.getDate();
    let m = date.getMonth() + 1;
    let y = date.getFullYear();
    let dateString = (d <= 9 ? '0' + d : d) + '-' + (m <= 9 ? '0' + m : m) + '-' + y;
    let timeString = date.toLocaleTimeString();
    return dateString + ' ' + timeString;
  }

  
  // ngOnDistroy(){
  //   this.subscription.unsubscribe();
  // }


}
