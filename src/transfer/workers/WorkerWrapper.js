import * as consts from "../../common/consts";
import _assign from "lodash/assign";


const generateCorrelationId = () => {
    return Date.now() + Math.floor(1000 + Math.random() * 9000) + 1;
};

class WorkerWrapper {
    constructor(opts) {
        this.task = null;
        this.worker = null;
        this.state = consts.WORKER_STATES.IDLE;
        this.handleWorkerMsg = opts.handleWorkerMsg;
        // this.callbacks = {}; // postMessage callbacks registry
    }

    isBusy() {
        return this.getState() !== consts.WORKER_STATES.IDLE;
    }

    initProcessingTask() { throw Error('To be implemented in inheriting class') }

    // processTask() { throw Error('To be implemented in inheriting class') }

    assignTask(task) {
        this.setState(consts.WORKER_STATES.PROCESSING);
        this.task = task;
        this.updateTask({ state: consts.TASK_STATES.ASSIGNED });
        this.initProcessingTask(task);
    }

    updateTask(updatedData) {
        _assign(this.task, updatedData);
    }

    getState() {
        return this.state;
    }

    setState(newState) {
        // this.worker.postMessage({
        //     type: consts.MSG_TYPES.UPDATE_WORKER_STATE,
        //     payload: newState
        // });
        this.state = newState;
    }

    // TODO: should probably only set task's flag & check if proper task is going to be withdrawn
    withdrawTask(task) {
        this.task = null;
        this.state = consts.WORKER_STATES.IDLE;
    }

    checkIfTaskIsAssigned(task) {
        return this.task && this.task.uid === task.uid;
    }

    getAssignedTask() {
        return this.task;
    }

    // TODO: different syntax form transferable in IE - this will NOT work
    sendMsgToWorker(type, payload, transferable=null) {
        if (transferable !== null) {
            this.worker.postMessage({
                type,
                payload
            }, [transferable]);
        } else {
            this.worker.postMessage({
                type,
                payload
            });
        }
    }

    // // TODO: save callbk register timestamp to handle obsolete callbacks (old enough)
    // //       Can handle only synchronous worker actions, asynchronous will not work...
    // sendMsgToWorkerWithCallback(type, payload, transferable=null, callbk) {
    //     const correlationId = generateCorrelationId();
    //     this.callbacks[correlationId] = callbk;
    //     const _payload = _assign(payload, { _cid:  correlationId });
    //     this.sendMsgToWorker(type, _payload, transferable);
    // }
}

export default WorkerWrapper;