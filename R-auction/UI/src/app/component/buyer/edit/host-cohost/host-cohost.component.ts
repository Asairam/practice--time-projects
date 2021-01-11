import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { BuyerEditService } from 'src/app/component/component-service/buyer-edit.service';
import { LoginService } from '../../../component-service/login.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CommonService } from '../../../../commonService/common.service';
import { CommonPopupComponent } from 'src/app/shared/component/common-popup/common-popup.component';
import { AuthService } from '../../../../authService/auth.service';
import * as config from '../../../../appConfig/app.config';
import { ActivatedRoute } from '@angular/router';
import { ViewPopupComponent } from 'src/app/shared/component/view-popup/view-popup.component';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { Subject } from 'rxjs';
import * as api from '../../../../../environments/environment';
import { HostCohostMailPopupComponent } from './host-cohost-mail-popup/host-cohost-mail-popup.component';
import { FormControl } from '@angular/forms';
/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromEditModule from '../state/editmodule.reducer';
import { takeWhile } from 'rxjs/operators';

@Component({
	selector: 'HOST-COHOST-CARD-HOLDER',
	templateUrl: './host-cohost.component.html',
	styleUrls: ['./host-cohost.component.css']
})
export class HostCohostComponent implements OnInit, OnDestroy {

	auctionReadOnly: boolean = false;
	componentActive: boolean = true;
	@Output() mailTemplate = new EventEmitter<any>();
	@Input() orgList = null;
	viewlist = "card";
	commonheader: any;
	auctionID: any;
	searchName = '';
	translateSer: any;
	IsHidden1: any;
	loadStatus = false;
	userSourceSupplier = [];
	coHostDetails = [];
	hostSource = [];
	dataExistsHost = false;
	hostFilter = config.filterHost;
	selectedValue = config.filterHost[0]["value"];
	sorting = false;
	allchecked = false;
	imageURL = api.environment.rauction;
	aucStatus = this.route.snapshot.queryParamMap.get('status') ? this.route.snapshot.queryParamMap.get('status').toLowerCase() : null;
	config: any = config.SWIPER_SLIDER;
	hostMailBody: any;
	userQuestionUpdate = new Subject<string>();
	constructor(
		public buyerService: BuyerEditService,
		private loginservice: LoginService,
		private MatDialog: MatDialog,
		public common: CommonService,
		private authService: AuthService,
		private route: ActivatedRoute,
		private store: Store<fromEditModule.EditModuleState>
		) {
		this.userQuestionUpdate.pipe(debounceTime(1000),distinctUntilChanged())
		.subscribe(value => {
			if (value.length >= 3) {
				this.searchLdapUser(value);
			}
		});
	}

	ngOnInit() {
		this.store.pipe(select(fromEditModule.getAuctionReadOnly),takeWhile(() => this.componentActive) )
		.subscribe(auctionReadOnly => {
			this.auctionReadOnly = auctionReadOnly;
		});
		this.common.translateSer('ITEM_MSG').subscribe(async (text: string) => {
			this.translateSer = text;
		});
		if (this.buyerService.auctionData.auctionID) {
			this.getHost();
		}

		this.common.translateSer('COMMON').subscribe(async (text: string) => {
			this.commonheader = text;
		});

	}

	updateHostList(data) {
		data.org = data["org"] ? data.org : "";
		//data.error=data.org?false:true;
		data.orgList = JSON.parse(JSON.stringify(this.orgList));
		data.orgListCopy = JSON.parse(JSON.stringify(this.orgList));
	}

	filterBanks(value, data) {
		if (value) {
			data.orgList = data.orgListCopy.filter(
				item => item.name.toLowerCase().indexOf(value.toLowerCase()) > -1
			);
		}
		else {
			data.orgList = data.orgListCopy;
		}
	}

	changeOrg(data) {
		if (!(data["org"])) {
			data.error = true;
		}
		else {
			data.error = false;
		}
	}

