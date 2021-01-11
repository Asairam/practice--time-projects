import * as fromRoot from './app.state';
import { createFeatureSelector, createSelector } from '@ngrx/store';
import { AppModuleActions, AppModuleActionTypes } from './app.actions';

export interface State extends fromRoot.State {
    appModule: AppModuleState
}


export interface AppModuleState {
    auctionConfiguration: any,
}

const initialState: AppModuleState = {
    auctionConfiguration: null,
}

const initialConfiguration = {
    cumulativeTotal: false,
    currency: false,
    participantLive: false,
    sealedBid: false,
    suspendSupplier: false,
    takeLead: false,
    cumulativeReport: false
}

const getAppModuleFeatureState = createFeatureSelector<AppModuleState>('appModule');
export const getAuctionConfigOnly = createSelector(getAppModuleFeatureState, state => state.auctionConfiguration);


export function reducer(state = initialState, action: AppModuleActions): AppModuleState {
    switch (action.type) {
        case AppModuleActionTypes.SetAppConfigerMode:
            return {
                ...initialState,
                auctionConfiguration : action.payload ? action.payload : { features : {...initialConfiguration}}
            }
            break;
        default:
            return state;
    }
}