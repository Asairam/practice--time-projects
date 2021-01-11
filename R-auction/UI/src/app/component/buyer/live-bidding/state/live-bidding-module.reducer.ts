import * as fromRoot from '../../../../state/app.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { LiveBiddingModuleActionTypes, LiveBiddingModuleActions } from './live-bidding-module.actions';

interface State extends fromRoot.State {
    liveBiddingModule: LiveBiddingModuleState
}

export interface LiveBiddingModuleState {    
    liveBiddingModuleStateInitialized: boolean,
    auctionDetails: AuctionDetails,
    sealedbidDataShowHide: boolean
}

interface AuctionDetails {
    status: any,
    republishRequired: boolean,
    mode: String,
    participantAdditionEnabled: Boolean,
    primaryCurrency: Currency
}

interface Currency {
    currencyCode: string,
    currencyName: string
}

const initialState: LiveBiddingModuleState = {
    liveBiddingModuleStateInitialized: false,
    sealedbidDataShowHide: false,
    auctionDetails: {
        status: null,
        republishRequired: false,
        mode: '',
        participantAdditionEnabled: false,
        primaryCurrency: null
    },
}


const getLiveBiddingModuleFeatureState = createFeatureSelector<LiveBiddingModuleState>('liveBiddingModule');
export const getLiveBiddingModuleStateInitialized = createSelector(getLiveBiddingModuleFeatureState, state => state.liveBiddingModuleStateInitialized);
export const getAuctionDetails = createSelector(getLiveBiddingModuleFeatureState, state => state.auctionDetails);
export const getAuctionStatus = createSelector(getAuctionDetails, state => {
    if(state.status && state.status == 'published' && state.republishRequired) {
        return 'suspended';
    }
    return state.status;
});
export const getLiveBiddingModuleSealedbidDataShowHide = createSelector(getLiveBiddingModuleFeatureState, state => state.sealedbidDataShowHide);
export function reducer(state = initialState, action: LiveBiddingModuleActions): LiveBiddingModuleState {
    switch(action.type) {
        case LiveBiddingModuleActionTypes.ClearLiveBiddingModuleData:
            return {
                ...initialState,
            }
        case LiveBiddingModuleActionTypes.SetStatusAndRepublishRequired:
            return {
                ...state,
                auctionDetails: {
                    ...state.auctionDetails,
                    republishRequired: action.payload.republishRequired,
                    status: action.payload.status,
                    primaryCurrency: action.payload.primaryCurrency ? action.payload.primaryCurrency : state.auctionDetails.primaryCurrency
                }
            }
        case LiveBiddingModuleActionTypes.SealedBidModeDataHideShow:
            return {
                ...state,
                sealedbidDataShowHide : action.payload
            }
            break;
        default:
            return state;
    }
}