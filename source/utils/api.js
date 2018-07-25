import { trim, toUpper } from 'lodash/string';
import _ from 'lodash';
import { replace } from 'react-router-redux';
import { authActions } from 'core/auth/actions';
import store from 'store/store';
import book from 'routes/book';
import { getToken } from 'utils';

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
    rawResponse,
) {
    try {
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

        const status = response.status;
        const { dispatch } = store;

        switch (true) {
            case status >= 200 && status < 300:
                return rawResponse ? await response : await response.json();
            case status === 400:
                dispatch(replace(`${book.exception}/400`));
                throw new Error(
                    `Something went wrong with response:\n${response}`,
                );
                break;
            case status === 401:
                dispatch(authActions.logout());
                throw new Error(
                    `Something went wrong with response:\n${response}`,
                );
                break;
            case status === 403:
                dispatch(replace(`${book.exception}/403`));
                throw new Error(
                    `Something went wrong with response:\n${response}`,
                );
                break;
            case status >= 404 && status < 422:
                dispatch(replace(`${book.exception}/404`));
                throw new Error(
                    `Something went wrong with response:\n${response}`,
                );
                break;
            case status >= 500 && status <= 504:
                dispatch(replace(`${book.exception}/500`));
                throw new Error(
                    `Something went wrong with response:\n${response}`,
                );
                break;
            default:
                throw new Error(`Error with response:\n${response}`);
        }
    } catch (error) {
        throw new Error(error);
    }
}
