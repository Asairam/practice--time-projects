import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl, ValidationErrors } from '@angular/forms';
import { CommonService } from '../../commonService/common.service';
import { BuyerEditService } from './../component-service/buyer-edit.service';
import { AuthService } from '../../authService/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {

  searchEmail: null;
  userDetails:any;
  loader = false;
  resetfield = false;
  roleArrStr = '';
  listOrganisation = [];
  resetForm: FormGroup;
  submit = false;
  resetButLoad = false;
  p_type = 'password';
  Cp_type = 'password';
  userData:any;
  isItAdmin = false;
  isAdmin = true;
  isBuyer = false;
  isSupplier = false;
  constructor(private buyerservice: BuyerEditService, public common: CommonService, private formBuilder: FormBuilder,private auths: AuthService,)
   { }

  ngOnInit() {
    this.form();
    // this.callOrg();
    this.getAuthUsers();
  }


  getAuthUsers() {
    this.userData = this.auths.getUserData();
    if(this.userData.roles.length > 0) {
      var itAdmin = this.userData.roles.filter(item => { 
        return item.role == "rauction-it-admin";
      });

      if(itAdmin.length>0) {
        this.isItAdmin = true;
      } else {
        this.isItAdmin = false;
      }
       var admin = this.userData.roles.filter(item => { 
        return item.role == "admin";
      });

      if(admin.length>0) {
        this.isAdmin = true;
      } else {
        this.isAdmin = false;
      }
      
    }
  }



  searchButt() {
    if (!this.searchEmail) {
      //this.toaster.warning("Please enter value..");
      return false;
    }
    else {
      this.loader = true;
      this.resetfield = false;
      this.roleArrStr = '';
      this.resetForm.reset();
      this.userDetails = {};
      this.submit = false;
      this.common.resetpwdEmailValidation(this.searchEmail).subscribe((res: any) => {
        this.userDetails = res['data'];
        if (!res['data']) {
          this.common.warning("No Records Found..");
        } else {
         this.getOrgListById(res['data']['org']);
         var buyer = this.userDetails.roles.filter(item => { 
            return item.role == "buyer";
          });
    
          if(buyer.length>0) {
            this.isBuyer = true;
          } else {
            this.isBuyer = false;
          }
          var supplier = this.userDetails.roles.filter(item => { 
            return item.role == "supplier";
          });
    
          if(supplier.length>0) {
            this.isSupplier = true;
          } else {
            this.isSupplier = false;
          }
          this.roleArrStr = Array.prototype.map.call(this.userDetails.roles, function (item) { return item.role; }).join(",");
        }
        this.loader = false;
      }, (err) => { this.loader = false; });
    }
  }

  form() {
    this.resetForm = this.formBuilder.group({
      password: ['', [Validators.required, ResetPasswordComponent.validateNumber]],
      confirm_password: ['', [Validators.required, ResetPasswordComponent.validateNumber]],
      resetPasswordJustification: ['', [Validators.required]]
    }, {
        validators: this.password.bind(this)
      });
  }

  password(formGroup: FormGroup) {
    const { value: password } = formGroup.get('password');
    const { value: confirmPassword } = formGroup.get('confirm_password');
    return password === confirmPassword ? null : { passwordNotMatch: true };
  }


  static validateNumber(control: FormControl): ValidationErrors {
    let regx = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,30}$/g;
    if (!control.value) return null;
    if (control.value && !control.value.toString().match(regx)) {
      return { onlyAllowed: 'Please match the requested format.' };
    }
    return null;
  }
  resetFormSub() {
    this.submit = true;
    if (this.resetForm.invalid) {
      return;
    } else {
      let obj = {
        password: this.resetForm.value.password,
        email: this.userDetails.email,
        resetPasswordJustification: this.resetForm.value.resetPasswordJustification

      }
      
      this.resetButLoad = true;
      console.log("reset password data--", obj);
      
      this.common.resetPwd(obj).subscribe((res: any) => {
        this.common.success("Password updated successfully");
      console.log("reset password success");
        this.resetForm.reset();
        this.resetButLoad = false;
        this.submit = false;
      }, (err) => {this.resetButLoad = false; });
    }
  }

  get f() { return this.resetForm.controls; }
  getOrgListById(orgId) {
    this.buyerservice.getOrganisationListForAdmin(orgId).subscribe((res: any) => {
      var list_organization = res.data;
      if (list_organization && list_organization.length > 0) {
       var orgName = list_organization.find(org => org._id === orgId);
       this.userDetails['companycode'] = orgName.name;
      }
    });
  }


}