	getHost() {
		this.buyerService.getHostData(this.buyerService.auctionData.auctionID).subscribe((res: any) => {
			if (res.data && res.data.hostInvites) {
				this.coHostDetails = res.data.hostInvites;
				this.buyerService.hostMail = res["data"] ? res["data"].body : "";
				this.buyerService.hostEmail = res["data"] ? (res["data"].cc ? res["data"].cc : []) : [];
				if (this.buyerService.hostEmail.length > 0) {
					this.buyerService.hostEmail = this.buyerService.hostEmail.map(x => { return { value: x } });
				}

				this.coHostDetails.forEach(data => {
					this.emailVali(data.employeeMail).then(result => {
						data.orgDrop = data.org ? true : result;
						data.org = result ? '' : data.org;
					});
					this.updateHostList(data);
				})
			}
		})
	}
	onTextHost(value) {
		// this.loadStatusHost = true;
		setTimeout(() => {
			if (value.length >= 3) {
				this.searchLdapUser(value);
			}
			else {
				// this.tableHost([]);
			}
		}, 1000)

	}

	clearSearch() {
		this.searchName = '';
		this.hostSource = [];
	}

	searchLdapUser(value) {
		this.common.loader = false;
		this.loadStatus = true;
		let domainId = '{"displayName":' + '"' + value + '"';
		let loggedInUser = this.authService.getUserData();
		this.loginservice.ldapuser(domainId).subscribe((res: any) => {
			this.loadStatus = false;
			if (res.success) {
				// remove logged in user and user with no domain id if any in array.
				this.hostSource = res.data.filter(element => element.domainId && element.email !== loggedInUser.email);
				window.scroll(0, window.scrollY + 120);
				this.plusMinusInHostSource();
				this.common.loader = true;
			}
		});
	}	

	onAddButtonClick() {
		if(this.auctionReadOnly) return;
		this.IsHidden1 = !this.IsHidden1;
		setTimeout(() => {
			if (this.IsHidden1) {
				window.scroll(0, window.scrollY + 120);
			}
		}, 0);
	}

	addHost(event, hostObj) {
		event.stopPropagation();
		this.buyerService.getSupplierByEmailId(hostObj.email).subscribe((res: any) => {
			if (res.success) {
				this.openpopup(hostObj, res);
			}
		});
	}

	emailVali(email) {
		return new Promise((resolve, reject) => {
			try {
				this.buyerService.getSupplierByEmailId(email).subscribe((res: any) => {
					if (res.success) {
						resolve(res.data ? false : true);
					}
				});
			}
			catch (ex) { }
		})
	}

	deleteCoHost(hostObj) {
		const objMatDialogConfig = new MatDialogConfig();
		objMatDialogConfig.data = {
			dialogMessage: this.translateSer['REMOVE_ITEM'] + hostObj.employeeName,
			tab: 'confirmmsg',
			dialogPositiveBtn: "Yes",
			dialogNegativeBtn: "No"
		}
		objMatDialogConfig.disableClose = true;
		let refMatDialog = this.MatDialog.open(CommonPopupComponent, objMatDialogConfig);
		refMatDialog.afterClosed().subscribe((value) => {
			if (value) {
				this.coHostDetails = this.coHostDetails.filter((element) => element.employeeMail !== hostObj.employeeMail);
				this.plusMinusInHostSource();
			}
			this.buyerService.hostDetails = this.coHostDetails.slice(0);
		});
	}

	removeCoHost(event, hostObj) {
		event.stopPropagation();
		this.deleteCoHost(hostObj);
	}

	plusMinusInHostSource() {
		this.hostSource.forEach((element: any) => {
			let tmp = this.coHostDetails.find((element2) => {
				return element.email === element2.employeeMail
			})
			if (tmp) {
				element.isAdded = true;
			} else {
				element.isAdded = false;
			}
		})
	}


	openDetail(obj) {
		let domainId = '{"domainId":' + '"' + obj.domainId + '"';
		this.loginservice.ldapuser(domainId).subscribe((res: any) => {
			if (res.success) {
				let x = res.data[0];
				obj.details = {
					address: x['address'],
					company: x['company'],
					department: x['department'],
					displayName: x['displayName'],
					domainId: x['domainId'],
					email: x['email'],
					employeeID: x['employeeID'],
					mobile: x['mobile'],
					state: x['state'],
					telephone: x['telephone'],
					profilePic: x['profilePic']
				}
			}
		});
	}

	formatObjData(element, index) {
		return {
			type: 'host',
			code: this.coHostDetails[index].employeeID,
			supplierName: this.coHostDetails[index].employeeName,
			email: this.coHostDetails[index].employeeMail,
			mobile: this.coHostDetails[index].employeeMobileNo.toString(),
			name: {
				firstname: element ? element.name.firstname ? element.name.firstname
					: this.coHostDetails[index].employeeName : this.coHostDetails[index].employeeName,
				lastname: element ? element.name.lastname ? element.name.lastname : "" : ""
			},
			org: this.coHostDetails[index]["org"]
		}
	}

