export const MSG_TYPES = {
    ERROR: -1,
    INIT: 0,
    PROCESS: 1,
    UPLOAD_INIT: 2,
    UPLOAD_START: 3,
    UPLOAD_PROGRESS: 4,
    UPLOAD_SUCCESS: 5,
    UPLOAD_FAILURE: 6,
};

export const WORKER_STATUSES = {
    IDLE: 1,
    PROCESSING: 2,
    BROKEN: 3
};

export const TASK_STATUSES = {
    NEW: 1,
    ASSIGNED: 2,
    PROCESSING: 2,
    STOPPED: 3,
    COMPLETED: 4,
    BROKEN: 5
};

export const TRANSFER_TYPES = {
    UPLOAD: 1,
    DOWNLOAD: 2
};

export const CHUNK_SIZE = 524288; // 0.5MB