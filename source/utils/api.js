import { trim, toUpper } from 'lodash/string';
import _ from 'lodash';
import { replace } from 'react-router-redux';
import { authActions } from 'core/auth/actions';
import store from 'store/store';
import book from 'routes/book';
import { getToken } from 'utils';

export const API = __LOCAL__
    ? 'https://dev-api.carbook.pro'
    : 'https://dev-api.carbook.pro';
// export const API = __DEV__ ? 'http://127.0.0.1:14281' : 'dev-api.carbook.pro';

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
        const queryObj = _.toPairs(query)
            .filter(
                ([key, value]) =>
                    _.isString(value) ? !_.isEmpty(value) : true,
            )
            .map(([key, value]) => `${key}=${value}`);

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
                return dispatch(replace(`${book.exception}/400`));
            case status === 401:
                return dispatch(authActions.logout());
            case status === 403:
                return dispatch(replace(`${book.exception}/403`));
            case status >= 404 && status < 422:
                return dispatch(replace(`${book.exception}/404`));
            case status >= 500 && status <= 504:
                return dispatch(replace(`${book.exception}/500`));
            default:
                throw new Error(
                    `Something went wrong with response validation\n${response}`,
                );
        }
        // }
    } catch (error) {
        console.error("ERROR! fetchAPI:", error); // eslint-disable-line
    }
}
