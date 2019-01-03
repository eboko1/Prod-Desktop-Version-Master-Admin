// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon, Popconfirm } from 'antd';

// own

/* eslint-disable complexity */
export function columnsConfig(props) {
    const numberCol = {
        title:     '№',
        dataIndex: 'id',
        width:     '5%',
    };
    const nameCol = {
        title:     'Название кассы',
        dataIndex: 'name',
        width:     '45%',
    };

    const typeCol = {
        title:     'Тип',
        dataIndex: 'type',
        width:     '25%',
        render:    type => (
            <FormattedMessage id={ `cash-creation-form.type-${type}` } />
        ),
    };

    const infoCol = {
        title:     'Справочник',
        dataIndex: 'text',
        width:     '20%',
    };

    const deleteCol = {
        width:     'auto',
        dataIndex: 'delete',
        render:    id => (
            <Popconfirm
                title={ `${<FormattedMessage id='delete' />} ?` }
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
