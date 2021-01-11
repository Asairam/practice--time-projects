import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BuyerEditService } from '../../../../component/component-service/buyer-edit.service';
import { CommonService } from '../../../../commonService/common.service';
import * as config from '../../../../appConfig/index';
import { ItemsformService } from '../../../../shared/services/itemsform.service';
import { PopupService } from '../../../../shared/services/popup.services';
import { ItemService } from './items.service';
/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromEditModule from '../state/editmodule.reducer';
import { takeWhile } from 'rxjs/operators';

@Component({
	selector: 'ITEM-CARD-HOLDER',
	templateUrl: './items.component.html',
	styleUrls: ['./items.component.css']
})
export class ItemsComponent implements OnInit, OnDestroy {

	uomNameList = [];
	sortTouched: boolean = false;
	auctionReadOnly: boolean = false;
	componentActive: boolean = true;
	@Input() customFieldList: any;
	oldData = [];
	auctionID: any;
	crud = config.crudOpe;
	itemDetails = [];
	itemFilterLot = [{ id: '', value: '--Select--' }, { id: 'lotType', value: 'Lot Name' }];
	itemFilter = [{ id: '', value: '--Serial Number--' }, { id: 'itemName', value: 'Item Name' },{ id: 'itemCode', value: 'Item Code' },{ id: 'minimumDesiredQuantity', value: 'Quantity' },{ id: 'startPrice', value: 'Start Price' }, { id: 'historicalCost', value: 'Historical Cost' }];
	itemcoloum: any;
	translateSer: any;
	commonheader: any;
	selectFilterLot = this.itemFilterLot[0].id;
	selectFilter = config.filterItem[0].id;
	viewlist = "card";
	sliderConfig: any;
	aucStatus;
	isPublish = false;
	allchecked = false;
	constructor(
		public common: CommonService,
		public buyerService: BuyerEditService,
		private itformService: ItemsformService,
		private popupService: PopupService,
		private itemService: ItemService,
		private store: Store<fromEditModule.EditModuleState>
	) {
	}

	ngOnInit() {
		this.getUomData().then((res: any) => {
			res.forEach((obj: any) => {
				this.uomNameList.push(obj.name);
			});
		}).catch(console.error)
		this.store.pipe(select(fromEditModule.getAuctionReadOnly),takeWhile(() => this.componentActive) )
		.subscribe(auctionReadOnly => {
			this.auctionReadOnly = auctionReadOnly;
		});

		this.store.pipe(select(fromEditModule.getAuctionStatus),takeWhile(() => this.componentActive))
		.subscribe(auctionStatus => {
			if( auctionStatus == 'suspended') {
				console.log('suspended');
			}
			if(auctionStatus == 'published') {
				console.log('published');
			}
			if(auctionStatus == 'paused') {
				console.log('paused');
			}
			if(auctionStatus == 'draft') {
				console.log('draft');
			}
			this.aucStatus = auctionStatus;
		});

		if (this.common.isMobile) {
			this.sliderConfig = config.SWIPER_SLIDER;
		} else {
			this.sliderConfig = this.itemService.getSliderConfig();
		}
		this.subscribeConstants();
		if (this.buyerService.auctionData.auctionID) {
			this.getItemsAndCustomField();
			this.itemService.crudFun(this.crud, this.aucStatus);
		}
		this.subscribeCustomFieldChanges();
	}

	subscribeConstants() {
		this.common.apiCall.pipe(takeWhile(() => this.componentActive)).subscribe((data: any) => {
			if (this.buyerService.lotList.length > 0) {
				let lotData = [];
				this.buyerService.lotList.forEach(lot => {
					lotData.push(lot.lotID);
				})
				this.buyerService.itemDetails = this.buyerService.itemDetails.filter(x => lotData.includes(x.lotID));
			} else {
				this.itemDetails.length = 0;
			}
		});

		this.common.toggleDiv.pipe(takeWhile(() => this.componentActive)).subscribe((data: any) => {
			if (data === 'check_duplicate_arr') this.itemService.findunique(this.buyerService.itemDetails);
		});
		this.common.translateSer('ITEM_MSG').pipe(takeWhile(() => this.componentActive)).subscribe(async (text: string) => {
			this.translateSer = text;
		});
		this.common.translateSer('ITEM_COLOUM').pipe(takeWhile(() => this.componentActive)).subscribe(async (text: string) => {
			this.itemcoloum = text;
		});
		this.common.translateSer('COMMON').pipe(takeWhile(() => this.componentActive)).subscribe(async (text: string) => {
			this.commonheader = text;
		});
	}

