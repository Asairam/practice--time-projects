import { Component, OnInit, OnDestroy, Input, OnChanges, ViewChild, Output, EventEmitter, ElementRef } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { BuyerEditService } from '../../../../component-service/buyer-edit.service';
import { AuthService } from '../../../../../authService/auth.service';
import { CommonService } from '../../../../../commonService/common.service';
import * as config from '../../../../../appConfig/app.config';
import { ItemsformService } from '../../../../../shared/services/itemsform.service';
import { PopupService } from '../../../../../shared/services/popup.services';
import { ItemService } from '../items.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ViewPopupComponent } from 'src/app/shared/component/view-popup/view-popup.component';

/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromEditModule from '../../state/editmodule.reducer';
import { takeWhile } from 'rxjs/operators';

@Component({
	selector: 'app-item-popup',
	templateUrl: './item-popup.component.html',
	styleUrls: ['./item-popup.component.css'],
	providers: [ItemService]
})
export class ItemPopupComponent implements OnInit, OnDestroy, OnChanges {

	auctionReadOnly: boolean = false;
	componentActive: boolean = true;

	@Output() openAttach=new EventEmitter<any>();
	@Output() resetAll: EventEmitter<any> = new EventEmitter();
	formObs;
	@Output() saveDisabledEvent: EventEmitter<any> = new EventEmitter();
	companyReferences = [];
	mmcsCharacteristics = [];
	mmcsLongDesc;
	submited: boolean = false;
	@ViewChild('submitElementItem') submitElementItem: ElementRef;
	@Output() onMMCSselect: EventEmitter<any> = new EventEmitter();
	@Output() addNext: EventEmitter<any> = new EventEmitter();
	@Output() itemCodeSelected: EventEmitter<any> = new EventEmitter();
	@Output() onSearchEnabled: EventEmitter<any> = new EventEmitter();
	primaryCurrency;
	searchEnabled: boolean = false;
	showSearch: boolean = true;
	showItemForm: boolean = true;
	selectedVal: any = [];
	@Input() customFieldList: any;
	panelOpenState = false;
	createItemForm: FormGroup;
	maxDate = new Date();
	UomList = [];
	UomList_Master = [];
	displayFlag: boolean = false;
	historical_hide = false;
	haveItemCode = "";
	updateItemName: any;
	buttShow = true;
	itemminList = [
		{ "name": "Amount", ID: "amount" },
		{ "name": "Percentage", ID: "percentage" }
	];
	TRANSLATE_SER: any;
	COLUMN: any;
	COMMON_BTN: any;
	@Input() viewData;
	@Input() auctionId;
	@Input() tab;
	public itemCode = "";
	public FilterCtrl: FormControl = new FormControl();
	currencyCode: any;
	isShowPo = false;
	public historicalCostData:any;
	public primaryHistoricalCost:any;
	public primaryHistoricalCurrecy:any;
	
	constructor(
		public buyerService: BuyerEditService,
		private authService: AuthService,
		private common: CommonService,
		private itformService: ItemsformService,
		private itemService: ItemService,
		private popup: PopupService,
		private matDialog: MatDialog,
		private store: Store<fromEditModule.EditModuleState>
	) {

		this.buyerService.selectPoHistory.subscribe(async (report: any) => {
			this.primaryHistoricalCurrecy = report.currency;
			this.primaryHistoricalCost = Number(report.price);
			console.log("primary-history cost-----", report.price);
			if(report.currency != this.primaryCurrency.currencyCode) {
					this.buyerService.getCurrencyList().subscribe((res: any) => {
						var historyCurrency = res.data.filter(function(item) {
							return item.code ==  report.currency;
						});
						var obj = {
							"auctionID":this.auctionId,
							"currency":[{"currencyCode":report.currency,"currencyName":historyCurrency[0].name}, {"currencyCode":this.primaryCurrency.currencyCode,"currencyName":this.primaryCurrency.currencyName}],
							"primaryCurrency":this.primaryCurrency.currencyCode
						}
						var self = this;
						this.buyerService.getItemExchangeRate(obj).subscribe((res: any) => {
							var exchangeRate = 1;
							res.data.forEach(function(rate) {
								if(report.currency == rate.currencyCode) {
									exchangeRate = Number(rate.exchangeRate);
									self.historicalCostData = rate;
									delete self.historicalCostData.exchangeRateDate;
								}
							})
							self.createItemForm.patchValue({
								historicalCost:(exchangeRate*Number(report.price)).toFixed(2),
								historicalCostDate : new Date(report.createdAt)
							});
						})
					})
			} else {
				this.createItemForm.patchValue({
					historicalCost:report.price,
					historicalCostDate : new Date(report.createdAt)
				});
			}
		})
	}

