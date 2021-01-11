import { Action } from '@ngrx/store';

export enum EditModuleActionTypes {
    ClearEditModuleData = '[EditModule: BasicInfo] Clear all auction data',
    SetStatusAndRepublishRequired = '[EditModule] Set Status and Republish Required Flag',
    SetAuctionStatus = '[EditModule] Set Auction Status',
    SetAuctionReadOnlyMode = '[EditModule] Set Auction Read Only Mode',
    SetParticipantAdditionForLiveAuction = '[Editmodule: Edit] Add participant in Live auction',
    SetPrimaryCurrencyAndDecimal = '[Editmodule] Set Primary currency and decimal value'
}

export class ClearEditModuleData implements Action {
    readonly type = EditModuleActionTypes.ClearEditModuleData;
    constructor(public payload: boolean) {}
}

export class SetStatusAndRepublishRequired implements Action {
    readonly type = EditModuleActionTypes.SetStatusAndRepublishRequired;    
    constructor(public payload: any) {}
}

export class SetPrimaryCurrencyAndDecimal implements Action {
    readonly type = EditModuleActionTypes.SetPrimaryCurrencyAndDecimal;    
    constructor(public payload: any) {}
}

export class SetAuctionStatus implements Action {
    readonly type = EditModuleActionTypes.SetAuctionStatus;
    constructor(public payload: boolean) {}
}

export class SetAuctionReadOnlyMode implements Action {
    readonly type = EditModuleActionTypes.SetAuctionReadOnlyMode;
    constructor(public payload: boolean){}
}

export class SetParticipantAdditionForLiveAuction implements Action {
    readonly type = EditModuleActionTypes.SetParticipantAdditionForLiveAuction;    
    constructor(public payload: any) {}
}

export type EditModuleActions = ClearEditModuleData
| SetStatusAndRepublishRequired
| SetAuctionStatus
| SetAuctionReadOnlyMode
| SetParticipantAdditionForLiveAuction
| SetPrimaryCurrencyAndDecimal