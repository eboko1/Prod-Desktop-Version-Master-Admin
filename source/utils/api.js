// vendor
import { trim, toUpper } from 'lodash/string';
import { replace } from 'react-router-redux';
import _ from 'lodash';

// proj
import { logout } from 'core/auth/duck';
// import { emitError } from 'core/ui/duck';

import { getToken } from 'utils';
import store from 'store/store';
import book from 'routes/book';

export const API = __API_URL__;
/*
    ? 'https://dev-api.carbook.pro'
    : 'https://dev-api.carbook.pro';
// export const API = __DEV__ ? 'http://127.0.0.1:14281' : 'dev-api.carbook.pro';
*/

const apiC = trim(API, '/');
// const apiC = trim(__API_URL__, '/');
/* eslint-disable */
export default async function fetchAPI(
    method,
    endpoint,
    query,
    body,
    { rawResponse, handleErrorInternally } = {},
) {
    const endpointC = trim(endpoint, "/"); // trim all spaces and '/'
    const handler = endpointC ? `/${endpointC}` : ""; // be sure that after api will be only one /
    const methodU = toUpper(method);
    const queryObj = _(query)
        .toPairs()
        .filter(
            ([key, value]) =>
                _.isString(value) ? !_.isEmpty(value) : !_.isNil(value),
        )
        .map(([key, value]) => ({ key, value }))
        .map(
            ({ key, value }) =>
                _.isArray(value)
                    ? value.map(subValue => ({ key, value: subValue }))
                    : { key, value },
        )
        .flatten()
        .map(({ key, value }) => `${key}=${value}`)
        .value();

    const request = {
        method: methodU,
        headers: {
            "content-type": "application/json",
            "Cache-Control": "no-cache",
            "Access-Control-Request-Headers": "*",
            // 'Access-Control-Request-Method':  '*',
        },
    };

    const token = getToken();

    if (token) {
        Object.assign(request.headers, {
            Authorization: `${token}`,
        });
    }

    if (methodU === "POST" || methodU === "PUT" || methodU === "DELETE") {
        request.body = JSON.stringify(body || {});
    }

    // async function response() {
    const response = await fetch.apply(null, [
        `${apiC}${handler}${
            queryObj.length > 0 ? `?${queryObj.join("&")}` : ""
        }`,
        request,
        ...arguments,
    ]);

    const { status, statusText: message } = response;
    const { dispatch } = store;

    switch (true) {
        case status >= 200 && status < 300:
            return rawResponse ? await response : await response.json();
        case status === 400:
            if (!handleErrorInternally) {
                dispatch(replace(`${book.exception}/400`));
                return;
            }
            // dispatch(emitError({ message, status }));
            throw new ResponseError(message, status);
        case status === 401:
            dispatch(logout());
            throw new ResponseError(message, status);
        case status === 403:
            if (!handleErrorInternally) {
                dispatch(replace(`${book.exception}/403`));
                return;
            }
            // dispatch(emitError({ message, status }));
            throw new ResponseError(message, status);
        case status >= 404 && status < 422:
            if (!handleErrorInternally) {
                dispatch(replace(`${book.exception}/404`));
                return;
            }
            // dispatch(emitError({ message, status }));
            throw new ResponseError(message, status);
        case status >= 500 && status <= 504:
            if (!handleErrorInternally) {
                dispatch(replace(`${book.exception}/500`));
                return;
            }
            // dispatch(emitError({ message, status }));
            throw new ResponseError(message, status);
        default:
            throw new ResponseError(message, status);
    }
}

class ResponseError extends Error {
    constructor(message, status) {
        super();

        Error.captureStackTrace(this, this.constructor);

        this.name = this.constructor.name;

        this.message = message || "Something went wrong. Please try again.";
        this.status = status || 500;
    }
}
