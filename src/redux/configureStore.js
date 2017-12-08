import {applyMiddleware, compose, createStore} from 'redux';
import { createEpicMiddleware } from 'redux-observable';
import thunk from 'redux-thunk';

import { rootEpic, rootReducer } from './modules/root';

const epicMiddleware = createEpicMiddleware(rootEpic);
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(rootReducer,
    composeEnhancers(
        applyMiddleware(thunk, epicMiddleware)
    )
);

export default store;