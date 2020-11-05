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

export function deleteRequisite(id, func) {
    let url = __API_URL__ + `/businesses/requisites/${id}`;
    fetch(url, {
        method: 'DELETE',
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
        func();
    })
    .catch(function (error) {
        console.log('error', error)
    });
}

export function postRequisite(data, func) {
    console.log(data);
    let url = __API_URL__ + `/businesses/requisites`;
    fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': token,
        },
        body: JSON.stringify(data)
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
        func();
    })
    .catch(function (error) {
        console.log('error', error)
    });
}

export function updateRequisite(id, data, func) {
    console.log(data);
    let url = __API_URL__ + `/businesses/requisites/${id}`;
    fetch(url, {
        method: 'PUT',
        headers: {
            'Authorization': token,
        },
        body: JSON.stringify(data)
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
        func();
    })
    .catch(function (error) {
        console.log('error', error)
    });
}