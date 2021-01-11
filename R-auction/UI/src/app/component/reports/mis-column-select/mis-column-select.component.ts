import { Component, OnInit, Inject } from '@angular/core';
import { MisReportService } from '../mis-auction-report/mis-report.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  templateUrl: './mis-column-select.component.html',
  styleUrls: ['./mis-column-select.component.css']
})
export class MisColumnSelectComponent implements OnInit {

  
	todoMisAuc = []; 
	todothisItem = [];
	dialogPositiveBtn;
	donethisAuction = [];
	originalOrderedAuction;
	donethisItem = [];
	originalOrderedItem; 
    
	constructor(   
        public misService: MisReportService,
		public dialog: MatDialog, 
		public MatDialogRef: MatDialogRef<MisColumnSelectComponent>, 
		@Inject(MAT_DIALOG_DATA) data
	) { 
		
		this.dialogPositiveBtn = data.dialogPositiveBtn;
	}

	ngOnInit() { 	
		this.misService.getUnSelectAuctionColsMis().forEach(element => {
			this.todoMisAuc.push(element);
		});
		this.misService.getUnSelectItemColsMis().forEach(element => {
			this.todothisItem.push(element);
		});
		this.originalOrderedAuction = [...this.misService.misdefaultAuction];
		this.originalOrderedItem = [...this.misService.misdefaultItem];
	}

	

	dropMis(event: CdkDragDrop<string[]>) {
		console.log(event);
		if (event.previousContainer === event.container) {
		  moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
		} else {
		  transferArrayItem(event.previousContainer.data,
							event.container.data,
							event.previousIndex,
							event.currentIndex);
		}
	}

	onPositiveMisBtn() {
		this.storeSelectedAndSortMisOrders();

		this.MatDialogRef.close(true);
	}

	cancelMisDialog() {
		this.misService.misdefaultAuction.length = 0;
		this.misService.misdefaultAuction.splice(0,0, ...this.originalOrderedAuction);
		this.misService.misdefaultItem.length = 0;
		this.misService.misdefaultItem.splice(0,0, ...this.originalOrderedItem);
		this.MatDialogRef.close(false)
	}

	storeSelectedAndSortMisOrders() {
		this.misService.misdefaultAuction.forEach((obj, index) => {
			obj.index = index + 1;
		});
		this.misService.misdefaultItem.forEach((obj, index) => {
			obj.index = index + 1;
		});
		this.todoMisAuc.forEach((obj) => {
			obj.index = 0;
		});
		this.todothisItem.forEach((obj) => {
			obj.index = 0;
		});		
		this.misService.saveUserSpecificMISReportSettings().then(res => {
			console.log('Cumu report settings saved')
		}).catch(err => console.log('Cumu report settings not saved'));
	}

	selectAllMisAuctionHeaders() {
		this.misService.misdefaultAuction.length = 0;
		this.todoMisAuc.length = 0;
		this.misService.populateMisTitleDefAuction();
	}

	selectAllMisLineItemColumn() {
		this.misService.misdefaultItem.length = 0;
		this.todothisItem.length = 0;
		this.misService.populateMisTitleDefItem();		
	}
	
}
