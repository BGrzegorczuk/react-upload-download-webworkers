import * as consts from '../../common/consts';

class WorkerWrapper {
    constructor(opts) {
        this.task = null;
        this.worker = null;
        this.status = consts.WORKER_STATUSES.IDLE;
        this.handleWorkerMsg = opts.handleWorkerMsg;
        // this.callbacks = {}; // for postMessage callbacks
        // this.lastCallbackId = 0;
    }

    isAvailable() {
        return this.status === consts.WORKER_STATUSES.IDLE;
    }

    initProcessingTask() { throw Error('To be implemented in inheriting class') }

    processTask() { throw Error('To be implemented in inheriting class') }

    assignTask(task) {
        task.status = consts.TASK_STATUSES.ASSIGNED;
        this.status = consts.WORKER_STATUSES.PROCESSING;
        this.task = task;
        this.initProcessingTask(task);
    }

    updateState(newState) {
        this.worker.postMessage({
            type: consts.MSG_TYPES.UPDATE_WORKER_STATE,
            payload: newState
        });
    }

    // TODO: should probably only set task's flag & check if proper task is going to be withdrawn
    withdrawTask(task) {
        this.task = null;
        this.status = consts.WORKER_STATUSES.IDLE;
    }

    checkIfTaskIsAssigned(task) {
        return this.task && this.task.uid === task.uid;
    }

    // postMessageWithCallback(msg, callback) {
    //     this.callbacks[this.lastCallbackId] = callback;
    //     _.extend(msg, { _cid: this.lastCallbackId });
    //     this.worker.postMessage(msg);
    // }
}

export default WorkerWrapper;