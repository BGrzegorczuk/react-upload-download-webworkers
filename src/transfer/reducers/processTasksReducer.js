import {ADD_TRANSFER_TASK, UPDATE_TRANSFER_TASK} from "../actions/actionTypes";

const initialState = {
    byId: {}
};

const processTasksReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case ADD_TRANSFER_TASK:
            const newTask = action.payload.task;
            let tasks = { [newTask.uid]: newTask };
            return { ...state, byId: {...state.byId, ...tasks} };
        // case UPDATE_TRANSFER_TASK:
        //     const taskToUpdate = action.payload.task;
        //     return { ...state, byId: { ...state.byId, [taskToUpdate.uid]: taskToUpdate } };
        default:
            return state;
    }
};

export default processTasksReducer;