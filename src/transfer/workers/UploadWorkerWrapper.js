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
        // TODO: handle more seriously
        this.worker.onerror = (err) => console.warn("WORKER ERR:", err);
    }

    initProcessingTask(task) {
        const {name, size} = task.file;

        this.updateTask({ state: consts.TASK_STATES.PROCESSING });
        this.setState(consts.WORKER_STATES.PROCESSING);

        fileToArrayBuffer(task.file, (e) => {
            const data = e.target.result;
            this.worker.postMessage({
                type: consts.MSG_TYPES.UPLOAD_INIT,
                payload: {
                    uid: task.uid,
                    filename: name,
                    ext: name.split('.').slice(-1)[0],
                    totalBytes: size,
                    processedBytes: 0,
                    buffer: data
                }
            }, [data]);
        });
    }

    pauseTask(task) {}

    stopTask(task) {}

    removeTask(task) {}

    // // PO CO TA METODA?
    // processTask(task) {
    //     console.log('processTask', task);
    // }
}

export default UploadWorkerWrapper;