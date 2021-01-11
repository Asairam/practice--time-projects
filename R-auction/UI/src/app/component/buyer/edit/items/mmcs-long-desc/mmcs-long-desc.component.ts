import { Component, OnInit, Input} from '@angular/core';

@Component({
  selector: 'mmcs-long-desc',
  templateUrl: './mmcs-long-desc.component.html'
})
export class MmcsLongDescComponent implements OnInit {

	@Input() companyReferences;
	@Input() mmcsCharacteristics;
	@Input() mmcsLongDesc;
	COMPANY_REFERENCES_LABELS = new Map([
		['PN', 'Part Number'], 
		['OPN', 'Old Part Number'],
		['CAT', 'Catalogue Number'],
		['MM',  'Manufacturer’s Model Type'],
		['companyName', 'Manufacturer']
	]);
	
	ngOnInit() {
	}

	filterIt(ref) {
		if(ref == 'PN' || ref == 'OPN' || ref == 'CAT' || ref == 'MM') {
			return true;
		} else {
			return false;
		}
	}
	
	getDescForCompanyReferences(key) {
		return this.COMPANY_REFERENCES_LABELS.get(key);
	}
	
}
