import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'live-participant-remark',
	templateUrl: './live-participant-remark.component.html',
	styleUrls: ['./live-participant-remark.component.css']
})
export class LiveParticipantRemarkComponent implements OnInit {

	@Input() liveRemarkObj: any;
	constructor() { }

	ngOnInit() {
	}

}