import { combineReducers } from 'redux';
import transferReducer from "./transfer/reducer";

const rootReducer = combineReducers({
    transfer: transferReducer
});

export default rootReducer;