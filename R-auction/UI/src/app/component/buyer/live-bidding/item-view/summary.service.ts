import { Injectable, LOCALE_ID, Inject } from '@angular/core';
import { formatNumber } from '@angular/common';

@Injectable()
export class SummaryService {


  constructor(
    @Inject(LOCALE_ID) private locale: string
  ) { }

  setNewProperties(itemObj, lot, auctionData) {

    itemObj.totalLandedCost = 0;
    itemObj.landedUnitRate = 0;
    itemObj.bestBid = itemObj.itemsBestBidUnitCost;
    itemObj.landedUnitRate = 0;
    itemObj.totalLandedCost = 0;
    if (itemObj.bids.length > 0) {
      itemObj.landedUnitRate = itemObj.bids[0].data.landedCost;
      itemObj.totalLandedCost = itemObj.bids[0].data.totalLandedCost;
      itemObj.currencyCode = itemObj.bids[0].data["currency"] ? itemObj.bids[0].data["currency"]["currencyCode"] : auctionData.primaryCurrency;

    }
    itemObj.lotName = lot.lotName;
    itemObj.lotID = lot.lotID;
  }

  calculateAndSortBid(bidArray, savingType, auctionData, buyer_savings_drop) {

    let auctionType = auctionData.type
    let decimalPlace = auctionData.decimalPlace;
    let decimalPattern = '.' + decimalPlace + '-' + decimalPlace;

    bidArray.forEach(bid => {
      bid.historicalTotalVal = ((bid.historicalCost ? +bid.historicalCost : 0) * (bid.minimumDesiredQuantity ? +bid.minimumDesiredQuantity : 0));
      bid.preliminaryTotalVal = ((bid.preliminaryVal ? +bid.preliminaryVal : 0) * (bid.minimumDesiredQuantity ? +bid.minimumDesiredQuantity : 0));
      bid.initialTotalVal = ((bid.initialVal ? +bid.initialVal : 0) * (bid.minimumDesiredQuantity ? +bid.minimumDesiredQuantity : 0));
      // buyer_savings_drop[0]['totalValue'] += bid.preliminaryTotalVal;
      // buyer_savings_drop[1]['totalValue'] += bid.initialTotalVal;
      // buyer_savings_drop[2]['totalValue'] += bid.historicalTotalVal;


      switch (savingType.id) {
        case 100: this.preliminaryBidSavingCal(bid, auctionType, decimalPattern);
          break;
        case 101: this.initialBidSavingCal(bid, auctionType, decimalPattern);
          break;
        case 102: this.historicalBidSavingCal(bid, auctionType, decimalPattern);
          break;
      }
    });
    bidArray = this.sortBid(bidArray);

    return bidArray;
  }

  sortBid(bidArray) {
    bidArray.sort(function (a, b) {
      if (a.savingsPercentage == 'NA' && b.savingsPercentage != 'NA') return 1;
      if (a.savingsPercentage != 'NA' && b.savingsPercentage == 'NA') return -1;
      if (a.savingsPercentage == 'NA' && b.savingsPercentage == 'NA') return -1;
      if (Number(a.savingsPercentage) > Number(b.savingsPercentage)) {
        return -1;
      }
      if (Number(a.savingsPercentage) < Number(b.savingsPercentage)) {
        return 1;
      }
      return 0;
    });
    return bidArray;
  }

