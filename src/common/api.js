import 'whatwg-fetch';
import extend from 'lodash/extend';
import { Observable } from 'rxjs/Rx';

/* CUSTOM ERROR */
function FetchError() {
    var temp = Error.apply(this, arguments);
    temp.name = this.name = 'FetchError';
    this.message = temp.message;
    if(Object.defineProperty) {
        // getter for more optimizy goodness
        /*this.stack = */Object.defineProperty(this, 'stack', {
            get: function() {
                return temp.stack
            },
            configurable: true // so you can change it if you want
        })
    } else {
        this.stack = temp.stack
    }
}

//inherit prototype using ECMAScript 5 (IE 9+)
FetchError.prototype = Object.create(Error.prototype, {
    constructor: {
        value: FetchError,
        writable: true,
        configurable: true
    }
});


const request = (method, url, body = {}) => {

    const defaultHeaders = new Headers();
    const defaultOpts = {
        method,
        headers: defaultHeaders,
        mode: 'cors',
        cache: 'default'
    };
    let opts = extend({}, defaultOpts, { body });

    return Observable
        .fromPromise(
            fetch(url, opts)
                .then(res => {
                    console.log('fetch.then', res.status, res);

                    switch(res.status) {
                        case 200:
                            return res.json();
                        default:
                            // return Observable.throw(`FETCH ERROR WITH STATUS ${res.status}`);
                            throw new FetchError(`FETCH ERROR WITH STATUS ${res.status}`);
                    }
                })
                .catch(err => {
                    console.log('fetch.catch', err);
                    if (err.name === 'FetchError') {
                        throw new Error('RETHROWN ERROR');
                    }
                })
        )
        .map(val => console.log('map', val))
        .do(res => console.log('>> FETCH RESPONSE', res));
};


export const apiGET = (url) => {
    return request('GET', url);
};

export const apiPOST = (url, body) => {
    return request('POST', url, body);
};

export const apiPUT = (url, body) => {
    return request('PUT', url, body);
};

export const apiPATCH = (url, body) => {
    return request('PATCH', url, body);
};

export const apiDELETE = (url) => {
    return request('DELETE', url);
};