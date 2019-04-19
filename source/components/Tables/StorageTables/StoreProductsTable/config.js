// vendor
import React from 'react';
import { Popconfirm, Icon } from 'antd';
import _ from 'lodash';

// proj
import { MODALS } from 'core/modals/duck';

export default props => {
    const code = {
        title: props.intl.formatMessage({
            id: 'storage.product_code',
        }),
        dataIndex: 'code',
        width:     'auto',
    };

    const name = {
        title: props.intl.formatMessage({
            id: 'storage.name',
        }),
        dataIndex: 'name',
        width:     '10%',
    };

    const brandName = {
        title: props.intl.formatMessage({
            id: 'storage.brand',
        }),
        dataIndex: 'brandName',
        width:     '20%',
    };

    const markup = {
        title: props.intl.formatMessage({
            id: 'storage.markup',
        }),
        dataIndex: 'priceGroup',
        width:     '20%',
        render:    (key, data) => (
            <div>{ _.get(data, 'priceGroup.multiplier') }</div>
        ),
    };

    const actions = {
        width:     'auto',
        dataIndex: 'delete',
        render:    (key, { id, name }) => (
            <div>
                <Icon
                    type='edit'
                    onClick={ () =>
                        props.setModal(MODALS.STORE_PRODUCT, { id, name })
                    }
                />
                <div />
                <Popconfirm
                    title={ `${props.intl.formatMessage({
                        id: 'delete',
                    })} ?` }
                    onConfirm={ () => props.deleteSupplier(id) }
                >
                    <Icon type='delete' />
                </Popconfirm>
            </div>
        ),
    };

    return [
        code,
        name,
        brandName,
        markup,
        actions,
    ];
};
