import {combineReducers} from "redux";
import processTasksReducer from "./reducers/processTasksReducer";
import completedTasksReducer from "./reducers/completedTasksReducer";


const transferReducer = combineReducers({
    processTasks: processTasksReducer,
    // completedTasks: completedTasksReducer
});


export default transferReducer;