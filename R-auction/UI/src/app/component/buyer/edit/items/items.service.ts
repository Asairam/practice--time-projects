import { Injectable } from '@angular/core';
import { ItemsformService } from '../../../../shared/services/itemsform.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ViewPopupComponent } from '../../../../shared/component/view-popup/view-popup.component';
import { BuyerEditService } from '../../../../component/component-service/buyer-edit.service';
import * as XLSX from 'xlsx';

@Injectable()
export class ItemService {

    getSliderConfig() {
        return {
            slidesPerView: 3,
            spaceBetween: 15,
            navigation: {
                nextEl: '.swiper-button-next',
                prevEl: '.swiper-button-prev',
            },
            // autoplay: {
            //   delay: 2500,
            //   disableOnInteraction: false,
            // },
            breakpoints: {
                1024: {
                    slidesPerView: 3,
                    spaceBetween: 15,
                },
                768: {
                    slidesPerView: 3,
                    spaceBetween: 15,
                },
                640: {
                    slidesPerView: 2,
                    spaceBetween: 15,
                },
                320: {
                    slidesPerView: 1,
                    spaceBetween: 10,
                }
            }
        };
    }

    private excelColumn = [{
            "S.No": null,
            "Lot": null,
            "Item Code": null,
            "Name": null,
            "Description": null,
            "Minimum Desired Quantity": null,
            "Unit Of Measure": null,
            "Historical Cost": null,
            "Historical Cost Date": null,
            "Start Price": null,
            "Minimum Bid Change": null,
            "Remark": null
        }];

    constructor(
        private itformService: ItemsformService,
        private MatDialog: MatDialog, 
		public buyerService: BuyerEditService,
    ) {}

    private extArray = ['xlsx', 'xls'];

    extractRegularAndMmcsItems(worksheet) {
        let mmcsWorksheet = worksheet.filter((element: any) => {
            return element.itemCode;
        });
        let regularWorksheet = worksheet.filter((element: any) => {
            // if(!element.itemCode) delete element["S.No"];
            return !element.itemCode;
        });
        return { regularWorksheet, mmcsWorksheet};
    }

    sanitizeWorksheet(worksheet) {
        
        // Remove Empty rows
        worksheet = worksheet.filter(element =>{
            let stArr = Object.keys(element);
            // check for richtext
            let emptyRow = true;
            stArr.forEach(keyName => {
                if(element[keyName]) {
                    emptyRow = false;
                }
            })
            if(emptyRow) {
                return false;
            } else {
                return true;
            }
        })
        // check for missing sr no.
        let serialNoMissingList = [];
        worksheet.forEach((element, index) =>{
            if(!element['S.No']) {
                serialNoMissingList.push(index+1);
            }
        });

        // check for duplicate serial no.
        let duplicateSerialList = []
        worksheet.forEach((element, index, arr) => {
            for(let i=index+1; i<arr.length; i++) {
                if(element['S.No'] == arr[i]['S.No']) {
                    duplicateSerialList.push(index+1);
                    break;
                }
            }
        });

        // check for duplicate name
        let duplicateName = [];
        worksheet.forEach((element, index, arr) => {
            for(let i=index+1; i<arr.length; i++) {
                if(element['itemName'] && arr[i]['itemName'] && element['itemName'].toLowerCase() == arr[i]['itemName'].toLowerCase()) {
                    duplicateName.push(element['S.No']);
                    duplicateName.push(arr[i]['S.No']);
                }
            }
        });

        // check for non numeric
        let nonNumericSerialList = [];
        worksheet.forEach((element) => {
            if(isNaN(element['S.No'])) nonNumericSerialList.push(element['S.No']);
        })

        

        // Remove data with Rich text.
        let richtextErrorArr = [];
        worksheet = worksheet.filter(element => {
            let errMsg = [];
            let stArr = Object.keys(element);
            // check for richtext
            stArr.forEach(keyName => {
                if(element[keyName] && typeof(element[keyName]) === "object") {
                    errMsg.push(element['S.No']);
                }
            })
            if(errMsg.length > 0) {
                richtextErrorArr.push(element['S.No']);
                return false;
            } else {
                return true;
            }
        });
        let blankFieldArr = [];
        worksheet = worksheet.filter(element => {
            
            let stArr = Object.keys(element);
            // check if all values are empty.
            let valueExist = false;
            stArr.forEach(keyName => {
                if (keyName !== 'S.No' && element[keyName]) {
                    valueExist = true;
                }
            });
            if(!valueExist) {
                blankFieldArr.push(element['S.No']);
                return false;
            } else {
                return true;
            }
        })
        return { 
            worksheet, 
            richtextErrorArr, 
            blankFieldArr, 
            serialNoMissingList, 
            duplicateSerialList, 
            nonNumericSerialList, 
            duplicateName
         };
    }



