import { Component, OnInit, Input, OnDestroy } from '@angular/core';
import { BuyerEditService } from '../../../../component-service/buyer-edit.service';
import { CommonService } from 'src/app/commonService/common.service';
import * as config from 'src/app/appConfig/app.config';
import { SupplierService } from 'src/app/component/component-service/supplier.service';

/* NgRx */
import { Store, select} from '@ngrx/store';
import * as fromEditModule from '../../state/editmodule.reducer';
import { takeWhile } from 'rxjs/operators';
import * as fromAppModule from '../../../../../state/app.reducer';

@Component({
  selector: 'app-preliminarybids',
  templateUrl: './preliminarybids.component.html',
  styleUrls: ['./preliminarybids.component.css']
})
export class PreliminarybidsComponent implements OnInit, OnDestroy {

  multipleCurrencyAuction: boolean = false;
  afMfEnabled: boolean = false;
  componentActive: boolean = true;
	auctionReadOnly: boolean = false;

  @Input() auctionData =
    {
      decimalPlace: 0,
      minBidChangeValue: null,
      minBidType: null,
      currency: [],
      primaryCurrency: null
    }
  @Input() supplierUser = false;
  @Input() auctionID = null;
  @Input() displaySupplier = null;
  @Input() preBid = [];
  @Input() item = [];
  @Input() treeData = [];
  preliminaryData = [];
  status = false;
  decimalValue = "";
  selectCurrency = null;
  addFactor = 0;
  mulFactor = 0;
  selectBidCurrency = null;
  currency = null;
  bidData = { addFactor: 0, mulFactor: 0, currency: null, supplierID: null };
  auctionStatusList = config.AUCTIONSTATUS;
  displayFlag = false;
  errorFlag = false;
  total = { baseCost: 0, variableCost: 0, landedCost: 0, totalLandedCost: 0 };

  constructor(
    public buyerService: BuyerEditService, 
    public common: CommonService, 
    private supplierService: SupplierService,
		private store: Store<fromEditModule.EditModuleState>,
		private appstore: Store<fromAppModule.AppModuleState>
    ) {
    this.buyerService.changeCurrency.subscribe(async (data: any) => {
      if (this.supplierUser) {
        this.selectCurrency = this.auctionData.currency.filter(x => x.currencyCode == data.currencyCode)[0];
        this.getSupplierPreData();
        this.getTotalValue();
      }
    });
    this.common.toggleDiv.subscribe((data: any) => {
      if (data.flag === 'viewPopupCallToPreliminary') {
        this.saveCalculate(true);
      }
    });
  }

  ngOnInit() {
    this.appstore.pipe(select(fromAppModule.getAuctionConfigOnly),takeWhile(() => this.componentActive) ).subscribe(auctionConfig => {
      if(auctionConfig && auctionConfig.features) {
        this.afMfEnabled = auctionConfig.features.currency;
      }
    });
    this.store.pipe(select(fromEditModule.getAuctionReadOnly),takeWhile(() => this.componentActive) ).subscribe(auctionReadOnly => {
			this.auctionReadOnly = auctionReadOnly;
    });
    this.store.pipe(select(fromEditModule.getAuctionDetails),takeWhile(() => this.componentActive) ).subscribe((auctionDetails: any) => {
			this.multipleCurrencyAuction = auctionDetails.bidCurrencyCount > 1 ? true: false;
    });

    this.preliminaryData = [];    
    this.auctionData.decimalPlace=this.auctionData.decimalPlace?this.auctionData.decimalPlace:this.auctionData["currencyDecimalPlace"];
    this.displayFlag = (this.buyerService.auctionData.auctionStatus == this.auctionStatusList.DR || this.buyerService.auctionData.auctionStatus == this.auctionStatusList.PB) ? true : false;
    if (this.supplierUser) {
      this.selectCurrency = this.auctionData.currency.filter(x => x.currencyCode == this.displaySupplier.supplierCurrency.currencyCode)[0];
      this.addFactor = (this.displaySupplier.supplierAF) ? this.displaySupplier.supplierAF : 0;
      this.mulFactor = (this.displaySupplier.supplierMF) ? this.displaySupplier.supplierMF : 0;
      this.preliminaryData = [...this.treeData];
      this.getSupplierPreData();
    }
    else {

      this.selectBidCurrency = this.auctionData.currency.filter(x => x.currencyCode == ((this.preBid.length > 0) ? this.preBid[0].currency.currencyCode : this.auctionData.primaryCurrency.currencyCode))[0];
      //if (this.displaySupplier.supplierAF || this.displaySupplier.supplierMF) {/
      this.addFactor = (this.preBid.length > 0) ? this.preBid[0].supplierAF : (this.displaySupplier.supplierAF) ? this.displaySupplier.supplierAF : 0;
      this.mulFactor = (this.preBid.length > 0) ? this.preBid[0].supplierMF : (this.displaySupplier.supplierMF) ? this.displaySupplier.supplierMF : 0;
      //   let bidCurrency= this.auctionData.currency.filter(x => x.currencyCode == this.displaySupplier.supplierCurrency.currencyCode);
      //   if (bidCurrency.length > 0) 
      //     this.selectBidCurrency = bidCurrency[0];
      // }
      this.selectCurrency = this.selectBidCurrency;
      this.bidData = { addFactor: this.addFactor, mulFactor: this.mulFactor, currency: this.selectCurrency, supplierID: this.displaySupplier.supplierID }
      this.getSupplierBiddingData();
    }
    this.getTotalValue();
  }

