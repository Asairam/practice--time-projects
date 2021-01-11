import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BuyerEditService } from '../../component-service/buyer-edit.service';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/commonService/common.service';
import * as config from '../../../../app/appConfig/app.config';
import * as routerconfig from '../../../appConfig/router.config';
import { BasicinfoComponent } from '../edit/basicinfo/basicinfo.component';
import { ItemsComponent } from '../edit/items/items.component';
import { ParticpantComponent } from '../edit/particpant/particpant.component';
import { HostCohostComponent } from '../edit/host-cohost/host-cohost.component';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { AuthService } from '../../../authService/auth.service';
import { ViewPopupComponent } from 'src/app/shared/component/view-popup/view-popup.component';
import { EditService } from './edit.service';
import { PublishConfirmationComponent } from './publish-confirmation/publish-confirmation.component';
import { PreliminarybidsCopy20200830Component } from './particpant/preliminarybids/preliminarybids-copy-20200830.component';

/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromEditModule from './state/editmodule.reducer';
import * as editModuleActions from './state/editmodule.actions';
import { takeWhile } from 'rxjs/operators';
import * as fromAppModule from '../../../state/app.reducer';
import { RoundsAuctionService } from './basicinfo/rounds-auction/rounds-auction.service';

@Component({
	selector: 'app-edit',
	templateUrl: './edit.component.html',
	styleUrls: ['./edit.component.css']
})
export class EditComponent implements OnInit, OnDestroy {
	roundList = [];
	roundsAuction = this.route.snapshot.queryParamMap.get('roundsAuc') ? true : false;
	ifSealedBid: boolean = false;
	componentActive: boolean = true;
	auctionReadOnly: boolean = false;
	participantAdditionOn: boolean = false;

	@ViewChild(BasicinfoComponent) basic: BasicinfoComponent;
	@ViewChild(ItemsComponent) item: ItemsComponent;
	@ViewChild(ParticpantComponent) supplier: ParticpantComponent;
	@ViewChild(HostCohostComponent) host: HostCohostComponent;

	customFieldList: any = [];
	orgList = null;
	routeLoc = window.location.pathname;
	aucStatus: string;
	translateSer: string;
	translateStatus: string;
	supplierSer: string;
	translateCommon: string;
	printData: string;
	prelimianryData: any;
	templateAuction = this.route.snapshot.queryParamMap.get('template')
	listTemplate: any;
	listTemplateCopy: any;
	remark = null;

	constructor(
		private matDialog: MatDialog,
		private location: Location,
		private routes: Router,
		private route: ActivatedRoute,
		public buyerService: BuyerEditService,
		public common: CommonService,
		private Config: AuthService,
		private editService: EditService,
		private MatDialog: MatDialog,
		private store: Store<fromEditModule.EditModuleState>,
		private appstore: Store<fromAppModule.AppModuleState>,
		private roundsAuctionService: RoundsAuctionService
	) { }

	ngOnInit() {
		this.common.getConfigDetails();

		this.pageAccess().then((result) => {
			this.appstore.pipe(select(fromAppModule.getAuctionConfigOnly), takeWhile(() => this.componentActive)).subscribe(auctionConfig => {
				if (auctionConfig && auctionConfig.features) {
					this.store.dispatch(new editModuleActions.SetParticipantAdditionForLiveAuction({
						participantLive: auctionConfig.features.participantLive,
						addParticipant: this.route.snapshot.queryParamMap.get('addParticipant') ? true : false
					}));
				}
			});
			this.store.pipe(select(fromEditModule.getAuctionReadOnly), takeWhile(() => this.componentActive)).subscribe(auctionReadOnly => {
				this.auctionReadOnly = auctionReadOnly;
			});
			this.store.pipe(select(fromEditModule.getSealedBidStatus), takeWhile(() => this.componentActive)).subscribe(auctionSealedBid => {
				this.ifSealedBid = auctionSealedBid;
			})
			this.store.pipe(select(fromEditModule.getAuctionStatus), takeWhile(() => this.componentActive)).subscribe(auctionStatus => {
				if (auctionStatus == 'suspended') {
					console.log('suspended');
				}
				if (auctionStatus == 'published') {
					console.log('published');
				}
				if (auctionStatus == 'paused') {
					console.log('paused');
				}
				if (auctionStatus == 'draft') {
					console.log('draft');
				}
				this.aucStatus = auctionStatus;

			});
			this.store.pipe(select(fromEditModule.getAuctionDetails),
				takeWhile(() => this.componentActive)).subscribe((auctionDetails: any) => {
					this.participantAdditionOn = auctionDetails.participantAdditionOn;
				});
			let id = this.route.snapshot.params.id;
			if (id) {
				this.buyerService.auctionData.auctionID = +id;
				this.editService.getStatus(id).then((result: string) => {
					// this.aucStatus = result['status'];
					this.buyerService.auctionData.type = result['type'];
				})
			} else {
				this.route.params.subscribe(params => {
					this.buyerService.auctionData.auctionID = params['id'] ? +params['id'] : null;
				});
			}
			this.getConstants();
			this.getAllTemplateData();
		});
	}

