import { Component, OnInit, Input, Output, EventEmitter, ViewChild, OnDestroy } from '@angular/core';
import { BuyerEditService } from 'src/app/component/component-service/buyer-edit.service';
import { CommonService } from 'src/app/commonService/common.service';
import { ActivatedRoute } from '@angular/router';
import * as configure from '../../../../appConfig/app.config';
import { MatDialog, MatDialogConfig } from '@angular/material';
import { ViewPopupComponent } from 'src/app/shared/component/view-popup/view-popup.component';
import { ParticipantMailPopupComponent } from '../particpant/participant-mail-popup/participant-mail-popup.component';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromEditModule from '../state/editmodule.reducer';
import { takeWhile } from 'rxjs/operators';
import { ParticipantService } from './participant.service';
@Component({
  selector: 'SUPPLIER-CARD-HOLDER',
  templateUrl: './particpant.component.html',
  styleUrls: ['./particpant.component.css']
})
export class ParticpantComponent implements OnInit, OnDestroy {
  preExcelDowButt: boolean = false;
  participantAdditionOn: boolean = false;
  auctionReadOnly: boolean = false;
  componentActive: boolean = true;

  searchParDetails = new Subject<string>();
  // @Output() publishEvent = new EventEmitter<boolean>();
  @Output() openPreBid = new EventEmitter<boolean>();
  @Output() mailTemplate = new EventEmitter<any>();
  auctionID: any;
  supplierDetails = [];
  supplierSource = [];
  lengthSupplier: any;
  role = null;
  IsHidden1: any;
  searchSupplierValue: any = 0;
  contactFlag = [];
  crud = configure.crudOpe;
  allchecked = false;
  searchSupplierFrom = configure.SEARCH_SUPPLIERFROM;
  config: any = configure.SWIPER_SLIDER;
  searchName: any;
  userSourceSupplier = [];
  loadStatus = false;
  supplierButt: any;
  aucStatus = this.route.snapshot.queryParamMap.get('status') ? this.route.snapshot.queryParamMap.get('status').toLowerCase() : null;
  isRegistered: boolean = true;
  translateSer: string;
  errorFlag: boolean;
  prelimianryData = [];
  dataExistsSupplier: boolean = false;
  supplierMailBody: any;
  preCrud = configure.crudPreBid;
  searchHere = configure.participantSearch.register;
  bidData = null;
  supplierFilter = configure.filterParticipant;
  selectedValue = configure.filterParticipant[0]["value"];
  sorting = false;
  selectContact = null;
  commonheader;
  selectSearch = configure.SEARCH_SUPPLIERFROM[0]["name"];

  constructor(
    private MatDialog: MatDialog,
    public buyerService: BuyerEditService,
    public common: CommonService,
    private route: ActivatedRoute,
    private store: Store<fromEditModule.EditModuleState>,
    public participantservice: ParticipantService
  ) {

    this.common.translateSer('PARTICIPANT_TAB').subscribe(async (text: string) => {
      this.translateSer = text;
    });
    this.common.translateSer('COMMON').subscribe(async (text: string) => {
      this.commonheader = text;
    });
    this.buyerService.vendorNewaddData.subscribe(async (data: any) => {
      if (data.flag) {
        this.selectContact.firstname = data.supplierData.contact.name.firstname;
        this.selectContact.lastname = data.supplierData.contact.name.lastname;
        this.selectContact.useremail1 = data.supplierData.contact.email;
        this.selectContact.mobileno = data.supplierData.contact.mobile;
        this.sameEmailValidate(data);
      }
      else {
        this.getNewVendorData(data)
      }
    });
    this.buyerService.bidCalculator.subscribe(async (data: any) => {
      // debugger;
      this.bidData = data;
      if (this.bidData) {
        if (Object.keys(this.bidData).length > 0) {
          this.supplierDetails.forEach((element) => {
            if (element.supplierID === data.supplierID) {
              element.supplierAF = (this.bidData.addFactor) ? this.bidData.addFactor : ((element.supplierAF) ? element.supplierAF : 0);
              element.supplierMF = (this.bidData.mulFactor) ? this.bidData.mulFactor : ((element.supplierMF) ? element.supplierMF : 0);
              element.supplierCurrency = {
                currencyCode: this.bidData.currency.currencyCode,
                currencyName: this.bidData.currency.currencyName
              }
              return false;
            }
          })
        }
        this.saveParticpantDetails();
      }
    });
    this.searchParDetails.pipe(
      debounceTime(1000),
      distinctUntilChanged())
      .subscribe(value => {
        if (value.length >= 3) {
          this.onSearchClick();
        }
      });
  }

