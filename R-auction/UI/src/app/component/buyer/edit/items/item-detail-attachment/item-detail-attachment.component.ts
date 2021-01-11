import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'item-detail-attachment',
	templateUrl: './item-detail-attachment.component.html',
	styleUrls: ['./item-detail-attachment.component.css']
})
export class ItemDetailAttachmentComponent implements OnInit {

    @Input() formObj;
	constructor() { }

	ngOnInit() {
	}
}
