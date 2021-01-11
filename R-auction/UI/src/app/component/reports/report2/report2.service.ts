import { Injectable } from '@angular/core';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { Report2MenuComponent } from './report2-menu/report2-menu.component'

@Injectable()
export class Report2Service {

    constructor(
        private MatDialog: MatDialog
    ){}

    filterHeaderList(headerList) {
        let newHeaderList = []
        // let validFieldNames = ["auctionID", "auctionCode", "type", "rfqNo", "auctionName", "description", "currencyDecimalPlace",
        //     "primaryCurrency", "auctionStatus", "businessUnit", "company", "status", "minBidChangeType", "minBidChangeValue",
        //     "supplierInvitedCount", "supplierAcceptedCount",
        //     "totalBaseCost", "totalHistoricalCost", "startDate", 
        //     "endDate", "createdBy", "createdDate",
        // "updatedBy", "updatedDate", "createdAt", "updatedAt"];
        headerList.forEach(obj => {
            // if(validFieldNames.includes(obj.fieldName)) newHeaderList.push(obj);     
            newHeaderList.push(obj);       
        })
        headerList.sort((a,b) => {
            const bandA = a.fieldName.toUpperCase();
            const bandB = b.fieldName.toUpperCase();
            let comparison = 0;
            if (bandA > bandB) {
                comparison = 1;
            } else if (bandA < bandB) {
                comparison = -1;
            }
            return comparison;
        });
        return newHeaderList;
    }

    extractColNames(itemArr) {
        let itemNameList = [];
        let customFieldNameList = [];
        let suppliesFieldNameList = [];
        let selectedObj = {};
        let idNameMaper = {};
		itemArr.forEach(element => {
            this.extractItemsColNames(element.itemRows, itemNameList);
            this.extractCustColNames(element.customFieldData, customFieldNameList);
			this.extractSuppColNames(element.supplierWiseBid, suppliesFieldNameList, selectedObj, idNameMaper);
		})
		itemNameList.forEach((itemName, index) => {
			itemNameList[index] = {fieldName: itemName};
        });
        itemNameList.sort((c,d) => {
            const bandA = c.fieldName.toUpperCase();
            const bandB = d.fieldName.toUpperCase();
            let comparison2 = 0;
            if (bandA > bandB) {
                comparison2 = 1;
            } else if (bandA < bandB) {
                comparison2 = -1;
            }
            return comparison2;
        });
        customFieldNameList.forEach((custName, index) => {
			customFieldNameList[index] = {fieldName: custName};
        });
        suppliesFieldNameList.forEach((element, index) => {
			suppliesFieldNameList[index] = {fieldName: element, selected: selectedObj[element] ? true : false, bidderId: idNameMaper[element]};
        });
		return {
            itemNameList: itemNameList, 
            customFieldNameList: customFieldNameList,
            suppliesFieldNameList: suppliesFieldNameList
        };
    }

    private extractItemsColNames(itemRows, itemNameList) {
        (Object.keys(itemRows)).forEach(itemName => {
            if(!itemNameList.includes(itemName) && 
                itemName != 'itemCode' && itemName != 'itemName'  && 
                itemName != 'minimumDesiredQuantity'  && itemName != 'unitOfMeasure' &&
                itemName != 'revision' && itemName != 'specification' &&
                itemName != 'specificationUrl' && itemName != 'reservedPrice'
            ) itemNameList.push(itemName);
        })
    }
    private extractCustColNames(customFieldData, customFieldNameList) {
        customFieldData.forEach(custObj => {
            if(!customFieldNameList.includes(custObj.name)) customFieldNameList.push(custObj.name);
        })
    }
    private extractSuppColNames(supplierWiseBid, suppliesFieldNameList, selectedObj, idNameMaper) {
        // supplierWiseBid=supplierWiseBid.filter(x=> x["lastBid"]);       
        supplierWiseBid.forEach(suppObj => {
            idNameMaper[suppObj.vendorName] = suppObj.bidderID;
            if(!suppliesFieldNameList.includes(suppObj.vendorName)) suppliesFieldNameList.push(suppObj.vendorName);
            if(suppObj.lastBid) selectedObj[suppObj.vendorName] = true;
        })
    }

