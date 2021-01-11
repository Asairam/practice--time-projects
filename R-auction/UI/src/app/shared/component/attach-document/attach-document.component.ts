import { Component, OnInit, OnDestroy, ViewChild, Input, Output, EventEmitter, ElementRef } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { CommonService } from '../../../commonService/common.service';
import { AuthService } from '../../../authService/auth.service';
import * as config from '../../../appConfig/app.config';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { ViewPopupComponent } from '../view-popup/view-popup.component';
import { BuyerEditService } from '../../../component/component-service/buyer-edit.service';
import { ActivatedRoute } from '@angular/router';

/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromEditModule from '../../../component/buyer/edit/state/editmodule.reducer';
import { takeWhile } from 'rxjs/operators';

const URL = 'https://evening-anchorage-3159.herokuapp.com/api/';
@Component({
  selector: 'app-attach-document',
  templateUrl: './attach-document.component.html',
  styleUrls: ['./attach-document.component.css']
})
export class AttachDocumentComponent implements OnInit, OnDestroy {  
  
  auctionReadOnly: boolean = false;
  componentActive: boolean = true;

  @Input() formObj;
  totalCombinedFileSizeForMail = 1024 * 1024 * 10;
  maxSizePerFile = 1024 * 1024 * 40;
  @Output() changeTab: EventEmitter<any> = new EventEmitter();
  @Output() sendData: EventEmitter<any> = new EventEmitter();
  @Input() selectedMMCSArr=null;
  displayFlag: boolean = false;
  imageUrlArray: any = [];
  uploader = new FileUploader({ allowedFileType: ['pdf', 'jpeg'] });
  @Input() sapcode=null;
  @Input() tab=null;
  @Input() viewData=null;
  @Input() auctionId=null;
  @Input() page=null;
  common_btn: any;
  downlink: any;
  invalidFile = [];
  file: string;
  docId: number = 0;
  attachment_type_options = config.ATTACHMENTTYPE_OPTION;
  extArray = config.FILE_EXT_TYPE;
  uploadFormatText = [...this.extArray];
  attArr = [];
  copyArr = [];
  samefileError = [];
  sameSizeError = [];
  uploadButton = true;
  checkedAll = false;
  dis = false;
  @ViewChild('myDiv') myDiv: ElementRef<HTMLElement>;
  aucStatus = this.route.snapshot.queryParamMap.get('status');
  showArrow=false;
  constructor(
      private common: CommonService, 
      public auth: AuthService, 
      private matDialog: MatDialog, 
      private route: ActivatedRoute, 
      public buyerService: BuyerEditService,    
      private store: Store<fromEditModule.EditModuleState>
    ) {
    this.common.translateSer('COMMON').subscribe(async (text: string) => {
      this.common_btn = text;
    });
    this.uploaderFun();
  }

  ngOnInit() {
    this.store.pipe(select(fromEditModule.getAuctionReadOnly),takeWhile(() => this.componentActive) )
      .subscribe(auctionReadOnly => {
        this.auctionReadOnly = auctionReadOnly;
    });
  }
  
  ngOnChanges() {
    this.attArr = [];
    this.copyArr = [];
    if (this.viewData && this.viewData.data && this.viewData.data.attachmentList && this.viewData.data.attachmentList.length > 0) {
      this.attArr = [...this.viewData.data.attachmentList];
      this.copyArr = [...this.viewData.data.attachmentList];
    }
    if (!this.common.auctionLeader.host && this.viewData && (this.viewData.aucStatus == 'draft' || this.viewData.aucStatus == 'paused' || this.viewData.aucStatus == 'suspended')) {
      this.dis = true;
    } else {
      this.dis = false;
    } 
    if( this.page=='query_history'){
      this.dis = true;
    }   
    this.buildThumbnailArray(this.attArr);
  }
  ngAfterViewInit() {
    window.addEventListener("dragover", function (e) {
      e.preventDefault();
    }, false);
    window.addEventListener("drop", function (e) {
      e.preventDefault();
    }, false);
  }

  onClose() {
    if (this.page == "query_history") {
      this.sendData.emit(this.attArr);
    }else {
      let sendData = {
        flag: 'closeAttach',
        pageFrom: this.page.pageFrom,
        selectedInd: 0
      }
      this.common.toggleDiv.emit(sendData);
    }
  }

  uploaderFun() {
    this.uploader = new FileUploader({
      url: URL,
      disableMultipart: true, // 'DisableMultipart' must be 'true' for formatDataFunction to be called.
      formatDataFunctionIsAsync: true,
      formatDataFunction: async (item) => {
        return new Promise((resolve, reject) => {
          resolve({
            name: item._file.name,
            length: item._file.size,
            contentType: item._file.type,
            date: new Date()
          });
        });
      }
    });
  }

