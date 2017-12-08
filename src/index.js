import React from 'react';
import ReactDOM from 'react-dom';
import {Provider} from 'react-redux';
import store from "./redux/configureStore";
import App from './App';
import transferQueue from "./transfer/TransferQueue";
import registerServiceWorker from './registerServiceWorker';
import './rxjs-extensions';
import './index.css';
import {transferQueueHandler} from "./transfer/transferQueueHandler";

transferQueue.setup({
    uploadWorkersNo: 3,
    handleWorkerMsg: transferQueueHandler
});

ReactDOM.render(
    <Provider store={store}>
        <App />
    </Provider>
    , document.getElementById('root')
);
registerServiceWorker();