  initialBidSavingCal(bidObj, auctionType, decimalPattern) {
    let itemsBestBid = bidObj && bidObj.bids && bidObj.bids.length > 0 && bidObj.bids[0].data && bidObj.bids[0].data.totalBaseCostPrimary ? bidObj.bids[0].data.totalBaseCostPrimary : null;
    switch (auctionType) {
      case 'reverse':
        // FORMULAE :: "Initial Total Value - Best Bid Total Value";
        let savings = itemsBestBid ? bidObj.initialTotalVal - itemsBestBid : 'NA';
        // FORMULAE :: "((Initial Total Value - Best Bid Total Value))/((Initial Total Value)*100";
        let savingsPercentage = itemsBestBid ? ((bidObj.initialTotalVal - itemsBestBid) / bidObj.initialTotalVal) * 100 : 'NA';
        // DECIMAL
        this.applyDecimal(bidObj, savings, savingsPercentage, decimalPattern);
        break;
      case 'forward':
        // FORMULAE :: "Best Bid Total Value - Initial Total Value";
        let savings2 = itemsBestBid && bidObj.initialTotalVal ? itemsBestBid - bidObj.initialTotalVal : 'NA';
        // FORMULAE ::  "((Best Bid Total Value - Initial Total Value))/Initial Total Value)*100";
        let savingsPercentage2 = itemsBestBid && bidObj.initialTotalVal ? ((itemsBestBid - bidObj.initialTotalVal) / bidObj.initialTotalVal) * 100 : 'NA';
        // DECIMAL
        this.applyDecimal(bidObj, savings2, savingsPercentage2, decimalPattern);
        break;
    }
  }

  preliminaryBidSavingCal(bidObj, auctionType, decimalPattern) {
    let itemsBestBid = bidObj && bidObj.bids && bidObj.bids.length > 0 && bidObj.bids[0].data && bidObj.bids[0].data.totalBaseCostPrimary ? bidObj.bids[0].data.totalBaseCostPrimary : null;
    switch (auctionType) {
      case 'reverse':
        // FORMULAE :: "Preliminary Total Value - Best Bid Total Value"
        let savings = itemsBestBid ? bidObj.preliminaryTotalVal - itemsBestBid : 'NA';
        // FORMULAE :: "((Preliminary Total Value - Best Bid Total Value))/((Preliminary Total Value)*100"
        let savingsPercentage = itemsBestBid ? ((bidObj.preliminaryTotalVal - itemsBestBid) / bidObj.preliminaryTotalVal) * 100 : 'NA';
        // DECIMAL
        this.applyDecimal(bidObj, savings, savingsPercentage, decimalPattern);
        break;
      case 'forward':
        // FORMULAE :: "Best Bid Total Value - Preliminary Total Value";
        let savings2 = itemsBestBid ? itemsBestBid - bidObj.preliminaryTotalVal : 'NA';
        // FORMULAE :: "((Best Bid Total Value - Preliminary Total Value))/Preliminary  Total Value)*100";
        let savingsPercentage2 = itemsBestBid ? ((itemsBestBid - bidObj.preliminaryTotalVal) / bidObj.preliminaryTotalVal) * 100 : 'NA';
        // DECIMAL
        this.applyDecimal(bidObj, savings2, savingsPercentage2, decimalPattern);
        break;
    }
  }

  historicalBidSavingCal(bidObj, auctionType, decimalPattern) {
    let itemsBestBid = bidObj && bidObj.bids && bidObj.bids.length > 0 && bidObj.bids[0].data && bidObj.bids[0].data.totalBaseCostPrimary ? bidObj.bids[0].data.totalBaseCostPrimary : null;
    switch (auctionType) {
      case 'reverse':
        // FORMULAE :: "Historical Total Value - Best Bid Total Value"
        let savings = itemsBestBid && bidObj.historicalTotalVal ? bidObj.historicalTotalVal - itemsBestBid : 'NA';
        // FORMULAE :: "((Historical Total Value - Best Bid Total Value)/Historical Total Value)*100"
        let savingsPercentage = itemsBestBid && bidObj.historicalTotalVal ? ((bidObj.historicalTotalVal - itemsBestBid) / bidObj.historicalTotalVal) * 100 : 'NA';
        // DECIMAL
        this.applyDecimal(bidObj, savings, savingsPercentage, decimalPattern);
        break;
      case 'forward':
        // FORMULAE :: "Best Bid Total Value - Historical Total Value";
        let savings2 = itemsBestBid && bidObj.historicalTotalVal ? itemsBestBid - bidObj.historicalTotalVal : 'NA';
        // FORMULAE ::  "((Best Bid Total Value - Historical Total Value))/Historical Total Value)*100";
        let savingsPercentage2 = itemsBestBid && bidObj.historicalTotalVal ? ((itemsBestBid - bidObj.historicalTotalVal) / bidObj.historicalTotalVal) * 100 : 'NA';
        // DECIMAL
        this.applyDecimal(bidObj, savings2, savingsPercentage2, decimalPattern);
        break;
    }
  }