	ngOnChanges() { }

	ngOnInit() {
		this.store.pipe(select(fromEditModule.getAuctionReadOnly),takeWhile(() => this.componentActive) )
		.subscribe(auctionReadOnly => {
			this.auctionReadOnly = auctionReadOnly;
		});
		this.store.pipe(select(fromEditModule.getAuctionDetails), 
			takeWhile(() => this.componentActive)).subscribe((auctionDetails: any) => {
			this.primaryCurrency = Object.assign({}, auctionDetails.primaryCurrency);
		});
		// sequence shoud not change.
		this.getConstants();
		// let obj = this.viewData.type === "update" ? this.viewData.data : '';
		this.resetForm(); 
		this.filterItemLevelCustomfield();
		this.checkUom();
	}

	getConstants() {
		this.common.translateSer('ITEM_MSG').subscribe(async (text: string) => {
			this.TRANSLATE_SER = text;
		});
		this.common.translateSer('ITEM_COLOUM').subscribe(async (text: string) => {
			this.COLUMN = text;
		});
		this.common.translateSer('COMMON').subscribe(async (text: string) => {
			this.COMMON_BTN = text;
		});
	}

	// setSelectedReport(report) {
	// 	this.primaryCurrency.currencyCode = report.currency;
	// 	this.createItemForm.patchValue({
	// 		historicalCost:report.price,
	// 		historicalCostDate : new Date(report.createdAt)
	// 	});
	// 	this.isShowPo = false;
	// }

	showPODetails() {
		this.itemCode = this.haveItemCode;
		// this.isShowPo = this.isShowPo?false:true;
		
		const objMatDialogConfig = new MatDialogConfig();
		objMatDialogConfig.panelClass = 'dialog-vlg';
		objMatDialogConfig.data = {
			dialogMessage: "PO History Details",
			tab: 'pohistory',
			dialogNegativeBtn: "Close",
			data: this.itemCode
		}
		objMatDialogConfig.disableClose = true;
		let refMatDialog = this.matDialog.open(ViewPopupComponent, objMatDialogConfig);
		refMatDialog.afterClosed().subscribe((value) => {

		})
	}

	checkUom() {
		let uom = sessionStorage.getItem('uom');
		if (uom) {
			uom = JSON.parse(uom);
			this.setUomAndSort(uom);
			this.start();
		}
		if (uom) this.common.loader = false; // disable loader if uom exist. STEP 1
		this.getUomData().then(result => {
			sessionStorage.setItem('uom', JSON.stringify(result));
			this.setUomAndSort(result);
			if (uom) this.common.loader = true; // re-enable loader if uom exist. STEP 2
			if (!uom) {
				this.start();
			}
		})
	}

