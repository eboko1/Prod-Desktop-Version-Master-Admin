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
    // handleUpdate,
    handleDelete,
    getServiceData,
) {
    // console.log('→ config props', props);

    const _getDefaultValue = (key, fieldName) => {
        const services = (props.services || [])[ key ];
        if (!services) {
            return;
        }

        const fields = {
            serviceId: services.serviceId,
            detailId:  services.detailId,
            quantity:  services.duration,
        };

        return fields[ fieldName ];
    };
    const serviceCol = {
        title:  'Работа',
        key:    'service',
        width:  '15%',
        render: (text, { key }) => (
            <DecoratedSelect
                cnStyles={ Styles.select }
                field={ `service[${key}][serviceId]` }
                getFieldDecorator={ props.form.getFieldDecorator }
                initialValue={ _getDefaultValue(key, 'serviceId') }
                dropdownMatchSelectWidth={ false }
                dropdownStyle={ { width: '50%' } }
            >
                { props.services.services.map(({ serviceId, serviceName }) => (
                    <Option value={ serviceId } key={ serviceId }>
                        { serviceName }
                    </Option>
                )) }
            </DecoratedSelect>
        ),
    };

    const detailsCol = {
        title:  'Запчасти',
        key:    'details',
        width:  '15%',
        render: (text, { key }) => (
            <DecoratedSelect
                cnStyles={ Styles.select }
                field={ `service[${key}][detailId]` }
                getFieldDecorator={ props.form.getFieldDecorator }
                rules={ [
                    {
                        required: true,
                        message:  'Type is required',
                    },
                ] }
                initialValue={ _getDefaultValue(key, 'detailId') }
                dropdownMatchSelectWidth={ false }
                dropdownStyle={ { width: '50%' } }
            >
                { props.services.details.map(({ detailId, detailName }) => (
                    <Option value={ detailId } key={ detailId }>
                        { detailName }
                    </Option>
                )) }
            </DecoratedSelect>
        ),
    };

    const quantityCol = {
        title:  'Кол-во',
        key:    'quantity',
        width:  '10%',
        render: (text, { key }) => (
            <DecoratedInputNumber
                fields={ {} }
                field={ `service[${key}][quantity]` }
                getFieldDecorator={ props.form.getFieldDecorator }
                initialValue={ _getDefaultValue(key, 'quantity') }
            />
        ),
    };

    const actionsCol = {
        title:  '',
        key:    'actions',
        width:  'auto',
        render: (text, { key }) => (
            <div>
                <Icon
                    type='save'
                    className={ Styles.saveIcon }
                    // onClick={ () => console.log('→ click') }
                    onClick={ () => {
                        props.createService({
                            ...props.form.getFieldValue(`service[${key}]`),
                        });
                        props.resetFields();
                        // const callback = entity => {
                        //     const initialEntity = _getDefaultValue(key);
                        //     console.log('→ initialEntity', initialEntity);
                        //     if (initialEntity) {
                        //         const { serviceId } = initialEntity;
                        //         props.updateService(serviceId, entity);
                        //     } else {
                        //         props.createService(entity);
                        //     }
                        //     props.resetFields();
                        // };
                        // getServiceData(key, callback);
                    } }
                    // onClick={ () => {
                    //     const callback = entity => {
                    //         const initialEntity = _.get(initialService, [ key ]);
                    //
                    //         if (initialEntity) {
                    //             const { id } = initialEntity;
                    //             props.updateService(id, entity);
                    //         } else {
                    //             props.createService(entity);
                    //         }
                    //         props.resetFields();
                    //     };
                    //     this._getServiceData(key, callback);
                    // } }
                />
                { /* <Icon
                    type='delete'
                    className={ Styles.deleteIcon }
                    onClick={ () => {
                        const service = _getDefaultValue(key, 'service');
                        if (service) {
                            props.deleteService(service);
                        }
                        props.resetFields();
                    } }
                /> */ }
            </div>
        ),
    };

    return [ serviceCol, detailsCol, quantityCol, actionsCol ];
}