	saveUnregisterEmail = (objData) => {
		return new Promise((resolve, reject) => {
			if (objData.length > 0) {
				objData = objData.map(x => x.data);
				this.buyerService.registerNewVendor(objData).subscribe((res) => {
					if (res["success"]) {
						resolve();
					}
				}, err => {
					reject(err);
				})
			}
			else {
				resolve();
			}
		})
	}

	validateEmail(res) {
		let objData = [];
		res.forEach((element, index) => {
			let objEmailData = element.data;
			if (objEmailData) {
				if ((objEmailData.roles) ? (objEmailData.roles.length > 0) : false) {
					let roleData = objEmailData.roles.find(x => x.role.toLowerCase().trim() == "buyer");
					if (!roleData) {
						objData.push({ data: this.formatObjData(objEmailData, index), update: true });
					}
				}
				else {
					objData.push({ data: this.formatObjData(objEmailData, index), update: true });
				}
			}
			else {
				objData.push({ data: this.formatObjData(objEmailData, index), update: false });
			}

		});
		return objData;
	}

	emailValidation(isPublish, hostList) {
		let objData = [];
		return new Promise((resolve, reject) => {
			try {
				if (isPublish) {
					let emails = hostList.map(x => x.employeeMail);
					this.buyerService.getHostsByEmailId(emails).subscribe((res: any) => {
						if (res.length > 0) {
							objData = this.validateEmail(res);
							resolve(objData);
						}
					})
				}
				else {
					resolve(objData);
				}
			}
			catch (ex) {
				reject("Unable to save Co-Host");
			}
		})
	}

	validateHostOrg(isPublish) {
		if (isPublish) {
			if (this.coHostDetails && this.coHostDetails.length > 0) {
				this.coHostDetails.forEach((element) => {
					if (element.org) {
						element.error = false;
					}
					else {
						if (element.orgDrop) {
							element.error = true;
						}
					}
				});
				if (this.coHostDetails.some(x => x.error)) {
					return true;
				}
				else {
					return false;
				}
			}
			else {
				return false;
			}
		}
	}

	saveHostDetails(isPublish = false) {
		return new Promise((resolve, reject) => {

			if (this.coHostDetails.length > 0 && isPublish) {
				this.emailValidation(isPublish, this.coHostDetails).then(result => {
					return this.saveUnregisterEmail(result);
				}).then(result => {
					return this.saveHostData();
				}).then((hosts = []) => {
					resolve(hosts);
				})
			}
			else {
				this.saveHostData().then((hosts = []) => {
					resolve(hosts);
				})
			}

		})
	}

	saveHostData() {
		let hostList = [];
		let hostDetails = JSON.parse(JSON.stringify(this.coHostDetails));
		if (hostDetails.length > 0) {
			hostDetails.forEach((element) => {
				const { error, orgList, orgListCopy, checked, orgDrop, ...noA } = element;
				hostList.push(noA);
			});
		}
		return new Promise((resolve, reject) => {
			let hostDetail = {
				auctionID: this.buyerService.auctionData.auctionID,
				body: (this.buyerService.hostMail) ? this.buyerService.hostMail : this.buyerService.hostMailBody(),
				hostInvites: hostList,
				cc: this.buyerService.hostEmail.map(x => x["value"])
			}
			this.buyerService.insertHostData(hostDetail).subscribe((res: any) => {
				if (res.success) {
					this.dataExistsHost = true;
					resolve(hostDetail.hostInvites);
				}
			}, (err: any) => {
				reject(err);
			})
		})
	}

	get auctionStatus() {
		return this.buyerService.auctionData.auctionStatus;
	}

	mailBodyOpen() {
		let sendData = {
			flag: 'openAttach',
			pageFrom: 'mailTemplate',
			data: { 'supplier': false },
			auctionID: this.buyerService.auctionData.auctionID
		}
		
		this.mailTemplate.emit(sendData);
	}

