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

export function getClientData(id, func) {
    let url = __API_URL__ + `/clients/${id}`;
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
        console.log(data.requisites);
        func(data.requisites);
    })
    .catch(function (error) {
        console.log('error', error)
    });
}

export function deleteClientRequisite(id, func) {
    let url = __API_URL__ + `/clients/requisites/${id}`;
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

export function postClientRequisite(data, func, clientId) {
    console.log(data);
    let url = __API_URL__ + `/clients/${clientId}/requisites`;
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

export function updateClientRequisite(id, data, func) {
    console.log(data);
    let url = __API_URL__ + `/clients/requisites/${id}`;
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

export function deleteSupplierRequisite(id, func) {
    let url = __API_URL__ + `/business_suppliers/requisites/${id}`;
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

export function postSupplierRequisite(data, func, id) {
    console.log(data);
    let url = __API_URL__ + `/business_suppliers/${id}/requisites`;
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

export function updateSupplierRequisite(id, data, func) {
    console.log(data);
    let url = __API_URL__ + `/business_suppliers/requisites/${id}`;
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