  private applyDecimal(bidObj, savings, savingsPercentage, decimalPattern) {
    bidObj.savingsDisplay = savings == 'NA' ? 'NA' : savings < 0 ? formatNumber(0, this.locale, decimalPattern) : formatNumber(savings, this.locale, decimalPattern);
    bidObj.savings = savings == 'NA' ? 'NA' : savings < 0 ? 0 : savings;
    bidObj.savingsPercentage = savingsPercentage == 'NA' ? 'NA' : savingsPercentage < 0 ? 0 : savingsPercentage;
    bidObj.savingsPercentageDisplay = savingsPercentage == 'NA' ? 'NA' : savingsPercentage < 0 ? formatNumber(0, this.locale, decimalPattern) : formatNumber(savingsPercentage, this.locale, decimalPattern);
    bidObj.savingsPercentageRangeDisplay = this.isSealedbidSavingPerCal(savingsPercentage);
  }

  isSealedbidSavingPerCal(val) {
    let calval = val;
    let reVal;
    if (calval == 'NA') {
      reVal = 'NA';
    } else if (calval < 0) {
      reVal = this.process1(calval);
    } else {
      reVal = this.process2(calval);
    }
    return reVal;
  }

  process1(calval) {
    let reVal1;
    switch (true) {
      case (-5 <= calval):
        reVal1 = '>-5%';
        break;
      case (-10 <= calval):
        reVal1 = '-5 to -10%';
        break;
      case (-25 <= calval):
        reVal1 = '-10 to -25%';
        break;
      case (-50 <= calval):
        reVal1 = '-25 to -50%';
        break;
      case (-50 >= calval):
        reVal1 = '<-50%';
        break;
      default:
      // code block
    }
    return reVal1;
  }

  process2(calval) {
    let reVal2;
    switch (true) {
      case (calval <= 5):
        reVal2 = '<5%';
        break;
      case (calval <= 10):
        reVal2 = '5 to 10%';
        break;
      case (calval <= 25):
        reVal2 = '10 to 25%';
        break;
      case (calval <= 50):
        reVal2 = '25 to 50%';
        break;
      case (calval >= 50):
        reVal2 = '>50%';
        break;
      default:
      // code block
    }
    return reVal2;
  }

  callHeaderLevel(savingType, bidObj) {
    let decimalPattern = '.' + bidObj.currencyDecimalPlace + '-' + bidObj.currencyDecimalPlace;
    switch (savingType.id) {
      case 100: this.headerLevelPreliminaryBidSavingCal(bidObj, decimalPattern);
        break;
      case 101: this.headerLevelInitialBidSavingCal(bidObj, decimalPattern);
        break;
      case 102: this.headerLevelHistoricalBidSavingCal(bidObj, decimalPattern);
        break;
    }
  }

