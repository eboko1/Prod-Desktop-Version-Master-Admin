// vendor
import React from 'react';
import { Select } from 'antd';

// proj
import { DecoratedSelect } from 'forms/DecoratedFields';

// own
const Option = Select.Option;

export default props => {
    const {
        formItem,
        formatMessage,
        getFieldDecorator,
        getPopupContainer,
        initialValue,
    } = props;

    return (
        <DecoratedSelect
            formItem={ formItem }
            label={ formatMessage({ id: 'storage.measure_units' }) }
            fields={ {} }
            field='measureUnit'
            getFieldDecorator={ getFieldDecorator }
            getPopupContainer={ getPopupContainer }
            initialValue={ initialValue }
        >
            <Option value={ 'piece' } key={ 'piece' }>
                { formatMessage({ id: 'storage.measure.piece' }) }
            </Option>
            <Option value={ 'liter' } key={ 'liter' }>
                { formatMessage({ id: 'storage.measure.liter' }) }
            </Option>
        </DecoratedSelect>
    );
};