    checkFileExtAndName(event) {
        let file = event.target.files[0]
        let nameArr = file.name.split('.')
        let fileExt = nameArr[nameArr.length - 1];
        if (!this.extArray.includes(fileExt.toLowerCase())) {            
            return {file: file, extensionValid: false, formData: null};
        }
        let formData = new FormData();
        formData.append('sampleFile', file);
        return {file: file, extensionValid: true, formData: formData};
    }

    excelUploadLocal(e) {
        return new Promise((resolve, reject) => {
            var files = e.target.files, f = files[0];
            var reader = new FileReader();
            reader.onload = (event: any) => {
                var data = new Uint8Array(event.target.result);
                var workbook = XLSX.read(data, {type: 'array'});
                var sheet_name_list = workbook.SheetNames;
                sheet_name_list.forEach((y) => {
                    if(y == "data") {
                        var worksheet: any = workbook.Sheets[y];
                        var headers = {};
                        var data = [];
                        for(let z in worksheet) {
                            if(z[0] === '!') continue;
                            //parse out the column, row, and value
                            var tt = 0;
                            for (var i = 0; i < z.length; i++) {
                                let tmp:any = z[i];
                                if (!isNaN(tmp)) {
                                    tt = i;
                                    break;
                                }
                            };
                            var col = z.substring(0,tt);
                            var row = parseInt(z.substring(tt));
                            var value = worksheet[z].v;

                            //store header names
                            if(row == 1 && value) {
                                headers[col] = value;
                                continue;
                            }

                            if(!data[row]) data[row]={};
                            data[row][headers[col]] = value;
                        }
                        //drop those first two rows which are empty
                        data.shift();
                        data.shift();
                        for(let head in headers) {
                            data.forEach(ele => {
                                let prop = headers[head];
                                if(!ele[prop]) {
                                    ele[prop] = '';
                                }
                            })
                        }
                        data = this.camelCaseObjectKey(data);
                        data = this.nullify(data);
                        resolve(data);
                    }
                });
            };
            reader.readAsArrayBuffer(f);
        });        
    }

    nullify(data) {
        data.forEach(obj => {
            for (const property in obj) {
                if(!obj[property]) {// case check if prop == 0, "0", "", " ".
                    if(typeof(obj[property]) === "string") { // case check if prop == "0", "", " ".
                        obj[property] = obj[property].trim(); // handles case prop == " ".
                        if(obj[property].length === 0) { // handles case prop == ""
                            obj[property] = null;
                        }
                    }
                }
            }
        });
        return data;
    }

    validateColumns(worksheet, customFieldList) {
        let form  = this.itformService.getBlankForm(customFieldList);
        let validExcelColumns = Object.keys(form.controls);
        validExcelColumns.unshift("S.No");
        let workSheetColumns = Object.keys(worksheet[0]);
        let invalidColumns = [];
        workSheetColumns.forEach(columnName => {
          if(!validExcelColumns.includes(columnName)) invalidColumns.push(columnName);
        })
        if(invalidColumns.length > 0) {
            const objMatDialogConfig = new MatDialogConfig();
            objMatDialogConfig.panelClass = 'dialog-md';
            objMatDialogConfig.data = {
                dialogMessage: 'Error',
                dialogContent: 'Template is invalid. Contains extra cols: ' + invalidColumns.join(" , ") + ".",
                tab: 'excel-item-template',
                dialogNegativeBtn: "Close"
            }
            objMatDialogConfig.disableClose = true;
            let refMatDialog = this.MatDialog.open(ViewPopupComponent, objMatDialogConfig);
            refMatDialog.afterClosed()
            return {valid: false}
        }
        return { valid: true }
    }