  headerLevelInitialBidSavingCal(bidObj, decimalPattern) {
    switch (bidObj.type) {
      case 'reverse':
        // FORMULAE :: "Initial Total Value - Best Bid Total Value";
        let savings = bidObj.currentBidSingleSource ? bidObj.initialBid - bidObj.currentBidSingleSource : 'NA';
        // FORMULAE :: "((Initial Total Value - Best Bid Total Value))/((Initial Total Value)*100";
        let savingsPercentage = bidObj.currentBidSingleSource ? ((bidObj.initialBid - bidObj.currentBidSingleSource) / bidObj.initialBid) * 100 : 'NA';
        // DECIMAL
        this.applyDecimal(bidObj, savings, savingsPercentage, decimalPattern);
        break;
      case 'forward':
        // FORMULAE :: "Best Bid Total Value - Initial Total Value";
        let savings2 = bidObj.currentBidSingleSource && bidObj.initialBid ? bidObj.currentBidSingleSource - bidObj.initialBid : 'NA';
        // FORMULAE ::  "((Best Bid Total Value - Initial Total Value))/Initial Total Value)*100";
        let savingsPercentage2 = bidObj.currentBidSingleSource && bidObj.initialBid ? ((bidObj.currentBidSingleSource - bidObj.initialBid) / bidObj.initialBid) * 100 : 'NA';
        // DECIMAL
        this.applyDecimal(bidObj, savings2, savingsPercentage2, decimalPattern);
        break;
    }
  }

  headerLevelHistoricalBidSavingCal(bidObj, decimalPattern) {
    switch (bidObj.type) {
      case 'reverse':
        // FORMULAE :: "Historical Total Value - Best Bid Total Value"
        let savings = bidObj.currentBidSingleSource && bidObj.historicalBid ? bidObj.historicalBid - bidObj.currentBidSingleSource : 'NA';
        // FORMULAE :: "((Historical Total Value - Best Bid Total Value)/Historical Total Value)*100"
        let savingsPercentage = bidObj.currentBidSingleSource && bidObj.historicalBid ? ((bidObj.historicalBid - bidObj.currentBidSingleSource) / bidObj.historicalBid) * 100 : 'NA';
        // DECIMAL
        this.applyDecimal(bidObj, savings, savingsPercentage, decimalPattern);
        break;
      case 'forward':
        // FORMULAE :: "Best Bid Total Value - Historical Total Value";
        let savings2 = bidObj.currentBidSingleSource && bidObj.historicalBid ? bidObj.currentBidSingleSource - bidObj.historicalBid : 'NA';
        // FORMULAE ::  "((Best Bid Total Value - Historical Total Value))/Historical Total Value)*100";
        let savingsPercentage2 = bidObj.currentBidSingleSource && bidObj.historicalBid ? ((bidObj.currentBidSingleSource - bidObj.historicalBid) / bidObj.historicalBid) * 100 : 'NA';
        // DECIMAL
        this.applyDecimal(bidObj, savings2, savingsPercentage2, decimalPattern);
        break;
    }
  }

  headerLevelPreliminaryBidSavingCal(bidObj, decimalPattern) {
    switch (bidObj.type) {
      case 'reverse':
        // FORMULAE :: "Preliminary Total Value - Best Bid Total Value"
        let savings = bidObj.currentBidSingleSource ? bidObj.preliminaryBid - bidObj.currentBidSingleSource : 'NA';
        // FORMULAE :: "((Preliminary Total Value - Best Bid Total Value))/((Preliminary Total Value)*100"
        let savingsPercentage = bidObj.currentBidSingleSource ? ((bidObj.preliminaryBid - bidObj.currentBidSingleSource) / bidObj.preliminaryBid) * 100 : 'NA';
        // DECIMAL
        this.applyDecimal(bidObj, savings, savingsPercentage, decimalPattern);
        break;
      case 'forward':
        // FORMULAE :: "Best Bid Total Value - Preliminary Total Value";
        let savings2 = bidObj.currentBidSingleSource ? bidObj.currentBidSingleSource - bidObj.preliminaryBid : 'NA';
        // FORMULAE :: "((Best Bid Total Value - Preliminary Total Value))/Preliminary  Total Value)*100";
        let savingsPercentage2 = bidObj.currentBidSingleSource ? ((bidObj.currentBidSingleSource - bidObj.preliminaryBid) / bidObj.preliminaryBid) * 100 : 'NA';
        // DECIMAL
        this.applyDecimal(bidObj, savings2, savingsPercentage2, decimalPattern);
        break;
    }
  }

}
