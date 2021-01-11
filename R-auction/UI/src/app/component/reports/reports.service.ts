
import { Injectable } from '@angular/core';
import { BuyerBiddingService } from '../component-service/buyer-bidding.service';
import { CumulativeColumnSelectComponent } from './admin/cumulative-report/cumulative-column-select-popup/cumulative-column-select.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { MisColumnSelectComponent } from './mis-column-select/mis-column-select.component';

@Injectable()
export class ReportsService {

	orgMap = new Map();

    constructor(
        private MatDialog: MatDialog,
        private bidService: BuyerBiddingService
    ) {}

    getAllOrganization() {
		return new Promise((resolve, reject) => {
			this.bidService.getAllOrganization().subscribe(res => {
				resolve(res);
			}, err => {
				reject();
			})
		});
	}

	getUserOrgList(orgid) {
		// reuturns data eg- [{_id: 1268, name: "Reliance Digital"}]
		return new Promise((resolve, reject) => {
			this.bidService.getuserOrgList(orgid).subscribe(res => {
				resolve(res);
			}, err => {
				reject();
			})
		});
	}

	getTreeStructuredOrganization(orgId) {
		return this.getAllOrganization().then((result: any) => {
			// Restructure json with min required values
			result.data.forEach((element: any) => {
				this.orgMap.set(element._id, element);
			});;
			return this.getUserOrgList(orgId);
		}).then((result: any) => {

			return new Promise((resolve, reject) => {
				let tmpMap = new Map();
				result.data.forEach(element => {
					let valObj = this.orgMap.get(element._id);
					if(valObj) {
						tmpMap.set(element._id, valObj);
					}
				});
				// Calculates padding required for childs in tree
				let stepp = (someObj, padding, tmp) => {
					if(someObj.children.length>0) {
						padding = padding + 1;
						for(let x=0; x<someObj.children.length; x++) {
							let tomObj = tmpMap.get(someObj.children[x]);
							if(tomObj) {
								tomObj = {
									...tomObj
								}
								tomObj.padding = padding;
								tmp.push(tomObj);
								stepp(tomObj, padding, tmp);
							}
						}
						padding = padding - 1;
					}
				}
				let padding = 0;
				let subOrgList = [];
				let rootObj = tmpMap.get(result.data[0]._id);
				rootObj.padding = padding;
				subOrgList.push(rootObj);
				if(rootObj.children.length > 0) {
					stepp(rootObj, padding, subOrgList);
				}
				resolve(subOrgList);
			})
		})
	}

	openCumulativeMenuPopup() {
		console.log("cumulative---report")
        const objMatDialogConfig = new MatDialogConfig();
        objMatDialogConfig.panelClass = 'dialog-lg';
        objMatDialogConfig.data = {
            dialogMessage: "Select Headers",
            tab: 'headerList',
            dialogContent: '',
            dialogPositiveBtn: "Ok",
            dialogNegativeBtn: "Cancel"
        }
        objMatDialogConfig.width = "1100px";
        objMatDialogConfig.height = "450px";
        objMatDialogConfig.disableClose = true;
        let refMatDialog = this.MatDialog.open(CumulativeColumnSelectComponent, objMatDialogConfig);
        return refMatDialog.afterClosed();
	}

	openMISMenuPopup() {
		console.log("MIS---report")
        const objMatDialogConfig = new MatDialogConfig();
        objMatDialogConfig.panelClass = 'dialog-lg';
        objMatDialogConfig.data = {
            dialogMessage: "Select Headers",
            tab: 'headerList',
            dialogContent: '',
            dialogPositiveBtn: "Ok",
            dialogNegativeBtn: "Cancel"
        }
        objMatDialogConfig.width = "1100px";
        objMatDialogConfig.height = "450px";
        objMatDialogConfig.disableClose = true;
        let refMatDialog = this.MatDialog.open(MisColumnSelectComponent, objMatDialogConfig);
        return refMatDialog.afterClosed();
	}

	dateAndTime2(val) {
        if(!val) return;
        let date = new Date(val);
        let d2 = date.getDate();
        let m2 = date.getMonth() + 1;
        let y2 = date.getFullYear();
        let dateString2 = (d2 <= 9 ? '0' + d2 : d2) + '-' + (m2 <= 9 ? '0' + m2 : m2) + '-' + y2;
        let timeString2 = date.toLocaleTimeString();
        return dateString2 + ' ' + timeString2;
	}

	getUserListForOrg(orgId) {
		return new Promise((resolve, reject) => {
			this.bidService.getUsersInAnOrg(orgId).subscribe(res => {
				resolve(res)
			}, err => {reject(err)});
		});
  }

  getReportGenerationStatus(pageNum) {
    // this.bidService.getReportGenerateStatus(pageNum).subscribe(res => {
    //   debugger
    // }, err => {
    //   debugger;
    // })
    return new Promise((resolve, reject) => {
      this.bidService.getReportGenerateStatus(pageNum).subscribe((res: any) => {
        res.data.requests.forEach(element => {
          element.docFileId = element.docID;
        });
        resolve(res.data);
      }, err => reject())
    });
  }
  allReportClear() {
    return new Promise((resolve, reject) => {
      this.bidService.clearReports().subscribe((res: any) => {
        resolve(res.data);
      }, err => reject())
    });
  }
}
