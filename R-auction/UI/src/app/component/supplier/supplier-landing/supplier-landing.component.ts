import { Component, OnInit } from '@angular/core';
import { SupplierService } from '../../../component/component-service/supplier.service';
import { CommonService } from '../../../commonService/common.service';
import { Router, ActivatedRoute} from '@angular/router';
import * as routerconfig from 'src/app/appConfig/router.config';

@Component({
  selector: 'app-supplier-landing',
  templateUrl: './supplier-landing.component.html',
  styleUrls: ['./supplier-landing.component.scss']
})
export class SupplierLandingComponent implements OnInit {
  buyerData: any;
  constructor(public supplierService:SupplierService,  private actRoute: ActivatedRoute, private CommonService:CommonService, private routes:Router) { }

  ngOnInit() {
    this.getSupplierData();
    
  }
  

  getSupplierData() {
    // this.CommonService.loader = true;
    try {
      let obj = {
        'futureDuration': 100,
        'duration': 1000
      };
      this.supplierService.getSupplierkpiData(obj).subscribe((res: any) => {
        if (res['success']) {
          this.buyerData = res.data;
          // this.CommonService.loader = false;
        }
      }, error => { this.CommonService.loader = false; });
    } catch (err) { this.CommonService.loader = false; }
  }
  
  onType(type){    
    this.routes.navigate([routerconfig.supplier_router_links.PARTICIPANT_LIST_VIEW], { queryParams: { status: type } });
  }
}
