import { Injectable } from '@angular/core';
import { BuyerBiddingService } from '../../component-service/buyer-bidding.service';
import { FormBuilder, FormGroup} from '@angular/forms';
import { CommonService } from '../../../commonService/common.service';
import { resolve } from 'url'; 

@Injectable()  
export class MisReportService {

	defaultmail = {email: 'All'};
	misqueryForm: FormGroup;
	miserror = {
		startDateErrors: false,
		endDateErrors: false
	}

	misShowAll = true;
	misexcelTypeList = [{name: 'Single Sheet', value: 'singleSheet'}, {name: 'Multi Sheet', value: 'multiSheet'}]
    public reportData = {
        auctionList: [],
		totalRecord: 0,
		pageSize: 10,
		pageIndex: 1 
    }

    public misAucCollist = [
		{fieldName: 'auctionName', label: 'Auction Name'},
		{fieldName: 'company', label: 'Business Unit'},
		{fieldName: 'createdBy', label: 'Created By'},
		{fieldName: 'description', label: 'Description'},
		{fieldName: 'startDate', label: 'Start Date'},
		{fieldName: 'endDate', label: 'End Date'},
		{fieldName: 'status', label: 'Status'},
		{fieldName: 'type', label: 'Type'},
		{fieldName: 'primaryCurrency', label: 'Primary Currency'},
		{fieldName: 'auctionID', label: 'Auction Id'},
		{fieldName: 'createdAt', label: 'Created At'},
		{fieldName: 'minBidChangeValue', label: 'Minimum Change Value'},
		{fieldName: 'supplierInvitedCount', label: 'Participant Invited'},
		{fieldName: 'supplierAcceptedCount', label: 'Participant Accepted'},
		{fieldName: 'supplierBiddedCount', label: 'Participant Bidded'},
		{fieldName: 'bidCount', label: 'Total Bid'},
    ];

    public misItemColList = [
		{fieldName: 'lotType', label: 'Lot'},
		{fieldName: 'itemName', label: 'Item Name'},
		{fieldName: 'description', label: 'Description'},
		{fieldName: 'minimumDesiredQuantity', label: 'Reliance Quantity'},
		{fieldName: 'unitOfMeasure', label: 'UOM'},
		{fieldName: 'startPrice', label: 'Start Price'},
		{fieldName: 'historicalCost', label: 'Historical Cost'},
		{fieldName: 'historicalCostDate', label: 'Historical Cost Date'},
		{fieldName: 'minimumChangeValue', label: 'Minimum Change Value'},
		{fieldName: 'itemCode', label: 'Item Code'},
		{fieldName: 'topSupplier', label: 'Top Participant'},
		{fieldName: 'topBidderPrice', label: 'Top Participant Price'},
		{fieldName: 'remarks', label: 'Remarks'},
		{fieldName: 'participantName', label: 'Participant Name'},		
		{fieldName: 'createdAt', label: 'Bid Time'},		
		{fieldName: 'baseCost', label: 'Best Bid Unit Rate'},		
		{fieldName: 'variableCost', label: 'Best Bid Total Value'},	
		{fieldName: 'rank', label: 'Rank'}
    ];

    //Note - titleDefaultAuction & titleDefaultItem will be used trougout the report for colun interchage. Do not changes ref to these array.
    public misdefaultAuction = [];
    public misdefaultItem = []


    constructor(      
		private bidServiceformis: BuyerBiddingService,
		private fb: FormBuilder,
		private com: CommonService
      ){
      this.populateMisColumn();
	}

	isTypeDate(fieldName) {
		return (fieldName == 'startDate' || fieldName == 'endDate' || fieldName == 'createdAt') ? true : false;
	  }
	
	bindFilterFormDetail() {
		this.misqueryForm = this.fb.group({
		  openDate: [null],
		  endDate: [null]
		});
	}

	
	initTo() {
		if(!this.misqueryForm.valid) return;
		console.log("search mis report");
		let payload = this.getPLoadData();
		if(!payload.error) {
			this.getMisReports(payload).then( (res: any) => {
				res.data.data.forEach(ele => {
					ele.open = this.misShowAll;
				})
				this.reportData.auctionList = res.data.data;
				this.reportData.totalRecord = res.data.count;
			}).catch(err => console.log('API Failed'));
		}
	}

	getMISReportExcel() {
		if(!this.misqueryForm.valid) return;
		
		let payload = this.getPLoadData();
		this.bidServiceformis.getMISReportExcel(payload.startDate, payload.endDate, payload.auctionHeader, payload.itemheader);
		this.com.success("Request raised for report generation");
	} 

