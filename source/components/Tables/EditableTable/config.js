// vendor
import React from 'react';
// import { FormattedMessage } from 'react-intl';
import { Icon, Popconfirm } from 'antd';

// own
import { cellType } from './EditableCell/cellConfig.js';

/* eslint-disable complexity */
export function columnsConfig(props) {
    const serviceNameCol = {
        title:     'Наименование работы',
        dataIndex: 'serviceName',
        width:     '15%',
    };

    const detailNameCol = {
        title:     'Наименование ЗЧ',
        dataIndex: 'detailId',
        width:     '20%',
        editable:  true,
        cellType:  cellType.LIMITED_SELECT,
        details:   props.details,
        render:    (datailId, { detailName }) => detailName,
    };

    const quantityCol = {
        title:     'КОЛ-ВО',
        dataIndex: 'quantity',
        width:     '10%',
        editable:  true,
        cellType:  cellType.NUMERAL,
    };

    const deleteCol = {
        width:     '15%',
        dataIndex: 'delete',
        render:    (text, { serviceId, suggestionId }) =>
            !serviceId && (
                <Popconfirm
                    title='Sure to delete?'
                    onConfirm={ () => props.deleteService(suggestionId) }
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
        serviceNameCol,
        detailNameCol,
        quantityCol,
        deleteCol,
    ];
}
