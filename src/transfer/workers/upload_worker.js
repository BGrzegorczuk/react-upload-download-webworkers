import * as consts from '../../common/consts';
import {fileMD5} from '../../common/utils';

let CURRENT_STATUS = consts.WORKER_STATUSES.IDLE;
let CHUNK_NO;
let CHUNKS_TOTAL;
let INTERVAL = null;
let TASK = null;


// TODO: handle PAUSE & REMOVE task by user UI action !!!!!
const handleMsg = (e) => {
    const { type, payload } = e.data;

    try {
        switch (type) {
            case consts.MSG_TYPES.UPLOAD_INIT:
                handleUploadInit(payload);
                break;
            case consts.MSG_TYPES.UPDATE_WORKER_STATE:
                handleUpdateState(payload);
                break;

            default:
                console.warn('UNKNOWN MSG', e.data);
        }
    }
    catch (e) {
        reportError(e);
    }
};

const progress = () => {
    self.postMessage({ type: consts.MSG_TYPES.PROCESS })
};

const reportError = (err) => {
    console.warn('reportError', err);
};

const updateState = (newState) => {
    CURRENT_STATUS = newState;
    self.postMessage({
        type: consts.MSG_TYPES.UPDATE_WORKER_STATE,
        payload: newState
    });
};

const getState = () => {
    return CURRENT_STATUS;
};

const handleUploadInit = (data) => {
    const md5 = fileMD5(data.buffer);

    self.postMessage({
        type: consts.MSG_TYPES.LOG,
        payload: 'File MD5: ' + md5
    });

    CHUNKS_TOTAL = Math.ceil(data.size / consts.CHUNK_SIZE);
    TASK = data;

    const url = 'http://localhost/init_upload';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    // TODO: make synchronous call
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const res = JSON.parse(xhr.responseText);

            console.log("RES:", res);

            if (res.chunksTotal === res.chunksUploaded) {
                handleFileAlreadyUploaded(data);
            } else {
                // TODO: ?? why not just simple incrementation
                CHUNK_NO = res.chunksUploaded === 0 ? 1 : res.chunksUploaded + 1;
                self.postMessage({
                    type: consts.MSG_TYPES.UPLOAD_INIT,
                    payload: {
                        data: res
                    }
                });

                uploadChunk(md5, data);
            }
        }
    };

    const uploadData = {
        uid: data.uid,
        md5,
        filename: data.filename,
        ext: data.ext,
        size: data.size,
        chunksTotal: CHUNKS_TOTAL
    };

    xhr.send(JSON.stringify(uploadData));
};

const handleFileAlreadyUploaded = (data) => {
    console.warn(`File ${data.filename} already uploaded!`);
};

const uploadChunk = (md5, data) => {
    let offset = consts.CHUNK_SIZE * (CHUNK_NO - 1);
    const buff = data.buffer;

    console.log('uploadChunk', 'total bytes:'+buff.byteLength);

    const onChunkSent = function (e) {
        offset += e.loaded;

        if (offset >= buff.byteLength) {
            onUploadFinish(data);
            return;
        }
        else {
            console.log("onChunkSent", 'offset: '+offset);
            onUploadChunk(data);
            sendChunk(offset, consts.CHUNK_SIZE, buff);
        }
    };

    const sendChunk = function (offset, length, buff) {
        const chunk = buff.slice(offset, length+offset);
        console.log('sendChunk', CHUNK_NO, chunk.byteLength);
        const chunkData = new Uint8Array(chunk);
        const url = `http://localhost/upload?uid=${data.uid}&md5=${md5}&cn=${CHUNK_NO}`;
        let xhr = new XMLHttpRequest();

        xhr.open('POST', url);
        xhr.overrideMimeType('text/plain; charset=x-user-defined=binary');

        xhr.upload.onprogress = function (e) {
            const percentage = Math.round(
                ( (CHUNK_NO - 1) * consts.CHUNK_SIZE + e.loaded ) * 100 / buff.byteLength
            );

            self.postMessage({
                type: consts.MSG_TYPES.UPLOAD_PROGRESS,
                payload: percentage
            });
        };

        xhr.upload.onload = onChunkSent;

        xhr.upload.onerror = function(e) { console.log('onerror', e); };

        xhr.send(chunkData);
    };

    sendChunk(offset, consts.CHUNK_SIZE, buff);
};

const onUploadChunk = (data) => {
    // console.log('onUploadChunk', data);
    CHUNK_NO++;
};

const onUploadFinish = (data) => {
    console.log('onUploadFinish', data);
    const url = 'http://localhost/upload_finish';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const res = JSON.parse(xhr.responseText);

            self.postMessage({
                type: consts.MSG_TYPES.UPLOAD_SUCCESS,
                payload: res
            });

            cleanup();
            updateState(consts.WORKER_STATUSES.IDLE);
        }
    };

    xhr.send(JSON.stringify({}));
};

const onUploadError = (data) => {
    console.log('onUploadError', data);
};

const cleanup = () => {
    CHUNK_NO = null;
    CHUNKS_TOTAL = null;
    TASK = null;
};

const handleUpdateState = (newState) => {
    updateState(newState);
};


self.addEventListener('message', handleMsg);