	getPLoadData() {		
		try {
			let startDate: any = '', endDate: any = '';
			if(this.misqueryForm.value.openDate) {
				let month = ((this.misqueryForm.value.openDate).getMonth());
				let day = ((this.misqueryForm.value.openDate).getDate());
				let year = ((this.misqueryForm.value.openDate).getFullYear());
				startDate = (new Date(year, month, day, 0, 0, 0, 0)).toISOString();
			}
			if(this.misqueryForm.value.endDate) {
				let oMonth = ((this.misqueryForm.value.endDate).getMonth());
				let oDay = ((this.misqueryForm.value.endDate).getDate());
				let oYear = ((this.misqueryForm.value.endDate).getFullYear());
				endDate = (new Date(oYear, oMonth, oDay, 23, 59, 59, 999)).toISOString();
			}

			let auctionHeader = '';
			let itemheader = '';
			this.misdefaultAuction.forEach((obj, index) => {
				if(index == 0) {
					auctionHeader = auctionHeader + obj.fieldName;
				} else {
					auctionHeader = auctionHeader + ',' + obj.fieldName;
				}
			});
    		this.misdefaultItem.forEach((obj, index) => {
				if(index == 0) {
					itemheader = itemheader + obj.fieldName;
				} else {
					itemheader = itemheader + ',' + obj.fieldName;
				}
			});
	
			if (endDate && startDate && endDate <= startDate) {
				this.miserror.endDateErrors = true;
				return { error : true}
			}
			else {
				return {
					"startDate": startDate,
					"endDate": endDate,
					"pageNum": this.reportData.pageIndex, 
					"pageSize": this.reportData.pageSize,
					"auctionHeader": auctionHeader, 
					"itemheader": itemheader
				}
			}
		}
		catch (e) {
		}
	}

    
    populateMisColumn() {
		this.populateMisTitleDefAuction();
		this.populateMisTitleDefItem();
	}
	
	populateMisTitleDefAuction(){
		this.misAucCollist.forEach(ele => {
			this.misdefaultAuction.push(ele);
		});
	}

	populateMisTitleDefItem() {
		this.misItemColList.forEach(ele => {
			this.misdefaultItem.push(ele);
		});
	}

	populateMisColumnFromConfig(data) {		
		this.misdefaultAuction.length = 0;
		data.misAuctionHeader.forEach(element => {
			this.misAucCollist.forEach((ele: any) => {
				if(element.fieldName == ele.fieldName) {
					ele.index = element.index
					this.misdefaultAuction.push(ele);
				}
			});
		});
		this.misdefaultItem.length = 0;
		data.misItemHeader.forEach(element => {
			this.misItemColList.forEach((ele: any) => {
				if(element.fieldName == ele.fieldName) {
					ele.index = element.index
					this.misdefaultItem.push(ele);		
				}		
			});
		});
	}

    getUnSelectAuctionColsMis(): Array<any> {
      let tmp = [];
      this.misAucCollist.forEach((ele: any) => {
        if(this.misdefaultAuction.indexOf(ele) < 0) {
          tmp.push(ele);
        }        
      });
      return tmp;
    }

    getUnSelectItemColsMis() {
      let tmp = [];
      this.misItemColList.forEach((ele: any) => {
        if(this.misdefaultItem.indexOf(ele) < 0) {
          tmp.push(ele);
        }        
      });
      return tmp;
    }

    getMisReports(payload) {
        return new Promise((resolve, reject) => {
            this.bidServiceformis.getMisReports(payload.startDate, payload.endDate, payload.pageNum, payload.pageSize).subscribe((res: any) => {
				resolve(res);
            }, (err) => {
                reject()
            });
        });        
	}
	
	getUserSpecificMISReportSettings() {
		return new Promise((resolve, reject) => {
			this.bidServiceformis.getUserSpecificMISReportSettings().subscribe((res: any) => {
				resolve(res);
			  }, (err) => {
				  reject()
			  })
		})
	}

	saveUserSpecificMISReportSettings() {
		return new Promise((resolve, reject) => {
			let payload = {
				"itemHeader": this.misdefaultItem ,
				"auctionHeader": this.misdefaultAuction
			  }
			this.bidServiceformis.saveUserSpecificMISReportSettings(payload).subscribe((res: any) => {
				resolve(res);
			  }, (err) => {
				  reject()
			  })
		});
	}




}