	getOrganization(data) {
		this.orgList = data;
	}

	getConstants() {
		this.common.translateSer('PUBLISH').subscribe(async (text: string) => {
			this.translateSer = text;
		});
		this.common.translateSer('STATUS_DETAILS').subscribe(async (text: string) => {
			this.translateStatus = text;
		});
		this.common.translateSer('PARTICIPANT_TAB').subscribe(async (text: string) => {
			this.supplierSer = text;
		});
		this.common.translateSer('COMMON').subscribe(async (text: string) => {
			this.translateCommon = text;
		});
	}

	newCustomList(val) {
		this.customFieldList = val;
	}

	loadStatus(value) {
		// this.common.loader = value;
	}

	publishAuction() {
		this.common.loader = true;
		if(this.roundsAuction && this.aucStatus == config.AUCTIONSTATUS.CO.toLowerCase()) {
			this.getRoundsAucDetails().then((res) => {
				if (this.roundList && this.roundList.length > 0 && this.roundList.find(obj=>!obj.status)) {
					let lastArrEle = this.roundList[(this.roundList.length - 1)];
					lastArrEle.startDate = new Date(lastArrEle.startDate);
					lastArrEle.endDate = new Date(lastArrEle.endDate);
					this.buyerService.mailAuctionData.startDate = lastArrEle.startDate;
					this.buyerService.mailAuctionData.endDate = lastArrEle.endDate;
					this.buyerService.mailAuctionData.opent = {
						hours: lastArrEle.startDate.getHours(),
						minutes: lastArrEle.startDate.getMinutes()
					  };
					  this.buyerService.mailAuctionData.endt = {
						hours: lastArrEle.endDate.getHours(),
						minutes: lastArrEle.endDate.getMinutes()
					  };
					  this.buyerService.roundName = lastArrEle.roundName;
					this.changeAuctionStatus();
				} else {
					window.scroll(0, 220)
					this.common.warning('Please create round.');
				}
			}).catch(err => {
				if (err) this.common.error(err.message);
			});
		} else {
			this.basic.triggerFullFormSubmit().then((result) => {
				console.log('publishAuction :: Step 1/11 Completed');
				return new Promise((resolve, reject) => {
					this.buyerService.itemDetails.length !== 0 ? resolve() : reject(new Error("Add Atleast One Item"));
				})
			})
				.then((result) => {
					console.log('publishAuction :: Step 2/11 Completed');
					return new Promise((resolve, reject) => {
						this.buyerService.participantDetails.length !== 0 ? resolve() : reject(new Error("Add Atleast One Supplier"));
					});
				})
				.then((result) => {
					console.log('publishAuction :: Step 3/11 Completed');
					return new Promise((resolve, reject) => {
						let flag = this.host.validateHostOrg(true);
						!flag ? resolve() : reject(new Error("Kindly see the error on organisation of co-host"));
					});
				})
				.then((result) => {
					console.log('publishAuction :: Step 4/11 Completed');
					return this.basic.saveAuctionDetails();
				})
				.then((result) => {
					console.log('publishAuction :: Step 5/11 Completed');
					return this.item.itemSub();
				})
				.then((result) => {
					console.log('publishAuction :: Step 6/11 Completed');
					return new Promise((resolve, reject) => {
						if (this.aucStatus && this.aucStatus.toLowerCase() == config.AUCTIONSTATUS.PB.toLowerCase()) {
							this.buyerService.supplierMailBody("NA");
							this.buyerService.hostMailBody("NA");
						}
						else {
							this.buyerService.supplierMailBody();
							this.buyerService.hostMailBody();
						}
						resolve();
					})
				})
				.then((result) => {
					console.log('publishAuction :: Step 7/11 Completed');
					return this.getParticipantAndCohostList();
				})
				.then((result) => {
					console.log('publishAuction :: Step 8/11 Completed');
					return this.supplier.saveParticpantDetails(true);
				})
				.then((result) => {
					console.log('publishAuction :: Step 9/11 Completed');
					return this.host.saveHostDetails(true);
				})
				.then((result) => {
					console.log('publishAuction :: Step 10/11 Completed');
					if (this.buyerService.remarkFlag)
						return this.postRemark();
				})
				.then((result) => {
					console.log('publishAuction :: Step 11/11 Completed');
					return this.changeAuctionStatus();
				})
				.then(result => {

				})
				.catch(err => {
					if (err) this.common.error(err.message);
					this.common.loader = false;
				})
		} 
		
	}

