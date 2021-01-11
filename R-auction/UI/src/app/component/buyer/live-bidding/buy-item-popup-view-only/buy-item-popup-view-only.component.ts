import { Component, Inject, OnInit, OnDestroy} from '@angular/core';
import { CommonService } from '../../../../commonService/common.service';
import * as config from '../../../../appConfig/app.config';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromLiveBiddingModule from '../state/live-bidding-module.reducer';
import { takeWhile } from 'rxjs/operators';


@Component({
	templateUrl: './buy-item-popup-view-only.component.html',
	styleUrls: ['./buy-item-popup-view-only.component.css']
})
export class BuyItemPopupViewOnlyComponent implements OnInit, OnDestroy {
    
    componentActive: boolean = true;
    popupData: any;
    customfieldList = [];
    commonheader: any;
    attachment_type_options = config.ATTACHMENTTYPE_OPTION;
    showAttachments: boolean = false;
    primaryCurrency: any;

	constructor(
        public MatDialogRef: MatDialogRef<BuyItemPopupViewOnlyComponent>,
		public common: CommonService,
        @Inject(MAT_DIALOG_DATA) { ...data }, 
        private store: Store<fromLiveBiddingModule.LiveBiddingModuleState>
	) {        
        this.common.translateSer('COMMON').subscribe(async (text: string) => {
            this.commonheader = text;
        });
        this.popupData = data.data;
        this.customfieldList = data.data.customfieldList;
    }

    ngOnInit() {
        this.store.pipe(select(fromLiveBiddingModule.getAuctionDetails), takeWhile(() => this.componentActive)).subscribe(auctionDetails => {
            if(auctionDetails) {
                this.primaryCurrency = auctionDetails.primaryCurrency;
            }                
		});
    }
    
    showAttachDocument() {
        this.showAttachments = !this.showAttachments;
    }

    ngOnDestroy() {
        this.componentActive = false;
    }
}
