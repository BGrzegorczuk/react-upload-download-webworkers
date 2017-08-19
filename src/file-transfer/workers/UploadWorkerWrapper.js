/* eslint import/no-webpack-loader-syntax: off */

import WorkerWrapper from "./WorkerWrapper";
import * as consts from '../../common/consts';
import {fileToArrayBuffer} from "../../common/utils";
const UploadWorker = require('worker-loader!./upload_worker.js');

class UploadWorkerWrapper extends WorkerWrapper {
    constructor(opts) {
        super(opts);
        this.worker = new UploadWorker();
        this.worker.onmessage = this.handleWorkerMsg.bind(this);
    }

    initProcessingTask(task) {
        const {name, size} = task.file;

        this.updateState(consts.WORKER_STATUSES.PROCESSING);

        fileToArrayBuffer(task.file, (e) => {
            const data = e.target.result;
            this.worker.postMessage({
                type: consts.MSG_TYPES.UPLOAD_INIT,
                payload: {
                    uid: task.uid,
                    filename: name,
                    ext: name.split('.').slice(-1)[0],
                    size,
                    buffer: data
                }
            }, [data]); // TODO: different syntax in IE - this will NOT work
        });
    }

    processTask(task) {
        console.log('processTask', task);
    }

    handleWorkerMsg(e) {
        const {type, payload} = e.data;

        switch (type) {
            case consts.MSG_TYPES.UPLOAD_INIT:
                this.handleWorkerUploadInit(payload);
                break;
            case consts.MSG_TYPES.UPLOAD_PROGRESS:
                this.handleWorkerUploadProgress(payload);
                break;
            case consts.MSG_TYPES.UPLOAD_SUCCESS:
                this.handleWorkerUploadComplete(payload);
                break;
            case consts.MSG_TYPES.UPDATE_WORKER_STATE:
                this.handleWorkerUpdateState(payload);
                break;
            case consts.MSG_TYPES.LOG:
                this.handleWorkerLog(payload);
                break;
            default:
                console.warn('UNKNOWN MSG', e.data)
        }
    }

    handleWorkerUploadInit(data) {
        console.log('handleWorkerUploadInit', data);
    }

    handleWorkerUploadProgress(percentage) {
        console.log('handleWorkerUploadProgress', percentage);
    }

    handleWorkerUploadComplete(data) {
        console.log('handleWorkerUploadComplete', data);
    }

    handleWorkerUpdateState(newState) {
        console.log('handleWorkerUpdateState', newState);
    }

    handleWorkerLog(msg) {
        console.log('LOG FROM WORKER', msg);
    }
}

export default UploadWorkerWrapper;