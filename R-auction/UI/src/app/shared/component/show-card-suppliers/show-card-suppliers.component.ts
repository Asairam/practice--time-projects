import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { CommonService } from '../../../commonService/common.service';
import { BuyerEditService } from 'src/app/component/component-service/buyer-edit.service';
@Component({
  selector: 'app-show-card-suppliers',
  templateUrl: './show-card-suppliers.component.html',
  styleUrls: ['./show-card-suppliers.component.css']
})
export class ShowCardSuppliersComponent implements OnInit, OnChanges {
  @Input() supplier_details;
  supplierList = [];
  translateSer:any;
  constructor(public common: CommonService, private buyerService: BuyerEditService) {
    this.common.translateSer('STATUS_DETAILS').subscribe(async (text: string) => {
      this.translateSer = text;
    });
   }

  ngOnInit() {

  }
  ngOnChanges() {
    if (this.supplier_details)
      this.getSupplierList();
  }
  onClose() {
    let sendData;
    sendData = {
      flag: 'closeAttach',
      pageFrom: 'show_card_suppliers'
    }
    this.common.toggleDiv.emit(sendData);
  }

  getSupplierList() {
    this.supplierList = [];
    this.buyerService.getSupplierDetails(this.supplier_details.auctionData.auctionID).subscribe((res: any) => {
      if (res.success && res["data"].supplierList && res["data"].supplierList.length > 0) {
        if (this.supplier_details.seleType.toLowerCase() == 'bidded') {
          this.supplierList = res["data"].supplierList.filter((obj) => { return obj.status.toLowerCase() === 'bidded' });
        } else if (this.supplier_details.seleType.toLowerCase() == 'accepted' || this.supplier_details.seleType.toLowerCase() == 'bidded') {
          this.supplierList = res["data"].supplierList.filter((obj) => { return obj.status.toLowerCase() === 'accepted' || obj.status.toLowerCase() === 'bidded' });
        } else {
          this.supplierList = res["data"].supplierList.filter((obj) => { return obj.status.toLowerCase() === 'invited' || obj.status.toLowerCase() === 'accepted' || obj.status.toLowerCase() === 'bidded' });
        }
      }

    }, err => { });
  }
}
