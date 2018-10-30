// vendor
import React from 'react';
import { FormattedMessage } from 'react-intl';
import { Icon, Select, Popconfirm } from 'antd';
import moment from 'moment';
import _ from 'lodash';

// proj
import {
    DecoratedInput,
    DecoratedInputNumber,
    DecoratedSelect,
} from 'forms/DecoratedFields';

// own
import Styles from './styles.m.css';
const Option = Select.Option;

/* eslint-disable complexity */
export function columnsConfig(
    props,
    state,
    handleAdd,
    handleUpdate,
    handleDelete,
) {
    // console.log('→cc  props', props);

    const _getDefaultValue = (key, fieldName) => {
        const services = (props.services || [])[ fieldName ];
        if (!services) {
            return;
        }

        const fields = {
            service:  services.service,
            detail:   services.detail,
            quantity: services.duration,
        };

        return fields[ fieldName ];
    };
    const serviceCol = {
        title:  'Service',
        key:    'service',
        width:  '15%',
        render: (text, { key }) => (
            <DecoratedInput
                field={ `service[${key}][service]` }
                getFieldDecorator={ props.form.getFieldDecorator }
                initialValue={ _getDefaultValue('service') }
            />
        ),
    };

    const detailsCol = {
        title:  'Details',
        key:    'details',
        width:  '15%',
        render: (text, { key }) => (
            <DecoratedSelect
                cnStyles={ Styles.serviceType }
                field={ `service[${key}][detail]` }
                getFieldDecorator={ props.form.getFieldDecorator }
                rules={ [
                    {
                        required: true,
                        message:  'Type is required',
                    },
                ] }
                initialValue={ _getDefaultValue('detail') }
            >
                <Option value={ 'test' } key={ 'test1' }>
                    test
                </Option>
                <Option value={ 'mock' } key={ 'mock1' }>
                    mock
                </Option>
            </DecoratedSelect>
        ),
    };

    const quantityCol = {
        title:  'Quantity',
        key:    'quantity',
        width:  '10%',
        render: (text, { key }) => (
            <DecoratedInputNumber
                field={ `service[${key}][quantity]` }
                getFieldDecorator={ props.form.getFieldDecorator }
                initialValue={ _getDefaultValue('quantity') }
            />
        ),
    };

    const actionsCol = {
        title:  '',
        key:    'actions',
        width:  'auto',
        render: (text, { key }) => (
            <div>
                { /* <Icon
                    type='save'
                    className={ Styles.saveIcon }
                    onClick={ () => {
                        const callback = entity => {
                            const initialEntity = _.get(initialService, [ key ]);

                            if (initialEntity) {
                                const { id } = initialEntity;
                                props.updateService(id, entity);
                            } else {
                                props.createService(entity);
                            }
                            props.resetFields();
                        };
                        this._getServiceData(key, callback);
                    } }
                /> */ }
                <Icon
                    type='delete'
                    className={ Styles.deleteIcon }
                    onClick={ () => {
                        const id = _getDefaultValue(key, 'id');
                        if (id) {
                            props.deleteService(id);
                        }
                        props.resetFields();
                    } }
                />
            </div>
        ),
    };

    return [ serviceCol, detailsCol, quantityCol, actionsCol ];
}
