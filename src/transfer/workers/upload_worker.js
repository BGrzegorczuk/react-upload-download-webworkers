import * as consts from '../../common/consts';
import {fileMD5} from '../../common/utils';
import {WORKER_STATES} from "../../common/consts";

let STATE = consts.WORKER_STATES.IDLE;
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

const sendMsg = (type, payload) => {
    self.postMessage({
        type,
        payload
    })
};

const reportError = (err) => {
    console.warn('reportError', err);
};

const handleUploadInit = (data) => {

    // if STATE !== const.WORKER_STATES.IDLE {
    //
    // }

    const md5 = fileMD5(data.buffer);

    // sendMsg(consts.MSG_TYPES.LOG, 'File MD5: ' + md5);
    console.log('File MD5: ' + md5);

    CHUNKS_TOTAL = Math.ceil(data.totalBytes / consts.CHUNK_SIZE);
    TASK = data;

    console.log("TASK from upload_worker", TASK);

    const url = 'http://localhost/init_upload';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url, false); // make the request synchronous
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

    // TODO: make synchronous call & handle errors
    // xhr.onreadystatechange = function () {
    //     if (xhr.readyState === 4 && xhr.status === 200) {
    //         const res = JSON.parse(xhr.responseText);
    //         const msgPayload = { ...res, uid: TASK.uid };
    //
    //         console.log("RES:", res);
    //
    //         if (res.chunksTotal === res.chunksProcessed) {
    //             handleFileAlreadyUploaded(data);
    //         } else {
    //             // TODO: ?? why not just simple incrementation
    //             CHUNK_NO = res.chunksProcessed === 0 ? 1 : res.chunksProcessed + 1;
    //
    //             sendMsg(consts.MSG_TYPES.UPLOAD_INIT, msgPayload);
    //
    //             uploadChunk(md5, data);
    //         }
    //     }
    // };

    const uploadData = {
        uid: data.uid,
        md5,
        filename: data.filename,
        ext: data.ext,
        totalBytes: data.totalBytes,
        chunksTotal: CHUNKS_TOTAL
    };

    xhr.send(JSON.stringify(uploadData));

    // TODO: for now only optimistic case implemented, no error handling

    if (xhr.readyState === 4 && xhr.status === 200) {
        const res = JSON.parse(xhr.responseText);
        const msgPayload = { ...res, uid: TASK.uid };

        console.log("RES:", res);

        if (res.chunksTotal === res.chunksProcessed) {
            handleFileAlreadyUploaded(data);
        } else {
            // TODO: ?? why not just simple incrementation
            CHUNK_NO = res.chunksProcessed === 0 ? 1 : res.chunksProcessed + 1;

            sendMsg(consts.MSG_TYPES.UPLOAD_INIT, msgPayload);

            uploadChunk(md5, data); // must use setTimeout for handleInit fn to return
        }
    }
};

const handleFileAlreadyUploaded = (data) => {
    console.warn(`File ${data.filename} already uploaded!`);
};

const uploadChunk = (md5, data) => {
    let offset = consts.CHUNK_SIZE * (CHUNK_NO - 1);
    const buff = data.buffer;

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

    // TODO: MDN .../docs/XMLHttpRequest/Using_XMLHttpRequest - UNSENT...

    const sendChunk = function (offset, length, buff) {
        const chunk = buff.slice(offset, length+offset);
        console.log('sendChunk', CHUNK_NO, chunk.byteLength);
        const chunkData = new Uint8Array(chunk);
        console.log(">>>>>", 'offset ' + offset, 'chunkData.length ' + chunkData.length);
        const url = `http://localhost/upload?uid=${data.uid}&md5=${md5}&cn=${CHUNK_NO}&pb=${offset+chunkData.length}`;
        let xhr = new XMLHttpRequest();

        xhr.open('POST', url);
        xhr.overrideMimeType('text/plain; charset=x-user-defined=binary');

        xhr.upload.onprogress = function (e) {
            // const percentage = Math.round(
            //     ( (CHUNK_NO - 1) * consts.CHUNK_SIZE + e.loaded ) * 100 / buff.byteLength
            // );

            sendMsg(consts.MSG_TYPES.UPLOAD_PROGRESS, {
                uid: TASK.uid,
                processedBytes: offset + chunkData.length,
                chunksProcessed: CHUNK_NO // TODO: check if that is correct chunk processed number
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

            sendMsg(consts.MSG_TYPES.UPLOAD_SUCCESS, res);

            cleanup();
            updateState(consts.WORKER_STATES.IDLE);
        }
    };

    xhr.send(JSON.stringify({}));
};

const handleUpdateState = (newState) => {
    updateState(newState);
};

const updateState = (newState) => {
    STATE = newState;
    sendMsg(consts.MSG_TYPES.UPDATE_WORKER_STATE, newState);
};

const getState = () => {
    return STATE;
};

const cleanup = () => {
    STATE = consts.WORKER_STATES.IDLE;
    CHUNK_NO;
    CHUNKS_TOTAL;
    INTERVAL = null;
    TASK = null;
};

const onUploadError = (err) => {
    // sendMsg(consts.MSG_TYPES.LOG, 'upload_worker error: ' + err);
    console.log('upload_worker error: ' + err);
};

self.addEventListener('message', handleMsg);