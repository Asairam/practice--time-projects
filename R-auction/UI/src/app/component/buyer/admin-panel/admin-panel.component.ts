import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BuyerEditService } from '../../component-service/buyer-edit.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CommonService } from '../../../commonService/common.service';
import * as fromAppModule from '../../../state/app.reducer';
import { takeWhile } from 'rxjs/operators';
import { Store, select } from '@ngrx/store';
import { AuthService } from '../../../authService/auth.service';



@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.scss']
})
export class AdminPanelComponent implements OnInit {

  constructor(private fb: FormBuilder, private buyerservice: BuyerEditService, public common: CommonService, private auth: AuthService,
    private store: Store<fromAppModule.AppModuleState>) { 
      this.common.translateSer('COMMON').subscribe(async (text: string) => {
        this.translateSerCommon = text;
      });
    }
  translateSerCommon:any;
  public settings: any;
  componentActive2: boolean = true;
  showDel = false;
  public feature: object; //new FormBuilder();
  public list_organization: any;
  public admin_settings: any;
  public orgIds = [];
  public orgName: any;
  isItAdmin = false;
  uData:any;
  isAdmin = true;
  ngOnInit() {
    this.common.getConfigDetails();
    var orgId = JSON.parse(localStorage.getItem("userdata")).org;
    this.getOrgListById(orgId);
    this.getOrgSetting();
    this.getAuthUser();
  }

  
  getAuthUser() {
    this.uData = this.auth.getUserData();
    if(this.uData.roles.length > 0) {
      var itAdmin = this.uData.roles.filter(item => { 
        return item.role == "rauction-it-admin";
      });

      if(itAdmin.length>0) {
        this.isItAdmin = true;
      } else {
        this.isItAdmin = false;
      }
      var admin = this.uData.roles.filter(item => { 
        return item.role == "admin";
      });

      if(admin.length>0) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
    }
  }

  getOrgSetting() {
    this.settings = this.fb.group({
      features: this.fb.group({
        suspendSupplier: false,
        takeLead: false,
        cumulativeTotal: false,
        sealedBid: false,
        participantLive: false,
        currency: false,
        testAuction:false,
        cumulativeReport: false
      })
    })
    this.store.pipe(select(fromAppModule.getAuctionConfigOnly), takeWhile(() => this.componentActive2))
      .subscribe(auctioncon => {
        if (auctioncon && auctioncon.features) {
          delete auctioncon.features.topRankOnly;
          this.admin_settings = auctioncon;
          this.settings = this.fb.group({
            features: this.fb.group(this.admin_settings.features)
          });
        }
      })
  }

  getOrgListById(orgId) {
    this.buyerservice.getOrganisationListForAdmin(orgId).subscribe((res: any) => {
      this.list_organization = res.data;
      if (this.list_organization && this.list_organization.length > 0) {
        this.orgName = this.list_organization.find(org => org._id === orgId);
        this.list_organization.forEach(org => {
          this.orgIds.push(org._id);
        });
      }
    });
  }

  changeSettingConfig(settingData, type) {
    // var obj = {features:this.admin_settings.features};
    // var features = settingData.value.features;
    // if(type == "rules") {
    //   obj.features["cumulativeTotal"] = features.cumulativeTotal;
    // } else {
    //   obj.features["suspendSupplier"] = features.suspendSupplier;
    //   obj.features["takeLead"] = features.takeLead;
    //   obj.features["sealedBid"] = features.sealedBid;
    //   obj.features["participantLive"] = features.participantLive;
    //   obj.features["currency"] = features.currency
    // }
    // obj["orgID"] = this.orgIds;
    let feobj = settingData.value;
    feobj["orgID"] = this.orgIds;
    this.buyerservice.saveSettingForAdmin(feobj).subscribe((res: any) => {
      if (res["success"]) {
        this.common.getConfigDetails();
        this.common.success('Admin panel settings has been updated');
      }
    });
  }

}
