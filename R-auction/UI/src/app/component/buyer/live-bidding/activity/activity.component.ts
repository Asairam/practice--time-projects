import { Component, OnInit, Input, Output, OnDestroy, EventEmitter, ViewChild, TemplateRef } from '@angular/core';
import { BuyerBiddingService } from 'src/app/component/component-service/buyer-bidding.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { CommonService } from '../../../../commonService/common.service';
import { ViewPopupComponent } from '../../../../shared/component/view-popup/view-popup.component';
import { SocketService } from '../../../socketService/socket.service';
import { Subscription } from 'rxjs';
import { takeWhile } from 'rxjs/operators';
/* NgRx */
import { Store, select } from '@ngrx/store';
import * as fromAppModule from '../../../../state/app.reducer';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
@Component({
  selector: 'app-activity',
  templateUrl: './activity.component.html',
  styleUrls: ['./activity.component.css']
})
export class ActivityComponent implements OnInit, OnDestroy {
  alertMsg = '';
  modalReference  = null;
  dialogContent:any;
  @ViewChild('modalContent1') modalContent1: TemplateRef<any>;
  @Input() issealedBidDis = false;
  componentActive1: boolean = true;
  @Input() auctionID: any;
  @Input() auctionData = null;
  timeSocket: Subscription;
  @Output() ifRemoveSupplier: EventEmitter<any> = new EventEmitter<any>();
  commonheader: any;
  showDelete = false;
  constructor(public bidService: BuyerBiddingService, private common: CommonService, private MatDialog: MatDialog, private socketService: SocketService,
    private store: Store<fromAppModule.AppModuleState>,private modal: NgbModal) {
    this.common.translateSer('COMMON').subscribe(async (text: string) => {
      this.commonheader = text;
    });
  }

  ngOnInit() {
    this.getOnlineSupplierList(this.auctionID);
    this.store.pipe(select(fromAppModule.getAuctionConfigOnly), takeWhile(() => this.componentActive1))
      .subscribe(auctioncon => {
        if (auctioncon && auctioncon.features) {
          this.showDelete = auctioncon.features.suspendSupplier;
        }
      })
  }
  removeParticipant(val) {
    this.alertMsg = `Are you sure you want to delete the <b>${val.user.name}</b>?`;
    if(val.user.userID == this.auctionData.topSupplier) {
      this.alertMsg = `<b>${val.user.name}</b> is on Rank 1. Are you sure you want to delete the participant?`;
    }
    if(this.issealedBidDis) {
      this.alertMsg = `Are you sure you want to delete the participant?`;
    }
    this.modalReference  = this.modal.open(this.modalContent1, {
      size: 'sm',
      backdrop: 'static',
      keyboard: false,
      centered: true,
      windowClass: 'my-popupclass'
    });
    this.dialogContent = Object.assign(val, {remark:''});
  
    // try {
    //   const objMatDialogConfig = new MatDialogConfig();
    //   objMatDialogConfig.panelClass = 'dialog-xs';
    //   objMatDialogConfig.data = {
    //     dialogMessage: this.commonheader['PLZ_CON'],
    //     dialogContent: 'Are you sure you want to delete'+': <b>' + val.user.name + '</b>?',
    //     tab: 'confirm_msg',
    //     dialogPositiveBtn: "Yes",
    //     dialogNegativeBtn: "No"
    //   }
    //   objMatDialogConfig.disableClose = true;
    //   let refMatDialog = this.MatDialog.open(ViewPopupComponent, objMatDialogConfig);
    //   refMatDialog.afterClosed().subscribe((value) => {
    //     if (value) {
    //       let obj = {
    //         "auctionID": val.user.auctionID,
    //         "supplier": val.user.email
    //       };
    //       this.bidService.removeparticipateSupplier(obj).subscribe((res) => {
    //         this.ifRemoveSupplier.emit(true);
    //         this.common.success(val.user.name + ' deleted successfully.');
    //       }, (err) => { });
    //     }
    //   });
    // } catch (err) { }
  }

  getOnlineSupplierList(aucId) {
    this.timeSocket = this.socketService.supplierOnlineStatus(aucId)
      .subscribe(data => {
        if (data && data.length > 0 && data[0]['user']['auctionID'] === aucId) {
          // if(this.auctionData.isSealedBidAuction) {
          //   this.bidService.participantsArr = this.common.getRandomElementsFromArray(data);
          // } else {
            this.bidService.participantsArr = data;
          // }
          this.bidService.participantsArr.forEach(element => {
            element.lastBid = element.lastBid ? Math.round(element.lastBid) : null;
            if (element.lastBid > 10 && element.user.status === 'Online') {
              element.user.status = 'No Bids Last 10 minutes';
            }
          });
        }
      });
  }
  ngOnDestroy() {
    if (this.timeSocket) {
      this.timeSocket.unsubscribe();
    }
    this.componentActive1 = false;
  }

  callDeleteApi() {
    let obj = {
      "auctionID": this.dialogContent.user.auctionID,
      "supplier":  this.dialogContent.user.email,
      "remark" : this.dialogContent.remark
    };
    this.bidService.removeparticipateSupplier(obj).subscribe((res) => {
      this.ifRemoveSupplier.emit(true);
      this.modalReference.close();
      if(this.issealedBidDis) {
        this.common.success( 'Participant deleted successfully.');
      }else {
        this.common.success( this.dialogContent.user.name + ' deleted successfully.');
      }
    }, (err) => { });
  }
}
