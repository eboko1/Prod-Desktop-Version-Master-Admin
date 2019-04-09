// vendor
import React from 'react';
import { Popconfirm, Icon } from 'antd';
// import { FormattedMessage } from 'react-intl';
// import moment from 'moment';
import { v4 } from 'uuid';
import { DecoratedInputNumber } from 'forms/DecoratedFields';

// proj

// own
// import Styles from './styles.m.css';

export function columnsConfig(props, state) {
    const productId = {
        title:     'productId',
        dataIndex: 'productId',
        width:     '20%',
        editable:  true,
    };
    const productGroup = {
        title:     'productGroup',
        dataIndex: 'productGroup',
        key:       v4(),
        width:     '20%',
        editable:  true,
    };

    const measure = {
        title:     'measure',
        dataIndex: 'measure',
        key:       v4(),
        width:     '10%',
        editable:  true,
    };

    const productName = {
        title:     'productName',
        dataIndex: 'productName',
        key:       v4(),
        width:     '20%',
        editable:  true,
    };

    const price = {
        title:     'price',
        dataIndex: 'price',
        key:       v4(),
        width:     '10%',
        editable:  true,
        // render:    price => (
        //     <DecoratedInputNumber
        //         getFieldDecorator={ getFieldDecorator }
        //         field='price'
        //         initialValue={ price }
        //         rules={ [
        //             {
        //                 required: true,
        //                 message:  'required!',
        //             },
        //         ] }
        //     />
        // ),
    };

    const actions = {
        title:     '',
        dataIndex: 'actions',
        render:    (key, data) =>
            state.dataSource.length >= 1 ? (
                <Popconfirm
                    title='Sure to delete?'
                    onConfirm={ () => props.handleDelete(data.key) }
                >
                    <Icon type='delete' />
                </Popconfirm>
            ) : null,
    };

    return [
        productId,
        productGroup,
        measure,
        productName,
        // brand,
        // customCode,
        // certificate,
        // priceGroup,
        price,
        actions,
    ];
}
