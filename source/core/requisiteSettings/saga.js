import { getToken } from 'utils';
const token = getToken();

export function getData(func) {
    let url = __API_URL__ + `/businesses/requisites`;
    fetch(url, {
        method: 'GET',
        headers: {
            'Authorization': token,
        }
    })
    .then(function (response) {
        if (response.status !== 200) {
        return Promise.reject(new Error(response.statusText))
        }
        return Promise.resolve(response)
    })
    .then(function (response) {
        return response.json()
    })
    .then(function (data) {
        console.log(data);
        func(data);
    })
    .catch(function (error) {
        console.log('error', error)
    });
}