	subscribeCustomFieldChanges() {
		this.buyerService.getCustomFieldObservable().pipe(takeWhile(() => this.componentActive)).subscribe(obs_res => {
			this.getCustomFields().then(result => {
				if (this.buyerService.auctionData.auctionStatus.toLowerCase() == 'published') {
					this.popupService.republishMessage();
				}
				if (obs_res == "success-create" || obs_res == "success-update") {
					this.itemService.deleteCustomfieldValue(this.buyerService.itemDetails, this.customFieldList);
					this.reValidateItems(this.buyerService.itemDetails);
				}
				if (obs_res == 'success-delete') {
					// remove deleted value from all item's customFieldData property.    
					this.itemService.deleteCustomfieldValue(this.buyerService.itemDetails, this.customFieldList);
				}
			})
			.catch(err => this.common.error(err.message));
		})
	}

	getItemsAndCustomField() {
		Promise.all([this.getItems(), this.getCustomFields()]).then(result => {
			this.buyerService.itemDetails.forEach(itemObj => {
				this.itformService.validateItemDetails(itemObj, this.customFieldList);
			})
		}).catch(err => {
			if (err && err.message) this.common.error(err.message);
		})
	}

	getItems() {
		return new Promise((resolve, reject) => {
			this.common.loader = true;
			this.buyerService.getItemsData(this.buyerService.auctionData.auctionID).pipe(takeWhile(() => this.componentActive)).subscribe((res) => {
				let lotList = res[0]['data'];
				let itemDetails = [...res[1]['data']];
				this.buyerService.lotList = lotList
				this.itemDetails = itemDetails;
				this.buyerService.itemDetails = itemDetails;
				this.buyerService.getItemDataPass(itemDetails);
				this.oldData = JSON.parse(JSON.stringify([...itemDetails]))
				resolve();
			}, (err) => {
				this.common.loader = false;
				reject(new Error("Unable to fetch items"));
			})
		})
	}

	getCustomFields() {
		return new Promise((resolve, reject) => {
			if (this.buyerService.auctionData.auctionID) {
				this.buyerService.getCustomFieldList(this.buyerService.auctionData.auctionID).pipe(takeWhile(() => this.componentActive)).subscribe((res: any) => {
					let itemCustList = res.data.filter(cust => cust.displayLevel === "item");
					this.customFieldList = itemCustList.sort((a, b) => {
						return a._id - b._id;
					});
					resolve();
				}, err => {
					reject(new Error("Unable to fetch custom fields"));
				})
			} else {
				reject(new Error("Auction Id unavailable"));
			}
		})
	}

	createItem() {
		let sendData = {
			flag: 'openAttach',
			pageFrom: 'item',
			data: { 'type': 'create', 'aucStatus': this.aucStatus, data: { 'attachmentList': [] } },
			auctionID: this.buyerService.auctionData.auctionID,
			customFieldList: this.customFieldList,
		}
		this.common.toggleDiv.emit(sendData);
		this.itemService.crudFun(this.crud, this.aucStatus);
	}
	createLot() {
		let sendData = {
			flag: 'openAttach',
			pageFrom: 'lot',
			data: { 'type': 'create', 'aucStatus': this.aucStatus, 'itemList': this.buyerService.itemDetails },
			auctionID: this.buyerService.auctionData.auctionID
		}
		this.common.toggleDiv.emit(sendData);
	}

	createcard(view) {
		this.viewlist = view;
	}

	itemSub() {
		return new Promise((resolve, reject) => {
			let itemList = [];
			let hasError = false;
			this.buyerService.itemDetails.forEach((element, ind) => {
				element.itemCode = element.itemCode ? element.itemCode.toString() : null;
				const { landedUnitRate, itemWeight, totalLandedCost, landedUnit, baseCost, variableCost, totalLanded, bestBid, totalBestBid, flag, amount, amountFlag, submit, currency, attachmentListLength, updatedAt, updatedBy, _id, createdAt, createdBy, __v, error, checked, ...noA } = element;
				if (error) hasError = true;

				if(element.currency && element.currency.length >0) {
					delete element.currency[0]._id;
					noA.currency = element.currency;
				}
				itemList.push(noA);
			});
			if (hasError) {
				reject(new Error("Validations for Items Array failed."));
			} else {
				let defaultLotSequence = !this.selectFilterLot && this.sortTouched ? true : false
				this.itemService.addSequenceNumber(itemList, defaultLotSequence);
				let lotSeqencePayload = this.itemService.getLotSequence(itemList, this.buyerService.lotList);
				this.itemService.saveItemArray(itemList, this.buyerService.auctionData.auctionID).then(res => {
					if (this.buyerService.auctionData.auctionStatus.toLowerCase() == config.AUCTIONSTATUS.PB.toLowerCase()) {
						if (!this.buyerService.remarkFlag) {
							let flag = false;
							if (itemList.length != this.oldData.length) {
								flag = true;
							}
							else {
								itemList.forEach(item => {
									if (!flag) {
										let oldItem = this.oldData.filter(x => x.itemID == item.itemID);
										if (oldItem.length > 0) {
											flag = config.compareData(item, oldItem[0]);
										}
										else {
											flag = true;
										}
									}
									else {
										return flag;
									}
								})
							}
							this.buyerService.remarkFlag = flag;
							if (this.buyerService.remarkFlag) {
								this.oldData = JSON.parse(JSON.stringify([...itemList]));
							}
						}
					}
					else{
						this.oldData = JSON.parse(JSON.stringify([...itemList]));
					}
					
					this.getItemsAndCustomField();
					return this.itemService.saveLotSequence(this.buyerService.auctionData.auctionID, lotSeqencePayload);
				}).then(res => {
					resolve();
				}).catch(err => {
					this.common.loader = false;
					reject(err);
				});
			}
		})
	}

