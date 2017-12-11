import * as consts from "../common/consts";
import store from "../redux/configureStore";
import {addTransferTask} from "./actions/tasks";

export const transferQueueHandler = (e) => {
    const {type, payload} = e.data;

    switch (type) {
        case consts.MSG_TYPES.UPLOAD_INIT:
            handleWorkerUploadInit(payload);
            break;
        case consts.MSG_TYPES.UPLOAD_PROGRESS:
            handleWorkerUploadProgress(payload);
            break;
        case consts.MSG_TYPES.UPLOAD_SUCCESS:
            handleWorkerUploadComplete(payload);
            break;
        case consts.MSG_TYPES.UPDATE_WORKER_STATE:
            handleWorkerUpdateState(payload);
            break;
        case consts.MSG_TYPES.LOG:
            handleWorkerLog(payload);
            break;
        default:
            console.warn('UNKNOWN MSG', e.data)
    }
};

// Called only if file was not uploaded before
const handleWorkerUploadInit = (data) => {
    console.log('handleWorkerUploadInit', data);
    store.dispatch(addTransferTask(data));
};

const handleWorkerUploadProgress = (data) => {
    console.log('handleWorkerUploadProgress', data.uid, data.processedBytes, data.totalBytes);
    // store.dispatch(updateTransferTask(data));
};

const handleWorkerUploadComplete = (data) => {
    console.log('handleWorkerUploadComplete', data);
    // store.dispatch(completeTransferTask);
};

const handleWorkerUpdateState = (newState) => {
    console.log('handleWorkerUpdateState', newState);
};

const handleWorkerLog = (msg) => {
    console.log('LOG FROM WORKER', msg);
};
