import { ActionReducer, combineReducers } from '@ngrx/store';

import * as flowModels from '../models/flow'
import * as flow from './flow'

export interface State {
    flow: flowModels.Flow
};

const initialState: State = {
    flow: flow.initialState
};

const reducers = {
    flow: flow.reducer
};

export const productionReducer = combineReducers(reducers);

// tsc fails for some reason if the reducer isn't defined with a type signature
// like this.
// https://github.com/btroncone/ngrx-store-localstorage/issues/13
export function reducer(state: any, action: any) {
    return productionReducer(state, action);
}