import { saveAs } from 'file-saver';

export const URL = window.location.hostname;
export const API_URL = __API_URL__;

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

export async function sendDiagnosticAnswer(orderId, templateId, groupId, partId, index, answer, comment) {
    let token = localStorage.getItem('_my.carbook.pro_token');
    let url = API_URL;
    let params = `/orders/diagnostics/answer`
    url += params;
    const data = {
        orderId: orderId,
        templateId: templateId,
        groupId: groupId,
        partId: partId,
        index: index,
        answer: String(answer),
        comment: {...comment},
    };
    try {
        const response = await fetch(url, {
            method: 'PUT',
            headers: {
                'Authorization': token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        const result = await response.json();
        if(result.success) {
            //console.log("OK", result);
        }
        else {
            console.log("BAD", result);
        }
    } catch (error) {
        console.error('ERROR:', error);
    }
}

export async function confirmDiagnostic(orderId, data) {
    let token = localStorage.getItem('_my.carbook.pro_token');
    let url = API_URL;
    let params = `/orders/${orderId}`;
    
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
            //console.log("OK", result);
        }
        else {
            console.log("BAD", result);
        }
    } catch (error) {
        console.error('ERROR:', error);
    }
}

export async function lockDiagnostic(orderId) {
    let token = localStorage.getItem('_my.carbook.pro_token');
    let url = API_URL;
    let params = `/orders/${orderId}/diagnostics`;
    
    url += params;
    try {
        const response = await fetch(url, {
            method: 'LOCK',
            headers: {
                'Authorization': token,
            },
        });
        const result = await response.json();
        if(result.success) {
            console.log("LOCKED", result);
        }
        else {
            console.log("BAD", result);
        }
    } catch (error) {
        console.error('ERROR:', error);
    }
}

export async function deleteDiagnosticProcess(orderId, templateId, groupId, partId, index) {
    let token = localStorage.getItem('_my.carbook.pro_token');
    let url = API_URL;
    let params = `/orders/diagnostics/part?orderId=${orderId}&templateId=${templateId}&groupId=${groupId}&partId=${partId}&index=${index}`;

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
            //console.log("OK", result);
        }
        else {
            console.log("BAD", result);
        }
    } catch (error) {
        console.error('ERROR:', error);
    }
}

export async function addNewDiagnosticRow(orderId, templateId, groupId, partId, index) {
    let token = localStorage.getItem('_my.carbook.pro_token');
    let url = API_URL;
    let params = `/orders/diagnostics/part?orderId=${orderId}&templateId=${templateId}&groupId=${groupId}&partId=${partId}&index=${index}`;

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
            //console.log("OK", result);
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
            //console.log("OK", result);
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
            //console.log("OK", result);
        }
        else {
            console.log("BAD", result);
        }
    } catch (error) {
        console.error('ERROR:', error);
    }
}

export async function createAgreement(orderId, lang, confirmFunc, errorFunc) {
    let token = localStorage.getItem('_my.carbook.pro_token');
    let url = API_URL;
    let params = `/orders/create_agreement?orderId=${orderId}`;

    url += params;
    fetch(url, {
        method: 'POST',
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
        confirmFunc();
    })
    .catch(function (error) {
        errorFunc();
    })
}

export async function getPartProblems(partId, getData) {
    let token = localStorage.getItem('_my.carbook.pro_token');
    let url = API_URL;
    let params = `/diagnostics/problems_mask?partId=${partId}`;

    url += params;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        });
        const result = await response.json();
        getData(result.problems);
    } catch (error) {
        console.error('ERROR:', error);
    }
}

export async function sendMessage(orderId) {
    let token = localStorage.getItem('_my.carbook.pro_token');
    let url = API_URL;
    let params = `/orders/${orderId}/send_diagnostics_complete_message`;

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
        console.log('data', data);
    })
    .catch(function (error) {
        console.log('error', error)
    })
}

export async function getDiagnosticsReport(orderId) {
    let token = localStorage.getItem('_my.carbook.pro_token');
    let url = API_URL;
    let params = `/diagnostics/report?orderId=${orderId}`;

    url += params;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        });
        const reportFile = await response.blob();

            const contentDispositionHeader = response.headers.get(
                'content-disposition',
            );
            const fileName = contentDispositionHeader.match(
                /^attachment; filename="(.*)"/,
            )[ 1 ];
            await saveAs(reportFile, fileName);
    } catch (error) {
        console.error('ERROR:', error);
    }
}

export async function getDiagnosticsAct(orderId) {
    let token = localStorage.getItem('_my.carbook.pro_token');
    let url = API_URL;
    let params = `/orders/reports/diagnosticsReport/${orderId}`;

    url += params;
    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': token,
            }
        });
        const reportFile = await response.blob();

            const contentDispositionHeader = response.headers.get(
                'content-disposition',
            );
            const fileName = contentDispositionHeader.match(
                /^attachment; filename="(.*)"/,
            )[ 1 ];
            await saveAs(reportFile, fileName);
    } catch (error) {
        console.error('ERROR:', error);
    }
}