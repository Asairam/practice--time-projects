import { Component, OnInit, Input } from '@angular/core';
import { CommonService } from 'src/app/commonService/common.service';

@Component({
  selector: 'app-supplier-currency',
  templateUrl: './supplier-currency.component.html',
  styleUrls: ['./supplier-currency.component.css']
})
export class SupplierCurrencyComponent {

  
  currentDate=new Date();
  @Input() supplier_currency = null;
  constructor(private common: CommonService) {
    }

  closeClick() {
    let sendData = {
      flag: 'closeAttach',
      pageFrom: 'supplier_currency'
    }
    this.common.toggleDiv.emit(sendData);
  }


}
