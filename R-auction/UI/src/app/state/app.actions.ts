import { Action } from '@ngrx/store';

export enum AppModuleActionTypes {
    SetAppConfigerMode = '[Application] Set Configuration'
}

export class SetAppConfigerMode implements Action {
    readonly type = AppModuleActionTypes.SetAppConfigerMode;
    constructor(public payload: any){}
}

export type AppModuleActions = SetAppConfigerMode;