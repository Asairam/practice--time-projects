import * as fromRoot from '../../../../state/app.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { EditModuleActions, EditModuleActionTypes } from './editmodule.actions';

export interface State extends fromRoot.State {
    editModule: EditModuleState
}


export interface EditModuleState {
    editModuleStateInitialized: boolean,
    auctionReadOnly: boolean,
    participantLive: boolean,
    auctionDetails: AuctionDetails,
}

interface AuctionDetails {
    status: any,
    republishRequired: boolean,
    mode: String,
    addParticipant: boolean,
    participantAdditionOn: boolean,    
    sealedBidAuction:boolean,
    bidCurrencyCount: number,
    primaryCurrency: Currency,
    currencyDecimal: number,
    auctionId: number
}

interface Currency {
    currencyCode: string,
    currencyName: string
}

const initialState: EditModuleState = {
    editModuleStateInitialized: false,
    auctionReadOnly: false,
    participantLive: false,
    auctionDetails: {
        status: null,
        republishRequired: false,
        mode: '',
        addParticipant: false,
        participantAdditionOn: false,
        sealedBidAuction:false,
        bidCurrencyCount: 1,
        primaryCurrency: null,
        currencyDecimal: 0,
        auctionId: null
    },
}

const getEditModuleFeatureState = createFeatureSelector<EditModuleState>('editModule');
export const getEditModuleStateInitialized = createSelector(getEditModuleFeatureState, state => state.editModuleStateInitialized);
export const getAuctionReadOnly = createSelector(getEditModuleFeatureState, state => state.auctionReadOnly);
export const getAuctionDetails = createSelector(getEditModuleFeatureState, state =>  {
    state.auctionDetails.participantAdditionOn = (state.participantLive && state.auctionDetails.addParticipant && state.auctionDetails.status == 'open') ? true : false;
    return state.auctionDetails
});
export const getAuctionStatus = createSelector(getAuctionDetails, state => {
    if(state.status && state.status == 'published' && state.republishRequired) {
        return 'suspended';
    }
    return state.status;
});
export const getSealedBidStatus = createSelector(getAuctionDetails, state => state.sealedBidAuction);


export function reducer(state = initialState, action: EditModuleActions): EditModuleState {
    switch(action.type) {
        case EditModuleActionTypes.ClearEditModuleData:
            return {
                ...initialState,
                auctionDetails : {
                    ...initialState.auctionDetails
                }  
            }
        case EditModuleActionTypes.SetAuctionReadOnlyMode:
            return {
                ...state,
                auctionReadOnly : action.payload
            }
            break;
        case EditModuleActionTypes.SetAuctionStatus: 
            return {
                ...state,
                auctionDetails: {
                   ...state.auctionDetails,
                   status: action.payload
                }
            }
        case EditModuleActionTypes.SetStatusAndRepublishRequired:
            return {
                ...state,
                auctionDetails: {
                    ...state.auctionDetails,
                    auctionId: action.payload.auctionId ? action.payload.auctionId : state.auctionDetails.auctionId,
                    republishRequired: action.payload.republishRequired,
                    status: action.payload.status ? action.payload.status : state.auctionDetails.status,
                    sealedBidAuction: action.payload.isSealedBidAuction,
                    bidCurrencyCount: action.payload.bidCurrencyCount ? action.payload.bidCurrencyCount : state.auctionDetails.bidCurrencyCount,
                }
            }
        case EditModuleActionTypes.SetPrimaryCurrencyAndDecimal:
            return {
                ...state,
                auctionDetails: {
                    ...state.auctionDetails,
                    primaryCurrency: action.payload.primaryCurrency,
                    currencyDecimal: action.payload.currencyDecimal
                }
            }
        case EditModuleActionTypes.SetParticipantAdditionForLiveAuction:
            return {
                ...state,
                participantLive: action.payload.participantLive,
                auctionDetails: {
                    ...state.auctionDetails,
                    addParticipant: action.payload.addParticipant
                }
            }            
        default:
            return state;
    }
}