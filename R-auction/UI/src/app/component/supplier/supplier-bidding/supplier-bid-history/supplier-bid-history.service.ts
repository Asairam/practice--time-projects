import { Injectable } from '@angular/core';

@Injectable()
export class SupplierbidhistoryService {

    constructor() {}

    getFormatedOutput(list, exchangeRate) {
        list.sort((a, b) => {
            var dateA = new Date(a.submitDate).getTime();
            var dateB = new Date(b.submitDate).getTime();
            return dateA < dateB ? 1 : -1;
        });

        list.forEach(bid => {
            bid.convertedLandedCost = bid.landedCost / exchangeRate;
            bid.convertedTotalLandedCost = bid.totalLandedCost / exchangeRate;
        });

        let filteredList = list.filter((obj) => {
            return !obj.isDeleted;
        });


        return { filteredList: filteredList };
    }
}