    processWorksheet(worksheet, buyerService, customFieldList, fromMMCS?) {
        worksheet.forEach(element => {
            element.minChangeType = 'amount';
            element.attachmentListLength = 0;
            element.attachmentList = [];
            element.auctionID = buyerService.auctionData.auctionID;
            element.lotID = null;
            element.historicalCostDate = element.historicalCostDate ? new Date(element.historicalCostDate).toISOString() : null;
            element.fromMMCS = fromMMCS;
            element.remarks =  element.remarks? element.remarks :'';
            const resSomeSearch = buyerService.lotList.find(item => element.lotType && item.lotName.toLowerCase() === element.lotType.toLowerCase());
            if (resSomeSearch) {
              element.lotID = resSomeSearch.lotID;
              element.lotType = resSomeSearch.lotName;
            } else {
              element.lotID = buyerService.lotList && buyerService.lotList.length > 0 ? buyerService.lotList[0]['lotID'] : 0;
              element.lotType = buyerService.lotList && buyerService.lotList.length > 0 ? buyerService.lotList[0]['lotName'] : 0;
            }    
        });
        worksheet = this.modifyAndValidateWorksheet(worksheet, customFieldList);
        return worksheet;
    }

    private modifyAndValidateWorksheet(worksheet, customFieldList) {
        worksheet.forEach(element => {
            element.customFieldData = [];
            if (!element.itemName || !element.lotID || !element.minimumDesiredQuantity ||
                new Date(element.historicalCostDate) > new Date() || !element.unitOfMeasure) {
                element.error = true;
            }
            // if element has custom element && custom element is required but val of custom is empty the mark element as error.
            customFieldList.forEach(customElement => {
                element.customFieldData.push({
                customFieldID: customElement.customFieldID,
                name: customElement.fieldName,
                value: element[customElement.fieldName] ? element[customElement.fieldName] : ''
                })
                if (customElement.isMandatory && !element[customElement.fieldName]) element.error = true;
                // delete custom field key in item level.
                delete element[customElement.fieldName];
            });
        });
        return worksheet;
    }

    getExcelColumnNames(name, customFieldList) {
        let columnNamesObj;
        columnNamesObj =  Object.assign({}, this.excelColumn[0]);
        customFieldList.forEach(element => {
            columnNamesObj[element.fieldName] = null;
        });
        return columnNamesObj;	
    }

    deletePopup(dialogMessage) {
        const objMatDialogConfig = new MatDialogConfig();
        objMatDialogConfig.panelClass = 'dialog-xs';
        objMatDialogConfig.data = {
            dialogMessage: dialogMessage,
            dialogContent: 'Are you sure you want to delete items.',
            tab: 'confirm_msg',
            dialogPositiveBtn: "Yes",
            dialogNegativeBtn: "No"
        }
        objMatDialogConfig.disableClose = true;
        let refMatDialog = this.MatDialog.open(ViewPopupComponent, objMatDialogConfig);
        return refMatDialog.afterClosed();
    }

    findunique(arr) {
        let duplicateArr = [];
		arr.forEach((element, ind) => {
            for (let i = (ind + 1); i < arr.length; i++) {
                if (element.itemName && arr[i].itemName && element.itemName.toLowerCase() === arr[i].itemName.toLowerCase() && !arr[i].itemID) {
                    arr[i].error = true;  
                    duplicateArr.push((i+1));    
                }
            }
        });
        return duplicateArr;
    }
    
    deleteCustomfieldValue(itemDetails, customFields) {
		itemDetails.forEach(element => {
			if (customFields.length == 0) {
				element.customFieldData.length = 0;
			} else {
				let tmp = [];
				customFields.forEach(cusField => {
				element.customFieldData.forEach(itemCusField => {
					if (cusField.customFieldID == itemCusField.customFieldID) tmp.push(itemCusField);
				})
				});
				element.customFieldData.length = 0;
				if (tmp.length > 0) element.customFieldData.splice(element.customFieldData.length, 0, ...tmp);
			}
		})
    }
    
    confirmationMsg(dialogMessage, dialogContent, itemName) {
        const objMatDialogConfig = new MatDialogConfig();
        objMatDialogConfig.panelClass = 'dialog-xs';
        objMatDialogConfig.data = {
        dialogMessage: dialogMessage,
        dialogContent: dialogContent + '<b>' + itemName + '</b>',
        tab: 'confirm_msg',
        dialogPositiveBtn: "Yes",
        dialogNegativeBtn: "No"
        }
        objMatDialogConfig.disableClose = true;
        let refMatDialog = this.MatDialog.open(ViewPopupComponent, objMatDialogConfig);
        return refMatDialog.afterClosed();
    }

    crudFun(crud, aucStatus) {
		crud.forEach((element) => {
			if (aucStatus && aucStatus.toLowerCase() !== 'draft') {
				if (element.name === 'Delete') {
				element.bol = false;
				}
			} else {
				element.bol = true;
			}
		});
    }

