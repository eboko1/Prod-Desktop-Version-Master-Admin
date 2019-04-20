// vendor
import React from 'react';
import _ from 'lodash';

// proj
import { MODALS } from 'core/modals/duck';
import { ActionIcons } from 'commons/_uikit';

export default props => {
    const code = {
        title: props.intl.formatMessage({
            id: 'storage.product_code',
        }),
        dataIndex: 'code',
        width:     '20%',
    };

    const recordDatetime = {
        title: props.intl.formatMessage({
            id: 'storage.record_datetime',
        }),
        dataIndex: 'recordDatetime',
        width:     '20%',
    };

    const status = {
        title: props.intl.formatMessage({
            id: 'storage.status',
        }),
        dataIndex: 'status',
        width:     '20%',
    };

    const client = {
        title: props.intl.formatMessage({
            id: 'storage.client',
        }),
        dataIndex: 'client',
        width:     '20%',
    };

    const sum = {
        title: props.intl.formatMessage({
            id: 'storage.sum',
        }),
        dataIndex: 'sum',
        width:     '20%',
    };

    const actions = {
        width:     'auto',
        dataIndex: 'delete',
        render:    (key, data) => {
            return (
                <ActionIcons
                // edit={ () =>
                //     props.setModal(MODALS.STORE_PRODUCT, {
                //         id,
                //         name,
                //         code,
                //         editing: true,
                //     })
                // }
                // delete={ () => props.deleteProduct(id) }
                />
            );
        },
    };

    return [
        code,
        recordDatetime,
        status,
        client,
        sum,
        actions,
    ];
};
