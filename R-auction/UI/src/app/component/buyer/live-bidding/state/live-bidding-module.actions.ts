import { Action } from '@ngrx/store';

export enum LiveBiddingModuleActionTypes {
    ClearLiveBiddingModuleData = '[Live Bidding Module] Clear all live bidding data',    
    SetStatusAndRepublishRequired = '[Live Bidding Module] Set Status and Republish Required Flag',
    SealedBidModeDataHideShow = '[Live Bidding Module] check sealed bid Flag'
}

export class ClearLiveBiddingModuleData implements Action {
    readonly type = LiveBiddingModuleActionTypes.ClearLiveBiddingModuleData;
    constructor(public payload: boolean) {}
}

export class SetStatusAndRepublishRequired implements Action {
    readonly type = LiveBiddingModuleActionTypes.SetStatusAndRepublishRequired;    
    constructor(public payload: any) {}
}

export class SealedBidModeDataHideShow implements Action {
    readonly type = LiveBiddingModuleActionTypes.SealedBidModeDataHideShow;
    constructor(public payload: boolean){}
}

export type LiveBiddingModuleActions = ClearLiveBiddingModuleData
| SetStatusAndRepublishRequired | SealedBidModeDataHideShow;