	exportAsXLSX(name): void {
		let uom: any = [];
		this.getUomData().then(res => {
			uom = res;
		}).catch(err => {
		}).finally(() => {
			let columnArr = [];			
			columnArr.push(this.itemService.getExcelColumnNames(name, this.customFieldList));
			this.buyerService.exportAsExcelFile(columnArr, name, uom);
		})
		
	}

	getUomData() {
		return new Promise((resolve, reject) => {
			this.buyerService.uom().subscribe((res: any) => {
				let { data } = res;
				resolve(data);
			}, (err) => {
				reject(new Error(err))
			});
		})
	}

	incomingfile(event, name) {
		let { extensionValid, file, formData } = this.itemService.checkFileExtAndName(event);
		if (!extensionValid) {
			this.common.error(this.translateSer['FILE_NOT_V']);
			return;
		}

		this.onExcelLocal(event).then(worksheetObj => {
			return this.mmcsExcel(worksheetObj);
		}).then((worksheetObj: any) => {
			let { regular_sheet, mmcs_sheet, nonmmcs_sheet } = worksheetObj;
			// debugger;
			// process array.
			let mmcs_final_sheet = this.itemService.processWorksheet(mmcs_sheet, this.buyerService, this.customFieldList, true);
			let nonmmc_finals_sheet = this.itemService.processWorksheet(nonmmcs_sheet, this.buyerService, this.customFieldList, false);
			let regular_final_sheet = this.itemService.processWorksheet(regular_sheet, this.buyerService, this.customFieldList, false);
			// concat array
			let combined_final_sheet = mmcs_final_sheet.concat(regular_final_sheet).concat(nonmmc_finals_sheet);
			// sort as per serial no.
			combined_final_sheet.sort(function (a, b) {
				return a["S.No"] - b["S.No"];
			});
			// check for blank name
			let blankName = [];
			combined_final_sheet.forEach((element, index, arr) => {
				if(!element['itemName']) {
					blankName.push(element["S.No"]);
				}
			});
			if(blankName.length > 0) {
				let errText = blankName.join(' , ');
				return new Promise((resolve, reject) => reject(new Error('Name required for Row no. : ' + errText)));
			}
			// delete serial no.
			combined_final_sheet.forEach((element) => {
				delete element["S.No"];
			})
			//add to items array.
			combined_final_sheet.forEach(obj => {
				this.itemService.pushToItemArray(this.buyerService.itemDetails, obj)
			});
			// validation check for entered data.
			this.reValidateItems(this.buyerService.itemDetails);
			let duplicateExistArr = this.itemService.findunique(this.buyerService.itemDetails);
			this.common.success(this.translateSer['EXCEL_UP_SU']);
			if (duplicateExistArr.length > 0) {
				setTimeout(() => { this.common.error(`Duplicate card : ${duplicateExistArr.join(' , ')}`) }, 500);
			}
		}).catch((err: any) => {
			this.common.error(err.message);
		}).finally(() => {
			event.target.value = '';
		});		
	}

