import {ADD_COMPLETED_TASK} from "../actions/actionTypes";

const initialState = {
    byId: {}
};

const processTasksReducer = (state = initialState, action = {}) => {
    console.log('action', action);
    switch (action.type) {
        case ADD_COMPLETED_TASK:
            const newTask = action.payload.task;
            // let tasks = { [newTask.uid]: newTask };
            // return { ...state, byId: {...tasks} };
        default:
            return state;
    }
};

export default processTasksReducer;