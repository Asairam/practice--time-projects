import * as fromRoot from '../../../../state/app.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { SupplierBiddingModuleActionTypes, SupplierBiddingModuleActions } from './supplier-bidding.actions';

export interface State extends fromRoot.State {
    supplierBiddingModule: SupplierBiddingModuleState
}

export interface SupplierBiddingModuleState {
    supplierBiddingModuleStateInitialized: boolean, 
    auctionDetails: AuctionDetails,
}

interface AuctionDetails {
    status: any,
    republishRequired: boolean,
    takeLeadApplicable: boolean,
    takeLeadEnabled: boolean,
    biddingCurrency: CurrencyAndExchange
    primaryCurrency: Currency,
    currencyDecimal: number,
    additionMultiplicationFactor: boolean
}

interface CurrencyAndExchange {
    currencyName: string,
    currencyCode: string,
    exchangeRate: number
}

interface Currency {
    currencyName: string,
    currencyCode: string
}

const initialState: SupplierBiddingModuleState = {
    supplierBiddingModuleStateInitialized: false,
    auctionDetails: {
        status: null,
        republishRequired: false,
        takeLeadApplicable: false,
        takeLeadEnabled: false,
        biddingCurrency: null,
        primaryCurrency: null,
        currencyDecimal: 0,
        additionMultiplicationFactor: false
    },
}

const getSupplierBiddingModuleFeatureState = createFeatureSelector<SupplierBiddingModuleState>('supplierBiddingModule');
export const getSupplierBiddingModuleInitialized = createSelector(getSupplierBiddingModuleFeatureState, state => state.supplierBiddingModuleStateInitialized);
export const getAuctionDetails = createSelector(getSupplierBiddingModuleFeatureState, state => state.auctionDetails);
export const getAuctionStatus = createSelector(getAuctionDetails, state => {
    if(state.status && state.status == 'published' && state.republishRequired) {
        return 'suspended';
    }
    return state.status;
});


export function reducer(state = initialState, action: SupplierBiddingModuleActions): SupplierBiddingModuleState {
    switch(action.type) {
        case SupplierBiddingModuleActionTypes.ClearSupplierBiddingModuleData:
            return {
                ...initialState,
                auctionDetails : {
                    ...initialState.auctionDetails
                }  
            }
        case SupplierBiddingModuleActionTypes.SetStatusAndRepublishRequired:
            return {
                ...state,
                auctionDetails: {
                    ...state.auctionDetails,
                    republishRequired: action.payload.republishRequired,
                    status: action.payload.status,
                    takeLeadApplicable: action.payload.status == 'open' && (action.payload.infoShownToSupplier == 'price and rank' || action.payload.infoShownToSupplier == 'price') ? true : false
                }
            }
        case SupplierBiddingModuleActionTypes.SetBiddingCurrencyAndExchangeRate:
            return {
                ...state,
                auctionDetails: {
                    ...state.auctionDetails,
                    biddingCurrency : action.payload
                }
            }
        case SupplierBiddingModuleActionTypes.SetPrimaryCurrency:
            return {
                ...state,
                auctionDetails: {
                    ...state.auctionDetails,
                    primaryCurrency : action.payload
                }
            } 
        case SupplierBiddingModuleActionTypes.SetCurrencyDecimal:
            return {
                ...state,
                auctionDetails: {
                    ...state.auctionDetails,
                    currencyDecimal : action.payload.currencyDecimal
                }
            }           
        case SupplierBiddingModuleActionTypes.SetAdminConfigFeature:
            return {
                ...state,
                auctionDetails : {
                    ...initialState.auctionDetails,
                    takeLeadEnabled: action.payload.takeLead ? true : false,
                    additionMultiplicationFactor: action.payload.additionMultiplicationFactor ? true : false 
                }
            }
        default:
            return state;
    }
}