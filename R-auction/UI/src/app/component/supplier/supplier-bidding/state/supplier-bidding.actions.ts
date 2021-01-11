import { Action } from '@ngrx/store';

export enum SupplierBiddingModuleActionTypes {
    ClearSupplierBiddingModuleData = '[SupplierBiddingModule: SupplierBiddingComponent] Clear all auction data',
    SetStatusAndRepublishRequired = '[SupplierBiddingModule] Set Status and Republish Required Flag',
    SetAdminConfigFeature = 'Set Admin Congifured Features',
    SetBiddingCurrencyAndExchangeRate = '[SupplierBiddingModule] Sets Exchange rate and bidding currency',
    SetPrimaryCurrency = '[SupplierBiddingModule] Sets Primary Currency',
    SetCurrencyDecimal = '[SupplierBiddingModule] Sets Currency Decimal'
}

export class ClearSupplierBiddingModuleData implements Action {
    readonly type = SupplierBiddingModuleActionTypes.ClearSupplierBiddingModuleData;
    constructor(public payload: boolean) {}
}

export class SetStatusAndRepublishRequired implements Action {
    readonly type = SupplierBiddingModuleActionTypes.SetStatusAndRepublishRequired;    
    constructor(public payload: any) {}
}

export class SetAdminConfigFeature implements Action {
    readonly type = SupplierBiddingModuleActionTypes.SetAdminConfigFeature;
    constructor(public payload: any){}
}

export class SetBiddingCurrencyAndExchangeRate implements Action {
    readonly type = SupplierBiddingModuleActionTypes.SetBiddingCurrencyAndExchangeRate;    
    constructor(public payload: any) {}
}

export class SetPrimaryCurrency implements Action {
    readonly type = SupplierBiddingModuleActionTypes.SetPrimaryCurrency;    
    constructor(public payload: any) {}
}

export class SetCurrencyDecimal implements Action {
    readonly type = SupplierBiddingModuleActionTypes.SetCurrencyDecimal;    
    constructor(public payload: any) {}
}

export type SupplierBiddingModuleActions = ClearSupplierBiddingModuleData
| SetStatusAndRepublishRequired
| SetAdminConfigFeature
| SetBiddingCurrencyAndExchangeRate
| SetPrimaryCurrency
| SetCurrencyDecimal