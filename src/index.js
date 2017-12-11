import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from "./redux/configureStore";
import App from './App';
import transferQueue from "./transfer/TransferQueue";
import _omit from "lodash/omit";
import registerServiceWorker from './registerServiceWorker';
import {addTransferTask, updateTransferTask} from "./transfer/actions/tasks";
import './rxjs-extensions';
import './index.css';
// import {transferQueueHandler} from "./transfer/transferQueueHandler";


transferQueue.setup({
    uploadWorkersNo: 3,
    onUploadInit: (task) => {
        console.log("onUploadInit -> dispatch", task);
        // const payload = _omit(task, 'file');
        store.dispatch(addTransferTask(task));
    },
    onUploadProgress: (task) => {
        console.log("onUploadProgress -> dispatch", task);
        // const payload = _omit(task, 'file');
        store.dispatch(updateTransferTask(task));
    },
    onUploadComplete: () => {},
    onUploadError: () => {},
});

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root')
);
registerServiceWorker();