    openItemColumnsMenu(itemColumnNames, custColNames, supplierColumnNames, supplierSubColumnNames) {
        const objMatDialogConfig = new MatDialogConfig();
        objMatDialogConfig.panelClass = 'dialog-lg';
        objMatDialogConfig.data = {
            dialogMessage: "Select Item Columns",
            tab: 'itemColumns',
            dialogContent: { 
                itemColumnNames: itemColumnNames, 
                custColNames: custColNames,  
                supplierColumnNames: supplierColumnNames,
                supplierSubColumnNames: supplierSubColumnNames
            },
        }
        objMatDialogConfig.width = "1100px";
        objMatDialogConfig.height = "250px";
        objMatDialogConfig.disableClose = true;
        let refMatDialog = this.MatDialog.open(Report2MenuComponent, objMatDialogConfig);
        return refMatDialog.afterClosed();
    }
    
    openHeaderMenu(headerList) {
        const objMatDialogConfig = new MatDialogConfig();
        objMatDialogConfig.panelClass = 'dialog-lg';
        objMatDialogConfig.data = {
            dialogMessage: "Select Headers",
            tab: 'headerList',
            dialogContent: headerList,
            dialogPositiveBtn: "Ok",
            dialogNegativeBtn: "Cancel"
        }
        objMatDialogConfig.width = "1100px";
        objMatDialogConfig.height = "250px";
        objMatDialogConfig.disableClose = true;
        let refMatDialog = this.MatDialog.open(Report2MenuComponent, objMatDialogConfig);
        return refMatDialog.afterClosed();
    }
    
    getExcelQueryString(itemColumnNames, custColNames, selectedHeaders, supplierColumnNames) {		
		let itemColumn = '&itemColumn=itemName,itemCode,minimumDesiredQuantity,unitOfMeasure';
		let customField = '&customField=';
        let auctionHeader = '&auctionHeader=';
        let suppliers = '&suppliers=';
		itemColumnNames.forEach(itemObj => {
			if(itemObj.selected) {
				itemColumn = itemColumn + ',' + itemObj.fieldName;
			}
        });
        let clen = custColNames.length
        custColNames.forEach((custObj, index)=> {
            if(custObj.selected) {
                customField = customField + custObj.fieldName;
                if(index != clen-1) customField = customField + ',';
            }
        })
		
		selectedHeaders.forEach(element => {
			auctionHeader = auctionHeader + ',' + element;
        });
        supplierColumnNames.filter((suppObj) => suppObj.selected).forEach((suppObj, index) => {
            if(index == 0) {
                suppliers = suppliers + suppObj.bidderId;
            } else {
                suppliers = suppliers + ',' + suppObj.bidderId;
            }
        });
		return itemColumn + customField + auctionHeader + suppliers;
    }
    
    camelToTitle = (camelCase) => camelCase
		.replace(/([A-Z])/g, (match) => ` ${match}`)
		.replace(/^./, (match) => match.toUpperCase())
        .trim();
        
    formatValue(fieldName, rowObj) {
        let val = rowObj[fieldName];
        if( fieldName == 'createdAt' ||  fieldName == 'updatedAt' || fieldName == 'historicalCostDate') {
            return this.dateAndTime(val);
        }
        return val;
    }
    dateAndTime(val) {
        if(!val) return;
        let date = new Date(val);
        let d = date.getDate();
        let m = date.getMonth() + 1;
        let y = date.getFullYear();
        let dateString = (d <= 9 ? '0' + d : d) + '-' + (m <= 9 ? '0' + m : m) + '-' + y;
        let timeString = date.toLocaleTimeString();
        return dateString + ' ' + timeString;
    }

}