	postRemark() {
		return new Promise((resolve, reject) => {
			let objInfo = {
				"auctionID": this.buyerService.auctionData.auctionID,
				"remark": this.remark
			}
			this.buyerService.buyerRemark(objInfo).subscribe(res => {
				let userDtls = this.Config.getUserData();
				let auctionLeader = { email: userDtls.email, name: (userDtls.name.firstname + ' ' + userDtls.name.lastname) };
				if (this.remark) {
					this.basic.buyerRemarks = res["data"].sort((a, b) => { return (new Date(b.updatedAt).getTime()) - (new Date(a.updatedAt).getTime()) });
					this.basic.buyerRemarks = this.basic.buyerRemarks.map(x => ({ ...x, updatedUser: auctionLeader["name"] }));
				}

				this.buyerService.supplierMailBody(this.remark ? this.remark : "NA");
				this.buyerService.hostMailBody(this.remark ? this.remark : "NA");
				this.remark = null;
				this.buyerService.remarkFlag = false;
				resolve();
			}, err => reject(err));
		})
	}

	getParticipantAndCohostList(addLiveParticipant?) {
		return new Promise((resolve, reject) => {
			let suppliers = this.supplier.getSupplierList();
			let cohosts = this.host.getCohostList();

			if (this.aucStatus !== 'suspended' && this.aucStatus !== 'open') {
				suppliers.forEach(supplier => {
					supplier.selected = true;
				});
				cohosts.forEach(cohost => {
					cohost.selected = true;
				});
				resolve();
				return;
			}
			const objMatDialogConfig = new MatDialogConfig();
			objMatDialogConfig.panelClass = 'dialog-lg';
			objMatDialogConfig.data = {
				dialogMessage: !addLiveParticipant ? "Confirmation" : "Are you sure you want to add participant?",
				dialogContent: {
					suppliers: suppliers,
					cohosts: cohosts,
					remarks: { flag: this.buyerService.remarkFlag, data: { remark: this.remark, allRemarks: this.basic.buyerRemarks } },
					liveRemark: { flag: addLiveParticipant, data: { value: '' } },
					readOnly: this.aucStatus !== 'suspended'

				},
				dialogPositiveBtn: "Confirm"
			}
			objMatDialogConfig.disableClose = true;
			let refMatDialog = this.MatDialog.open(PublishConfirmationComponent, objMatDialogConfig);
			refMatDialog.afterClosed().subscribe((value) => {
				if (value && addLiveParticipant) {
					resolve({ supplierList: suppliers, value: value });
					return;
				}
				if (value) {
					this.remark = value["remark"] ? value["remark"] : "";
					resolve();
				}
			});

		})

	}

