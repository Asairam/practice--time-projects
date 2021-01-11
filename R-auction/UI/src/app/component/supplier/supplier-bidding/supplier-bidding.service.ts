import { Injectable } from "@angular/core";
import { SupplierService } from '../../component-service/supplier.service';
import { resolve } from 'url';

@Injectable()
export class SupplierBiddingService {

    constructor(
        private supplierservice: SupplierService
    ) { }

    getAuctionDetailsById(auctionID) {
        return new Promise((resolve, reject) => {
            this.supplierservice.getLiveBidDetails(auctionID).subscribe(res => {
                resolve(res);
            }, err => {
                reject()
            })
        });        
    }

    getSupplierOrgFeature(auctionID) {
        return new Promise((resolve, reject) => {
            this.supplierservice.getSupplierOrgFeature(auctionID).subscribe(res => {
                resolve(res);
            }, err => {
                reject()
            })
        })
    }

}