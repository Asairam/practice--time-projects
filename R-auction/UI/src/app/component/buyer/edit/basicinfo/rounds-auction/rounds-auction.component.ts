import { Component, OnInit, Input, TemplateRef, ViewChild, OnChanges } from '@angular/core';
import { CommonService } from 'src/app/commonService/common.service';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { RoundsAuctionService } from './rounds-auction.service';
import { BuyerEditService } from 'src/app/component/component-service/buyer-edit.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-rounds-auction',
  templateUrl: './rounds-auction.component.html',
  styleUrls: ['./rounds-auction.component.css']
})
export class RoundsAuctionComponent implements OnInit, OnChanges {
  roundsActiveRoute = true;
  @Input() auctionData;
  modalReference2 = null;
  @ViewChild('modalContent2') modalContent2: TemplateRef<any>;
  error = {
    startDateError: false,
    endDateError1: false
  }
  headcoloum: any;
  createRoundForm: FormGroup;
  today = new Date();
  startDateVar: any;
  endDateVar: any;
  roundList = [];
  paramObj: any;
  constructor(private common: CommonService, private formBuilder: FormBuilder,
    private roundsAuctionService: RoundsAuctionService,
    public buyerService: BuyerEditService,
    private route: ActivatedRoute,
    private modal: NgbModal) { }

  ngOnInit() {
    this.common.translateSer('COMMON').subscribe(async (text: string) => {
      this.headcoloum = text;
    });
    this.formData();
  }

  ngOnChanges() {
    if(this.auctionData)
    this.getRoundsAuc();
    this.roundsActiveRoute = this.route.snapshot.queryParamMap.get('roundsAuc') ? true : false;
  }

  onClose() {
    let sendData = {
      flag: 'closeAttach',
      pageFrom: 'roundsAuc'
    }
    this.common.toggleDiv.emit(sendData);
    this.createRoundForm.reset();
  }

  formData() {
    this.createRoundForm = this.formBuilder.group({
      roundName: ['', Validators.required],
      roundDescription: ['', Validators.required],
      startDate: [null, Validators.required],
      endDate: [null, Validators.required],
      startTime: [null, Validators.required],
      endTime: [null, Validators.required],
      roundID: null
    });
  }

  roundFormSub() {
    this.dateFilter().then(result => {
      if (this.createRoundForm.value.roundID && this.roundList.find(obj => obj.roundID == this.createRoundForm.value.roundID)) {
        this.roundsAuctionService.updateRoundsAuctionData(this.createRoundForm.value).subscribe((res: any) => {
          this.common.success("Updated Successfully.");
          this.commonRef();
        }, (err) => {
          this.common.error(err);
        });
      } else {
        delete this.createRoundForm.value.roundID;
        this.roundsAuctionService.createRoundsAuctionData(this.createRoundForm.value).subscribe((res: any) => {
          this.common.success("Created Successfully.");
          this.commonRef();
        }, (err) => {
          this.common.error(err);
        });
      }
    }).catch(err => { });
  }

  dateFilter() {
    return new Promise((resolve, reject) => {
      this.error.startDateError = false;
      this.error.endDateError1 = false;
      let formObj = this.createRoundForm.getRawValue();

      if (!formObj.startDate || !formObj.endDate || !formObj.startTime || !formObj.endTime) {
        reject(new Error("Date or Time needs to be entered"));
      } else {
        let smonth = ((formObj.startDate).getMonth());
        let sday = ((formObj.startDate).getDate());
        let syear = ((formObj.startDate).getFullYear());
        let shour = ((formObj.startTime).getHours());
        let sminute = ((formObj.startTime).getMinutes());
        let eoMonth = ((formObj.endDate).getMonth());
        let eoDay = ((formObj.endDate).getDate());
        let eoYear = ((formObj.endDate).getFullYear());
        let eoHour = ((formObj.endTime).getHours());
        let eoMinute = ((formObj.endTime).getMinutes());
        this.startDateVar = new Date(syear, smonth, sday, shour, sminute);
        this.endDateVar = new Date(eoYear, eoMonth, eoDay, eoHour, eoMinute);
        if (this.endDateVar <= this.startDateVar) {
          this.error.endDateError1 = true;
          reject();
        } else {
          this.createRoundForm.patchValue({
            startDate: this.startDateVar,
            endDate: this.endDateVar
          });
          delete this.createRoundForm.value.startTime;
          delete this.createRoundForm.value.endTime;
          Object.assign(this.createRoundForm.value, { auctionID: this.buyerService.auctionData.auctionID })
          resolve();
        }
      }
    })
  }

  getRoundsAuc() {
    this.roundsAuctionService.getRoundsAuctionData(this.buyerService.auctionData.auctionID).subscribe((res: any) => {
      this.roundList = res['data'];
    }, (err) => { });
  }

  onAction(type, list) {
    if (type == 'edit') {
      this.createRoundForm.patchValue({
        startDate: new Date(list.startDate),
        endDate: new Date(list.endDate),
        startTime: new Date(list.startDate),
        endTime: new Date(list.endDate),
        roundName: list.roundName,
        roundDescription: list.roundDescription,
        roundID: list.roundID
      });
    } else {
      this.modalReference2 = this.modal.open(this.modalContent2, {
        size: 'sm',
        backdrop: 'static',
        keyboard: false,
        centered: true
      });
      this.paramObj = {
        auctionID: this.buyerService.auctionData.auctionID,
        roundID: list.roundID
      };
    }
  }

  commonRef() {
    this.getRoundsAuc();
    this.createRoundForm.reset();
  }

  deleteSub() {
    this.roundsAuctionService.deleteRoundsAuctionData(this.paramObj).subscribe((res: any) => {
      this.common.success("Deleted Successfully.");
      this.commonRef();
      this.modalReference2.close();
    }, (err) => { });
  }
}