  dropped(e: any) {
    for (let i = 0; i < this.uploader.queue.length; i++) {
      if (this.checkDuplicate(this.uploader.queue[i]) && this.invalidFileHandle(this.uploader.queue[i]) && this.checkSize(this.uploader.queue[i])) {
        this.fileUpload(this.uploader.queue[i]);
      }

      // if (this.checkDuplicate(this.uploader.queue[i])) {
      //   if (this.checkSize(this.uploader.queue[i])) {
      //     this.fileUpload(this.uploader.queue[i]);
      //   } else {
      //     if (this.sameSizeError.indexOf(this.uploader.queue[i]['_file']['name']) === -1) {
      //       this.sameSizeError.push(this.uploader.queue[i]['_file']['name']);
      //     }
      //   }
      // } else {
      //   if (this.samefileError.indexOf(this.uploader.queue[i]['_file']['name']) === -1) {
      //     this.samefileError.push(this.uploader.queue[i]['_file']['name']);
      //   }
      // }

    }
    this.handleFileError();
  }

  handleFileError() {
    if ((this.samefileError && this.samefileError.length > 0) || (this.sameSizeError && this.sameSizeError.length > 0) || (this.invalidFile && this.invalidFile.length > 0)) {
      let errObj = {
        samefile: this.samefileError,
        samesize: this.sameSizeError,
        invalidFile: this.invalidFile
      }
      this.attachmentErrorHandle(errObj);
    }
  }

  fileUpload(key) {
    this.uploadButton = false;
    this.file = key.file.rawFile;
    let data = new FormData();
    data.append('media', this.file);
    this.common.uploadAttachmentData(data).subscribe((res: any) => {
      if (res.success) {
        let newName = {
          docId: this.docId += 1,
          docTypeVal: String(1),
          docDesc: this.attachment_type_options && this.attachment_type_options.length > 0 ? this.attachment_type_options[0]['value'] : null,
          fileName: key.file.rawFile.name,
          isInternal: false,
          isExternal: true,
          docFileId: res.data.id,
          fileSize: key.file.rawFile.size,
          forMailing: key.file.rawFile.forMailing ? true : false
        };
        this.attArr.push(newName);
        
        this.buildThumbnailArray(this.attArr);

        this.uploader.queue = [];
        this.samefileError = [];
        this.sameSizeError = [];
        this.invalidFile = [];
      }
    }, (error: any) => {
      if(typeof(error) === "string") {
        this.common.error(error);
        return;
      }
      this.common.error(error.error.message);
    });
  }
  saveAtt() {
    if(this.page!='query_history')
      this.viewData.data.attachmentList.length = 0;
      for(let x=0; x<this.attArr.length; x++) {
        this.viewData.data.attachmentList.push(this.attArr[x]);
      }
     
      
    this.uploadButton = true;
    if (this.attArr && this.attArr.length === 0) {
      this.common.success(this.common_btn['ATTACH_UP_SUCC']);
    } else {
      this.common.success(this.common_btn['ATTACH_ADD_SUCC']);
    }
  }

  buildThumbnailArray(objArray) {
    let tmparr = [];
    objArray.forEach((element) => {
      let splitFile = element.fileName.split('.')
      if (config.IMAGE_TYPE.includes(splitFile[splitFile.length - 1].toLowerCase())) {
        let imageUrl = this.common.downloadAttachmentData(element);
        tmparr.push({ image: imageUrl, thumbImage: imageUrl, title: element.fileName });
      }
    });
    this.imageUrlArray = tmparr;
    // this.showArrow=(this.imageUrlArray.length>3  && !this.common.isMobile)?true:((this.common.isMobile  && this.imageUrlArray.length>1)?true:false);
      
    // setTimeout(() => {
    //   if( this.myDiv){
    //   let el: HTMLElement = this.myDiv.nativeElement;
    //   el.click()
    //   }
    // }, 0);
  }

  onRowDelete(ind, val) {
    try {
      const objMatDialogConfig = new MatDialogConfig();
      objMatDialogConfig.panelClass = 'dialog-xs';
      objMatDialogConfig.data = {
        dialogMessage: this.common_btn['PLZ_CON'],
        dialogContent: this.common_btn['CONFIRM_MSG'] + '<b>' + val.fileName + '</b>',
        tab: 'confirm_msg',
        dialogPositiveBtn: "Yes",
        dialogNegativeBtn: "No"
      }
      objMatDialogConfig.disableClose = true;
      let refMatDialog = this.matDialog.open(ViewPopupComponent, objMatDialogConfig);
      refMatDialog.afterClosed().subscribe((value) => {
        if (value) {
          this.attArr.splice(ind, 1);
          this.viewData.data.attachmentList = this.attArr;          
          this.buildThumbnailArray(this.attArr);
          this.checkUpload(this.attArr, this.copyArr);
          this.common.success(val.fileName + ' ' + this.common_btn['DELE_SUCC']);
        }
      });
    } catch (e) {

    }
  }

