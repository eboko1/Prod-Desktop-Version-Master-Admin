// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon, Select, Popconfirm } from 'antd';
import moment from 'moment';
import _ from 'lodash';
import { v4 } from 'uuid';

// proj
import {
    DecoratedInputNumber,
    DecoratedDatePicker,
    DecoratedTimePicker,
    DecoratedSelect,
} from 'forms/DecoratedFields';
import { OrderStatusIcon } from 'components';

import { getDateTimeConfig } from 'utils';

// own
import Styles from './styles.m.css';
const Option = Select.Option;

/* eslint-disable complexity */
export function columnsConfig(
    props,
    state,
    formatMessage,
    onDelete,
    bodyUpdateIsForbidden,
    fetchedOrder,
) {
    const serviceNameCol = {
        title:     'Наименование работы',
        dataIndex: 'serviceName',
        // key:       v4(),
        // sorter:    true,
        // sortOrder: this._handleColumnOrder(
        //     this.props.sort,
        //     'servicename',
        // ),
        width:     '15%',
    };
    const detailNameCol = {
        title:     'Наименование ЗЧ',
        dataIndex: 'detailName',
        // key:       v4(),
        width:     '20%',
        editable:  true,
    };
    const quantityCol = {
        title:     'КОЛ-ВО',
        dataIndex: 'quantity',
        // key:       v4(),
        // sorter:    true,
        // sortOrder: this._handleColumnOrder(
        //     this.props.sort,
        //     'detailname',
        // ),
        width:     '10%',
        editable:  true,
        // record:    (text, { key }) => (
        //     <DecoratedInputNumber
        //         field={ `service[${key}][quantity]` }
        //         getFieldDecorator={ props.form.getFieldDecorator }
        //         // initialValue={ _getDefaultValue(key, 'quantity') }
        //     />
        // ),
    };

    const deleteCol = {
        width:     '15%',
        dataIndex: 'delete',
        // key:    v4(),
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

    return [ serviceNameCol, detailNameCol, quantityCol, deleteCol ];
}
