export const URL = window.location.hostname;
export const API_URL = __API_URL__;

export function getAgreementData(sessionId, lang, getData) {
    let token = localStorage.getItem('_my.carbook.pro_token');
    let url = API_URL;
    let params = `/orders/agreement?sessionId=${sessionId}&lang=${lang}`;
    url += params;

    fetch(url, {
        method:  'GET',
        headers: {
            Authorization: token,
        },
    })
        .then(function(response) {
            if (response.status !== 200) {
                return Promise.reject(new Error(response.statusText));
            }

            return Promise.resolve(response);
        })
        .then(function(response) {
            return response.json();
        })
        .then(function(data) {
            getData(data);
            console.log('data', data);
        })
        .catch(function(error) {
            console.log('error', error);
        });
}

export async function confirmAgreement(sessionId, data, lang) {
    let token = localStorage.getItem('_my.carbook.pro_token');
    let url = API_URL;
    let params = `/orders/agreement?sessionId=${sessionId}&lang=${lang}`;
    url += params;

    try {
        const response = await fetch(url, {
            method:  'PUT',
            headers: {
                Authorization:  token,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });
        const result = await response.json();
        if (result.success) {
            console.log('OK', result);
        } else {
            console.log('BAD', result);
        }
    } catch (error) {
        console.error('ERROR:', error);
    }
}
