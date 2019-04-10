// vendor
import React from 'react';
import { Popconfirm, Icon } from 'antd';

// proj
import { MODALS } from 'core/modals/duck';

export default props => {
    const id = {
        title:     'id',
        dataIndex: 'id',
        width:     'auto',
    };

    const treePath = {
        title:     'treePath',
        dataIndex: 'treePath',
        width:     '20%',
    };

    const brandName = {
        title:     'brandName',
        dataIndex: 'brandName',
        width:     '20%',
    };

    const markup = {
        title:     'markup',
        dataIndex: 'markup',
        width:     '20%',
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
        id,
        treePath,
        brandName,
        markup, 
    ];
};
