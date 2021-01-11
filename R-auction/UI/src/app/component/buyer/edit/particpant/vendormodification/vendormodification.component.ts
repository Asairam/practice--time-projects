import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, PatternValidator } from '@angular/forms';
import { CommonService } from '../../../../../commonService/common.service';
import { BuyerEditService } from '../../../../component-service/buyer-edit.service';
import * as config from '../../../../../appConfig/app.config';

/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromEditModule from '../../state/editmodule.reducer';
import { takeWhile } from 'rxjs/operators';

@Component({
  selector: 'app-vendormodification',
  templateUrl: './vendormodification.component.html',
  styleUrls: ['./vendormodification.component.css']
})
export class VendormodificationComponent implements OnInit, OnDestroy {

  auctionReadOnly: boolean = false;
  componentActive: boolean = true;
  @Input() contactData = null;
  vendorModificationForm: FormGroup;
  role = null;
  translateSer:any;
  constructor(
    private formBuilder: FormBuilder, 
    private common: CommonService, 
    private buyereditservice: BuyerEditService,
    private store: Store<fromEditModule.EditModuleState>
    ) { 
    this.common.translateSer('PARTICIPANT_TAB').subscribe(async (text: string) => {
      this.translateSer = text;
    });
  }

  ngOnInit() {
    this.store.pipe(select(fromEditModule.getAuctionReadOnly),takeWhile(() => this.componentActive) )
      .subscribe(auctionReadOnly => {
        this.auctionReadOnly = auctionReadOnly;
    })
    window.scroll(0, 0);
    this.formData();
    if (this.contactData)
      this.role = this.contactData.contact["role"] ? this.contactData.contact["role"] : "vendor";
    else
      this.role = this.buyereditservice.mailAuctionData.type == config.AUC_TYPE[0]["value"] ? 'customer' : 'vendor';
  }

  formData() {
    this.vendorModificationForm = this.formBuilder.group({
      supplierName: [{ value: (this.contactData) ? this.contactData.supplier.supplierName1 : '', disabled: (this.contactData) ? true : false }],
      firstName: [(this.contactData) ? this.contactData.contact.firstname : '', Validators.required],
      lastName: [(this.contactData) ? this.contactData.contact.lastname : '', Validators.required],
      email: [(this.contactData) ? this.contactData.contact.useremail1 : '', [Validators.required, Validators.email]],
      mobile: [(this.contactData) ? this.contactData.contact.mobileno : '', [Validators.required, Validators.minLength(3)]],
    });
  }

  emailValidate(obj = null) {
    this.buyereditservice.getSupplierByEmailId(obj[0]["email"]).subscribe((res: any) => {
      if (res["data"]) {
        this.common.error("Emailid already exists.");
      }
      else {
        this.registerUser(obj);
      }
    }, err => {
      this.common.error(err);
    })
  }

  registerUser(obj = null) {
    this.buyereditservice.registerNewVendor(obj).subscribe((res) => {
      if (res["success"]) {
        let sendData = {
          flag: 'closeAttach',
          pageFrom: 'new_supplier',
          data: res["data"][0]
        }
        this.common.toggleDiv.emit(sendData);
        this.common.success(this.translateSer['ADD_SUPPLIER']);
      }
      this.common.loader = false;
    }, (err) => {
      this.common.loader = false;
      this.common.error(err);
    })
  }

  formSubmit() {
    try {
      this.common.loader = true;
      if (this.vendorModificationForm.valid) {
        let obj = [{
          type: this.role,
          code: "",
          supplierName: this.vendorModificationForm.get('supplierName').value,
          email: this.vendorModificationForm.get('email').value,
          mobile: this.vendorModificationForm.get('mobile').value.toString(),
          name: {
            firstname: this.vendorModificationForm.get('firstName').value,
            lastname: this.vendorModificationForm.get('lastName').value,
          }
        }]
        if (this.contactData) {
          let sendData = {
            flag: 'closeAttach',
            pageFrom: 'exist_supplier',
            data: {
              supplierData: {
                supplierID: this.contactData.supplier.supplierID,
                contact: { cpId: this.contactData.contact.cpId, name: obj[0].name, email: obj[0].email, mobile: obj[0].mobile }
              }, flag: true
            }
          }
          this.common.toggleDiv.emit(sendData);
          this.common.success(this.translateSer['UP_SUPPLIER'])
        }
        else {
          this.emailValidate(obj);
        }
      }
    }
    catch{
    }
  }

  onClose() {
    let sendData = {
      flag: 'closeAttach',
      pageFrom: (this.contactData) ? 'exist_supplier' : 'new_supplier'
    }
    this.common.toggleDiv.emit(sendData);
  }

  ngOnDestroy() {
    this.componentActive = false;
  }

}