  saveAllBid() {
    this.saveCalculate(false, true);
  }

  getSupplierPreData() {
    let primaryValue = this.auctionData.currency.find(x => x.currencyCode == this.auctionData.primaryCurrency);
    this.preliminaryData.forEach(lot => {
      lot.items.forEach(element => {
        let bids = this.preBid.filter(x => x.lineItemID == element.itemID);
        if (bids.length > 0) {
          //  element.itemsBestBidPrimary =(primaryValue.currencyCode==this.selectCurrency.currencyCode)?bids[0].baseCostPrimary: (bids[0].currency.currencyCode == this.selectCurrency.currencyCode) ? bids[0].baseCost : config.convertCurrency(bids[0].baseCost, primaryValue.exchangeRate, this.selectCurrency.exchangeRate);
          element.itemsBestBidPrimary = bids[0].baseCostPrimary.toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
          element.landedUnitRate = (bids[0].landedCost / this.selectCurrency.exchangeRate).toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
          element.totalLandedCost = (bids[0].totalLandedCost / this.selectCurrency.exchangeRate).toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
        }
        else {
          element.itemsBestBidPrimary = 0;
        }
        element.bestBid = (element.itemsBestBidPrimary / this.selectCurrency.exchangeRate).toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
        element.totalBestBid = ((element.itemsBestBidPrimary * element.minimumDesiredQuantity) / this.selectCurrency.exchangeRate).toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);

      })
    })
    this.preliminaryData.forEach(lot => {
      lot.items.forEach(item => {
        item.itemWeight = config.calculateItemWeightByBuyer({ bestBid: item.bestBid, minimumDesiredQuantity: item.minimumDesiredQuantity }, this.preliminaryData);
        item.itemWeight = (item.itemWeight * 100).toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
      })
    })
    this.decimalValue = "0.0-" + (this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"];
  }

  getTotalValue() {
    this.total = { baseCost: 0, variableCost: 0, landedCost: 0, totalLandedCost: 0 };
    this.preliminaryData.forEach(lot => {
      lot.items.forEach(item => {
        this.total.baseCost +=item["bestBid"] ?Number(item.bestBid):0;
        this.total.variableCost += item["totalBestBid"] ?Number(item.totalBestBid):0;
        this.total.landedCost += item["landedUnitRate"]?Number(item.landedUnitRate):0;
        this.total.totalLandedCost +=item["totalLandedCost"]? Number(item.totalLandedCost):0;
      });
    });
   }