  ngOnInit() {
    this.store.pipe(select(fromEditModule.getAuctionReadOnly), takeWhile(() => this.componentActive))
      .subscribe(auctionReadOnly => {
        this.auctionReadOnly = auctionReadOnly;
      });
    this.store.pipe(select(fromEditModule.getAuctionDetails),
      takeWhile(() => this.componentActive)).subscribe((auctionDetails: any) => {
        this.participantAdditionOn = auctionDetails.participantAdditionOn;
      });

    if (this.buyerService.auctionData.auctionID)
      this.getSupplierDetails();
    this.checkStatus();
  }
  checkStatus() {
    if (!this.aucStatus || this.aucStatus === 'draft' || this.aucStatus === 'published') {
      this.supplierButt = true;
    } else {
      this.supplierButt = false;
    }
  }
  getSupplierDetails() {
    this.buyerService.getSupplierDetails(this.buyerService.auctionData.auctionID).subscribe((res) => {
      this.supplierDetails = res["data"] ? res["data"].supplierList : [];
      this.buyerService.supplierMail = res["data"] ? res["data"].body : "";
      this.buyerService.supplierEmail = res["data"] ? (res["data"].cc ? res["data"].cc : []) : [];
      if (this.buyerService.supplierEmail.length > 0) {
        this.buyerService.supplierEmail = this.buyerService.supplierEmail.map(x => { return { value: x } });
      }
      this.buyerService.participantDetails = this.supplierDetails;
      // this.dataExistsSupplier = (this.supplierDetails.length > 0) ? true : false;
      if (this.supplierDetails.length > 0) {
        this.dataExistsSupplier = true;
      } else {
        this.dataExistsSupplier = false;
      }
      this.getPreliminaryBids();
      this.role = this.buyerService.auctionData.type == configure.AUC_TYPE[0]["value"] ? 'customer' : 'vendor';
      this.searchSupplierFrom = configure.SEARCH_SUPPLIERFROM.filter(x => x.role == this.role || x.role == "both");
      this.selectSearch = this.searchSupplierFrom[0]["name"];
      this.searchSupplierValue = this.searchSupplierFrom[0]["ID"];
      this.clearSearch();
    }, (err) => {

    })

  }

  onSearchClick() {
    try {
      if (this.searchName.length >= 3) {
        this.loadStatus = true;
        this.common.loader = false;
        if (this.searchSupplierValue == 0) {
          this.getSupp(this.searchName.trim());
        }
        else if (this.searchSupplierValue == 1) {
          this.getUnregisterSupplier(this.searchName.trim());
        }
        else {
          this.getCustomerData(this.searchName.trim());
        }

      }
      else {
        this.tableSupplier([]);
      }
    }
    catch (e) {
      this.common.error(e);
    }
  }

  getSupp(displayName) {
    let obj =
    {
      'vendorcodeval': displayName,
      'usernameval': displayName,
      'contactpersonname': displayName,
      'contactpersonemail': displayName,
      'activity': configure.ACTIVITY_STATUS
    }
    this.buyerService.getVendorList(obj).subscribe((res: any) => {
      this.userSourceSupplier = res;
      if (this.userSourceSupplier.length > 0) {
        this.userSourceSupplier.forEach(element => {
          let vendorData = this.supplierDetails.filter(obj => obj.supplierID == element.vendorcode);
          let address = [];
          if (element["user_name3"]) {
            address.push(element["user_name3"]);
          }
          if (element["user_name4"]) {
            address.push(element["user_name4"]);
          }
          if (element["street"]) {
            address.push(element["street"]);
          }
          if (element["city"] || element["pincode"]) {
            if (element["city"] && element["pincode"])
              address.push(element["city"] + "-" + element["pincode"]);
            else
              address.push(element["city"] ? element["city"] : element["pincode"]);
          }
          if (element["district"]) {
            address.push(element["district"]);
          }
          if (element["region"]) {
            address.push(element["region"]);
          }
          if (element["country"]) {
            address.push(element["country"]);
          }
          element.address = ""
          address.forEach((data, index) => {
            element.address += (data + ((address.length != index + 1) ? "," : ""));
          })
          element.openToggle = false;
          element.flag = false;
          element.isNewVendor = false;
          element.contactPerson.forEach(contact => {
            contact.role = "vendor";
            if (vendorData.length > 0) {
              element.flag = true;
              contact.flag = (vendorData[0].contactperson.filter(obj => obj.firstname.toLowerCase().trim() == contact.firstname.toLowerCase().trim() &&
                obj.lastname.toLowerCase().trim() == contact.lastname.toLowerCase().trim()).length > 0) ? true : false;
            }
            else {
              contact.flag = false
            }
          });
        });
      }
      this.tableSupplier(this.userSourceSupplier);
      this.loadStatus = false;
      this.common.loader = true;
      // setTimeout(() => { 
      //   if(!this.IsHidden1){
      //   window.scroll(0,window.scrollY+25);
      //   }
      //   else{
      //     window.scroll(0,window.scrollY-25);
      //   }
      //  }, 0);
    })

  }

