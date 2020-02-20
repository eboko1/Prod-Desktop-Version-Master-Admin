export async function sendDiagnosticAnswer(orderId, templateId, diagnosticId, processId, answer, comment, photo) {
    let token = localStorage.getItem('_my.carbook.pro_token');
    console.log(token);
    let url = window.location.hostname; //"https://" + window.location.hostname;
    let params = `/orders/diagnostics/answer?orderId=${orderId}&templateId=${templateId}&diagnosticId=${diagnosticId}&processId=${processId}&answer=${answer}`

    if(comment) params += `&comment=${comment}`;
    if(photo) params += `&photo=${photo}`;

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