	start() {
		if (this.viewData) {
			this.buttShow = true;
			if (this.viewData['type'] === 'update') {
				this.itemEdit(this.viewData);
				this.checkStatus(this.viewData);
			}
		}
		if (config.ROLE_ACCESS_CONTROL.both.includes(this.authService.userRole().toLowerCase())) {
			this.historical_hide = true;
		}
		this.FilterCtrl.valueChanges.subscribe(() => {
			this.UomList = this.itformService.filterUomList(this.UomList_Master, this.FilterCtrl.value);
		});
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

	setUomAndSort(data) {
		this.UomList = data;
		this.UomList_Master = data;
		this.common.sortOn(this.UomList, 'description');
	}

	filterItemLevelCustomfield() {
		if (this.customFieldList && this.customFieldList.length > 0) {
			this.customFieldList = this.customFieldList.filter((obj) => {
				return obj.displayLevel == "item";
			})
		}
	}

	checkStatus(val) {
		this.buttShow = true;
		switch (val.aucStatus) {
			case 'draft':
				this.createItemForm.enable();
				this.buttShow = true;
				break;
			case 'paused':
				this.buttShow = true;
				this.createItemForm.enable();
				this.createItemForm.get('minimumDesiredQuantity').disable();
				// this.createItemForm.get('startPrice').disable();  
				break;
			case 'published':
				this.buttShow = true;
				this.createItemForm.enable();
				break;
			case 'suspended':
				this.buttShow = true;
				this.createItemForm.enable();
				break;
			default:
				this.buttShow = false;
				this.createItemForm.disable();
		}
	}

	resetForm(obj?) {
		this.createItemForm = this.itformService.getBlankForm(this.customFieldList, obj);
		this.getLotData();
		this.mmcsCharacteristics = [];
		this.mmcsLongDesc = '';
		this.companyReferences = [];
		if (this.formObs) this.formObs.unsubscribe();
		this.formObs = this.createItemForm.statusChanges.subscribe(result => {
			this.enableDisableAttachment();
		}
		);
	}

	enableDisableAttachment() {
		let disabled = this.createItemForm.invalid || this.searchEnabled;
		let formObj = this.createItemForm.getRawValue();
		this.saveDisabledEvent.emit({ disabled: disabled, formObj: formObj });
	}

	getLotData() {
		if (this.viewData.type === 'create') {
			this.createItemForm.patchValue({
				lotID: this.buyerService.lotList && this.buyerService.lotList.length > 0 ? this.buyerService.lotList[0]['lotID'] : null
			});
			this.setLotType(this.createItemForm.value.lotID);
		} else {
			this.buyerService.lotList = this.buyerService.getLotList(this.auctionId);
		}
	}  

	itemEdit(rec) {
		let res = { ...rec['data'] };	
		if(res.historicalCost && res['currency'] && res['currency'].length > 0) {
			this.primaryHistoricalCost = res.historicalCost / res['currency'][0]['exchangeRate'];
			this.primaryHistoricalCurrecy = res['currency'][0]['currencyCode'];
		}
		this.updateItemName = res.itemName;
		let uom;
		if (res.unitOfMeasure) {
			uom = this.itformService.uomSearch(this.UomList, res.unitOfMeasure);
		} 
		if (uom) res.unitOfMeasure = uom['name'];
		this.haveItemCode = res.itemCode;
		//get form
		this.createItemForm = this.itformService.getBlankForm(this.customFieldList, res);
		if (rec.pageFrom === 'readonly') {
			this.displayFlag = true;
			this.itformService.diableForm(this.createItemForm, res.customFieldData)
		}
		if (res.fromMMCS) {
			this.disableOnMMCS();
			this.buyerService.getMaterialDetails(res.itemCode).subscribe((res: any) => {
				if (res.success) {
					if (res.data.result.length == 0) {
						return;
					}
					let val = res.data.result[0];
					this.mmcsCharacteristics = val.characteristics;
					this.companyReferences = val.companyReferences;
					this.mmcsLongDesc = val.longdesc;
					this.itemCodeSelected.emit(val);
				}
			})
		}
		// used to make required fields red when user edits a red card.
		setTimeout(() => {
			this.submitElementItem.nativeElement.click();
			this.enableDisableAttachment();
		}, 1000);
	}

	onClose() {
		let sendData = {
			flag: 'closeAttach',
			pageFrom: 'item'
		}
		this.common.toggleDiv.emit('check_duplicate_arr');
		this.common.toggleDiv.emit(sendData);
		
	}

	itemformSubmit(butt) {
		let customFieldData = this.newCustomFieldJson(this.customFieldList);

		let arrData = [];
		if (this.buyerService.itemDetails && this.buyerService.itemDetails.length > 0) {
			let formVal = this.createItemForm.getRawValue();
			arrData = this.buyerService.itemDetails.filter((obj) => {
				if (formVal.itemName && obj.itemName) {
					if (!this.updateItemName) {
						this.updateItemName = formVal.itemName;
					}
					if (this.viewData.type === "create") {
						return obj.itemName.toLowerCase() === formVal.itemName.toLowerCase();
					} else {
						return this.updateItemName.toLowerCase() !== formVal.itemName.toLowerCase() && obj.itemName.toLowerCase() === formVal.itemName.toLowerCase()
					}
				}
			});
		}
		if (arrData.length !== 0) {
			this.common.error(this.TRANSLATE_SER['ITEM_ALREADY_EXIT']);
		} else {

			this.createItemForm.patchValue({
				auctionID: this.auctionId,
			});
			//Note :: use getRawValue() on form to get values od disabled controls as well.
			let formObjectVal = this.createItemForm.getRawValue();
			if (!formObjectVal.historicalCostDate) {
				formObjectVal.historicalCostDate = null;
			}
			if (formObjectVal.reservedPriceDate === null) {
				delete formObjectVal.reservedPriceDate;
			}
			formObjectVal.customFieldData = customFieldData;
			formObjectVal.primaryHistoricalCost = this.primaryHistoricalCost;
			formObjectVal.currency = [(this.historicalCostData)?this.historicalCostData:this.primaryCurrency];
			this.deleteCustomProperty(formObjectVal, this.customFieldList);
			this.itformService.makeFieldNull(formObjectVal); // case: convert blank string to null.
			let msg = '';
			if (this.viewData.type === "create") {
				Object.assign(formObjectVal, { attachmentList: this.viewData.data.attachmentList });
				this.itemService.pushToItemArray(this.buyerService.itemDetails, formObjectVal);
				msg = this.TRANSLATE_SER['ITEM_CREATED_SUCC'];
			} else {
				this.buyerService.itemDetails.forEach((element, index) => {
					if (index === this.viewData.itemInd) {
						this.deleteCustomProperty(element, this.customFieldList);
						element.error = false
						Object.keys(element).forEach((Dkey) => {
							Object.keys(formObjectVal).forEach((Mkey) => {
								if (Dkey === Mkey) {
									element[Dkey] = formObjectVal[Mkey];
								}
							})
						})
					}
					element.attachmentListLength = element.attachmentList.length;
				});
				msg = this.TRANSLATE_SER['ITEM_UP_SUCC'];
			}
			this.common.success(msg);
			this.resetForm();
			// this.primaryCurrency.historyCurrencyCode = "";
			if (butt !== 'addNext') {
				this.onClose();
			} else {
				this.addNext.emit('addNext');
			}
			if (this.buyerService.auctionData.auctionStatus.toLowerCase() == 'published') {
				this.popup.republishMessage();
			}
		}
	}

	newCustomFieldJson(customFieldList) {
		let tmp = []
		for (let x = 0; x < customFieldList.length; x++) {
			tmp.push({
				"name": customFieldList[x].fieldName,
				"value": this.createItemForm.value[customFieldList[x].fieldName],
				"customFieldID": customFieldList[x].customFieldID
			});
		}
		return tmp;
	}
	deleteCustomProperty(formObj, customFieldList) {
		for (let x = 0; x < this.customFieldList.length; x++) {
			if (formObj.hasOwnProperty(customFieldList[x].fieldName)) {
				delete formObj[customFieldList[x].fieldName];
			}
		}
	}

	addNextFromParentComp(obj) {
		this.resetForm(obj);
	}

	get f() { return this.createItemForm.controls; }

	setLotType(data) {
		this.createItemForm.patchValue({
			lotType: this.buyerService.lotList && this.buyerService.lotList.length > 0 ? this.buyerService.lotList.filter((res) => { return res.lotID === data })[0]['lotName'] : null
		});
	}
	setValue(obj) {
		this.createItemForm.controls.itemCode.setValue(obj ? obj.sapcode : '');
		this.createItemForm.controls.itemName.setValue(obj ? obj.nvchabbrevdesc : '');
		this.createItemForm.controls.description.setValue(obj ? obj.longdesc : '');
		this.createItemForm.controls.unitOfMeasure.setValue(obj ? obj.uomCode : '');
		this.createItemForm.controls.fromMMCS.setValue(obj ? obj.fromMMCS : false);
	}

	onMMCSnext() {
		this.showSearch = false;
		this.showItemForm = true;
		this.setValue(this.selectedVal[0]);
		this.onMMCSselect.emit({ val: this.selectedVal, final: true, showSelection: false });
		this.searchEnabled = false;
		this.onSearchEnabled.emit({ attachTabDisabled: false });
		// disable these fields for mmcs code.
		this.disableOnMMCS();
	}
	submitForm() {
		this.submited = true;
		let controls = this.createItemForm.controls;
		for (let key in controls) {
			if (controls.hasOwnProperty(key)) {
				// programatically validating the code.
				controls[key].markAsTouched();
				controls[key].updateValueAndValidity();
			}
		}
	}

	itemSearched(obj) {
		this.searchEnabled = obj.searchEnabled;
		this.onSearchEnabled.emit({ attachTabDisabled: true });
		if (obj.searchResult && obj.searchResult.length > 0) this.showItemForm = false;
		if (obj.selectedVal) {
			this.selectedVal = obj.selectedVal;
			this.onMMCSselect.emit({ val: this.selectedVal, final: false, showSelection: this.selectedVal.length > 0 ? true : false });
		}
	}

	get nextDisabled() {
		return this.selectedVal.length == 0 || this.showItemForm;
	}
	get saveDisabled() {
		let disabled = this.createItemForm.invalid || this.searchEnabled;
		return disabled;
	}
	get saveAndNextDisabled() {
		return this.createItemForm.invalid || this.searchEnabled;
	}
	get enableForm() {
		return this.showItemForm && !this.searchEnabled;
	} 

	setItemCode(itemCode) {
		if(itemCode.currentTarget.value != "") {
			this.haveItemCode = itemCode.currentTarget.value;
		} else {
			this.haveItemCode = "";
		}
	}

	onKeyUp(event) {
		this.mmcsCharacteristics = [];
		this.companyReferences = [];
		let formObjVal = this.createItemForm.getRawValue();
		if (!formObjVal.itemCode) return;
		this.buyerService.getMaterialDetails(formObjVal.itemCode).subscribe((res: any) => {
			if (res.success) {
				if (res.data.result.length == 0) {
					this.common.error('No MMCS data found');
					return;
				}
				let val = res.data.result[0];
				val.fromMMCS = true;
				this.mmcsCharacteristics = val.characteristics;
				this.companyReferences = val.companyReferences;
				this.mmcsLongDesc = val.longdesc;
				this.setValue(val);
				this.itemCodeSelected.emit(val);
				// disable these fields for mmcs code.
				this.disableOnMMCS();
			}
		})
	}

	disableOnMMCS() {
		setTimeout(() => {
			this.createItemForm.get('unitOfMeasure').disable();
			this.createItemForm.get('itemCode').disable();
			this.createItemForm.get('itemName').disable();
			this.createItemForm.get('description').disable();
			this.showSearch = false;
		}, 500);

	}

	reset() {
		this.showSearch = true;
		this.resetForm();
		this.resetAll.emit();
	}

	onAttachDocument(data) {
		try {
			if (data.length > 0) {
				this.openAttach.emit(data);
			}
			else {
				return this.common.error("Not uploaded any file")
			}

		} catch{}
	}


	onlyNumberKey(event) {
		const pattern = /[0-9\/\-\ ]/;  
		let inputChar = String.fromCharCode(event.keyCode);
	
		if (!pattern.test(inputChar)) {
		  // invalid character, prevent input
			 return false;
		}
	}
	ngOnDestroy() {
		this.componentActive = false;
	}
}