  getUnregisterSupplier(displayName) {
    let role = (this.role == this.translateSer["ROLE_CUSTOMER"]) ? this.translateSer["ROLE_CUSTOMER"] : this.translateSer["ROLE_SUPPLIER"];
    let apiParam = `{%22isRegistered%22:%22false%22,%22roles.role%22:%22${role}%22,%22$or%22:[{%22email%22:{%22$regex%22:%22${displayName}%22,%22$options%22:%22$i%22}},{%22name.firstname%22:{%22$regex%22:%22${displayName}%22,%22$options%22:%22$i%22}},{%22setting.ril.vendorcodeSelected%22:{%22$regex%22:%22${displayName}%22,%22$options%22:%22$i%22}}]}`;
    this.buyerService.getUnregisterVendorList(`${apiParam}`).subscribe((res: any) => {
      res.data.forEach(element => {
        let vendorCode = (role == this.translateSer["ROLE_CUSTOMER"]) ? element.settings.ril.customerCode[0] : element.settings.ril.vendorcode[0];
        element.contactPerson = [{
          firstname: element.name.firstname,
          lastname: element.name.lastname,
          mobileno: element.mobile,
          useremail1: element.email,
          vendorcode: vendorCode,
          vendorfullname: element.name.firstname + ' ' + element.name.lastname,
          cpId: "01"
        }],

          element.vendorcode = vendorCode;
        element.useremail1 = element.email;
        element.isNewVendor = true;
        if (this.buyerService.auctionData.type.toLowerCase() == 'forward') {
          if (element.settings.ril && element.settings.ril.additionalInfo && element.settings.ril.additionalInfo.customerName) {
            element.user_name1 = element.settings.ril.additionalInfo.customerName;
          } else {
            element.user_name1 = element.contactPerson[0].vendorfullname;
          }
          // element.user_name1 = (element.settings.ril.additionalInfo) ? element.settings.ril.additionalInfo.customerName : element.contactPerson[0].vendorfullname;
        } else {
          if (element.settings.ril && element.settings.ril.additionalInfo && element.settings.ril.additionalInfo.supplierName) {
            element.user_name1 = element.settings.ril.additionalInfo.supplierName;
          } else {
            element.user_name1 = element.contactPerson[0].vendorfullname;
          }
          // element.user_name1 = (element.settings.ril.additionalInfo) ? element.settings.ril.additionalInfo.supplierName : element.contactPerson[0].vendorfullname;
        }
      });
      this.userSourceSupplier = res.data;
      this.loadStatus = false;
      if (this.userSourceSupplier.length > 0) {
        this.userSourceSupplier.forEach(element => {
          let vendorData = this.supplierDetails.filter(obj => obj.supplierID == element.vendorcode);
          element.openToggle = false;
          element.flag = false;
          element.contactPerson.forEach(contact => {
            contact.role = "vendor";
            if (vendorData.length > 0) {
              element.flag = true;
              contact.flag = (vendorData[0].contactperson.filter(obj => obj.firstname.toLowerCase().trim() == contact.firstname.toLowerCase().trim() &&
                obj.lastname.toLowerCase().trim() == contact.lastname.toLowerCase().trim()).length > 0) ? true : false;
            }
            else {
              contact.flag = false
            }
          });
        });
      }
      this.tableSupplier(this.userSourceSupplier);
      this.loadStatus = false;
      this.common.loader = true;
      // setTimeout(()=>  window.scroll(0,window.scrollY+25),0);
    }, error => { });
  }

  getCustomerData(displayName) {
    let obj = {
      "customercodeval": displayName,
      "usernameval": displayName,
      "contactpersonname": displayName,
      "contactpersonemail": displayName
    }
    this.buyerService.getCustomerList(obj).subscribe((res: any) => {
      res['data'].forEach(element => {
        element.contactPerson.forEach(elements => {
          elements.vendorfullname = elements.fullName;
          elements.vendorcode = elements.customerCode;
          elements.firstname = elements.firstName;
          elements.lastname = elements.lastName;
          elements.useremail1 = elements.email;
          elements.cpId = "01";
          delete elements.customerCode;
        });
        element.contactPerson.unshift({   // add company details to contact person
          'firstname': element.user_name1,
          'useremail1': element.email,
          'lastname': '',
          'companyDetails': true
        });
        element.vendorcode = element.customerCode;
        element.useremail1 = element.email;
        element.user_name1 = (element.user_name1) ? element.user_name1 : "No Name";
        element.address = '';
        delete element.customerCode;
      });
      this.userSourceSupplier = res['data'];
      if (this.userSourceSupplier.length > 0) {
        this.userSourceSupplier.forEach(element => {
          let vendorData = this.supplierDetails.filter(obj => obj.supplierID == element.vendorcode);
          element.openToggle = false;
          element.flag = false;
          element.isNewVendor = false;
          element.contactPerson.forEach(contact => {
            contact.role = this.translateSer["ROLE_CUSTOMER"];
            if (vendorData.length > 0) {
              element.flag = true;
              contact.flag = (vendorData[0].contactperson.filter(obj => obj.firstname.toLowerCase().trim() == contact.firstname.toLowerCase().trim() &&
                obj.lastname.toLowerCase().trim() == contact.lastname.toLowerCase().trim()).length > 0) ? true : false;
            }
            else {
              contact.flag = false
            }
          });
        });
      }
      this.tableSupplier(this.userSourceSupplier);
      this.loadStatus = false;
      //this.common.loader = true;
    })
  }

  tableSupplier(data) {
    this.supplierSource = data;
    this.lengthSupplier = data.length;
  }