	changeAuctionStatus() {
		this.buyerService.supplierMail = String(this.buyerService.supplierMailBody());
		this.buyerService.hostMail = String(this.buyerService.hostMailBody());

		return new Promise((resolve, reject) => {
			let summaryData = {
				auctionID: this.buyerService.auctionData.auctionID,
				status: config.AUCTIONSTATUS.PB,
				supplierMailBody: this.buyerService.supplierMail,
				hostMailBody: this.buyerService.hostMail
			}

			this.buyerService.postPublishAuction(summaryData).subscribe((res: any) => {
				if (res.success) {
					if (this.aucStatus && this.aucStatus.toLowerCase() == 'published') {
						this.common.success(this.translateSer['REPUBLISH_DATA']);
					} else {
						this.common.success(this.translateSer['PUBLISH_DATA']);
					}
					this.store.dispatch(new editModuleActions.SetStatusAndRepublishRequired({
						republishRequired: false,
						status: config.AUCTIONSTATUS.PB.toLowerCase()
					}));
					this.aucStatus = config.AUCTIONSTATUS.PB.toLowerCase();
					this.buyerService.auctionData.auctionStatus = config.AUCTIONSTATUS.PB;
					// this.location.replaceState(`/${routerconfig.buyer_router_links.EDIT_AUCTION}/${this.buyerService.auctionData.auctionID}?status=${this.aucStatus}`);
					this.common.loader = false;
					this.routes.navigate([routerconfig.buyer_router_links.BUYER_LIST_VIEW], { queryParams: { status: 'Published' } });

					resolve(res);
				}
			}, (error: any) => {
				if (error && error.message) this.common.error(error.message);
				reject();
			});
		});
	}

	async saveAuctionData() {
		this.common.loader = true;
		let err = error => {
			if (error && error.message) setTimeout(() => this.common.error(error.message), 1000);
		}
		// Save BASIC
		await this.basic.saveAuctionDetails("bypassValidation").then(res => {
			this.buyerService.supplierMailBody();
			this.buyerService.hostMailBody();
			this.common.success(" Header Details  saved successfully.")

		}).catch(err);
		// Save ITEMS
		await this.item.itemSub().then(res => {

			if (this.buyerService.itemDetails.length > 0) {
				this.common.success("Items  saved successfully.")
			}
		}
		).catch(err);
		// Save SUPPLIER/PARTICIPANTS
		await this.supplier.saveParticpantDetails().then(res => {

			if (this.buyerService.participantDetails.length > 0) {
				this.common.success("Participants saved successfully.")
			}
		}
		).catch(err);
		// Save HOST
		await this.host.saveHostDetails().then((res: any) => {
			if (res.length > 0)
				this.common.success("Co-host  saved successfully.")
		}).catch(err);
		// Close loader
		setTimeout(() => this.common.loader = false, 2000);
	}

	saveAuctionDataOnPause() {
		const objMatDialogConfig = new MatDialogConfig();
		objMatDialogConfig.panelClass = 'dialog-sm';
		objMatDialogConfig.data = {
			dialogMessage: 'Please Confirm',
			dialogContent: 'Auction in paused state can only have following fields changed. <br>A) Bidding rules. <br>B) End date and time. <br>C) Minimum Bid Change & Start Price at item level. <br><br><span>NOTE: Any other changes will not be saved.</span>',
			tab: 'confirm_msg',
			dialogPositiveBtn: "Yes",
			dialogNegativeBtn: "No"
		}
		objMatDialogConfig.disableClose = true;
		let refMatDialog = this.matDialog.open(ViewPopupComponent, objMatDialogConfig);
		refMatDialog.afterClosed().subscribe((value) => {
			if (value) {
				// debugger;
				this.basic.dateFilter()
					.then(result => {
						return this.basic.saveBiddingRules();
					})
					.then(result => {
						return this.basic.saveScheduleData();
					}).then(res => {
						return
					})
					.then((res) => {
						return this.item.itemSub();
					})
					.catch(err => {
						this.common.error(err);
					})
			}
		})


	}



	preliminaryBidFunction(eventdata) {
		try {
			let basicFormObj = this.basic.basicForm.getRawValue();
			let auctionData = {
				decimalPlace: basicFormObj.decimalPlace,
				minBidChangeValue: basicFormObj.minBidChangeValue,
				minBidType: basicFormObj.minBidChangeType,
				currency: this.basic.saveCurrencyData,
				primaryCurrency: this.basic.basicForm.controls.primaryCurrency.value
			}
			this.openPreliminaryBid(eventdata, auctionData);
		}
		catch (ex) {
			this.common.error(ex);
		}
	}

