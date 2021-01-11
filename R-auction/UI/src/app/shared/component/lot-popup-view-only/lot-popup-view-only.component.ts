import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { CommonService } from '../../../commonService/common.service';

@Component({
	selector: 'app-lot-popup-view-only',
	templateUrl: './lot-popup-view-only.component.html',
	styleUrls: ['./lot-popup-view-only.component.css']
})
export class LotPopupViewOnlyComponent implements OnInit, OnDestroy {

	@Input() viewData;
	createLotForm: FormGroup;
	lotcoloum: any;
	headcoloum: any;

    constructor(
        private common: CommonService, 
        ) {
        this.common.translateSer('LOT_COLOUM').subscribe(async (text: string) => {
        this.lotcoloum = text;
        });
        this.common.translateSer('COMMON').subscribe(async (text: string) => {
        this.headcoloum = text;
        });
    }

    ngOnInit() {
        this.formData();
        this.lotEdit(this.viewData.data);
    }

    lotEdit(rec) {
        this.createLotForm.patchValue({
            lotName: rec.lotName,
            lotDescription: rec.lotDescription,
            remarks: rec.remarks
        });
    }

  formData() {
    this.createLotForm = new FormGroup({
        lotName: new FormControl({value: '', disabled: false}),
        lotDescription: new FormControl({value: '', disabled: false}),
        remarks: new FormControl({value: '', disabled: false}),
    });    
  }
  
  ngOnDestroy() {
  }


}
