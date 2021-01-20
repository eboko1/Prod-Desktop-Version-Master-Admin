/**
 * This object contains constant valiables which are mapped on the server. You can use any of these to export corresponding fields.
 * For example if you select "client", then client name will be included to the report
 */
const reportFields = {
    creation_date: 'creation_date',
    appointment_date: 'appointment_date',
    done_date: 'done_date',
    service_advisor: 'service_advisor',
    mechanic: 'mechanic',
    purchase_manager: 'purchase_manager',
    post: 'post',
    status: 'status',
    requisite: 'requisite',
    client: 'client',
    nothing: 'nothing'
}

export default Object.freeze(reportFields);