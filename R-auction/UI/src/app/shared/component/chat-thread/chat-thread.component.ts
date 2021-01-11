import { Component, OnInit, Input, HostBinding } from '@angular/core';
import { BuyerBiddingService } from '../../../component/component-service/buyer-bidding.service';
import * as config from '../../../appConfig/app.config';
import { CommonService } from '../../../commonService/common.service';
//import { reportAnimation } from '../animation';
import { LoaderService } from '../../../shared/services/loader.service';
import { BuyerEditService } from '../../../component/component-service/buyer-edit.service';
import { reportAnimation } from 'src/app/component/reports/animation';
import { QueryChatService } from 'src/app/component/component-service/query-chat.service';
import { environment } from '../../../../environments/environment';
import { ActivatedRoute } from '@angular/router';


declare var jsPDF: any;

@Component({
  selector: 'app-chat-thread',
  templateUrl: './chat-thread.component.html',
  styleUrls: ['./chat-thread.component.css'],
  animations: [reportAnimation]
})
export class ChatThreadComponent implements OnInit {

	@Input() auctionID: any;
	auctionIdData: any;
	auctionDetails: any = {};
	supplierDetails = [];
	imageURL = environment.rauction;
	lotsAndItem: any = []
	decimalplace: any;
	buyerData: any = [];
	advanceSummaryData = [];
	suppliersDtls = [];
	queryList = [];
	basicInfoData:any = {};
	public myChathistory = [];
	@Input() displayType = null;
	supplierStatus = [];

	downButt: boolean = false;
	reportType: any = 'bestCase';
	report = [
		{ value: 'singleSource', viewValue: 'Single Source' },
		{ value: 'bestCase', viewValue: 'Best Cost Outcome' },
	];
	landscapeData = [];

	constructor(
		public route: ActivatedRoute,
		private bidService: BuyerBiddingService,
		private common: CommonService,
		private loader: LoaderService,
		private buyerService: BuyerEditService,
		private queryService: QueryChatService
	) { }

	ngOnInit() {
		this.getReport().then(result => {
			this.getPreAndBidCount2(result);
		});
		
	}
	
	downloadPDF() {
		if(this.route.snapshot.params.breadCrumbStatus.toLowerCase() === 'open')
		{
			this.common.warning('Not Available');
			return;
		}
		this.getLogo2().then(result => {
		  let doc = jsPDF();
		  this.drawLogo2(doc, result);
		  this.drawBasicInfo2(doc);
		  doc.save('chathistory.pdf');
		  
		});
		
	  }

	  drawLogo2(doc, logo) {
		let cord = {x: 75, y: 14}
		doc.addImage(logo, 'PNG', cord.x, cord.y, 60, 13);
	  }

	  getDateFormate(d) {
		  var date = new Date(d);
		var day =  date.getDate()<10?"0"+ date.getDate(): date.getDate();
		var month =  (date.getMonth()+1)<10?"0"+ (date.getMonth()+1):  date.getMonth()+1;
		var hours = date.getHours();
		var minute = date.getMinutes();
		//var zone = hours<12?"AM":"PM";
		// var zone = hours<12?"AM":"PM";
		//return day+ " "+ month + " "+ date.getFullYear() + " " + hours + ":" + minute;
		return day+ "-"+ month + "-"+ date.getFullYear() + " " + hours + ":" + (minute<10 ? '0'+minute : minute);
	  }