  onRowSupplierAdd(data, contactdata) {
    try {
      let vendorData = this.supplierDetails.filter(x => x.supplierID == data.vendorcode);
      if (data.contactPerson.length == 0) {
        this.common.error(this.translateSer["NO_CONTACT"]);
        return false;
      } else if (vendorData.length > 0 && vendorData[0]['status'].toLowerCase() == 'suspended') {
        this.common.error(data.user_name1 + ' has been suspended.');
        return false;
      }

      if (contactdata) {
        contactdata = new Object(contactdata);
        if (this.buyerService.auctionData.auctionStatus == configure.AUCTIONSTATUS.PB) {
          contactdata.mailStatus = true;
        }
      }
      else {
        if (this.buyerService.auctionData.auctionStatus == configure.AUCTIONSTATUS.PB) {
          data.contactPerson.forEach(element => {
            element.mailStatus = true;
          });
        }
      }

      
      if (vendorData.length == 0) {
        this.supplierDetails.push(
          {
            supplierID: data.vendorcode,
            supplierName1: (!this.isRegistered) ? data.settings.ril.additionalInfo.supplierName : data.user_name1,
            supplierName2: data.user_name2,
            supplierAdd1: data.user_name3,
            supplierAdd2: data.user_name4,
            supplierStreet: data.street,
            supplierLocation: data.city,
            supplierPincode: data.pincode,
            supplierCountry: data.country,
            supplierState: data.region,
            supplierTelephoneNo1: '',
            supplierTelephoneNo2: '',
            supplierContactPerson: '',
            supplierEmailId: data["email"] ? data.email.toString() : '',
            supplierRegAdd2: '',
            supplierRegAdd3: '',
            supplierMobileNo: '',
            supplierGstNo: '',
            supplierBillingState: '',
            isNewVendor: data.isNewVendor,
            contactperson: (!contactdata) ? Array.from(data.contactPerson) : [contactdata]
          });

        if (!contactdata) {
          data.contactPerson.forEach(contact => {
            contact.flag = true;
          });
        }
        else {
          contactdata.flag = true;
        }
      }
      else {
        if (!contactdata) {
          data.contactPerson.forEach(contact => {
            if (!(vendorData[0].contactperson.some(x => x.cpId == contact.cpId))) {
              vendorData[0].contactperson.push(contact);
              contact.flag = true;
            }
          });
        }
        else {
          vendorData[0].contactperson.push(contactdata);
          contactdata.flag = true;

        }
      }
      data.flag = data.contactPerson.some(x => x.flag)
      data.addflag = data.contactPerson.every(x => x.flag);
      this.sameEmailValidate(data);

      this.common.success((contactdata) ? this.translateSer['ADD_CONTACT_SUPPLIER'] : this.translateSer['ADD_SUPPLIER']);

    }
    catch (ex) {
      this.common.error(ex);
    }
  }

  onRowSupplierDelete(data, contactData, i, flag = null, icontact = null) {
    try {
      if (flag == "search") {
        if (this.participantAdditionOn) return;
        const index = this.supplierDetails.findIndex(obj => obj.supplierID == data.vendorcode);
        if (contactData) {
          let supplierData = this.supplierDetails.filter(obj => obj.supplierID == data.vendorcode)[0];
          contactData.flag = false;
          const indexContact = supplierData.contactperson.findIndex(obj => obj.cpId == contactData.cpId);
          if (supplierData.contactperson.length == 1)
            this.supplierDetails.splice(index, 1);
          else
            supplierData.contactperson.splice(indexContact, 1);


          this.common.success(this.translateSer['CONTACT_DATA_DELETE']);
        }
        else {
          this.supplierDetails.splice(index, 1);
          data.contactPerson.forEach(contact => {
            contact.flag = false;
          });

          this.common.success(this.translateSer['SUPPLIER_DELETE']);
        }
        data.flag = data.contactPerson.some(x => x.flag)
        data.addflag = data.contactPerson.every(x => x.flag);
      }
      else {
        const index = this.supplierDetails.findIndex(obj => obj.supplierID == data.supplierID);
        let searchData = this.supplierSource.filter(obj => obj.vendorcode == data.supplierID);
        if (contactData) {
          if (data.contactperson.length == 1)
            this.supplierDetails.splice(index, 1);
          else
            data.contactperson.splice(i, 1);

          if (searchData.length > 0) {
            let supplierContact = searchData[0].contactPerson.filter(x => x.cpId == contactData.cpId);
            supplierContact[0].flag = false;
          }
          this.common.success(this.translateSer['CONTACT_DATA_DELETE']);

        }
        else {
          this.supplierDetails.splice(index, 1);
          if (searchData.length > 0) {
            searchData[0].flag = false;
            searchData[0].contactPerson.forEach(element => {
              element.flag = false;
            });

          }
          this.common.success(this.translateSer['SUPPLIER_DELETE']);
        }
        if (searchData.length > 0) {

          searchData[0].flag = searchData[0].contactPerson.some(x => x.flag)
          searchData[0].addflag = searchData[0].contactPerson.every(x => x.flag);
        }
      }
      this.sameEmailValidate(data);
      this.buyerService.participantDetails = this.supplierDetails;
    }
    catch (ex) {
      this.common.error(ex);
    }
  }


