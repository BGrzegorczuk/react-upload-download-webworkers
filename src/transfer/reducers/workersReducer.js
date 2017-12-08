import {ADD_WORKER_TASK} from "../actions/actionTypes";

const initialState = {
    byId: {}
};

const workersReducer = (state = initialState, action = {}) => {
    switch (action.type) {
        case ADD_WORKER_TASK:
            const newTask = action.task;
            let tasks = { ...state.byId, [newTask.id]: newTask };
            return { ...state, ...tasks };
        default:
            return state;
    }
};

export default workersReducer;