	onExcelLocal(event) {
		return new Promise((resolve, reject) => {
			this.itemService.excelUploadLocal(event).then((res) => {
				let { valid } = this.itemService.validateColumns(res, this.customFieldList);
				if (!valid) {
					reject(new Error("Invalid Columns in file"));
					return;
				}
				let {
					worksheet,
					richtextErrorArr,
					blankFieldArr,
					serialNoMissingList,
					duplicateSerialList,
					nonNumericSerialList,
					duplicateName,
				} = this.itemService.sanitizeWorksheet(res);

				if (richtextErrorArr.length > 0) {
					let errText = richtextErrorArr.join(' , ');
					reject(new Error('Error in Row no. : ' + errText));
					return;
				}
				if (serialNoMissingList.length > 0) {
					let errText = serialNoMissingList.join(' , ');
					reject(new Error('Serial no. missing for record no. : ' + errText));
					return;
				}
				if (nonNumericSerialList.length > 0) {
					let errText = nonNumericSerialList.join(' , ');
					reject(new Error('Serial no. having non-numeric values : ' + errText));
					return;
				}

				if (duplicateSerialList.length > 0) {
					let errText = duplicateSerialList.join(' , ');
					reject(new Error('Duplicate Serial no. exist for record no. : ' + errText));
					return;
				}
				if (blankFieldArr.length > 0) {
					let errText = blankFieldArr.join(' , ');
					reject(new Error('Fields empty for Row no. : ' + errText));
					return;
				}
				
				if(duplicateName.length > 0) {
					let errText = duplicateName.join(' , ');
					reject(new Error('Duplicate name for Row no. : ' + errText));
					return;
				}
				worksheet.forEach((element, index) =>{
					if(this.uomNameList.indexOf(element['unitOfMeasure']) < 0) {
						element['unitOfMeasure'] = '';
					}
				});
				
				let { regularWorksheet, mmcsWorksheet } = this.itemService.extractRegularAndMmcsItems(worksheet);
				if (regularWorksheet.length == 0 && mmcsWorksheet.length == 0) {
					reject(new Error("Serial no. is required"));
					return;
				}
				resolve({ regularWorksheet, mmcsWorksheet });
			});
		});
	}

	mmcsExcel(worksheetObj) {
		return new Promise((resolve, reject) => {
			let regular_sheet = worksheetObj.regularWorksheet;
			let mmcs_sheet = [];
			let nonmmcs_sheet = [];

			if (worksheetObj.mmcsWorksheet.length == 0) {
				resolve({ regular_sheet, mmcs_sheet, nonmmcs_sheet });
				return;
			}
			this.buyerService.uploadMmcsList(worksheetObj.mmcsWorksheet).subscribe((res) => {
				let data = res['data'];
				let mmcs_sheet = [];
				let nonmmcs_sheet = [];
				data.forEach(element => {
					if(element.message) {
						let filtered = worksheetObj.mmcsWorksheet.find(obj => obj['S.No'] == element['S.No']);
						nonmmcs_sheet.push(filtered);
					} else {						
						element.formData.itemName = element.mmcs.nvchabbrevdesc;
						element.formData.description = element.mmcs.longdesc;
						element.formData.unitOfMeasure = element.mmcs.uomCode;
						mmcs_sheet.push(element.formData);
					}
				});
				resolve({ regular_sheet, mmcs_sheet, nonmmcs_sheet })
			}, (err) => {
				reject(err);
			});
		})
	}

	itemWiseSortOrder = 'asc';
	lotWiseSortOrder = 'asc';

	itemSorting(sortOrder) {
		this.itemWiseSortOrder = sortOrder ? sortOrder : 'asc';
		this.twoLevelSort();
	}
	itemSortingLot(sortOrder) {
		this.lotWiseSortOrder = sortOrder ? sortOrder : 'asc';
		this.twoLevelSort();
	}

	twoLevelSort() {
		this.sortTouched = true;
		if(this.selectFilter == 'startPrice' || this.selectFilter == 'historicalCost') {
			this.itemService.convertStringToNumber(this.buyerService.itemDetails, this.selectFilter);
		}
		config.twoLevelSorting(this.buyerService.itemDetails, this.selectFilterLot , this.lotWiseSortOrder, this.selectFilter, this.itemWiseSortOrder);
		
		if(this.selectFilter == 'startPrice' || this.selectFilter == 'historicalCost') {
			this.itemService.convertNumberToString(this.buyerService.itemDetails, this.selectFilter);
		}	
	}

	reValidateItems(itemdetails) {
		itemdetails.forEach(x => {
			this.itformService.validateItemDetails(x, this.customFieldList);
		});
	}

	selectAll(eve) {
		this.buyerService.itemDetails.forEach(element => {
			element.checked = eve;
		});
	}

	deleteItems() {
		if (this.buyerService.itemDetails.some(obj => { return obj.checked })) {
			try {
				this.itemService.deletePopup(this.commonheader['PLZ_CON']).pipe(takeWhile(() => this.componentActive)).subscribe((value) => {
					if (value) {
						for (var i = 0; i < this.buyerService.itemDetails.length; i++) {
							if (this.buyerService.itemDetails[i]['checked']) {
								this.buyerService.itemDetails.splice(i, 1);
								i--;
							}
						}
						this.common.success("item " + this.commonheader['DELE_SUCC']);
						this.allchecked = false;
					}
				});
			} catch (e) { }
		} else {
			this.allchecked = false;
			this.common.warning("Not checked");
		}
	}

	ngOnDestroy() {
		this.componentActive = false;
	}
}
