import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BuyerEditService } from '../../../../component-service/buyer-edit.service';
import { HttpClient , HttpHeaders} from '@angular/common/http';
import { AuthService } from '../../../../../authService/auth.service';
import { CommonService } from '../../../../../commonService/common.service';

@Component({
  selector: 'mmcs-attach',
  templateUrl: './mmcs-attach.component.html',
  styleUrls: ['./mmcs-attach.component.css']
})
export class MmcsAttachComponent implements OnInit {

	mmcsAttchList:any = [];
	@Input() sapcode;
	@Output() attach: EventEmitter<any> = new EventEmitter();
	token: any;

	constructor(
		private buyerService: BuyerEditService, 
		private http: HttpClient,
		private authService: AuthService,
		private common: CommonService
		) { }

	ngOnInit() {
		this.token = localStorage.getItem('tokenValue');
	}

	getMaterialAttachmentDetails() {
		this.buyerService.getMaterialAttachmentDetails(this.sapcode).subscribe((res: any) => {			
			if(res.success) {
				res.data.forEach(element => {
					element.generatedAttachmentUrl =  this.buyerService.getMmcdDownloadUrl(this.sapcode, element.sapdocNo);
				});
				this.mmcsAttchList = res.data;
			}
		})
	}

	attachMMCS(fileList) {
		let formdataArr = [];
		for(let v=0; v<fileList.length; v++) {
			if(fileList[v].selected) formdataArr.push(this.convertBase64ToFormData(fileList[v]));		  
		}
		if(formdataArr.length > 0) {
			this.attach.emit(formdataArr);
		} else {
			this.common.error("No file selected");
		}		
	}

	convertBase64ToFormData(fileObj) {
		let contentType = fileObj.fileBase64string ? fileObj.fileBase64string.split(';')[0] : '';
		let byteCharacters = atob(fileObj.fileBase64string);
		let byteNumbers = new Array(byteCharacters.length);
		for (var j = 0; j < byteCharacters.length; j++) {
		  byteNumbers[j] = byteCharacters.charCodeAt(j);
		}
		let byteArray = new Uint8Array(byteNumbers);
		let file = new File([new Blob([byteArray], { type: contentType })], fileObj.fileName, { type: fileObj.fileExt });
		let FileMMCSData = { file: { rawFile: file } };
		return FileMMCSData;
	}

	download(url,  docFileName) {
		if(url === "Document number missing") {
			return this.common.error("Document number missing");
		}
		let  httpOptions = {
			headers: new HttpHeaders({
			'authorization': 'Bearer ' + this.authService.getTokenValue(),
			}),
		};
		this.http.get<Blob>(url, { headers: httpOptions.headers, responseType: 'blob' as 'json' }).toPromise().then(res => {
			saveAsBlob(res, docFileName);
		});
		
		function saveAsBlob(data, docFileName) {
			var url = window.URL.createObjectURL(data);
			var anchor = document.createElement("a");
			anchor.download = docFileName;
			anchor.href = url;
			anchor.click();
		}
	}
	
}