  fetchContactPerson() {
    let tmp = [];
    this.supplierDetails.forEach((element, i) => {
      if (element.supplierID) {
        if (element.contactperson.some(x => x.role == this.translateSer["ROLE_CUSTOMER"]) && element.supplierEmailId) {
          let data = element.contactperson.find(x => x.useremail1 == element.supplierEmailId);
          tmp.push({
            useremail1: element.supplierEmailId,
            vendorcode: element.supplierID,
            role: this.translateSer["ROLE_CUSTOMER"],
            mobileno: data && data["mobileno"] ? data.mobileno : element.supplierMobileNo,
            firstname: data && data["firstname"] ? data.firstname : element.supplierName1,
            lastname: data && data.lastname ? data.lastname : "",
          });
        }
        element.contactperson.forEach(obj => {
          if (!(tmp.some(x => x.useremail1.toLowerCase().trim() == obj.useremail1.toLowerCase().trim()))) {
            tmp.push(obj);
          }
        });
      }
    });
    return tmp;
  }

  generateToolTipForSupplier(res, contactPersonList) {
    let objData = [];
    res.forEach((element, index) => {
      let objEmailData = element.data;
      if (objEmailData) {
        //objEmailData.settings.ril.vendorcode= objEmailData.settings.ril.vendorcode?objEmailData.settings.ril.vendorcode:objEmailData.settings.ril.customerCode;   
        if ((objEmailData.roles) ? (objEmailData.roles.length > 0) : false) {
          let roleData = objEmailData.roles.filter(x => x.role.toLowerCase().trim() == this.translateSer["ROLE_SUPPLIER"]
            || x.role.toLowerCase().trim() == this.translateSer["ROLE_CUSTOMER"])[0];
          if (roleData) {
            if (!(objEmailData.settings.ril.vendorcode.includes(contactPersonList[index].vendorcode))) {
              //  this.errorFlag = true;
              // contactPersonList[index].toolTip = this.translateSer["EMAIL_MAP"] + objEmailData.settings.ril.vendorcode;
              objData.push({ data: contactPersonList[index], update: true })
            }
            else {
              contactPersonList[index].toolTip = "";
            }
          }
          else {
            // this.errorFlag = true;
            // contactPersonList[index].toolTip = this.translateSer["ROLE_CHECK"];
            objData.push({ data: contactPersonList[index], update: true })
          }
        }
        else {
          // this.errorFlag = true;
          // contactPersonList[index].toolTip = this.translateSer["ROLE_CHECK"];
          objData.push({ data: contactPersonList[index], update: true })
        }
      }
      else {
        //  this.errorFlag = true;
        // contactPersonList[index].toolTip = this.translateSer["EMAIL_NOT_EXISTS"];
        objData.push({ data: contactPersonList[index], update: false })
      }
    });

    if (!this.errorFlag) {
      res.forEach((element, index) => {
        let objEmailData = element.data;
        if (objEmailData) {
          contactPersonList[index].roles = "";
          if (objEmailData.roles.length > 0) {
            if (objEmailData.settings.ril.vendorcode.includes(contactPersonList[index].vendorcode)) {
              contactPersonList[index].roles = objEmailData.roles;
            }
          }
        }
      })
    }
    return objData;
  }

  populateContactFlag() {
    this.supplierDetails.forEach((element, i) => {
      delete element._id;
      delete element.status;
      delete element.flag;
      delete element.checked;
      delete element.errorFlag;
      //delete element.isNewVendor;
      let bid = this.prelimianryData.length > 0 ? this.prelimianryData.filter(x => x.bidderID == element.supplierID) : [];
      element.supplierEmailId = element.contactperson[0].useremail1;
      element.supplierAF = (element.supplierAF) ? element.supplierAF : (bid.length > 0) ? bid[0].supplierAF : 0;
      element.supplierMF = (element.supplierMF) ? element.supplierMF : (bid.length > 0) ? bid[0].supplierMF : 0;
      element.supplierCurrency = (element.supplierCurrency) ? element.supplierCurrency : (bid.length > 0) ? bid[0].currency : {
        currencyCode: this.buyerService.auctionData.primaryCurrency.currencyCode,
        currencyName: this.buyerService.auctionData.primaryCurrency.currencyName
      };

      element.contactperson.forEach(obj => {
        if (obj.flag) {
          this.contactFlag.push({
            firstname: obj.firstname,
            lastname: obj.lastname,
            vendorcode: obj.vendorcode
          })
        }
        delete obj.flag;
        delete obj._id;
      })
    });
  }

  getSupplierList() {
    return this.supplierDetails;
  }

  confirmMailTemplate() {
    return new Promise((resolve, reject) => {
      const objMatDialogConfig = new MatDialogConfig();
      objMatDialogConfig.panelClass = 'dialog-lg';
      objMatDialogConfig.data = {
        dialogMessage: 'Supplier Mail Template',
        tab: 'mail-template',
        data: { 'supplier': true, auctionID: this.buyerService.auctionData.auctionID }
      }
      objMatDialogConfig.disableClose = true;
      let refMatDialog = this.MatDialog.open(ViewPopupComponent, objMatDialogConfig);
      refMatDialog.afterClosed().subscribe((value) => {
        if (value) {
          this.common.success("Confirm supplier mail template successfully")
          resolve();
        }
        else {
          this.common.error("Auction cannot published/republished successfully because you have not confirm the mail template of suppliers.");
          reject();
        }
      });
    })
  }

