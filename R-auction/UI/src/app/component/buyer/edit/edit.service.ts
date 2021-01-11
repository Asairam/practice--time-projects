import { Injectable } from '@angular/core';
import { BuyerEditService } from '../../component-service/buyer-edit.service'
import { CommonService } from 'src/app/commonService/common.service';
import { AuthService } from '../../../authService/auth.service';
import { MatDialogConfig, MatDialog } from '@angular/material';
import { RepublishQuestionComponent } from '../status-details/republish-question/republish-question.component';
import { Router } from '@angular/router';
import * as routerconfig from '../../../appConfig/router.config';
@Injectable()
export class EditService {

    constructor(
        private buyerEditService: BuyerEditService, 
        private common: CommonService, 
        private auth: AuthService,
        private matDialog: MatDialog, 
        private router: Router, 
        private buyerService: BuyerEditService,
    ) { }

    getStatus(auctionID) {
        return new Promise((resolve, reject) => {
            this.buyerEditService.getAuctionData(auctionID).subscribe((res: any) => {
                if (res.success) {
                    let isHost;
                    if(this.auth.getUserData().email !== res.data.auctionLeader.email) {
                        isHost = true;
                    } else {
                        isHost = false;
                    }
                    this.common.auctionLeader = Object.assign({ 'host': isHost }, res.data.auctionLeader);
                    resolve(res.data);
                } else {
                    reject("No auction status data.")
                }
            }, (err) => {
                reject("Api failed for fetching auction status.")
            })
        });
    }

    showPopupForSuspend() {
        const objMatDialogConfig = new MatDialogConfig();
        objMatDialogConfig.panelClass = 'dialog-lg';
        objMatDialogConfig.data = {
          dialogMessage: "Please Confirm",
          tab: 'askRepubQuest',
          dialogPositiveBtn: 'Edit & Re-Publish',
          dialogNegativeBtn: "Read Only",
          dialogContent: {
            msg: ''
          }
        }
        objMatDialogConfig.disableClose = true;
        let refMatDialog = this.matDialog.open(RepublishQuestionComponent, objMatDialogConfig);
        return refMatDialog.afterClosed();
    }

    redirectToEdit(val) {    
        let obj;
        if (val.isTemplate) {
          obj = { status: val.status, template: true };
        } else {
          obj = { status: val.status };
        }
        if(val.addParticipant) obj.addParticipant = true;
    
        let  allowEdit = (obj) => {
          this.router.navigate([routerconfig.buyer_router_links.EDIT_AUCTION+`/${val.auctionID}`], { queryParams: obj });
        } 
    
        let readOnly = (obj) => {       
          obj.mode = 'readonly';
          this.router.navigate([routerconfig.buyer_router_links.EDIT_AUCTION+`/${val.auctionID}`], { queryParams: obj });
        }
    
        if(val.status.toLowerCase() === 'published' && !val.republishRequired) {
          this.showPopupForSuspend().subscribe((value) => {    
            if(value == 'cancel') return;
            if(value == 'yes') {
              this.suspendAuction(val.auctionID).then((res) => {
                allowEdit(obj);          
              }).catch()
            }
            if(value == 'no') readOnly(obj);      
          });
           
        }else {
          allowEdit(obj);
        }  
      }

      suspendAuction(auctionID) {
        return new Promise((resolve, reject) => {
          this.buyerService.suspendAuctionId(auctionID).subscribe((res: any) => {
            resolve(res);
          }, err => reject())
        })
        
      }

}