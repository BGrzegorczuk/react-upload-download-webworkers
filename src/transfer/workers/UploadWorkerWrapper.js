/* eslint import/no-webpack-loader-syntax: off */

import WorkerWrapper from "./WorkerWrapper";
import * as consts from '../../common/consts';
import {fileToArrayBuffer} from "../../common/utils";
const UploadWorker = require('worker-loader!./upload_worker.js');

class UploadWorkerWrapper extends WorkerWrapper {
    constructor(opts) {
        super(opts);
        this.worker = new UploadWorker();
        this.worker.onmessage = opts.handleWorkerMsg;
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

    // PO CO TA METODA?
    processTask(task) {
        console.log('processTask', task);
    }
}

export default UploadWorkerWrapper;