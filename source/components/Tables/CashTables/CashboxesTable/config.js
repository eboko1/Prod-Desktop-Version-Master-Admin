// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon, Popconfirm, Tooltip } from 'antd';

// own

/* eslint-disable complexity */
export function columnsConfig(props) {
    const numberCol = {
        title:     '№',
        dataIndex: 'id',
        width:     '5%',
    };
    const nameCol = {
        title:     <FormattedMessage id='cash-table.name' />,
        dataIndex: 'name',
        width:     '45%',
    };

    const typeCol = {
        title:     <FormattedMessage id='cash-table.type' />,
        dataIndex: 'type',
        width:     '25%',
        render:    type => (
            <FormattedMessage id={ `cash-creation-form.type-${type}` } />
        ),
    };

    const infoCol = {
        title:     <FormattedMessage id='cash-table.description' />,
        dataIndex: 'description',
        width:     '20%',
    };

    const deleteCol = {
        width:     'auto',
        dataIndex: 'delete',
        render:    (key, { id, removable }) =>
            removable ? (
                <Popconfirm
                    title={ `${props.formatMessage({ id: 'delete' })} ?` }
                    onConfirm={ () => props.deleteCashbox(id) }
                >
                    <Icon
                        type='delete'
                        style={ {
                            fontSize: '18px',
                            color:    'var(--warning)',
                            cursor:   'pointer',
                        } }
                    />
                </Popconfirm>
            ) : (
                <Tooltip
                    placement='topLeft'
                    title={
                        <FormattedMessage id='cash-table_icon.unremovable' />
                    }
                    overlayStyle={ { zIndex: 110 } }
                >
                    <Icon type='question-circle' />
                </Tooltip>
            ),
    };

    return [
        numberCol,
        nameCol,
        typeCol,
        infoCol,
        deleteCol, 
    ];
}