  getSupplierBiddingData() {
    if (this.buyerService.auctionData.auctionStatus.toLowerCase() == config.AUCTIONSTATUS.DR.toLowerCase() || this.buyerService.auctionData.auctionStatus.toLowerCase() == config.AUCTIONSTATUS.PB.toLowerCase()) {
      this.status = true;
    }
    this.buyerService.lotList.forEach((lot, index) => {
      this.preliminaryData.push({ lotID: lot.lotID, lotName: lot.lotName });
      this.preliminaryData[index].items = this.buyerService.itemDetails.filter(x => x.lotID == lot.lotID);
    })
    this.preliminaryData = this.preliminaryData.filter((obj) => {
      return obj.items.length > 0;
    });
    this.preliminaryData.forEach(lot => {
      lot.items.forEach(element => {
        let preliminaryCost = (this.preBid != null) ? this.preBid.filter(x => x.lineItemID == element.itemID) : [];
        element.bestBid = (preliminaryCost.length > 0) ? preliminaryCost[0].baseCost : null;
        element.totalBestBid = (preliminaryCost.length > 0) ? preliminaryCost[0].variableCost : null;
        element.baseCost = (preliminaryCost.length > 0) ? preliminaryCost[0].baseCost : null;
        element.variableCost = (preliminaryCost.length > 0) ? preliminaryCost[0].variableCost : null;

      })
    })
    this.preliminaryData.forEach(lot => {
      lot.items.forEach(element => {
        element.submit = false;
        let landedData = null;
        landedData = config.calculateTotalLandedCost(this.addFactor, this.mulFactor, [...this.preliminaryData], element, this.selectCurrency.exchangeRate, false, (this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
        if (landedData["landedUnit"]) {
          element.landedUnitRate = landedData.landedUnit;
          element.totalLandedCost = landedData.totalLanded;
          element.itemWeight = config.calculateItemWeightByBuyer({ bestBid: element.bestBid, minimumDesiredQuantity: element.minimumDesiredQuantity }, this.preliminaryData);
          element.itemWeight = (element.itemWeight * 100).toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
        }
        element.amount = "";
        element.flag = true;

      })
    })

    this.decimalValue = "0.0-" + (this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"];
  }

	saveCalculate(accept = false, bidAll = false) {
		try {
			let landedData = null;
			let dataFlag = false;
			let saveItemData = [];
			let preDataExist = [];
			this.getDefaultZero();
			if (!accept && !bidAll) {
				this.preliminaryData.forEach(lot => {
					preDataExist = lot.items.filter(x => x.bestBid > 0);
					if (preDataExist.length > 0) {
						preDataExist.forEach(item => {
						let primaryValue = this.auctionData.currency.filter(x => x.currencyCode == this.selectCurrency.currencyCode)[0];
						item.baseCost = (primaryValue.currencyCode == this.selectBidCurrency.currencyCode) ? item.baseCost : config.convertCurrency(item.baseCost, primaryValue.exchangeRate, this.selectBidCurrency.exchangeRate)
						if (primaryValue.currencyCode != this.selectBidCurrency.currencyCode) {
							item.baseCost = Number(item.baseCost.toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]));
						}
						})
					}
				})
			}
			if (bidAll) {
				let bidFlag = false
				this.preliminaryData.forEach(lot => {
				preDataExist = lot.items.filter(x => x.amount || x.amount > 0);
				if (preDataExist.length > 0) {
					bidFlag = true;
					preDataExist.forEach(item => {
					let primaryValue = this.auctionData.currency.filter(x => x.currencyCode == this.selectCurrency.currencyCode)[0];
					item.baseCost = (primaryValue.currencyCode == this.selectBidCurrency.currencyCode) ? item.amount : config.convertCurrency(item.amount, primaryValue.exchangeRate, this.selectBidCurrency.exchangeRate)
					if (primaryValue.currencyCode != this.selectBidCurrency.currencyCode) {
						item.baseCost = Number(item.baseCost.toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]));
					}
					})
				}
				})
				if (!bidFlag)
				return this.common.error("Not input value in any item");
			}
			this.preliminaryData.forEach(lot => {
				preDataExist = lot.items.filter(x => (bidAll) ? x.amount > 0 : x.bestBid > 0);
				if (preDataExist.length > 0) {
					dataFlag = true;
					preDataExist.forEach(item => {
						if (accept) {
							landedData = {
								landedUnit: (item.landedUnitRate * this.selectCurrency.exchangeRate).toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]),
								totalLanded: (item.totalLandedCost * this.selectCurrency.exchangeRate).toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"])
							};
						} else {
							landedData = null;
							landedData = config.calculateTotalLandedCost(this.addFactor, this.mulFactor, this.preliminaryData, item, this.selectBidCurrency.exchangeRate, false, (this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
							if (landedData["landedUnit"]) {
								item.landedUnit = landedData.landedUnit.toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
								item.totalLanded = landedData.totalLanded.toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
							}
						}
						saveItemData.push({
							"auctionID": accept ? this.auctionID : this.buyerService.auctionData.auctionID,
							"organizationID": 0,
							"lineItemID": item.itemID,
							"bidType": "string",
							"name": item.itemName,
							"fixedCost": 0,
							"minCapacity": 0,
							"maxCapacity": 0,
							"currencyCode": accept ? this.selectCurrency.currencyCode : this.selectBidCurrency.currencyCode,
							"description": 0,
							"baseCost": accept ? item.bestBid : item.baseCost,//(item.baseCost).toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]),
							"variableCost": 0,
							"vendorID": this.displaySupplier.supplierID,
							"currency": {
								"currencyName": accept ? this.selectCurrency.currencyName : this.selectBidCurrency.currencyName,
								"currencyCode": accept ? this.selectCurrency.currencyCode : this.selectBidCurrency.currencyCode
							},
							"supplierAF": this.addFactor,
							"supplierMF": this.mulFactor,
							"landedCost": landedData.landedUnit,
							"totalLandedCost": landedData.totalLanded
						})					
					});
				}
			});
			if (dataFlag) {
				this.buyerService.insertPreBidItem(saveItemData).subscribe((res: any) => {
				this.selectCurrency = this.selectBidCurrency;
				this.preliminaryData.forEach(lot => {
					lot.items.forEach(item => {
						let preItem = res.data.filter(x => x.lineItemID == item.itemID);
						if (preItem.length > 0) {
							item.amount = "";
							item.bestBid = preItem[0].baseCost;
							item.totalBestBid = preItem[0].baseCost * item.minimumDesiredQuantity;
							if (!accept) {
								item.baseCost = item.bestBid;
								item.variableCost = item.totalBestBid;
								item.landedUnitRate = item.landedUnit;
								item.totalLandedCost = item.totalLanded;
							}
						}
						this.bidData = { addFactor: this.addFactor, mulFactor: this.mulFactor, currency: this.selectCurrency, supplierID: this.displaySupplier.supplierID };
					});
				});
				this.preliminaryData.forEach(lot => {
					lot.items.forEach(element => {
					element.itemWeight = config.calculateItemWeightByBuyer({ bestBid: element.bestBid, minimumDesiredQuantity: element.minimumDesiredQuantity }, this.preliminaryData);
					element.itemWeight = (element.itemWeight * 100).toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
					if (!accept) {
						this.buyerService.bidCalculator.next(this.bidData);
					}
					else {
						this.supplierService.acceptStatus.next(true);
					}
					})
				});
				this.getTotalValue();
				
				if (bidAll) this.common.success("Bid All Saved Successfully");
				
				}, (err: any) => {
					this.common.error(err);
				})
			} else {
				if (!accept) {
					this.selectCurrency = this.selectBidCurrency;
				}
				this.bidData = { addFactor: this.addFactor, mulFactor: this.mulFactor, currency: this.selectCurrency, supplierID: this.displaySupplier.supplierID };
				if (!accept) {
					this.buyerService.bidCalculator.next(this.bidData);
				}
			}

		} catch (ex) {
			this.common.error(ex);
		}
	}

  onSaveClick(result) {
    let objData = {};
    let bestBid = result.bestBid;
    result.bestBid = result.amount;
    result.baseCost = result.amount;
    result.totalBestBid = result.amount * result.minimumDesiredQuantity;
    result.variableCost = result.totalBestBid;
    this.getDefaultZero();
    let landedData = null;
    landedData = config.calculateTotalLandedCost(this.bidData.addFactor, this.bidData.mulFactor, this.preliminaryData, result, this.selectBidCurrency.exchangeRate, false, (this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
    if (landedData["landedUnit"]) {
      objData = [{
        "auctionID": this.buyerService.auctionData.auctionID,
        "organizationID": 0,
        "lineItemID": result.itemID,
        "bidType": "string",
        "name": result.itemName,
        "fixedCost": 0,
        "minCapacity": 0,
        "maxCapacity": 0,
        "currencyCode": this.selectBidCurrency.currencyCode,
        "description": 0,
        "baseCost": result.amount,
        "variableCost": 0,
        "vendorID": this.displaySupplier.supplierID,
        "currency": {
          "currencyName": this.selectBidCurrency.currencyName,
          "currencyCode": this.selectBidCurrency.currencyCode
        },
        "supplierAF": this.addFactor,
        "supplierMF": this.mulFactor,
        "landedCost": landedData.landedUnit.toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]),
        "totalLandedCost": landedData.totalLanded.toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"])
      }]
      this.buyerService.insertPreBidItem(objData).subscribe((res: any) => {
        result.submit = true;
        result.flag = true;
        result.bestBid = result.amount;
        result.totalBestBid = result.amount * result.minimumDesiredQuantity;
        result.baseCost = result.bestBid;
        result.variableCost = result.totalBestBid;
        result.amount = "";
        result.landedUnitRate = landedData.landedUnit.toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
        result.totalLandedCost = landedData.totalLanded.toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
        this.preliminaryData.forEach(lot => {
          lot.items.forEach(element => {
            // if (element.itemID != result.itemID) {
            let landedData = null;
            landedData = config.calculateTotalLandedCost(this.addFactor, this.mulFactor, [...this.preliminaryData], element, this.selectBidCurrency.exchangeRate, false, (this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
            if (landedData["landedUnit"]) {
              element.landedUnitRate = landedData.landedUnit.toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
              element.totalLandedCost = landedData.totalLanded.toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
              // }
              element.itemWeight = config.calculateItemWeightByBuyer({ bestBid: element.bestBid, minimumDesiredQuantity: element.minimumDesiredQuantity }, this.preliminaryData);
              element.itemWeight = (element.itemWeight * 100).toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
            }
          })
        })
        this.getTotalValue();
        this.common.success("Preliminary Bid For " + result.itemName + " Saved Successfully");
      }, (err) => {
        result.bestBid = bestBid;
        result.totalBestBid = result.bestBid * result.minimumDesiredQuantity;
        this.common.error(err)
      })

    }
  }

  onTextChange(data) {
    try {
      if (data["amount"])
        data.flag = (data.amount.length > 0) ? false : true;
      else
        data.flag = false;
    }
    catch (ex) {
      this.common.error(ex);
    }
  }

  deleteAllPreBid(){
    try {
      let itemIDs=[];
      let bidFlag=false;
      this.preliminaryData.forEach(lot => {
        let item = lot.items.filter(x => x.bestBid);
        if (item.length > 0) {
          bidFlag = true
          // itemIDs.push(item.map(x => x.itemID)[0]);
          item.forEach(element => {
            itemIDs.push(element.itemID);
          });
        }
      })

      if(!bidFlag)
           return this.common.error("Not bid in any item");

      let preliminaryBid = {
        auctionID: this.buyerService.auctionData.auctionID,
        supplierID: [this.displaySupplier.supplierID],
        itemID: itemIDs
      }
      this.buyerService.deletePreliminaryBid(preliminaryBid).subscribe((res: any) => {
        this.preliminaryData.forEach(lot => {
          lot.items.forEach(item => {
            item.bestBid = null;
            item.totalBestBid = null;
            item.landedUnitRate = null;
            item.totalLandedCost = null;
            item.baseCost = null;
            item.variableCost = null;
            delete item["itemWeight"];
          })
        })
        this.getTotalValue();
        this.common.success("Preliminary Bids Deleted Successfully");
      }, err => {
        this.common.error(err);
      })
    }
    catch (ex) {
      this.common.error(ex);
    }

  }

  deletPreliminaryBids(item) {
    try {
      let preliminaryBid = {
        auctionID: this.buyerService.auctionData.auctionID,
        supplierID: [this.displaySupplier.supplierID],
        itemID: [item.itemID]
      }
      this.buyerService.deletePreliminaryBid(preliminaryBid).subscribe((res: any) => {
        item.bestBid = null;
        item.totalBestBid = null;
        item.landedUnitRate = null;
        item.totalLandedCost = null;
        item.baseCost = null;
        item.variableCost = null;
        this.preliminaryData.forEach(lot => {
          lot.items.forEach(element => {
            //  if (element.itemID != item.itemID) {
            let landedData = null;
            landedData = config.calculateTotalLandedCost(this.addFactor, this.mulFactor, [...this.preliminaryData], element, this.selectBidCurrency.exchangeRate, false, (this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
            if (landedData["landedUnit"]) {
              element.landedUnitRate = landedData.landedUnit;
              element.totalLandedCost = landedData.totalLanded;
              if (element.itemID != item.itemID) {
                element.itemWeight = config.calculateItemWeightByBuyer({ bestBid: element.bestBid, minimumDesiredQuantity: element.minimumDesiredQuantity }, this.preliminaryData);
                element.itemWeight = (element.itemWeight * 100).toFixed((this.auctionData.decimalPlace) ? this.auctionData.decimalPlace : this.auctionData["currencyDecimalPlace"]);
              }
              else {
                if (element.itemWeight) {
                  delete element.itemWeight;
                }
              }
            }
          })
        })
        this.getTotalValue();
        this.common.success("Preliminary Bid For " + item.itemName + " Deleted Successfully");
      }, err => {
        this.common.error(err);
      })
    }
    catch (ex) {
      this.common.error(ex);
    }
  }

  getDefaultZero = (flag = null) => {
    // if (flag == "AF") {
    this.addFactor = (this.addFactor) ? this.addFactor : 0;
    //}
    //if (flag == "MF") {

    this.mulFactor = (this.mulFactor) ? this.mulFactor : 0;
    //}
  }


  acceptPercent(event: KeyboardEvent) {
    this.errorFlag = config.percentageRange(event);
    if (!this.errorFlag) {
      event.preventDefault();
      event.stopPropagation();
    }


  }

  ngOnDestroy() {
		this.componentActive = false;
	}

}
