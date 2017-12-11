import {
    ADD_TRANSFER_TASK, REMOVE_TRANSFER_TASK, UPDATE_TRANSFER_TASK, RESUME_TRANSFER_TASK, STOP_TRANSFER_TASK
} from "./actionTypes";

/* PROCESS TASKS ACTIONS */
export const addTransferTask = (task) => ({ type: ADD_TRANSFER_TASK, payload: { task } });
export const removeTransferTask = (task) => ({ type: REMOVE_TRANSFER_TASK, payload: { task } });
export const updateTransferTask = (task) => ({ type: UPDATE_TRANSFER_TASK, payload: { task } });
export const stopTransferTask = (task) => ({ type: STOP_TRANSFER_TASK, payload: { task } });
export const resumeTransferTask = (task) => ({ type: RESUME_TRANSFER_TASK, payload: { task } });