  saveParticpantDetails(isPublish = false) {
    return new Promise((resolve, reject) => {
      let objData = [];
      if (this.supplierDetails.some(x => x["errorFlag"])) {
        reject(new Error(this.translateSer["CHECK_ERROR"]));
        return;
      }
      let contactPersonList = this.fetchContactPerson();
      this.errorFlag = false;
      if (contactPersonList && contactPersonList.length > 0 && isPublish) {
        this.buyerService.getSuppliersByEmailId(contactPersonList).subscribe((res: any) => {
          if (res.length > 0) {
            objData = this.generateToolTipForSupplier(res, contactPersonList);
            if (this.errorFlag) {
              this.common.error(this.translateSer["CHECK_ERROR"]);
              return false;
            }
          }
          this.populateContactFlag();
          this.saveUnregisterEmail(objData).then(result => {
            return this.saveSuppliers();
          }, (err) => {
            reject(new Error("Unable to save participants."))
          }).then((result) => {
            resolve();
          })
        }, (err) => {
          reject(new Error("Unable to save participants."))
        })
      } else {
        this.populateContactFlag();
        this.saveSuppliers().then((result) => {
          resolve();
        }, (err) => {
          reject(new Error("Unable to save participants."))
        });
      }
    });
  }

  saveUnregisterEmail = (objData) => {
    return new Promise((resolve, reject) => {
      if (objData.length > 0) {
        let obj = [];
        objData.forEach(emaildata => {
          let element = emaildata.data;
          obj.push({
            type: element.role,
            code: element.vendorcode,
            supplierName: this.supplierDetails.find(x => x.supplierID == element.vendorcode)["supplierName1"],
            email: element.useremail1,
            mobile: element.mobileno.toString(),
            name: {
              firstname: element.firstname ? element.firstname : "No Name",
              lastname: element.lastname ? element.lastname : "",
            }
          });
        });
        this.buyerService.registerNewVendor(obj).subscribe((res) => {
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

  saveSuppliers() {
    return new Promise((resolve, reject) => {
      this.saveSupplierDetail().then(result => {
        resolve();
      })
        .catch(err => {
          reject(new Error("Unable to save participants."));
        })
    })
  }

  saveSupplierDetail() {

    let mailBody;
    if (this.aucStatus == 'open') {
      mailBody = this.buyerService.defaultSupplierMail();
    } else {
      mailBody = this.buyerService.supplierMail ? this.buyerService.supplierMail : this.buyerService.supplierMailBody();;
    }

    let supplierDetail = {
      auctionID: this.buyerService.auctionData.auctionID,
      body: mailBody,
      supplierList: this.supplierDetails,
      cc: this.buyerService.supplierEmail.map(x => x["value"])
    }
    let preData = [];
    let supplierVendor = this.supplierDetails.map(x => { return x.supplierID });
    if (this.prelimianryData.length > 0) {
      let preVendor = this.prelimianryData.map(x => { return x.bidderID })
      preData = preVendor.filter(val => !supplierVendor.includes(val)).filter((v, i, a) => a.indexOf(v) === i);
    }
    let prelimianryBid = {
      auctionID: this.buyerService.auctionData.auctionID,
      supplierID: preData,
      itemID: []
    }
    if (this.buyerService.itemDetails && this.buyerService.itemDetails.length > 0) {
      this.buyerService.itemDetails.forEach(element => {
        prelimianryBid.itemID.push(element.itemID)
      });
    }
    console.log(this.buyerService.itemDetails)
    if (!this.dataExistsSupplier) {
      return this.saveSupp(supplierDetail, preData, prelimianryBid);
    } else {
      return this.updateSupp(supplierDetail, preData, prelimianryBid);
    }
  }

  saveSupp(supplierDetail, preData, prelimianryBid) {
    return new Promise((resolve, reject) => {
      this.buyerService.insertSupplierData(supplierDetail).subscribe((res: any) => {
        this.supplierDetails.forEach(supplier => {
          supplier.contactperson.forEach(contact => {
            contact.flag = (this.contactFlag.filter(x => x.firstname.toLowerCase().trim() == contact.firstname.toLowerCase().trim() && x.lastname.toLowerCase().trim() == contact.lastname.toLowerCase().trim()).length > 0) ? true : false;
          });
        })
        if (res.success) {
          this.buyerService.participantDetails = Array.from(this.supplierDetails);
          this.dataExistsSupplier = true;
          if (preData.length > 0) {
            this.deletPreliminaryBids(prelimianryBid);
          } else {
            this.getSupplierDetails();
          }
          resolve()
        } else {
          reject(new Error("Participant details not saved."))
        }
      }, (err: any) => {
        this.common.loader = false;
        reject(new Error("Participant details not saved."));
      })
    })

  }

  updateSupp(supplierDetail, preData, prelimianryBid) {
    return new Promise((resolve, reject) => {
      this.buyerService.updateSupplierData(supplierDetail, this.participantAdditionOn).subscribe((res: any) => {
        this.supplierDetails.forEach(supplier => {
          supplier.contactperson.forEach(contact => {
            contact.flag = (this.contactFlag.filter(x => x.firstname.toLowerCase().trim() == contact.firstname.toLowerCase().trim() && x.lastname.toLowerCase().trim() == contact.lastname.toLowerCase().trim()).length > 0) ? true : false;
          });
        })
        if (res.success) {
          this.buyerService.participantDetails = Array.from(this.supplierDetails);

          if (preData.length > 0) {
            this.deletPreliminaryBids(prelimianryBid);
          } else {
            this.getSupplierDetails();
          }
          resolve();
        } else {
          reject(new Error("Participant details not updated."));
        }
      }, (err: any) => {
        this.common.loader = false;
        reject(new Error("Participant details not updated."));
      })
    })

  }

  getPreliminaryBids() {
    this.buyerService.getPreliminaryBidById(this.buyerService.auctionData.auctionID).subscribe((res: any) => {
      this.prelimianryData = res.data;

    })
  }

  deletPreliminaryBids(prelimianryBid) {
    this.buyerService.deletePreliminaryBid(prelimianryBid).subscribe((res: any) => {
      this.getPreliminaryBids();
      this.getSupplierDetails();
    })
  }
  vendorCreation() {
    let sendData = {
      flag: 'openAttach',
      pageFrom: 'newvendor',
      data: { 'type': 'create' },
      auctionID: this.buyerService.auctionData.auctionID
    }
    this.common.toggleDiv.emit(sendData);
    console.log(sendData);
  }

  vendorModification(supplier, data) {
    this.selectContact = data;
    let sendData = {
      flag: 'openAttach',
      pageFrom: 'existvendor',
      data: { 'type': 'modify', 'contactData': { supplier: supplier, contact: data } },
      auctionID: this.buyerService.auctionData.auctionID
    }
    this.common.toggleDiv.emit(sendData);
    console.log(sendData);
  }

  mailBodyOpen() {
    let sendData = {
      flag: 'openAttach',
      pageFrom: 'mailTemplate',
      data: { 'supplier': true },
      auctionID: this.buyerService.auctionData.auctionID
    }
    this.mailTemplate.emit(sendData);
  }


  seleDrop(butt, item, index, supplier, indexSupplier) {
    if (butt.name.toLowerCase() === 'edit') {
      let sendData = {
        flag: 'openAttach',
        pageFrom: 'item',
        data: { 'type': 'update', data: item, itemInd: index, 'aucStatus': this.aucStatus },
        auctionID: this.buyerService.auctionData.auctionID
      }
      this.common.toggleDiv.emit(sendData);
    }
    else if (butt.name.toLowerCase() === 'preliminary bid') {
      if (this.buyerService.itemDetails.some(x => x.itemID)) {
        this.openPreBid.emit(supplier);
      }
      else {
        this.common.error("Add atleast one item and save it")
      }
    }
    else {
      try {
        this.onRowSupplierDelete(supplier, null, indexSupplier)
      }
      catch (ex) {

      }
    }
  }

  searchSupplier(data) {
    this.searchSupplierValue = data.ID;
    this.selectSearch = data.name;
    this.searchName = '';
    this.supplierSource = []
    this.searchHere = (data.ID == 0) ? configure.participantSearch.register : (data.ID == 1) ? configure.participantSearch.unRegister : configure.participantSearch.customer;
  }

  clearSearch() {
    try {
      this.searchName = "";
      this.supplierSource.length = 0;
    }
    catch (ex) {
      this.common.error(ex);
    }
  }

  showMobileNo() {
    var element = document.getElementsByClassName("supplier-table");
    console.log(element);
    for (let index = 0; index < element.length; index++) {
      element[index].classList.toggle("show-mob-no");
    }

  }

  sameEmailValidate(data) {
    let vendorCode = data["supplierData"] ? data["supplierData"]["supplierID"] : data["supplierID"] ? data.supplierID : data.vendorcode;
    let vendorData = this.supplierDetails.find(x => x.supplierID == vendorCode);
    if (vendorData) {
      vendorData.contactperson.forEach(element => {
        element.toolTip = "";
      });
      let listMail = vendorData.contactperson.map(x => { return x.useremail1.toLowerCase() });
      let duplicateMail = listMail.filter((v, i, a) => a.indexOf(v.toLowerCase()) != i);
      if (duplicateMail.length > 0) {
        vendorData.errorFlag = true;
        duplicateMail.forEach((email) => {
          let emailData = vendorData.contactperson.filter(x => x.useremail1.toLowerCase().trim() == email.toLowerCase().trim());
          emailData.forEach(element => {
            element.toolTip = "Same mail ID for more than one contact persons are not allowed.";
          });
        })
        // if (flag == 'add')
        //    this.common.error(this.translateSer["CHECK_ERROR"]);
        //    return true;
      }
      else {
        vendorData.errorFlag = false;
      }
    }
    // else {
    //   vendorData.errorFlag = false;
    // }
  }

  getNewVendorData(data) {
    console.log(data);
    let passData = {
      vendorcode: data.code,
      user_name1: data.supplierName ? data.supplierName : data.name.firstname + ' ' + data.name.lastname,
      isNewVendor: true,
      isRegistered: false,
      contactPerson: {
        activity: '',
        firstname: data.name.firstname,
        lastname: data.name.lastname,
        mobileno: data.mobile,
        useremail1: data.email,
        vendorcode: data.code,
        vendorfullname: data.name.firstname + ' ' + data.name.lastname,
        role: this.role,
        cpId: "01"
      }
    }
    this.onRowSupplierAdd(passData, passData.contactPerson)
  }


  onAddClick(el: HTMLElement) {
    if (this.auctionReadOnly) return;
    this.IsHidden1 = !this.IsHidden1;
    el.scrollIntoView();
    this.searchHere = configure.participantSearch.register;
    this.searchName = "";
    this.supplierSource.length = 0;
    this.showsearchname();
    setTimeout(() => {
      if (this.IsHidden1) {
        window.scroll(0, window.scrollY + 100);
      }
      else {
        window.scroll(0, window.scrollY - 100);
      }
    }, 0)
  }

  get auctionStatus() {
    return this.buyerService.auctionData.auctionStatus;
  }

  participantSorting(sort = 0) {
    let selectedField = this.supplierFilter.find(x => x.value == this.selectedValue);
    if (selectedField.id) {
      if (sort < 2) {
        this.sorting = (sort == 0) ? false : true;
      }
      configure.sorting(this.supplierDetails, selectedField.id, this.sorting ? 'descending' : 'ascending');
      this.buyerService.participantDetails = this.supplierDetails;
    }
  }
  selectCheckbox(eve, sele, ind) {
    if (sele === 'all') {
      this.supplierDetails.forEach(element => {
        element.checked = eve;
      });
    } else {
      this.supplierDetails[ind]['checked'] = eve;
    }
  }

  selectDelete() {
    if (this.supplierDetails.some(obj => { return obj.checked })) {
      try {
        const objMatDialogConfig = new MatDialogConfig();
        objMatDialogConfig.panelClass = 'dialog-xs';
        objMatDialogConfig.data = {
          dialogMessage: this.commonheader['PLZ_CON'],
          dialogContent: 'Are you sure you want to delete participant.',
          tab: 'confirm_msg',
          dialogPositiveBtn: "Yes",
          dialogNegativeBtn: "No"
        }
        objMatDialogConfig.disableClose = true;
        let refMatDialog = this.MatDialog.open(ViewPopupComponent, objMatDialogConfig);
        refMatDialog.afterClosed().subscribe((value) => {
          if (value) {
            for (var i = 0; i < this.supplierDetails.length; i++) {
              if (this.supplierDetails[i]['checked']) {
                this.onRowSupplierDelete(this.supplierDetails[i], null, i);
                i--;
              }
            }
            this.common.success("Participant " + this.commonheader['DELE_SUCC']);
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

  supplierExportAsXLSX(name) {
    this.preExcelDowButt = true;
    const myArray = this.supplierDetails.filter(x => x.status);
    if(myArray.length == 0){
    this.common.error("Add atleast one vendor and save it");
    this.preExcelDowButt = false;
    return false;
    }
    const newArray = myArray.map(element =>{ 
      if(element.supplierName1 && element['supplierCurrency']){
          return element.supplierName1 + ' ('+element['supplierCurrency']['currencyCode']+')';
        } else {
          return element.supplierName1 + ' ('+this.buyerService.auctionData.primaryCurrency.currencyCode+')';
        }
    });
    let arrData = [];
    this.buyerService.itemDetails.filter(x => x.itemID).forEach((element,i) => {
      let obj = {
        "S.No": (i+1),
        "Lot": element.lotType,
        "Item Name": element.itemName,
        "Item Code": element.itemCode,
        "Reliance Quantity": element.minimumDesiredQuantity,
        "Unit Of Measure": element.unitOfMeasure
      }
      for (let par of newArray) {
        obj[par] = null;
      }
      arrData.push(obj);
    });
    let headerarr = ['S.No','Lot', 'Item Name', 'Item Code', 'Reliance Quantity', 'Unit Of Measure'].concat(newArray);
    this.participantservice.supplierExportAsExcelFile(arrData, name+'_'+this.buyerService.auctionData.auctionID, headerarr).then(result => {
      this.common.success(this.translateSer['EXCEL_DOWN_SU']);
      this.preExcelDowButt = false;
    }).catch(err => { });
  }

  incomingfilePri(event, name) {
		let extensionValid1 = this.participantservice.checkPriliminaryFileExtAndName(event);
		if (!extensionValid1) {
			this.common.error(this.translateSer['FILE_NOT_V']);
			return;
    }
    this.participantservice.fileUpload(event,this.buyerService.auctionData.auctionID).then(result => {
      console.log(result)
      this.buyerService.uploadPreliminaryExcel(result,this.buyerService.auctionData.auctionID).subscribe((res: any) => {
        this.common.success('Preliminary data successfully uploaded.');
        this.getPreliminaryBids();
      });
    }).catch(err => {
      this.common.warning(err);
    });
    event.target.value = '';
  }
  showsearchname() {
    this.role = this.buyerService.auctionData.type == configure.AUC_TYPE[0]["value"] ? 'customer' : 'vendor';
    this.searchSupplierFrom = configure.SEARCH_SUPPLIERFROM.filter(x => x.role == this.role || x.role == "both");
    this.selectSearch = this.searchSupplierFrom[0]["name"];
    this.searchSupplierValue = this.searchSupplierFrom[0]["ID"];
  }
}