	openPreliminaryBid(...args) {
		let baseAmount = (this.supplier.prelimianryData) ? this.supplier.prelimianryData.filter(x => args[0].supplierID == x.bidderID) : null;
		const objMatDialogConfig = new MatDialogConfig();
		objMatDialogConfig.panelClass = 'dialog-vlg';
		objMatDialogConfig.data = {
			dialogMessage: this.supplierSer['PRE_BID'],//+":" + args[0].supplierName1,
			dialogContent: { preBid: baseAmount, auctionData: args[1], supplier: args[0] },
			tab: 'preBidView',
			dialogPositiveBtn: !this.common.auctionLeader.host ? "Bid All" : "",
			dialogNegativeBtn: "Close"
		}
		objMatDialogConfig.disableClose = true;
		// let refMatDialog = this.matDialog.open(ViewPopupComponent, objMatDialogConfig);
		let refMatDialog = this.matDialog.open(PreliminarybidsCopy20200830Component, objMatDialogConfig);
		refMatDialog.afterClosed().subscribe((value) => {
			// debugger;
			this.supplier.getPreliminaryBids();
		})

	}

	goBack() {
		if (this.routeLoc === routerconfig.buyer_router_links.CREATE_AUCTION) {
			this.routes.navigate([routerconfig.buyer_router_links.BUYER_LIST_VIEW], { queryParams: { status: 'Draft' } });
		} else {
			window.history.back();
		}
	}
	openAuditLog() {
		const objMatDialogConfig = new MatDialogConfig();
		objMatDialogConfig.panelClass = 'dialog-vlg';
		objMatDialogConfig.data = {
			dialogMessage: "Audit Log",
			tab: 'audit-log',
			dialogNegativeBtn: "Close",
			auctionID: this.buyerService.auctionData.auctionID
		}
		objMatDialogConfig.disableClose = true;
		let refMatDialog = this.matDialog.open(ViewPopupComponent, objMatDialogConfig);
		refMatDialog.afterClosed().subscribe((value) => {
		})
	}

	get auctionID() {
		return this.buyerService.auctionData.auctionID;
	}

	downloadPDF() {
		let userDtls = this.Config.getUserData();
		let formData = this.basic.basicForm.getRawValue();
		let customeFields = [];

		let printViewObj = {
			basicInformation: {
				auctionName: formData.aucName,
				auctionID: formData.auctionID,
				auctionType: formData.aucType,
				company: formData.company,
				description: formData.description,
				rfqNo: this.basic.rfqNo
			},
			contactperson: {
				name: userDtls.name.firstname + ' ' + userDtls.name.lastname,
				email: userDtls.email ? userDtls.email : '',
				number: userDtls.mobile ? userDtls.mobile : ''
			},
			biddingRules: {
				extendauctionNewBid: formData.extensionType.value ? formData.extensionType.value : '',
				gracePeriod: formData.gracePeriod ? formData.gracePeriod * 60 : '',
				extentionTime: formData.extensionSeconds ? formData.extensionSeconds * 60 : '',
				minBidChange: formData.minBidChangeValue,
				bidCusionLimit: formData.bidCushionTypeLimit,
				minBidChangeType: formData.minBidChangeType,
				bidCushionTypeLimit: formData.bidCushionType,
				primaryCurrency: formData.primaryCurrency.currencyCode ? formData.primaryCurrency.currencyCode : '',
				biddingCurrency: this.basic.biddingCurrency.value ? this.basic.biddingCurrency.value : ''

			},
			shedule: {
				startDate: this.basic.basicForm.value.startDate ? this.basic.basicForm.value.startDate : '',
				endDate: this.basic.basicForm.value.endDate,
			},
			supplier: this.supplier.supplierDetails ? this.supplier.supplierDetails : '',
			host: this.host.coHostDetails ? this.host.coHostDetails : '',
			item: this.item,
			customField: this.customFieldList
		}
		//this.buyerService.downloadPDF.next(printViewObj);
		console.log("edit---field---", this.customFieldList);
		const objMatDialogConfig = new MatDialogConfig();
		objMatDialogConfig.panelClass = 'dialog-lg';
		objMatDialogConfig.data = {
			dialogMessage: "Print Preview",
			tab: 'Print-Preview',
			dialogNegativeBtn: "Close",
			data: printViewObj
		}
		objMatDialogConfig.disableClose = true;
		let refMatDialog = this.matDialog.open(ViewPopupComponent, objMatDialogConfig);
		refMatDialog.afterClosed().subscribe((value) => {
		})
	}
	getAllTemplateData() {
		this.buyerService.getAllTemplate().subscribe((res) => {
			if (res['success']) {
				console.log(res['data']);
				this.listTemplate = res['data'];
				this.listTemplateCopy = this.listTemplate;
				this.common.sortOn(this.listTemplate, "auctionName");
			}
		})
	}

