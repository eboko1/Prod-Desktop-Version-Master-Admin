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
        width:     '20%',
        editable:  true,
    };
    const quantityCol = {
        title:     'Кол-во',
        dataIndex: 'quantity',
        key:       v4(),
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
        width:  '15%',
        render: (text, { serviceId, suggestionId }) =>
            !serviceId &&
                <>
                    <Icon
                        type='save'
                        style={ {
                            fontSize: '18px',
                            color:    'var(--secondary)',
                            cursor:   'pointer',
                        } }
                        onClick={ () => {
                            props.updateService(suggestionId);
                        } }
                    />
                    <Icon
                        type='delete'
                        style={ {
                            fontSize: '18px',
                            color:    'var(--warning)',
                            cursor:   'pointer',
                        } }
                        onClick={ () => {
                            props.deleteService(suggestionId);
                        } }
                    />
                </>
        ,
    };

    return [ serviceNameCol, detailNameCol, quantityCol, deleteCol ];
}
