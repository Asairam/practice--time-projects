import { Injectable } from '@angular/core';
import { BuyerBiddingService } from '../../../component-service/buyer-bidding.service';
import { FormBuilder, FormGroup} from '@angular/forms';
import { CommonService } from '../../../../commonService/common.service';
import { resolve } from 'url';

@Injectable()
export class CumulativeReportService {


	excelTypeList = [{name: 'Single Sheet', value: 'singleSheet'}, {name: 'Multi Sheet', value: 'multiSheet'}]
    defaultEmail = {email: 'All'};
	queryForm: FormGroup;
	error = {
		startDateError: false,
		endDateError: false
	}

	showAll = true;

    public reportData = {
        auctionList: [],
		totalRecord: 0,
		pageSize: 10,
		pageIndex: 1
    }

    public auctionColumnlist = [
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

    public itemColumnList = [
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
    public titleDefaultAuction = [];
    public titleDefaultItem = []


    constructor(
		private bidService: BuyerBiddingService,
		private formBuilder: FormBuilder,
		private common: CommonService,
      ){
      this.populateColumns();
	}

	bindFormDetails() {
		this.queryForm = this.formBuilder.group({
		  openDate: [null],
		  endDate: [null],
		  subOrgObj: [null],
		  orgUser: [null],
		  excelType: [this.excelTypeList[0]]
		});
	}

	resetTableSettings() {
		this.reportData.auctionList = [];
		this.reportData.totalRecord = 0;
		this.reportData.pageSize = 10;
		this.reportData.pageIndex = 1;
	}

    isADate(fieldName) {
      return (fieldName == 'startDate' || fieldName == 'endDate' || fieldName == 'createdAt') ? true : false;
	}

	go() {
		if(!this.queryForm.valid) return;
		if(!this.queryForm.value.subOrgObj) {
			this.common.error("Please select Organization Unit");
			return;
		}
		let payload = this.getPayLoad(this.queryForm.value.subOrgObj._id, this.queryForm.value.orgUser.email);
		if(!payload.error) {
			this.getcumulativeAuctionData(payload).then( (res: any) => {
				res.data.data.forEach(ele => {
					ele.open = this.showAll;
				})
				this.reportData.auctionList = res.data.data;
				this.reportData.totalRecord = res.data.count;
			}).catch(err => console.log('API Failed'));
		}
	}

	getCumuReportExcel() {
		if(!this.queryForm.valid) return;
		if(!this.queryForm.value.subOrgObj) {
			this.common.error("Please select Organization Unit");
			return;
		}
		let payload = this.getPayLoad(this.queryForm.value.subOrgObj._id, this.queryForm.value.orgUser.email);
		this.bidService.getCumulativeAdminReportExcel(payload.startDate, payload.endDate, payload.org, payload.host, payload.auctionHeader, payload.itemheader, payload.type).subscribe(res => {
      this.common.success("Request raised for report generation");
    }, err => {this.common.error("Failed to raise request for report generation");})
	}

	getPayLoad(orgId, email) {
		try {
			// debugger;
			let startDate: any = '', endDate: any = '';
			if(this.queryForm.value.openDate) {
				let month = ((this.queryForm.value.openDate).getMonth());
				let day = ((this.queryForm.value.openDate).getDate());
				let year = ((this.queryForm.value.openDate).getFullYear());
				// let hour = ((this.queryForm.value.opent).getHours());
				// let minute = ((this.queryForm.value.opent).getMinutes());
				// let seconds = new Date(this.queryForm.value.opent.setSeconds(0));
				startDate = (new Date(year, month, day, 0, 0, 0, 0)).toISOString();
			}
			if(this.queryForm.value.endDate) {
				let oMonth = ((this.queryForm.value.endDate).getMonth());
				let oDay = ((this.queryForm.value.endDate).getDate());
				let oYear = ((this.queryForm.value.endDate).getFullYear());
				endDate = (new Date(oYear, oMonth, oDay, 23, 59, 59, 999)).toISOString();
			}

			let auctionHeader = '';
			let itemheader = '';
			this.titleDefaultAuction.forEach((obj, index) => {
				if(index == 0) {
					auctionHeader = auctionHeader + obj.fieldName;
				} else {
					auctionHeader = auctionHeader + ',' + obj.fieldName;
				}
			});
    		this.titleDefaultItem.forEach((obj, index) => {
				if(index == 0) {
					itemheader = itemheader + obj.fieldName;
				} else {
					itemheader = itemheader + ',' + obj.fieldName;
				}
			});

			if (endDate && startDate && endDate <= startDate) {
				this.error.endDateError = true;
				return { error : true}
			}
			else {
				return {
					"startDate": startDate,
					"endDate": endDate,
					"org": orgId,
					"pageNum": this.reportData.pageIndex,
					"pageSize": this.reportData.pageSize,
					"host": email == this.defaultEmail.email ? '' : email,
					"auctionHeader": auctionHeader,
					"itemheader": itemheader,
					"type": this.queryForm.value.excelType.value
				}
			}
		}
		catch (e) {
		}
	}


    populateColumns() {
		this.populateTitleDefaultAuction();
		this.populateTitleDefaultItem();
	}

	populateTitleDefaultAuction(){
		this.auctionColumnlist.forEach(ele => {
			this.titleDefaultAuction.push(ele);
		});
	}

	populateTitleDefaultItem() {
		this.itemColumnList.forEach(ele => {
			this.titleDefaultItem.push(ele);
		});
	}

	populateColumnsFromConfig(data) {
		this.titleDefaultAuction.length = 0;
		data.auctionHeader.forEach(element => {
			this.auctionColumnlist.forEach((ele: any) => {
				if(element.fieldName == ele.fieldName) {
					ele.index = element.index
					this.titleDefaultAuction.push(ele);
				}
			});
		});
		this.titleDefaultItem.length = 0;
		data.itemHeader.forEach(element => {
			this.itemColumnList.forEach((ele: any) => {
				if(element.fieldName == ele.fieldName) {
					ele.index = element.index
					this.titleDefaultItem.push(ele);
				}
			});
		});
	}

    getUnSelectedAuctionCol(): Array<any> {
      let tmp = [];
      this.auctionColumnlist.forEach((ele: any) => {
        if(this.titleDefaultAuction.indexOf(ele) < 0) {
          tmp.push(ele);
        }
      });
      return tmp;
    }

    getUnSelectedItemCol() {
      let tmp = [];
      this.itemColumnList.forEach((ele: any) => {
        if(this.titleDefaultItem.indexOf(ele) < 0) {
          tmp.push(ele);
        }
      });
      return tmp;
    }

    getcumulativeAuctionData(payload) {
        return new Promise((resolve, reject) => {
            this.bidService.getCumulativeAdminReport(payload.startDate, payload.endDate, payload.org, payload.pageNum, payload.host, payload.pageSize).subscribe((res: any) => {
				resolve(res);
            }, (err) => {
                reject()
            });
        });
	}

	getUserSpecificCumuReportSettings() {
		return new Promise((resolve, reject) => {
			this.bidService.getUserSpecificCumuReportSettings().subscribe((res: any) => {
				resolve(res);
			  }, (err) => {
				  reject()
			  })
		})
	}

	saveUserSpecificCumuReportSettings() {
		return new Promise((resolve, reject) => {
			let payload = {
				"itemHeader": this.titleDefaultItem ,
				"auctionHeader": this.titleDefaultAuction
			  }
			this.bidService.saveUserSpecificCumeReportSettings(payload).subscribe((res: any) => {
				resolve(res);
			  }, (err) => {
				  reject()
			  })
		});
	}


}
