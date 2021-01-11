import { Component, OnInit, Input } from '@angular/core';

@Component({
	selector: 'savings',
	templateUrl: './savings.component.html',
})
export class Savings implements OnInit {
    
    @Input() auctionType_Obj;
    @Input() savingSelected_Obj;
    @Input() compType;
	
	constructor(
	) { }

	ngOnInit() {
    }
    
}