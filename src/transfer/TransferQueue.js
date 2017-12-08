import * as consts from '../common/consts';
import {guid} from '../common/utils';
import UploadWorkerWrapper from './workers/UploadWorkerWrapper';

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
        this.handleWorkerMsg = opts.handleWorkerMsg;
        this.initWorkers(uploadWorkersNo || 3);
        this.start();
    }

    start() {
        this.ticker = setInterval(this.tick.bind(this), INTERVAL);
    }

    stop() {
        clearInterval(this.ticker);
    }

    tick() {
        for (let taskId in this.tasks) {
            const task = this.tasks[taskId];

            if (task.status === consts.TASK_STATUSES.NEW) {
                this.dispatchTaskToWorker(task);
            }
            // else if (task.status === consts.TASK_STATUSES.BROKEN) {
            //     this.handleBrokenTask(task);
            // }
            // else if (task.status === consts.TASK_STATUSES.COMPLETED) {
            //     this.deleteTask(task);
            // }
        }
    }

    async addTask(task) {
        console.log("addTask", task);
        const taskId = guid();
        const newTask = {
            ...task,
            uid: taskId,
            status: consts.TASK_STATUSES.NEW,
            timestamp: Date.now(),
            totalBytes: task.file.size,
            processedBytes: 0
        };
        this.tasks[taskId] = newTask;

        return newTask;
    }

    removeTask(task) {}

    getTaskById(taskId) {
        return this.tasks[taskId];
    }

    getAvailableWorkerForTask(task) {
        let freeWorker = null;

        if (task.type === consts.TRANSFER_TYPES.UPLOAD) {
            for (let worker of this.uploadWorkers) {
                if (worker) {
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