    titleToCamel = (title) => title 
        .replace(/\s(.)/g, (a) =>  a.toUpperCase()) 
        .replace(/\s/g, '') 
        .replace(/^(.)/, (b) => b.toLowerCase());

    camelCaseObjectKey(response) {
        let list = Object.keys( this.excelColumn[0]);
        response.forEach((obj, index) => {
            let keyList = Object.keys(obj);
            keyList.forEach((key: any) => {
                // Rename few keys because some keys in excel header when camelCased doesnot
                // match the property names used in item popup form.                
                
                if(list.find((ele) =>  ele == key)) {
                    let newKey = key === "Minimum Bid Change" ? "Minimum Change Value" : key;
                    newKey = key === "Lot" ? "Lot Type" : newKey;
                    newKey = key === "Name" ? "Item Name" : newKey;
                    newKey = key === "Remark" ? "Remarks" : newKey;
                    if(key !== 'S.No' ) {
                        let formatedKey =  this.titleToCamel(newKey);                      
                        obj[formatedKey] = obj[key]; // assign value.
                        delete obj[key]; // delete old key.
                    }
                }
            });
        });
        return response;
    }

    pushToItemArray(itemDetailsArr, formObjectVal) {
		if(itemDetailsArr.length == 0) {
			formObjectVal.sequenceNumberOriginal = 1;
		} else {
            let lastSeqNum = 0;
            itemDetailsArr.forEach(obj => {
                if(obj.sequenceNumberOriginal && obj.sequenceNumberOriginal > lastSeqNum) {
                    lastSeqNum = obj.sequenceNumberOriginal;
                }
            });
            formObjectVal.sequenceNumberOriginal = lastSeqNum + 1;
        }
		itemDetailsArr.push(formObjectVal);
    }
    
    addSequenceNumber(itemList, defaultLotSequence) {
        let listLength = itemList.length;
        if(listLength == 0) return;
        itemList.forEach((element, index) => {
            element.sequenceNumber = index + 1;
        });

        this.addSequenceNumberLot(itemList, defaultLotSequence);
    }

    addSequenceNumberLot(itemList, defaultLotSequence) {
        let listLength = itemList.length;
        if(listLength == 0) return;
        if(defaultLotSequence) {
            itemList.forEach((element, index, list) => {                
                element.sequenceNumberLot = 1;
            });
            return;
        }
        let lotIndex = 1
        itemList[0].sequenceNumberLot = lotIndex;
        itemList.forEach((element, index, list) => {
            if(index == listLength-1) return;
            if(list[index].lotType == list[index+1].lotType) {
                list[index+1].sequenceNumberLot = lotIndex;
            } else {
                lotIndex = lotIndex + 1;
                list[index+1].sequenceNumberLot = lotIndex;
            }
            element.sequenceNumber = index + 1;
        });
    }

    getLotSequence(itemList, lotList) {
        let lotMap = new Map();
        lotList.forEach(element => {
            lotMap.set(element.lotName, element.lotID);
        });
        let tmp = [];
        itemList.forEach(element => {
            tmp.push({lotID : lotMap.get(element.lotType) , sequenceNumberLot: (element.sequenceNumberLot ? element.sequenceNumberLot : 1) });            
        });
        let newTmp = []
        let uniqueArr = []
        tmp.forEach(ele => {
            if(newTmp.indexOf(ele.lotID) < 0) {
                uniqueArr.push(ele);
                newTmp.push(ele.lotID);
            }
        });
        return uniqueArr;
    }

    saveItemArray(itemList, auctionID) {
        return new Promise((resolve, reject) => {
            this.buyerService.saveItemList(itemList, auctionID).subscribe((res) => {                
                resolve(res);
            }, (err) => {
                reject(new Error("Items cannot be saved."));
            })
        });
    }

    saveLotSequence(auctionID, lotSeqencePayload) {
        let payload = {    
            "auctionID": auctionID,
            "lots": lotSeqencePayload
        }
        return new Promise((resolve, reject) => {
            this.buyerService.saveLotSequence(payload).subscribe((res) => {                
                resolve(res);
            }, (err) => {
                reject(new Error("Lot Sequence cannot be saved."));
            })
        });
    }

    convertStringToNumber(itemList, prop) {
        itemList.forEach(obj => {
            obj[prop] = Number(obj[prop]);
        });
    }

    convertNumberToString(itemList, prop) {
        itemList.forEach(obj => {
            obj[prop] = String(obj[prop]);
        });
    }
        
}