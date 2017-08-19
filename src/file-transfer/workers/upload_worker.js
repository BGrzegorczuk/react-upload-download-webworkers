import * as consts from '../../common/consts';

let CURRENT_STATE = consts.WORKER_STATUSES.IDLE
let CHUNK_NO;
let CHUNKS_TOTAL;
let INTERVAL = null;
let TASK = null;


const handleMsg = (e) => {
    const { type, payload } = e.data;

    try {
        switch (type) {
            case consts.MSG_TYPES.UPLOAD_INIT:
                onUploadInit(payload);
                break;
            case consts.MSG_TYPES.UPLOAD_PROGRESS:
                onUploadChunk(payload);
                break;
            case consts.MSG_TYPES.UPLOAD_SUCCESS:
                onUploadFinished(payload);
                break;
            case consts.MSG_TYPES.UPLOAD_FAILURE:
                onUploadFail(payload);
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
    CURRENT_STATE = newState;
};

const getState = () => {
    return CURRENT_STATE;
};

const onUploadInit = (data) => {
    CHUNKS_TOTAL = Math.ceil(data.size / consts.CHUNK_SIZE);

    const url = 'http://localhost/init_upload';
    const xhr = new XMLHttpRequest();
    xhr.open('POST', url);
    xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
    xhr.onreadystatechange = function () {
        if (xhr.readyState === 4 && xhr.status === 200) {
            const res = JSON.parse(xhr.responseText);

            CHUNK_NO = res.chunksUploaded + 1;
            TASK = data;

            self.postMessage({
                type: consts.MSG_TYPES.UPLOAD_INIT,
                payload: {
                    data: res
                }
            });

            uploadChunk(data);
        }
    };

    const uploadData = {
        uid: data.uid,
        filename: data.filename,
        ext: data.ext,
        size: data.size,
        chunksTotal: CHUNKS_TOTAL
    };

    xhr.send(JSON.stringify(uploadData));
};

const uploadChunk = (data) => {
    let offset = consts.CHUNK_SIZE * (CHUNK_NO - 1);
    const buff = data.buffer;

    console.log('uploadChunk', 'total bytes:'+buff.byteLength)

    const onChunkSent = function (e) {
        offset += e.loaded;

        if (offset >= buff.byteLength) {
            onUploadFinished(data);
            return;
        }
        else {
            CHUNK_NO++;
            console.log("onChunkSent", 'offset: '+offset);
            onUploadChunk(data);
            sendChunk(offset, consts.CHUNK_SIZE, buff);
        }
    };

    const sendChunk = function (offset, length, buff) {
        const chunk = buff.slice(offset, length+offset);
        console.log('sendChunk', CHUNK_NO, chunk.byteLength);
        const chunkData = new Uint8Array(chunk);
        const url = `http://localhost/upload?uid=${data.uid}&cn=${CHUNK_NO}`;
        let xhr = new XMLHttpRequest();

        xhr.open('POST', url);
        xhr.overrideMimeType('text/plain; charset=x-user-defined=binary');

        xhr.upload.onprogress = function (e) {
            const percentage = Math.round( (e.loaded / e.total) * 100 );
            // console.log('onprogress', percentage, e.loaded);
        };

        xhr.upload.onload = onChunkSent;

        xhr.send(chunkData);
    };

    sendChunk(offset, consts.CHUNK_SIZE, buff);
};

const onUploadChunk = (data) => {
    // console.log('onUploadChunk', data);
};

const onUploadFinished = (data) => {
    console.log('onUploadFinished', data);
};

const onUploadError = (data) => {
    console.log('onUploadError', data);
};


self.addEventListener('message', handleMsg);