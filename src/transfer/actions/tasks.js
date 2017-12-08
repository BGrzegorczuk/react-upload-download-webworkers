import {
    ADD_TRANSFER_TASK, REMOVE_TRANSFER_TASK, UPDATE_TRANSFER_TASK, START_TRANSFER_TASK, STOP_TRANSFER_TASK
} from "./actionTypes";

/* TRANSFER TASK ACTIONS */
export const addTransferTask = (task) => ({ type: ADD_TRANSFER_TASK, payload: { task } });
export const removeTransferTask = (task) => ({ type: REMOVE_TRANSFER_TASK, payload: { task } });
export const updateTransferTask = (task) => ({ type: UPDATE_TRANSFER_TASK, payload: { task } });
export const startTransferTask = (task) => ({ type: START_TRANSFER_TASK, payload: { task } });
export const stopTransferTask = (task) => ({ type: STOP_TRANSFER_TASK, payload: { task } });