	filterBanks(val) {
		this.listTemplate = this.listTemplateCopy;
		if (val) {
			this.listTemplate = this.listTemplateCopy.filter(
				item => item.auctionName.toLowerCase().indexOf(val.toLowerCase()) > -1
			);
		}
	}
	onTextClickData(data) {
		console.log(data)
		const objMatDialogConfig = new MatDialogConfig();
		objMatDialogConfig.panelClass = 'dialog-sm';
		objMatDialogConfig.data = {
			dialogMessage: 'Please Confirm',
			dialogContent: 'Are you sure you want to create Auction using this template then Enter Auction name and click yes',
			tab: 'template-confirm',
			dialogPositiveBtn: "Yes",
			dialogNegativeBtn: "No"
		}
		objMatDialogConfig.disableClose = true;
		let refMatDialog = this.matDialog.open(ViewPopupComponent, objMatDialogConfig);
		refMatDialog.afterClosed().subscribe((value) => {
			if (value) {
				console.log(value)
				let obj = {
					auctionID: data.value.auctionID,
					auctionName: value
				}
				this.buyerService.createAuctionUsingTemplate(obj).subscribe((res) => {
					if (res['success']) {
						this.routes.navigate([routerconfig.buyer_router_links.EDIT_AUCTION + '/', res['data'].auctionID], { queryParams: { status: 'Draft' } });
					}
				}, (error) => {
					this.common.error(error)
				})
			}
		});
	}

	mailTemplateOpen(event) {
		//Nikhil  when trying to open mail body  calls PUT method api's. In readonly mode this api call
		// suspends the auction. Hence donot call in readonly mode which is below code.
		if (this.auctionReadOnly) {
			this.showMailPopup(event);
			return;
		}

		this.common.loader = true;
		let err = error => {
			if (error && error.message) setTimeout(() => this.common.error(error.message), 1000);
		}
		Promise.all([this.basic.saveAucPart1(), this.basic.mailScheduleData()]).then(result => {
			this.showMailPopup(event);
		}).catch(err);
	}

	showMailPopup(event) {
		try {
			let sendData = {
				flag: event.flag,
				pageFrom: event.pageFrom,
				data: event.data,
				auctionID: this.buyerService.auctionData.auctionID
			}
			this.common.toggleDiv.emit(sendData);
		}
		catch (ex) {
			this.common.error(ex);
		}
	}

	auctionClose(type) {
		let msg = '';
		if (type == 'cancel') {
			msg = this.translateStatus['MSG_CAP_STA']['CANCEL'];
		} else {
			msg = this.translateStatus['MSG_CAP_STA']['DELETE'];
		}
		const objMatDialogConfig = new MatDialogConfig();
		objMatDialogConfig.panelClass = 'dialog-xs';
		objMatDialogConfig.data = {
			dialogMessage: "Please Confirm...",
			tab: 'confirm_msg',
			dialogContent: this.translateCommon['DO_U_W_T']['DO'] + msg + this.translateCommon['DO_U_W_T']['AUC'],
			dialogPositiveBtn: "Yes",
			dialogNegativeBtn: "No"
		}
		objMatDialogConfig.disableClose = true;
		let refMatDialog = this.matDialog.open(ViewPopupComponent, objMatDialogConfig);
		refMatDialog.afterClosed().subscribe((value) => {
			if (value) {
				if (type == 'cancel') {
					this.cancelAuc();
				} else {
					this.deleteAuc();
				}
			}
		})
	}

