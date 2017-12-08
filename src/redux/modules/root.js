import { combineEpics } from 'redux-observable';
import { combineReducers } from 'redux';

import transferReducer from '../../transfer/reducer';
import {addTransferTaskEpic} from "../../transfer/epics";


/* EPICS */
export const rootEpic = combineEpics(addTransferTaskEpic);


/* REDUCERS */
export const rootReducer = combineReducers({
    transfer: transferReducer
});