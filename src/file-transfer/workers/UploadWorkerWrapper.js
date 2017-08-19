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
            default:
                console.warn('UNKNOWN MSG', e.data)
        }
    }

    handleWorkerUploadInit(data) {
        console.log('handleWorkerUploadInit', data);
    }

    handleWorkerUploadProgress(data) {
        console.log('handleWorkerUploadProgress', data);
    }
}

export default UploadWorkerWrapper;