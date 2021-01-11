import { Component, OnInit, Inject } from '@angular/core';
import { CumulativeReportService } from '../cumulative-report.service';
import {CdkDragDrop, moveItemInArray, transferArrayItem} from '@angular/cdk/drag-drop';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
	templateUrl: './cumulative-column-select.component.html',
	styleUrls: ['./cumulative-column-select.component.css'],
})
export class CumulativeColumnSelectComponent implements OnInit {

	todoAuction = [];
	todoItem = [];
	dialogPositiveBtn;
	doneAuction = [];
	originalOrderAuction;
	doneItem = [];
	originalOrderItem;
    
	constructor(   
        public crService: CumulativeReportService,
		public dialog: MatDialog, 
		public MatDialogRef: MatDialogRef<CumulativeColumnSelectComponent>, 
		@Inject(MAT_DIALOG_DATA) data
	) { 
		
		this.dialogPositiveBtn = data.dialogPositiveBtn;
	}

	ngOnInit() {	
		this.crService.getUnSelectedAuctionCol().forEach(element => {
			this.todoAuction.push(element);
		});
		this.crService.getUnSelectedItemCol().forEach(element => {
			this.todoItem.push(element);
		});
		this.originalOrderAuction = [...this.crService.titleDefaultAuction];
		this.originalOrderItem = [...this.crService.titleDefaultItem];
	}

	drop(event: CdkDragDrop<string[]>) {
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

	onPositiveBtn() {
		this.storeSelectedAndSortOrder();

		this.MatDialogRef.close(true);
	}

	cancel() {
		this.crService.titleDefaultAuction.length = 0;
		this.crService.titleDefaultAuction.splice(0,0, ...this.originalOrderAuction);
		this.crService.titleDefaultItem.length = 0;
		this.crService.titleDefaultItem.splice(0,0, ...this.originalOrderItem);
		this.MatDialogRef.close(false)
	}

	storeSelectedAndSortOrder() {
		this.crService.titleDefaultAuction.forEach((obj, index) => {
			obj.index = index + 1;
		});
		this.crService.titleDefaultItem.forEach((obj, index) => {
			obj.index = index + 1;
		});
		this.todoAuction.forEach((obj) => {
			obj.index = 0;
		});
		this.todoItem.forEach((obj) => {
			obj.index = 0;
		});		
		this.crService.saveUserSpecificCumuReportSettings().then(res => {
			console.log('Cumu report settings saved')
		}).catch(err => console.log('Cumu report settings not saved'));
	}

	selectAllAuctionHeader() {
		this.crService.titleDefaultAuction.length = 0;
		this.todoAuction.length = 0;
		this.crService.populateTitleDefaultAuction();
	}

	selectAllLineItemColumns() {
		this.crService.titleDefaultItem.length = 0;
		this.todoItem.length = 0;
		this.crService.populateTitleDefaultItem();		
	}
	

}