	confirmMailTemplate() {
		return new Promise((resolve, reject) => {
			const objMatDialogConfig = new MatDialogConfig();
			objMatDialogConfig.panelClass = 'dialog-lg';
			objMatDialogConfig.data = {
				dialogMessage: 'Host/Co-Host Mail Template',
				tab: 'mail-template',
				data: { 'supplier': false, auctionID: this.buyerService.auctionData.auctionID }
			}
			objMatDialogConfig.disableClose = true;
			let refMatDialog = this.MatDialog.open(ViewPopupComponent, objMatDialogConfig);
			refMatDialog.afterClosed().subscribe((value) => {
				if (value) {
					this.common.success("Confirm host/co-host mail template successfully")
					resolve();
				}
				else {
					this.common.error("Auction cannot published/republished successfully because you have not confirm the mail template of hosts/co-hosts.");
					reject();
				}
			});
		})
	}

	hostSorting(sort = 0) {
		let selectedField = this.hostFilter.find(x => x.value == this.selectedValue);
		if (selectedField.id) {
			if (sort < 2) {
				if (sort == 0) {
					this.sorting = false;
				} else {
					this.sorting = true;
				}
			}
			config.sorting(this.coHostDetails, selectedField.id, this.sorting ? 'descending' : 'ascending');
		}
	}
	createcard(view) {
		this.viewlist = view;
	}

	selectCheckbox(eve, sele, ind) {
		if (sele === 'all') {
			this.coHostDetails.forEach(element => {
				element.checked = eve;
			});
		} else {
			this.coHostDetails[ind]['checked'] = eve;
		}
	}

	selectDelete() {
		if (this.coHostDetails.some(obj => { return obj.checked })) {
			try {
				const objMatDialogConfig = new MatDialogConfig();
				objMatDialogConfig.panelClass = 'dialog-xs';
				objMatDialogConfig.data = {
					dialogMessage: this.commonheader['PLZ_CON'],
					dialogContent: 'Are you sure you want to delete Co-Host.',
					tab: 'confirm_msg',
					dialogPositiveBtn: "Yes",
					dialogNegativeBtn: "No"
				}
				objMatDialogConfig.disableClose = true;
				let refMatDialog = this.MatDialog.open(ViewPopupComponent, objMatDialogConfig);
				refMatDialog.afterClosed().subscribe((value) => {
					if (value) {
						for (var i = 0; i < this.coHostDetails.length; i++) {
							if (this.coHostDetails[i]['checked']) {
								this.coHostDetails = this.coHostDetails.filter((element) => element.employeeMail !== this.coHostDetails[i]['employeeMail']);
								i--;
							}
						}
						this.plusMinusInHostSource();
						this.buyerService.hostDetails = this.coHostDetails.slice(0);
						this.common.success("Co-Host " + this.commonheader['DELE_SUCC']);
						this.allchecked = false;
					}
				});
			} catch (e) { }
		} else {
			this.allchecked = false;
			this.common.warning("Not checked");
		}
	}

	errorHandler(event) {
		event.target.src = this.imageURL + "assets/images/profile-2.svg";
	}


	getCohostList() {
		return this.coHostDetails;
	}

	openpopup(hostObj, res) {
		const objMatDialogConfig = new MatDialogConfig();
		objMatDialogConfig.panelClass = 'dialog-md';
		objMatDialogConfig.data = {
			dialogMessage: this.commonheader['PLZ_CON'],
			dialogContent: this.translateSer['ADD_HOST'],
			tab: 'confirm_msg',
			dialogPositiveBtn: "Yes",
			dialogNegativeBtn: "No"
		}
		objMatDialogConfig.disableClose = true;
		let refMatDialog = this.MatDialog.open(ViewPopupComponent, objMatDialogConfig);
		refMatDialog.afterClosed().subscribe((value) => {
			console.log(hostObj, this.coHostDetails)
			if (value) {
				let obj = {
					employeeName: hostObj.displayName,
					employeeID: hostObj.employeeID,
					status: config.AUCTIONSTATUS.IN,
					employeeMail: hostObj.email,
					employeeMobileNo: hostObj.mobile ? hostObj.mobile : '',
					orgDrop: !res.data ? true : false
				};
				this.updateHostList(obj);
				this.coHostDetails.push(obj);
				this.plusMinusInHostSource();
				this.buyerService.hostDetails = this.coHostDetails.slice(0);
			}
		});
	}

	ngOnDestroy() {
		this.componentActive = false;
	}

}
