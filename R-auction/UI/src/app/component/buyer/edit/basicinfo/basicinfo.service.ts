import { Injectable } from "@angular/core";
import { MatDialogConfig, MatDialog } from '@angular/material';
import { RawDataReportItemHeaderComponent } from '../basicinfo/template/rawDataReportItemHeader.component';
import { BuyerEditService } from '../../../component-service/buyer-edit.service';

@Injectable() 
export class BasicinfoService {

    constructor(
        private MatDialog: MatDialog,        
        public buyerService: BuyerEditService,
    ){}

    templateSettingForRawReportHeader(list, auctionData) {
        let itemColumnNames: any = Object.keys(list[0].data.uniqueItemColumn);
        for(let i=0; i<itemColumnNames.length; i++) {
            itemColumnNames[i] = { fieldName: itemColumnNames[i]};
        }

        let custColNames: any = Object.keys(list[0].data.itemCustomField);
        for(let i=0; i<custColNames.length; i++) {
            custColNames[i] = { fieldName: custColNames[i]};
        }

        let headerList = list[1].data;

        let dialogContent = { 
            itemColumnNames: itemColumnNames, 
            headerList: headerList,
            custColNames: custColNames || [],                
        }
        if(auctionData.rawDataColumns) {
            this.markAsSelected(dialogContent, auctionData.rawDataColumns);
        }

        const objMatDialogConfig = new MatDialogConfig();
        objMatDialogConfig.panelClass = 'dialog-lg';
        objMatDialogConfig.data = {
            dialogMessage: "Set default Item Columns",
            tab: 'itemColumns',
            dialogContent: dialogContent,
            dialogPositiveBtn: 'OK',
            dialogNegativeBtn: 'Cancel'
        }
        objMatDialogConfig.width = "1100px";
        objMatDialogConfig.height = "250px";
        objMatDialogConfig.disableClose = true;
        let refMatDialog = this.MatDialog.open(RawDataReportItemHeaderComponent, objMatDialogConfig);
        refMatDialog.afterClosed().subscribe(result => {
            if(result) {
                this.saveRawReportColTemplate(dialogContent, auctionData.auctionID)
            }
        })
    }
    
    markAsSelected(dialogContent, rawDataColumns) {
        if(rawDataColumns.header && rawDataColumns.header.length>0) {
            rawDataColumns.header.forEach(element => {
                dialogContent.headerList.forEach(head => {
                    if(element.name === head.fieldName) {
                        head.selected = true;
                    }
                });
            });
        }
        if(rawDataColumns.item && rawDataColumns.item.length>0) {
            rawDataColumns.item.forEach(element => {
                if(!element.isCustom) {
                    dialogContent.itemColumnNames.forEach(item => {
                        if(element.name === item.fieldName) {
                            item.selected = true;
                        }
                    });
                }
                if(element.isCustom) {
                    dialogContent.custColNames.forEach(custItem => {
                        if(element.name === custItem.fieldName) {
                            custItem.selected = true;
                        }
                    });
                }
                
            });
        }
    }

    saveRawReportColTemplate(dialogContent, auctionID) {
        let header = [];
        dialogContent.headerList.forEach(element => {
            if(element.selected) {
                header.push({
                    "name": element.fieldName,
                    "isCustom": false
                });
            }            
        });
        let item = [];
        dialogContent.itemColumnNames.forEach(element => {
            if(element.selected) {
                item.push({
                    "name": element.fieldName,
                    "isCustom": false
                });
            }            
        });
        dialogContent.custColNames.forEach(element => {
            if(element.selected) {
                item.push({
                    "name": element.fieldName,
                    "isCustom": true
                });
            }            
        });

        let payload = {
            "auctionID": auctionID,
            "columnData": {
              "header": header,
              "item": item
            }
          }
        this.buyerService.rawDataReportColTemplate(payload).subscribe(res => {
            console.log('Successfully saved');
        }, err => {
            console.log('api failed');
        })
    }

    get_CurrencyList_OrgList_ExchangeRateList(destroySubcriptions$) {
        return new Promise((resolve, reject) => {
            this.buyerService.getMasterData().takeUntil(destroySubcriptions$).subscribe((res: any) => {
                let tmp = {
                    CURRENCY_LIST : res[0].data,
                    ORGANIZATION_LIST: res[1].data,
                    EXCHANGE_RATE: res[2].data
                }
                resolve(tmp)
              }, (err) => {
                  reject()
              });
        })
    }

    pauseStateFormControl(basicForm) {        
        basicForm.disable();
        basicForm.controls.endt.enable();
        basicForm.controls.extensionSeconds.enable();
        basicForm.controls.gracePeriod.enable();
        basicForm.controls.extensionType.enable();
        basicForm.controls.bidInfoSupplier.enable();
        basicForm.controls.minBidChangeValue.enable();
        basicForm.controls.minBidChangeType.enable();
        basicForm.controls.bidCushionTypeLimit.enable();
        basicForm.controls.bidCushionType.enable();
        basicForm.controls.bestBidInfo.enable();
        basicForm.controls.allowties.enable();
    }

    patchBasicForm(aucObj, basicForm, listPrimaryCurrency) {
        basicForm.patchValue({
			aucName: aucObj.auctionName,
			aucType: aucObj.type,
			businessUnit: aucObj.businessUnit,
			company: aucObj.company,
			primaryCurrency: listPrimaryCurrency.find(x => x.currencyCode == aucObj.primaryCurrency),
			description: aucObj.description,
			decimalPlace: aucObj.currencyDecimalPlace,
			attachmentList: aucObj.attachmentList,
			remark: aucObj.remark,
			testUse: aucObj.testUse,
            isSealedBidAuction: aucObj.isSealedBidAuction
		});
    }

    getBuyerRemark(aucObj) {
        return aucObj.buyerRemarks ? aucObj.buyerRemarks.map(x => ({ ...x, updatedUser: aucObj.auctionLeader.name })) : [];
    }


    
}