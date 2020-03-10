export const API_URL = window.location.hostname == 'localhost'? 'http://localhost:14281' : 'https://test-api.carbook.pro';

export function getDiagnosticsTemplates(getData) {
    let token = localStorage.getItem('_my.carbook.pro_token');
    let url = API_URL;
    let params = `/diagnostics`;
    url += params;

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
        getData(data);
        console.log('data', data);
    })
    .catch(function (error) {
        console.log('error', error)
    })
}

export async function sendDiagnosticAnswer(orderId, templateId, groupId, partId, answer, comment, photo) {
    let token = localStorage.getItem('_my.carbook.pro_token');
    let url = API_URL;
    let params = `/orders/diagnostics/answer?orderId=${orderId}&templateId=${templateId}&groupId=${groupId}&partId=${partId}&answer=${answer}`
    const data = { photo: photo };

    if(comment) params += `&comment=${comment}`;

    url += params;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if(result.success) {
            console.log("OK", result);
        }
        else {
            console.log("BAD", result);
        }
    } catch (error) {
        console.error('ERROR:', error);
    }
}

export async function deleteDiagnosticProcess(orderId, templateId, groupId, partId) {
    let token = localStorage.getItem('_my.carbook.pro_token');
    let url = API_URL;
    let params = `/orders/diagnostics/part?orderId=${orderId}&templateId=${templateId}&groupId=${groupId}&partId=${partId}`;

    url += params;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': token,
            }
        });
        const result = await response.json();
        if(result.success) {
            console.log("OK", result);
        }
        else {
            console.log("BAD", result);
        }
    } catch (error) {
        console.error('ERROR:', error);
    }
}

export async function addNewDiagnosticRow(orderId, templateId, groupId, partId) {
    let token = localStorage.getItem('_my.carbook.pro_token');
    let url = API_URL;
    let params = `/orders/diagnostics/part?orderId=${orderId}&templateId=${templateId}&groupId=${groupId}&partId=${partId}`;

    url += params;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': token,
            }
        });
        const result = await response.json();
        if(result.success) {
            console.log("OK", result);
        }
        else {
            console.log("BAD", result);
        }
    } catch (error) {
        console.error('ERROR:', error);
    }
}

export async function addNewDiagnosticTemplate(orderId, templateId) {
    let token = localStorage.getItem('_my.carbook.pro_token');
    let url = API_URL;
    let params = `/orders/diagnostics/template?orderId=${orderId}&templateId=${templateId}`;

    url += params;
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': token,
            }
        });
        const result = await response.json();
        if(result.success) {
            console.log("OK", result);
        }
        else {
            console.log("BAD", result);
        }
    } catch (error) {
        console.error('ERROR:', error);
    }
}

export async function deleteDiagnosticTemplate(orderId, templateId) {
    let token = localStorage.getItem('_my.carbook.pro_token');
    let url = API_URL;
    let params = `/orders/diagnostics/template?orderId=${orderId}&templateId=${templateId}`;

    url += params;
    try {
        const response = await fetch(url, {
            method: 'DELETE',
            headers: {
                'Authorization': token,
            }
        });
        const result = await response.json();
        if(result.success) {
            console.log("OK", result);
        }
        else {
            console.log("BAD", result);
        }
    } catch (error) {
        console.error('ERROR:', error);
    }
}