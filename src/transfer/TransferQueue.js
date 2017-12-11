import * as consts from "../common/consts";
import {guid} from "../common/utils";
import _isFunction from "lodash/isFunction";
import _noop from "lodash/noop";
import _assign from "lodash/assign";
import UploadWorkerWrapper from "./workers/UploadWorkerWrapper";


const INTERVAL = 2000;

/*
Singleton Queue
 */
class TransferQueue {
    downloadWorkers = [];
    uploadWorkers = [];
    tasks = {};

    setup(opts) {
        const { uploadWorkersNo } = opts;
        this.assignCustomHandlers(opts);
        this.initWorkers(uploadWorkersNo || 3);
        this.start();
    }

    start() {
        this.ticker = setInterval(this.tick.bind(this), INTERVAL);
    }

    stop() {
        clearInterval(this.ticker);
    }

    //TODO: how to handle already uploaded tasks statuses? should it be BROKEN, COMPLETED or sth else?
    tick() {
        for (let taskId in this.tasks) {
            const task = this.tasks[taskId];

            if (task.state === consts.TASK_STATES.NEW) {
                this.dispatchTaskToWorker(task);
                break;
            }
            // else if (task.state === consts.TASK_STATES.BROKEN) {
            //     this.handleBrokenTask(task);
            //     break;
            // }
            // else if (task.state === consts.TASK_STATES.COMPLETED) {
            //     this.removeTask(taskId);
            //     break;
            // }
        }
    }

    handleWorkerMsg = (e) => {
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
    };

    assignCustomHandlers(opts) {
        this.customHandlers = {
            onUploadInit: _isFunction(opts.onUploadInit) ? opts.onUploadInit : _noop,
            onUploadProgress: _isFunction(opts.onUploadProgress) ? opts.onUploadProgress : _noop,
            onUploadComplete: _isFunction(opts.onUploadComplete) ? opts.onUploadComplete : _noop,
            onUploadError: _isFunction(opts.onUploadError) ? opts.onUploadError : _noop,
        };
    }

    handleWorkerUploadInit = (data) => {
        console.log('handleWorkerUploadInit', data);
        const { uid } = data;
        let task = this.getTaskById(uid);
        console.log('found task', task);
        this.customHandlers.onUploadInit({...task});
    };

    handleWorkerUploadProgress = (data) => {
        console.log('handleWorkerUploadProgress', data);
        const { uid, processedBytes, chunksProcessed } = data;
        let task = this.getTaskById(uid);
        this.updateTask(task, {...data});
        this.customHandlers.onUploadProgress({...task});
    };

    handleWorkerUploadComplete = (data) => {
        console.log('handleWorkerUploadComplete', data);
    };

    handleWorkerUpdateState = (newState) => {
        console.log('handleWorkerUpdateState', newState);
    };

    handleWorkerLog = (msg) => {
        console.log('LOG FROM WORKER', msg);
    };

    async addTask(task) {
        console.log("addTask", task);
        const taskId = guid();
        const newTask = {
            ...task,
            uid: taskId,
            state: consts.TASK_STATES.NEW,
            timestamp: Date.now(),
            totalBytes: task.file.size,
            processedBytes: 0
        };
        this.tasks[taskId] = newTask;

        return newTask;
    }

    updateTask(task, data) {
        _assign(task, data);
    }

    removeTask(taskId) {
        delete this.tasks[taskId];
    }

    getTaskById(taskId) {
        return this.tasks[taskId];
    }

    getAvailableWorkerForTask(task) {
        let freeWorker = null;

        if (task.type === consts.TRANSFER_TYPES.UPLOAD) {
            for (let worker of this.uploadWorkers) {
                if (!worker.isBusy()) {
                    freeWorker = worker;
                    break;
                }
            }
        }

        return freeWorker;
    }

    initWorkers(uploadWorkersNo) {
        for (let i=1; i <= uploadWorkersNo; i++) {
            this.addWorker(consts.TRANSFER_TYPES.UPLOAD);
        }
    }

    addWorker(type) {
        if (type === consts.TRANSFER_TYPES.UPLOAD) {
            this.uploadWorkers.push(new UploadWorkerWrapper(
                { handleWorkerMsg: this.handleWorkerMsg }
            ));
        }
    }

    dispatchTaskToWorker(task) {
        const worker = this.getAvailableWorkerForTask(task);
        console.log('freeWorker', worker);
        if (worker) {
            console.log('assignTaskToWorker', task);
            worker.assignTask(task);
        }
    }
}

export default new TransferQueue();