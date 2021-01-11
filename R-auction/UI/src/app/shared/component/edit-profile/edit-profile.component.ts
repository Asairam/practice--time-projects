import { Component, OnInit } from '@angular/core';
import { CommonService } from '../../../commonService/common.service';
import { AuthService } from '../../../authService/auth.service';
import { environment } from '../../../../environments/environment';
import * as config from '../../../appConfig/app.config';
import { LoginService } from '../../../component/component-service/login.service';
import { BuyerEditService } from '../../../component/component-service/buyer-edit.service';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  headcoloum: any;
  imageURL = environment.rauction;
  objUserProfile = this.auth.getUserData();
  list_organization: any;
  user_org_description = null;
  mobileNumberEdit = false;
  constructor(public common: CommonService, public auth: AuthService, private buyerEditService: BuyerEditService, private loginService: LoginService) { }

  ngOnInit() {
    this.objUserProfile = this.auth.getUserData();
    this.common.translateSer('COMMON').subscribe(async (text: string) => {
      this.headcoloum = text;
    });
    if (this.auth.userRole() &&  !config.ROLE_ACCESS_CONTROL.both_supplier.includes(this.auth.userRole())) {
      this.getList();
    }
  }

  onClose() {
    let sendData;
    sendData = {
      flag: 'closeAttach',
      pageFrom: 'edit-profile'
    }
    this.common.toggleDiv.emit(sendData);
  }

  errorHandler(event) {
    event.target.src = this.imageURL + "assets/images/profile-2.svg";
  }

  getList() {
    try {
      new Promise((resolve, reject) => {
        this.buyerEditService.getOrganisationList().subscribe((res: any) => {
          this.list_organization = res.data;
          resolve();
        }, err => {
          reject();
          this.common.error(err);
        });
      }).then(() => {
        let selectedOrg = this.list_organization.filter(obj => {
          return obj._id === this.objUserProfile['org'];
        });
        this.user_org_description = selectedOrg && selectedOrg.length > 0 ? selectedOrg[0].description : null;
      });
    } catch (e) { }
  }

  editDetails() {
    this.mobileNumberEdit = true;
  }

  saveUserDetails() {
    this.loginService.updateUserDetails(this.objUserProfile).subscribe((res: any) => {
      let val = this.auth.getUserData();
      val.mobile = this.objUserProfile.mobile;
      this.auth.saveUserData(val);
      this.common.success('Record saved successfully');
      this.mobileNumberEdit = false;
    }, err => {
      this.common.error(err);
    });
  }
}
