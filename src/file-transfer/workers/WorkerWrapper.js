import * as consts from '../../common/consts';

class WorkerWrapper {
    constructor(opts) {
        this.task = null;
        this.status = consts.WORKER_STATUSES.IDLE;
    }

    isAvailable() {
        return this.status === consts.WORKER_STATUSES.IDLE;
    }

    initProcessingTask() { throw Error('To be implemented in inheriting class') }

    processTask() { throw Error('To be implemented in inheriting class') }

    handleWorkerMsg () { throw Error('To be implemented in inheriting class') }

    assignTask(task) {
        task.status = consts.TASK_STATUSES.ASSIGNED;
        this.status = consts.WORKER_STATUSES.PROCESSING;
        this.task = task;
        this.initProcessingTask(task);
    }

    // TODO: should probably only set task's flag & check if proper task is going to be withdrawn
    withdrawTask(task) {
        this.task === null;
        this.status = consts.WORKER_STATUSES.IDLE;
    }

    checkIfTaskIsAssigned(task) {
        return this.task && this.task.uid === task.uid;
    }
}

export default WorkerWrapper;