  onAttachmentTypeChange(ind, doc) {
    this.uploadButton = false;
    if (this.checkedAll) {
      for (var i = ind; i < this.attArr.length; i++) {
        this.attArr[i].docDesc = doc;
      }
    }
  }

  attachmentErrorHandle(errorsname) {
    try {
      const objMatDialogConfig = new MatDialogConfig();
      objMatDialogConfig.panelClass = 'dialog-md';
      objMatDialogConfig.data = {
        dialogMessage: 'Error',
        dialogContent: errorsname,
        tab: 'attachmentError_confirm_msg',
        dialogNegativeBtn: "Close"
      }
      objMatDialogConfig.disableClose = true;
      let refMatDialog = this.matDialog.open(ViewPopupComponent, objMatDialogConfig);
      refMatDialog.afterClosed().subscribe((value) => {
        if (!value) {
          this.samefileError = [];
          this.sameSizeError = [];
          this.uploader.queue = [];
          this.invalidFile = [];
        }
      });
    } catch (e) {

    }
  }

  invalidFileHandle(queue) {
    let splitFile = queue['_file']['name'].split('.')
    let invalid = this.extArray.includes(splitFile[splitFile.length - 1].toLowerCase());
    if (!invalid) {
      if (this.invalidFile.indexOf(queue['_file']['name']) === -1) {
        this.invalidFile.push(queue['_file']['name']);
      }
    }
    return invalid;
  }
  invalidFileHandleMMCS(fileName) {
    let splitFile = fileName.split('.')
    let invalid = this.extArray.includes(splitFile[splitFile.length - 1].toLowerCase());
    if (!invalid) {
      if (this.invalidFile.indexOf(fileName) === -1) {
        this.invalidFile.push(fileName);
      }
    }
    return invalid;
  }

  checkDuplicate(name) {
      let ans = this.attArr.map(function (e) { return e.fileName; }).indexOf(name['_file']['name']) === -1;
      if (!ans) {
        if (this.samefileError.indexOf(name['_file']['name']) === -1) {
          this.samefileError.push(name['_file']['name']);
        }
      }
      return ans; 
  }
  checkDuplicateMMCS(fileName) {
    let ans = this.attArr.map(function (e) { return e.fileName; }).indexOf(fileName) === -1;
    if (!ans) {
      if (this.samefileError.indexOf(fileName) === -1) {
        this.samefileError.push(fileName);
      }
    }
    return ans; 
}

  checkSize(name) {
    let size = name.file.size <= this.maxSizePerFile;
    if (!size) {
      if (this.sameSizeError.indexOf(name['_file']['name']) === -1) {
        this.sameSizeError.push(name['_file']['name']);
      }
    }
    return size;
  }

  checkSizeMMCS(file) {
    let size = file.size <= this.maxSizePerFile;
    if (!size) {
      if (this.sameSizeError.indexOf(file['name']) === -1) {
        this.sameSizeError.push(file['name']);
      }
    }
    return size;
  }

  checkUpload(arr1, old) {
    if (JSON.stringify(arr1) !== JSON.stringify(old)) {
      this.uploadButton = false;
    } else {
      this.uploadButton = true;
    }
  }
  
  attachMMCS(formdataArr) {
    for(let f=0; f<formdataArr.length; f++) {
      if (this.checkDuplicateMMCS(formdataArr[f].file.rawFile.name) && 
          this.invalidFileHandleMMCS(formdataArr[f].file.rawFile.name) && 
          this.checkSizeMMCS(formdataArr[f].file.rawFile)) {
        this.fileUpload(formdataArr[f]);  
      }
          
    }
    this.uploadButton = false;
    this.handleFileError();
  }

  continue() {
    this.changeTab.emit();
  }

  get showClose() {
    return this.page.pageFrom != 'item';
  }

  get showContinue() {
    return this.page.pageFrom == 'item';
  }

  toggleInternalExternal(doc){
    if(!doc.isExternal) {
      doc.forMailing = false;
    }
  }

  totalSelectedFileSize() {
    let totalSize = 0;
    this.attArr.forEach(element => {
      if(element.forMailing) {
        totalSize = totalSize + Number(element.fileSize);
      }
    })
    if( totalSize > this.totalCombinedFileSizeForMail ) {
      try {
        const objMatDialogConfig = new MatDialogConfig();
        objMatDialogConfig.panelClass = 'dialog-md';
        objMatDialogConfig.data = {
          dialogMessage: 'Error',
          dialogContent: `Mail attachment size cannot exceed ${Math.floor((this.totalCombinedFileSizeForMail/(1024*1024)))}MB`,
          tab: 'mailAttachSizeExceeded',
          dialogNegativeBtn: "Close"
        }
        objMatDialogConfig.disableClose = true;
        let refMatDialog = this.matDialog.open(ViewPopupComponent, objMatDialogConfig);
        refMatDialog.afterClosed().subscribe(res => {

        }) 
      } catch (e) {
  
      }
    }
  }
  
  ngOnDestroy() {
    this.componentActive = false;
  }

}