	  drawBasicInfo2(doc) {

		doc.autoTable({
		  startY: 40,
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
		let auctionName = this.auctionDetails.auctionName? this.auctionDetails.auctionName:'';
		let auctionId = this.auctionIdData? this.auctionIdData:'';
		let auctionType = this.camelToTitle(this.auctionDetails.auctionType? this.auctionDetails.auctionType:'');
		let primaryCurrency = this.auctionDetails.primaryCurrency? this.auctionDetails.primaryCurrency:"";
		doc.autoTable({
		  startY: finalY + 3,
		  head: [['Auction name', 'Auction Id']],
		  body: [
			[  auctionName, auctionId ]
		  ],
		  theme: 'plain',
		});
		
		finalY = doc.previousAutoTable.finalY;
		// this.drawHr(doc, finalY+1, 230)
		doc.autoTable({
			startY: finalY + 3,
			head: [['Run By', 'Auction Status' , 'Auction Type']],
		  body: [
			[this.auctionDetails.runBy,  this.auctionDetails.auctionStatus, auctionType]
			],
		  
			theme: 'plain',
		  });
		  
		finalY = doc.previousAutoTable.finalY;
		
		  doc.autoTable({
			startY: finalY + 3,
			head: [ [ 'Reported Date', 'Auction Open Date', 'Auction Close Date' ]
			],
			body: [ 
			  [ this.getDateFormate(this.auctionDetails.reportDate), this.getDateFormate(this.auctionDetails.auctionOpen), this.getDateFormate(this.auctionDetails.auctionClose)],
			 
		  ],
			theme: 'plain',
             
		  });
		  
		finalY = doc.previousAutoTable.finalY;

		  doc.autoTable({
			startY: finalY + 3,
			head: [['Participants Invited for the Auction', 'Accepted Auction Invitation', 'Bidded for the Auction']],
			body: [
			  [ this.supplierDetails.length  , this.auctionDetails.acceptSupplier + this.auctionDetails.bidSupplier,  this.auctionDetails.bidSupplier]
		  
		  ],
			theme: 'plain',
		});
		  finalY = doc.previousAutoTable.finalY; 

		  doc.autoTable({
			startY: finalY + 3,
			head: [['Participants Suspended for the Auction','Preliminary Bids for the Auction', 'Primary Currency']],
			body: [
			  [  this.auctionDetails.suspendedUserCount, this.auctionDetails.preBidCount, primaryCurrency]
		  ],
			theme: 'plain',
		});
		  finalY = doc.previousAutoTable.finalY;

		doc.autoTable({
			startY: finalY+5,
			head: [],
			body: [
			  ['Participants Information']
			],
			bodyStyles: {
			  fontSize: 14
			},
			theme: 'plain',
		  })
		  finalY = doc.previousAutoTable.finalY;
		  this.drawHr(doc, finalY+2, 100);
		  var supplierList = [];
		  for(let i=0; i<this.suppliersDtls.length; i++) {
			  let contactperson = this.suppliersDtls[i].contactperson;
			 	let emails="", phones="", firstname=""; 
			  for(let j=0; j<contactperson.length; j++) {
				if(emails) {
					emails  += ", " + contactperson[j].useremail1;
				} else {
					emails = contactperson[j].useremail1 ;
				}
				if(phones) {
					phones  += ", " + contactperson[j].mobileno;
				} else {
					phones = contactperson[j].mobileno ;
				}
				
				if(firstname) {
					firstname  += ", " + contactperson[j].firstname;
				} else {
					firstname = contactperson[j].firstname ;
				}
			  } 
			supplierList.push([firstname+"-("+this.suppliersDtls[i].supplierID+")-"+this.suppliersDtls[i].supplierName1, emails, phones, this.suppliersDtls[i].status]);
		  }

		  doc.autoTable({
			startY: finalY+7,
			head: [["Participant", 
						"Participant Mail Id",
						"Contact Phone",
						"Status"
				]],
			body: supplierList,
			styles: {
				lineColor: [44, 62, 80]
			},
			bodyStyles: {
			  fontSize: 10
			},
		  })
		  finalY = doc.previousAutoTable.finalY;

		  doc.autoTable({
			startY: finalY+8,
			head: [],
			body: [
			  ['Chat History']
			],
			bodyStyles: {
			  fontSize: 14
			},
			theme: 'plain',
		  })
		  finalY = doc.previousAutoTable.finalY;
		  this.drawHr(doc, finalY+2, 100);
		var y=7, mychatrec=[], mychatsend=[];
		var date, chat, datef;
		for(let i=0; i<this.queryList.length; i++) {
			y++;
			mychatsend =[];
			chat = this.queryList[i].chatList;
			let user1 = chat.length > 0 ? chat[0].createdBy : '';
			if(chat.length>0) {
				for(let j=0; j<chat.length; j++) {
					date = new Date(chat[j].createdAt);
					var day =  date.getDate()<10?"0"+ date.getDate(): date.getDate();
					var month =  ( date.getMonth()+1)<10?"0"+  (date.getMonth()+1):  date.getMonth()+1;
					var hours = date.getHours();
					var minute = date.getMinutes();
					
					var zone = hours<12?"AM":"PM";
					
					datef = day+ "-"+ month + "-"+ date.getFullYear() + " " + hours + ":" + (minute<10 ? '0'+minute : minute) + " " + zone;
					
					let username = { 
						content: chat[j].createdBy + " :",
						username: true,
						name:chat[j].createdBy,
						colSpan: 4, 
						rowSpan: 0, 
						styles: { 
							fillColor: user1 == chat[j].createdBy ? [0, 173, 255] : [200, 247, 215],
							cellPadding: {top: 2, right: 2, bottom: 2, left: 2}
						}
					};

					let empty = {	
						colSpan: 2, 
						rowSpan: 0, 
						content: '', styles: { fillColor: 255 }
					}
					let message = { 
						content: chat[j].longDesc, 
						message: true,
						name:chat[j].createdBy,
						colSpan: 4, 
						rowSpan: 0, 
						styles: { 
							fillColor: user1 == chat[j].createdBy ? [0, 173, 255] : [200, 247, 215],
							cellPadding: {top: 0, right: 2, bottom: 0, left: 4}
						}
					};
					let timeStamp = { 
						content: datef, 
						timeStamp:true,
						name:chat[j].createdBy,
						colSpan: 4, 
						rowSpan: 0, 
						styles: { 
							fillColor: user1 == chat[j].createdBy ? [0, 173, 255] : [200, 247, 215], 
							fontSize: 8, 
							halign: 'right',
							cellPadding: {top: 0, right: 2, bottom: 0, left: 2}
						}
					};
					if(user1 == chat[j].createdBy) {
						mychatsend.push([username, empty]);
						mychatsend.push([message, empty]);
						mychatsend.push([timeStamp, empty]);
					} else {
						mychatsend.push([empty, username]);
						mychatsend.push([empty, message]);
						mychatsend.push([empty, timeStamp]);
					}
					mychatsend.push([
						{	colSpan: 0, 
							rowSpan: 0, 
							content: '', styles: { fillColor: 255}}						
					])
				}
				} else {
				mychatsend.push(["No chat history found"]);
			}
			
			
			let status = this.suppliersDtls[i].status.toLowerCase()=="suspended"?"(Suspended)":"";
		  doc.autoTable({
			startY: finalY+y+1,
			head: [["Chat History With Participant : "+ this.queryList[i].firstName + "-(" + this.queryList[i].supplierID + ")-" + this.queryList[i].userName + "                                             " + status]],
			body: [],
			styles: {
				lineColor: [44, 62, 80]
			},
		  });
		  finalY = doc.previousAutoTable.finalY;
		//   this.drawHr(doc, finalY+y, 230);
		  var r=0;
			var  k =0; 
		  doc.autoTable({
			startY: finalY+y+1,
			head: [],
			body: mychatsend,
			styles: {
				// cellPadding:3
			},
			columnStyles:{
				0: {fontStyle: 'bold'},
				1: {fontStyle: 'bold'},
				2: {fontStyle: 'bold'},
				3: {fontStyle: 'bold'},
				4: {fontStyle: 'bold'},
				5: {fontStyle: 'bold'},
			},
			theme: 'plain',	
			willDrawCell: (data) => {
				if(data.cell.raw && data.cell.raw.username) {
					data.cell.height = 7;
					data.cell.contentHeight = 7;
					data.row.height = 7;
					data.row.maxCellHeight = 7;
					// doc.setFontStyle('bold');
					if(user1 === data.cell.raw.name) {
						doc.setTextColor(0, 44, 142);
					} else {
						doc.setTextColor(0, 169, 29);
					}
					
				}
				if(data.cell.raw && data.cell.raw.message) {				
					// doc.setFontStyle('bold');
					if(user1 === data.cell.raw.name) {
						doc.setTextColor(255, 255, 255);
					} else {
						doc.setTextColor(20, 20, 20);
					}
				}
				if(data.cell.raw && data.cell.raw.timeStamp) {
					data.cell.height = 6;
					data.cell.contentHeight = 6;
					data.row.height = 6;
					data.row.maxCellHeight = 6;
					
					// doc.setFontStyle('bold');
					if(user1 === data.cell.raw.name) {
						doc.setTextColor(255, 255, 255);
					} else {
						doc.setTextColor(107, 107, 107);
					}
				}
			},
			didDrawCell: (data) => {
				if(data.cell.raw && data.cell.raw.username) {
					if(user1 === data.cell.raw.name) {
						doc.setFillColor(0, 173, 255);
						doc.setDrawColor(0, 173, 255);
						doc.triangle(data.cell.x-4, data.cell.y,data.cell.x,data.cell.y, data.cell.x, data.cell.y+5, "FD");
					} else {
						doc.setFillColor(200, 247, 215);
						doc.setDrawColor(200, 247, 215);
						doc.triangle(data.cell.x+data.cell.width + 4, data.cell.y, data.cell.x+data.cell.width ,data.cell.y, data.cell.x+data.cell.width, data.cell.y+5, "FD");
					}				
					
				}
			}	
			// styles:{minCellHeight:10, cellPadding:3,minCellWidth:30}
		  });
		  finalY = doc.previousAutoTable.finalY;
		//   this.drawHr(doc, finalY+y, 230);


		 
		  

		}
		

		  
	}

	  drawHr(doc, finalY, color) {
		doc.setDrawColor(color, color, color);
		let startX = 15;
		let endX = 195;
		doc.line(startX, finalY, endX, finalY);
	  }

	  camelToTitle = (camelCase) => camelCase
	  .replace(/([A-Z])/g, (match) => ` ${match}`)
	  .replace(/^./, (match) => match.toUpperCase())
	  .trim();



	getQueryListData() {
		let userChatHistory = [];
		this.suppliersDtls.forEach(item => {
			let obj = {
				userName:item.supplierName1,
				chatList:[],
				supplierID:item.supplierID,
				firstName:item.contactperson[0].firstname,
				status:item.status
			}
			this.queryList.push(obj);
			let data = {
			application: "Auction",
			appNo: this.auctionID,
			vendorNo:item.supplierID,
			queryNo: 0
			} 
			this.queryService.getQueryList(data).subscribe((res) => {
			
			if (res['data']) {
				let index = this.queryList.findIndex(item => {
					return item.supplierID == obj.supplierID
				});
				if(index != -1) {
					this.queryList[index].chatList = res['data'].queryList;
				}
			}
			}, err => {
			this.common.error(err);
			})
			
		});
	  }

	  


	reportTypeChanged() {
		this.getReport();
	}

	getPreAndBidCount2 = (result) => {
		// this.buyerService.getPreliminaryBidById(this.auctionID).subscribe((res: any) => {
		this.suppliersDtls.forEach(element => {
			let data=result.find(x => x._id == element.supplierID);
			element.liveBidCount = data?data["liveBid"]:0;
			element.preBidCount = data?data["preliminaryBid"]:0;
		});
		this.auctionDetails.inviteSupplier = this.suppliersDtls.filter(ele => ele.status == config.AUCTIONSTATUS.IN).length;
		this.auctionDetails.acceptSupplier = this.suppliersDtls.filter(ele => ele.status == config.AUCTIONSTATUS.AC).length;
		this.auctionDetails.bidSupplier = this.suppliersDtls.filter(ele => ele.status == config.AUCTIONSTATUS.BD).length;
		this.auctionDetails.suspendSupplier = this.suppliersDtls.filter(ele => ele.status == config.AUCTIONSTATUS.SP).length;
		this.auctionDetails.preBidCount = this.suppliersDtls.map(ele => ele.preBidCount).reduce((a, b) => a + b);
		this.auctionDetails.liveBidCount = this.suppliersDtls.map(ele => ele.liveBidCount).reduce((a, b) => a + b);
		// })
	}


	getDataLandscape2() {
		if (this.displayType != 'p') {
			this.lotsAndItem = this.lotsAndItem.filter(ele => ele["items"].length > 0);
			this.lotsAndItem.forEach(lot2 => {
				lot2.items.forEach((item) => {
					item.lot = { lotName: lot2.lotName, lotID: lot2.lotID, bids: lot2.bids };
					this.landscapeData.push(item);
				})
			});
		}

	}

	getReport() {
		return new Promise((resolve, reject) => {
			this.bidService.getBidReport(this.auctionID, this.reportType).subscribe((data: any) => {
				// AUCTION DATA
				let auctionData = data.data.auctionData;
				this.auctionDetails.suspendedUserCount = data.data.supplierStatus.suspended; 
				this.auctionDetails.auctionId = this.auctionID;
				this.auctionIdData = ((auctionData.type.toLowerCase() == "forward") ? "AUCFWD-" : "AUCRVS-") + String(auctionData.auctionID);
				this.auctionDetails.runBy = auctionData.auctionLeader.name;
				this.auctionDetails.reportDate = auctionData.currentDate;
				this.auctionDetails.auctionName = auctionData.auctionName;
				this.auctionDetails.auctionType = (auctionData.type.toLowerCase() == "forward") ? config.AUC_TYPE[0].name : config.AUC_TYPE[1].name;
				this.auctionDetails.auctionStatus = auctionData.status;
				this.auctionDetails.primaryCurrency = auctionData.primaryCurrency;
				this.auctionDetails.auctionOpen = new Date(auctionData.startDate);
				this.auctionDetails.auctionClose = new Date(auctionData.endDate);
				this.decimalplace = auctionData.currencyDecimalPlace;

				//SUPPLIER DATA
				let supplierData = data.data.supplierInvite;
				this.suppliersDtls = [...supplierData];
				this.supplierDetails = JSON.parse(JSON.stringify(this.suppliersDtls));
				// get user chat history
				this.getQueryListData();

				// LOTS AND ITEMS
				let buyerMatrix = data.data.buyerMatrix;
				this.lotsAndItem = buyerMatrix[0].lots;
				this.buyerData = buyerMatrix;
				//BID WINNER
				this.buyerData.forEach(auc => {

					//=this.supplierDetails.filter(x=> auc.bids.filter(y=> y["data"]["_id"].includes(x.supplierID) ));
					if (auc.bids.length > 0) {
						// supplierData.forEach((element) => {
						// 	let bidFlag = auc.bids.some(x => x.data._id == element.supplierID);
						// 	if (bidFlag)
						// 		this.supplierDetails.push(element);
						// })
						auc.bidWinner = this.getSupplierByRank(auc.bids);
					}
					auc.lots = auc.lots.filter((obj) => {
						return obj.items.length > 0;
					});
					auc.lots.forEach(lot => {
						lot.supplier = this.supplierDetails;
						if (lot.bids.length > 0) {
							lot.winner = this.getSupplierByRank(lot.bids);
						}
						lot.items.forEach(item => {
							if (item.bids.length > 0) {
								item.winner = this.getSupplierByRank(item.bids);
							}
							item.lotName = lot.lotName;
						});
					});
				});

				let bidData = [];
				// ADVANCED SUMMARY
				let advanceSummary = data.data.advanceSummary.filter((obj) => {
					return obj.items.length > 0;
				});
				//// ..for each lot.
				advanceSummary.forEach(lot => {
					// ..for each item in every lot.
					lot.items.forEach(item => {
						// ..add additional properties to each item in every lot.
						item.lotName = lot.lotName;
						item.supplierAdvanceData = [];
						item.totalHistoricalCost = 0;
						this.supplierDetails.forEach(supplier => {
							let dataBid = item.bidData.filter(x => x._id == supplier.supplierID)[0];
							let bidLength = (dataBid) ? dataBid.bidData.length : 0;
							dataBid = (dataBid) ? dataBid : new Object();
							item.supplierAdvanceData.push({ supplierID: supplier.supplierID, supplierName: supplier.supplierName1, data: null, bidLength: 0 })
							item.supplierAdvanceData.push({ supplierID: supplier.supplierID, supplierName: supplier.supplierName1, data: dataBid, bidLength: bidLength })
						});
						if (item.bidData.length > 0)
							bidData = [...bidData, ...item.bidData];

						item.totalHistoricalCost = ((item.historicalCost ? +item.historicalCost : 0) * (item.minimumDesiredQuantity ? +item.minimumDesiredQuantity : 0));
						this.advanceSummaryData.push(item);
					});
				});
				this.getDataLandscape2();
				resolve(JSON.parse(JSON.stringify(data.data.bidCountData)));
			}, (err) => {
				reject(err);
			})
		})
	}

	getSupplierByRank(dataBid) {
		let supplierName = "";
		let rankData = dataBid.filter(x => x.rank == 1);
		if (rankData) {
			supplierName = this.supplierDetails.filter(x => x.supplierID == rankData[0].data._id)[0].supplierName1;
		}
		return supplierName;
	}

	getReportExcel() {
		this.downButt = true;
		setTimeout(() => {
			this.downButt = false;
		}, 5000);
		if (this.displayType.type == 'p') {
			this.bidService.getBidReportExcel(this.auctionID, this.reportType);
		}
		else {
			this.bidService.getBidReportExcelLandscape(this.auctionID, this.reportType);
		}

	}

	getLogo2() {
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
		

}