	cancelAuc() {
		this.buyerService.auctionDelete(this.auctionID).subscribe((res) => {
			if (res['success']) {
				this.common.success('Auction cancelled successfully.')
				this.aucStatus = config.AUCTIONSTATUS.CL.toLowerCase();
				this.buyerService.auctionData.auctionStatus = config.AUCTIONSTATUS.CL;
				this.store.dispatch(new editModuleActions.SetStatusAndRepublishRequired({
					republishRequired: false,
					status: config.AUCTIONSTATUS.CL.toLowerCase()
				}));
				this.location.replaceState(`/${routerconfig.buyer_router_links.EDIT_AUCTION}/${this.buyerService.auctionData.auctionID}?status=${this.aucStatus}`);
			}
		})
	}

	deleteAuc() {
		this.buyerService.auctionHardDelete(this.auctionID).subscribe((res) => {
			if (res['success']) {
				this.common.success('Auction deleted successfully.')
				this.routes.navigate([routerconfig.buyer_router_links.BUYER_DASHBOARD]);
			}
		})
	}

	saveParticipant() {

		this.buyerService.getSupplierDetails(this.buyerService.auctionData.auctionID).subscribe((res: any) => {
			let oldSupplier = [];
			res.data.supplierList.forEach(obj => {
				oldSupplier.push(obj.supplierID);
			});

			this.getParticipantAndCohostList(true).then((res: any) => {
				if (res) {
					this.addLiveRemarkToEachSupplier(res.supplierList, res.value.liveRemarkObj.data.value, oldSupplier);
					return this.supplier.saveParticpantDetails(true);
				}
			}).then(res => {
				console.log('Added participant in Live Auction');
			}).catch(err => {
				console.log('Failed :: participant in Live Auction');
			})
		})
	}

	addLiveRemarkToEachSupplier(suppliers, remarkValue, oldSupplierList) {
		suppliers.forEach(supObj => {
			if (oldSupplierList.indexOf(supObj.supplierID) < 0) {
				supObj.supplierLiveRemark = {
					"remark": remarkValue,
				}
			}
		});
	}

	ngOnDestroy() {
		this.store.dispatch(new editModuleActions.ClearEditModuleData(true));
		this.buyerService.auctionData.auctionID = null;
		this.buyerService.remarkFlag = false;
		this.buyerService.mailAuctionData = {
			auctionName: "",
			type: "",
			description: "",
			businessUnit: "",
			company_name: "",
			startDate: "",
			endDate: "",
			opent: {
				hours: null,
				minutes: null
			},
			endt: {
				hours: null,
				minutes: null
			}
		}
		this.buyerService.supplierEmail = [];
		this.buyerService.hostEmail = [];
		this.buyerService.supplierMail = "";
		this.buyerService.hostMail = "";
		this.common.refreshAuctionLeader();
		this.componentActive = false;
		this.buyerService.roundName = '';
	}
	onrou() {
		this.common.buyerRedirectLanding();
	}

	pageAccess() {
		return new Promise((resolve, reject) => {
			this.store.pipe(select(fromAppModule.getAuctionConfigOnly), takeWhile(() => this.componentActive))
				.subscribe(auctioncon => {
					if (auctioncon && auctioncon.features) {
						if (!auctioncon.features.sealedBid && this.route.snapshot.queryParams.mode && this.route.snapshot.queryParams.mode.toLowerCase() === 'sealedbid') {
							this.routes.navigate([routerconfig.buyer_router_links.BUYER_DASHBOARD]);
							reject();
						} else {
							resolve();
						}
					}
				});
		});
	}

	getRoundsAucDetails() {
		return new Promise((resolve, reject) => {
			this.roundsAuctionService.getRoundsAuctionData(this.buyerService.auctionData.auctionID).subscribe((res: any) => {
				this.roundList = res['data'];
				resolve();
			}, (err) => { reject() });
		});
	}
}
